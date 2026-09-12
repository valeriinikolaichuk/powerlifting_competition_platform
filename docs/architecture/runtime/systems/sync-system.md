## Synchronization System
A real-time state synchronization system that accepts updates, persists them to the database, and instantly broadcasts them to all other connected clients.

<details open="open">
<summary>Contents</summary>  

- [SyncService](#syncservice)
  - [Synchronization Flow](#synchronization-flow)
- [SyncQueueService](#syncqueueservice)
  - [SyncQueue Flow](#syncqueue-flow)
- [SocketService](#socketservice)
- SyncReceiverService
  - SyncOperationFactory
  - Synchronization Operations
- [DTOs](#dtos)
  - [SnapshotDto](#snapshotdto)
  - [SyncQueueItem](#syncqueueitem)
  - SyncOutboxDto

</details>

 ---

### SyncService
Is responsible for managing offline-first data capabilities and bi-directional synchronization between the local [PGlite](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/pglite.md) (in-browser `PostgreSQL`) database and the remote backend server (or `localhost`) [database](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/database.md) when the `Runtime` **starts**.

Related with backend [Synchronization system](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/backend/systems/sync.md)

The `SyncService`  
1. [Initializes](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/pglite.md#pgliteservice) the local `PGlite` database.  
2. Sends pending changes to to the backend through [SyncQueueService](#sync).   
3. Requests the current database snapshot from the backend.  
4. Clears the local [USER_TABLES](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/shared-sql.md#synchronization-table-configuration).
5. Inserts the data received from the server into the local database.

The synchronization uses the shared [USER_TABLES](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/shared-sql.md#synchronization-table-configuration) definition to process all user-related tables without maintaining a separate list of tables in the `Runtime`.

While synchronization is running, the application displays `SynchronizingDatabaseComponent` inside `SystemPopupComponent`. This prevents the user from interacting with the application until the initial synchronization is completed.

If synchronization fails, the synchronization popup is closed and `RetryPopupComponent` displays `SynchronizationErrorComponent`.

The user can choose:  
- **RETRY** — starts the synchronization process again.

The local database is not replaced when synchronization fails.

- ### getSnapshot()
  - Fetches a complete data snapshot from the remote server ([/api/sync/snapshot](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/backend/systems/sync.md#synccontroller)).
  - Automatically detects the user's current UI `language` from the `URL` query parameters (`?lang=...`) and forwards it to the `API` to receive localized database records.

- ### refreshDatabase()
  - Clears all local application tables using a cascading truncate strategy (`TRUNCATE ... CASCADE`)
  - Refills them with the fresh server data provided in the [SnapshotDto](#snapshotdto).

- ### syncWithServer()
  - Populates local database tables with incoming snapshot data.
  - Dynamically maps object keys and values into secure, SQL-injection-proof parameterized queries (`$1, $2, ...`) and executes sequential insertions for each record.

---

#### Synchronization Flow 
<pre>
PGlite Initialization
        ↓
Check Online Status
        ↓
Pending sync_queue?
        ↓
Send Changes to Server
        ↓
Server Confirmation
        ↓
Clear Local Queue
        ↓
Request Database Snapshot
        ↓
Receive Snapshot
        ↓
TRUNCATE USER_TABLES
        ↓
Insert Server Data
        ↓
Synchronization Completed
</pre>

---

### SyncQueueService
Manages locally queued synchronization operations and sends pending operations to the backend through `SocketService`.

#### Responsibilities
- Adds local data changes to the synchronization queue.
- Retrieves unprocessed synchronization operations.
- Sends queued operations through the synchronization socket.
- Processes queued operations in creation order.
- Marks successfully synchronized operations as processed.

`SyncQueueService` stops the synchronization loop when an operation fails.

- ### addQueue()
Adds a synchronization operation to the local [sync_queue](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/pglite.md#sync_queue) table.

The queue item contains:
- `id` — unique queue item identifier.
- `sourceId` — device identifier that produced the operation.
- `operationId` — operation type.
- `recordId` — identifier of the affected record.
- `payload` — serialized operation data.
- `createdAt` — operation creation timestamp.

The queue item is inserted using the transaction provided by the caller.  
This allows the data change and its corresponding synchronization operation to be committed atomically.

- ### sync()
  - Retrieves all unprocessed synchronization queue items from the local [sync_queue](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/pglite.md#sync_queue) table.  
  - Operations are processed in ascending creation order.  
  - Each queued item[#syncqueueitem] is passed to [send()](#send).   
  - If synchronization of an operation fails, the process stops and the remaining operations remain in the queue for a later synchronization attempt.

- ### send()
The method accepts the [SyncQueueItem](#syncqueueitem) parameter.  
Sends a synchronization operation to the backend through [SocketService](#socketservice).

The operation is emitted using the sync socket event and contains:
* id
* sourceId
* operationId
* recordId
* payload
* createdAt

The method waits for the server `acknowledgement`.  
If the server confirms successful processing, the queue item is [marked](#markasprocessed) as `processed`.  
If the server reports failure, the operation is rejected and remains unprocessed.

- ### markAsProcessed()
Marks a successfully synchronized queue item by setting its `processed_at` timestamp.  
Only successfully `acknowledged` operations are marked as `processed`.

---

#### SyncQueue Flow
<pre>
      SyncQueueService
          sync()
            |
            |<--- sync_queue table
            |        
        SyncQueueItem
            |
            ▼
          send()
            |
socketService.socket.emit()
            |
            ▼
        [backend]
       SyncGateway
       handleSync()
            |
      SyncInboxService
            |
        SyncQueueDto
            |
        receive()
            |
            ├──► INSERT → sync_inbox table
            │
     SyncOutboxService
     createForDevices()
            │
          INSERT
            ↓
    sync_outbox table
            ├──► Device B → syncOutbox
            ├──► Device C → syncOutbox      
            ├──► ...

            │
            ▼
    return { success: true }
            │
            │ Socket.IO ACK
            ▼
    frontend callback()
            │
            ▼
        resolve()
            │
            ▼
markAsProcessed(item.id) ──► sync_queue
                             processed_at = NOW()
</pre>

---

### SocketService
Provides the `Socket.IO` connection between the Runtime application and the backend synchronization server.
```text
SyncQueueService
       │
       ▼
SocketService
       │
       │ Socket.IO
       ▼
Backend Sync Gateway
```

`SocketService` does not implement synchronization logic itself. It only provides the communication channel used by the synchronization services.

#### Responsibilities
- Establish a `Socket.IO` connection to the backend `API`.
- Send the current device `ID` during connection initialization.
- Expose the active socket instance to other services.
- Provide a method for waiting until the socket connection is established.

#### Initialization
When the service is created, it retrieves the device ID from `localStorage` and establishes a `Socket.IO` connection using the backend API URL from the application environment.

The device ID is sent as a connection query parameter:
```ts
const deviceId = localStorage.getItem('device_id');
this.socket = io(environment.apiUrl, {
  query: {
    deviceId,
  },
});
````

This allows the backend to associate the `Socket.IO` connection with the current `Runtime` device.

- ### waitForConnection()
Ensures that the socket connection is established before communication is attempted.   
If the socket is already connected, the method resolves immediately. Otherwise, it waits for the next `connect` event.

---

### DTOs

#### SnapshotDto
The data transfer object used for complete database hydration.
  * `data`: A key-value object where each key represents a `tableName` (string) and the value is an array of objects representing database rows (`Record<string, any>[]`).

#### SyncQueueItem
* id
* source_id
* operation_id
* record_id
* payload
* created_at
---
