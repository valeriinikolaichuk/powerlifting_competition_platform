## Database Synchronization

### SyncService
Is responsible for managing offline-first data capabilities and bi-directional synchronization between the local `PGlite` (in-browser `PostgreSQL`) database and the remote backend server (or `localhost` DB) when the `Runtime` **starts**.

The initialization flow is:  
1. Initializes the local `PGlite` database.
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

### Synchronization Flow
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
