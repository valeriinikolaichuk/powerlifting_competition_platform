## Synchronization Services
A real-time state synchronization services that accept updates, persist them to the database, and instantly broadcast them to all other connected clients.

<details open="open">
<summary>Contents</summary>  

- [SyncService](#syncservice)
  - [Synchronization Flow](#synchronization-flow)
- [SocketService](#socketservice)
- [SyncQueueService](#syncqueueservice)
  - [SyncQueue Flow](#syncqueue-flow)
- [SyncReceiverService](#syncreceiverservice)
  - [SyncOperationFactory](#syncoperationfactory)
  - [Synchronization Operations](#synchronization-operations)
- [DTOs](#dtos)
  - [SnapshotDto](#snapshotdto)
  - [SyncQueueItem](#syncqueueitem)
  - [SyncOutboxDto](#syncoutboxdto)

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

### SocketService
Provides the `Socket.IO` connection between the `Runtime` application and the backend synchronization server.
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
- Obtains the current `deviceId` from [DeviceIdService](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/runtime/entry.md#deviceidservice).
- Establish a `Socket.IO` connection to the backend `API`.
- Send the current device `ID` during connection initialization.
- The backend uses the received `deviceId` to place the socket into the corresponding `Socket.IO room`.
- Expose the active socket instance to other services.
- Provide a method for waiting until the socket connection is established.
- Rejects with a timeout error if the connection is not established within `5 seconds`.

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
Waits for the socket connection to become active. If the socket is already connected, it resolves immediately.  
Otherwise, it waits until the `connect` event is received or the connection timeout is reached.  
On timeout, the `promise` is rejected so the synchronization process can finish and be retried later.

---

### SyncQueueService
Manages locally queued synchronization operations and periodically sends pending operations to the backend through [SocketService](#socketservice).

#### Responsibilities
- Adds local data changes to the synchronization queue.
- Starts a periodic synchronization process.
- Prevents multiple queue synchronization processes from running simultaneously.
- Waits for an active socket connection before processing the queue.
- Retrieves unprocessed synchronization operations.
- Waits for an active socket connection before synchronization.
- Sends queued operations through the synchronization socket.
- Processes queued operations in creation order.
- Marks successfully synchronized operations as processed.
- Keep the processed record for one additional synchronization cycle so the server can confirm browser processing.
- Remove older processed records from the queue.

`SyncQueueService` stops the current synchronization attempt when an operation fails, leaving the remaining operations in the queue for a later attempt.

- ### start()
Starts the periodic synchronization process.

The method ensures that the synchronization loop is started only once and periodically calls [sync()](#sync) **every second**.

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
Controls synchronization execution and prevents concurrent queue processing.

If synchronization is already running, the method returns the existing `syncPromise` instead of starting another process.

Otherwise, it creates a new promise for `processQueue()`, waits for its completion, and clears the promise when processing finishes.

- ### processQueue()
  - Processes the pending synchronization queue.
  - Waits for the socket connection.
  - Retrieves all unprocessed items from [sync_queue](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/pglite.md#sync_queue).
  - Processes items in ascending `created_at` order.
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
* processedAt

The method waits for the server `acknowledgement`.  
If the server confirms successful processing, the queue item is [marked](#markasprocessed) as `processed`.  
If the server reports failure, the operation is rejected and remains unprocessed.

- ### markAsProcessed()
Marks a successfully synchronized queue item by setting its `processed_at` timestamp.  
Only successfully `acknowledged` operations are marked as `processed`.

The payload is no longer required after the initial synchronization, so it is cleared.

Previously processed records are removed when a newer record is successfully processed.

The current processed record is intentionally kept for the next synchronization cycle. This allows the server to receive the `processed_at` value and mark the corresponding [sync_inbox](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/database/management.md#sync_inbox) record as `processed by the browser`.

---

#### SyncQueue Flow
<pre>
             SyncQueueService
                    |
                  start()
                    |
              every 1 second
                    |
                    ▼
                  sync()
            sync already running?
             /              \
           no               yes
            |                |
      processQueue()    return existing
            |              Promise
   waitForConnection()
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
                             payload = NULL

                             delete processed_at IS NOT NULL
                                    AND id <> $1
</pre>

---

### SyncReceiverService
Listens for incoming `sync` events through `SocketService` and processes each synchronization item.  
Receives synchronization operations delivered by the backend [SyncOutboxDeliveryService](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/backend/systems/sync.md#syncoutboxdeliveryservice) through [SyncGateway](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/backend/systems/sync.md#syncgateway) over `Socket.IO`.

When a synchronization message is received, the service: 
- Before executing an operation, the service checks the [sync_processed](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/pglite.md#sync_processed) table using `sync_id`. If the synchronization record has already been processed, the operation is not executed again and a successful `ACK` is returned.
- Uses `SyncOperationFactory` to select the operation implementation based on `operationId`.
- Executes the selected operation with the received data.
- For a new synchronization record, the operation and insertion into [sync_processed](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/pglite.md#sync_processed) are executed in the same `PGlite` transaction.
- If the `transaction` fails, both changes are rolled back and the synchronization record can be safely retried.
- When a second delivery is received with processed_at, the corresponding [sync_processed](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/pglite.md#sync_processed) record is removed and a successful ACK is returned.
- Returns a success acknowledgement to the backend if the operation completes successfully.
- Returns a failure acknowledgement if an error occurs.


<pre>
         SyncReceiverService
                |
        SyncOperationFactory
                │
                ▼
      SyncOperationInterface
                │
                ├──► CreateCompetitionOperation
                ├──► UpdateCompetitionOperation
                ├──► DeleteCompetitionOperation
                └──► ...
                │
                ▼
              PGlite
</pre>

---

### SyncOperationFactory
Resolves the appropriate synchronization operation based on its `operationId`.

All available operations are injected through the `SYNC_OPERATIONS` `InjectionToken`. This allows individual operation implementations to be registered independently without modifying the factory.

#### SyncOperationInterface
Uses [SyncOutboxDto]([#syncoutbodDto) DTO which contains the operation metadata.  
Defines the common contract for all frontend synchronization operations:
```ts
export interface SyncOperationInterface {
    supports(operationId: string): boolean;
    execute(data: SyncOutboxDto): Promise<void>;
}
```

Each implementation identifies the operation it supports and contains the logic for applying that operation to the local PGlite database.

#### SYNC_OPERATIONS InjectionToken
Provides the collection of registered synchronization operation implementations to `SyncOperationFactory`.
```ts
export const SYNC_OPERATIONS = new InjectionToken<SyncOperationInterface[]>('SYNC_OPERATIONS');
```

---

### Synchronization Operations
Individual operations implement `SyncOperationInterface` and apply received synchronization data to the local database.

They use the shared [#shared-sql](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/shared-sql.md) package for both the operation-specific data type and the corresponding `SQL query`. This ensures that the same SQL and data structures are used consistently across the **frontend** and **backend**.

The package provides:
* [Shared SQL queries](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/shared-sql.md#synchronization-operations) for synchronization operations such as create, update, and delete.
* [Shared DTOs/types](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/shared-sql.md#shared-dtos) describing the data exchanged between the frontend and backend.
* **Shared operation definitions** through `SYNC_OPERATIONS`.

Operation implementations can use additional services when required, such as [UserService](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/runtime/entry.md#userservice) for resolving the local `user ID`.

---

### DTOs

### SnapshotDto
The data transfer object used for complete database hydration.
  * `data`: A key-value object where each key represents a `tableName` (string) and the value is an array of objects representing database rows (`Record<string, any>[]`).

### SyncQueueItem
* id
* source_id
* operation_id
* record_id
* payload
* created_at
* processed_at

### SyncOutboxDto
* id
* operationId
* recordId
* payload

---
