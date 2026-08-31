## Database Synchronization

<details open="open">
<summary>Contents</summary>  

- [SyncService](#syncservice)
  - [Synchronization Flow](#synchronization-flow)
- [DTOs](#dtos)

</details>

The application synchronizes the local `PGlite` database with the server when the application starts and an online connection is available.  

The synchronization process is handled by [SyncService](#syncservice).

### Synchronization flow
1. The local `PGlite` database is initialized.
2. Pending changes from `sync_queue` are sent to the server.
3. The server provides a database snapshot.
4. Local tables are refreshed from the snapshot.
5. The synchronization popup is closed after successful completion.

While synchronization is running, the application displays `SynchronizingDatabaseComponent` inside `SystemPopupComponent`. This prevents the user from interacting with the application until the initial synchronization is completed.

If synchronization fails, the synchronization popup is closed and `DecisionPopupComponent` displays `SynchronizationErrorComponent`.

The user can choose:

- **RETRY** — starts the synchronization process again.
- **CONTINUE** — continues using the existing local database copy.

The local database is not replaced when synchronization fails, so the user can continue working with the previously synchronized data.

---

### SyncService
Is responsible for managing offline-first data capabilities and bi-directional synchronization between the local [PGlite](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/pglite.md) (in-browser `PostgreSQL`) database and the remote backend server (or `localhost`) [database](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/database.md) when the `Runtime` **starts**.

Related with backend [Synchronization system](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/backend/systems/sync.md)

- #### handleQueueSync()
  - Processes the local synchronization `queue`.
  - Fetches all pending offline changes (where `processed_at IS NULL`).
  - Sends them to the [/api/sync](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/backend/systems/sync.md#synccontroller) backend endpoint, receives [QueueSyncResult](#queuesyncresult)
  - Clears the local queue once the server acknowledges a successful sync.
  - Includes built-in network error handling.

- #### getSnapshot()
  - Fetches a complete data snapshot from the remote server ([/api/sync/snapshot](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/backend/systems/sync.md#synccontroller)).
  - Automatically detects the user's current UI `language` from the `URL` query parameters (`?lang=...`) and forwards it to the `API` to receive localized database records.

- #### refreshDatabase()
  - Clears all local application tables using a cascading truncate strategy (`TRUNCATE ... CASCADE`)
  - Refills them with the fresh server data provided in the [SnapshotDto](#snapshotdto).

- #### syncWithServer()
  - Populates local database tables with incoming snapshot data.
  - Dynamically maps object keys and values into secure, SQL-injection-proof parameterized queries (`$1, $2, ...`) and executes sequential insertions for each record.

---

### Synchronization Flow 
1. [Initializes](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/pglite.md#pgliteservice) the local `PGlite` database.
2. If offline, it bypasses network requests and relies entirely on the local `PGlite` database copy.
3. Checks the local `sync_queue` table for pending changes.
4. Sends pending changes to the backend via a `POST` request.
5. Removes the successfully synchronized changes from the `local queue`.
6. Requests the current database snapshot from the backend.
7. Clears the local [USER_TABLES](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/shared-sql.md#synchronization-table-configuration).
8. Inserts the data received from the server into the local database.
9. Logs the synchronization progress and reports synchronization errors.

The synchronization uses the shared [USER_TABLES](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/shared-sql.md#synchronization-table-configuration) definition to process all user-related tables without maintaining a separate list of tables in the Runtime.

If the Runtime is offline, synchronization is skipped and the existing local database remains available.

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

### DTOs

#### QueueSyncResult
Structure of the backend response after pushing local changes.
  * `success`: Boolean flag indicating if the synchronization was successful.
  * `received`: The exact number of offline operations successfully processed by the server.

#### SnapshotDto
The data transfer object used for complete database hydration.
  * `data`: A key-value object where each key represents a `tableName` (string) and the value is an array of objects representing database rows (`Record<string, any>[]`).

---
