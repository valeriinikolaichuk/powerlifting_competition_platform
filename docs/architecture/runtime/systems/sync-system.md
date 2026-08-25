## Database Synchronization

### SyncService
Is responsible for synchronizing the `local browser database` with the server when the `Runtime` **starts** in online mode.

The initialization flow is:  
1. Initializes the local `PGlite` database.
2. Checks the local `sync_queue` for pending changes.
3. Sends pending changes to the backend.
4. Removes the successfully synchronized changes from the `local queue`.
5. Requests the current database snapshot from the backend.
6. Clears the local `USER_TABLES`.
7. Inserts the data received from the server into the local database.
8. Logs the synchronization progress and reports synchronization errors.

The synchronization uses the shared `USER_TABLES` definition to process all user-related tables without maintaining a separate list of tables in the Runtime.

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
