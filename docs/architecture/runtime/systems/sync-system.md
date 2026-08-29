## Database Synchronization

<details open="open">
<summary>Contents</summary>  

- [SyncService](#syncservice)
  - [Synchronization Flow](#synchronization-flow)
- [DTOs](#dtos)

</details>

---

### SyncService
Is responsible for managing offline-first data capabilities and bi-directional synchronization between the local `PGlite` (in-browser `PostgreSQL`) database and the remote backend server (or `localhost` DB) when the `Runtime` **starts**.

- #### handleQueueSync()
  - Processes the local synchronization `queue`.
  - Fetches all pending offline changes (where `processed_at IS NULL`).
  - Sends them to the `/api/sync` backend endpoint, receives [QueueSyncResult](#queuesyncresult)
  - Clears the local queue once the server acknowledges a successful sync.
  - Includes built-in network error handling.

- #### getSnapshot()
  - Fetches a complete data snapshot from the remote server (`/api/sync/snapshot`).
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
2. Automatically detects network status via `navigator.onLine`.
3. If offline, it bypasses network requests and relies entirely on the local `PGlite` database copy.
4. Checks the local `sync_queue` table for pending changes.
6. Sends pending changes to the backend via a `POST` request.
7. Removes the successfully synchronized changes from the `local queue`.
8. Requests the current database snapshot from the backend.
9. Clears the local [USER_TABLES](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/shared-sql.md#synchronization-table-configuration).
10. Inserts the data received from the server into the local database.
11. Logs the synchronization progress and reports synchronization errors.

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
