## Synchronization System
A real-time state synchronization system that accepts updates, persists them to the database, and instantly broadcasts them to all other connected clients.

<details open="open">
<summary>Contents</summary>  

- [SyncService](#syncservice)
  - [Synchronization Flow](#synchronization-flow)
- [SyncQueueService](#syncqueueservice)
- [DTOs](#dtos)

</details>

 ---

### SyncService
Is responsible for managing offline-first data capabilities and bi-directional synchronization between the local [PGlite](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/pglite.md) (in-browser `PostgreSQL`) database and the remote backend server (or `localhost`) [database](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/database.md) when the `Runtime` **starts**.

Related with backend [Synchronization system](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/backend/systems/sync.md)

The `SyncService`  
1. [Initializes](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/pglite.md#pgliteservice) the local `PGlite` database.
2. Checks the local `sync_queue` table for pending changes.
3. Sends pending changes to to the backend through `SocketService`.
- ⚠️ ?? 4. Removes the successfully synchronized changes from the `local queue`.
5. Requests the current database snapshot from the backend.
6. Clears the local [USER_TABLES](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/shared-sql.md#synchronization-table-configuration).
7. Inserts the data received from the server into the local database.

The synchronization uses the shared [USER_TABLES](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/shared-sql.md#synchronization-table-configuration) definition to process all user-related tables without maintaining a separate list of tables in the `Runtime`.

While synchronization is running, the application displays `SynchronizingDatabaseComponent` inside `SystemPopupComponent`. This prevents the user from interacting with the application until the initial synchronization is completed.

If synchronization fails, the synchronization popup is closed and `RetryPopupComponent` displays `SynchronizationErrorComponent`.

The user can choose:  
- **RETRY** — starts the synchronization process again.

The local database is not replaced when synchronization fails.

- #### ⚠️??? handleQueueSync()
  - Processes the local synchronization `queue`.
  - Fetches all pending offline changes (where `processed_at IS NULL`).
  - Sends them to the [/api/sync](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/backend/systems/sync.md#synccontroller) backend endpoint, receives [QueueSyncResult](#queuesyncresult)
  - Clears the local queue once the server acknowledges a successful sync.
  - Includes built-in network error handling.

- #### ⚠️??? getSnapshot()
  - Fetches a complete data snapshot from the remote server ([/api/sync/snapshot](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/backend/systems/sync.md#synccontroller)).
  - Automatically detects the user's current UI `language` from the `URL` query parameters (`?lang=...`) and forwards it to the `API` to receive localized database records.

- #### refreshDatabase()
  - Clears all local application tables using a cascading truncate strategy (`TRUNCATE ... CASCADE`)
  - Refills them with the fresh server data provided in the [SnapshotDto](#snapshotdto).

- #### syncWithServer()
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
Sends a synchronization operation to the backend through `SocketService`.

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

### DTOs

#### ⚠️???  QueueSyncResult
Structure of the backend response after pushing local changes.
  * `success`: Boolean flag indicating if the synchronization was successful.
  * `received`: The exact number of offline operations successfully processed by the server.

#### SnapshotDto
The data transfer object used for complete database hydration.
  * `data`: A key-value object where each key represents a `tableName` (string) and the value is an array of objects representing database rows (`Record<string, any>[]`).

### SyncQueueItem
⚠️
    id: string;
    source_id: string;
    operation_id: string;
    record_id: string;
    payload: string;
    created_at
---
