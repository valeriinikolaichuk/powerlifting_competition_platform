## Database services
The `Runtime` application uses two browser-based databases with different responsibilities:
- [IndexedDB](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/indexed.md#database-bombingoutruntime) — stores [Runtime session](systems/session-system.md) data.
- [PGlite](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/pglite.md) — stores the local relational application database.

---

### PgliteService
Manages the local `PGlite` database lifecycle and provides a centralized interface for database access.
* initializes the `PGlite` database in `IndexedDB`;
* creates and maintains the `__migrations` table;
* executes pending `SQL` [migrations](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/tree/main/runtime/public/assets/migrations);
* tracks applied migrations;
* exposes the database instance through the `database getter`;
* provides a generic `query()` method for executing `SQL` statements.

The service is located in the `database/` directory and is used by `Runtime` services that work directly with the local database.  
The database migrations are defined in [pglite.config.ts](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/runtime/src/app/database/services/pglite.config.ts) and executed by `PgliteService` during database initialization.

- ### initialize()
Creates the `local database` only once during the `Runtime` lifecycle.

During initialization, the service loads:
1. pglite.wasm
2. initdb.wasm
3. pglite.data

- ### runMigrations()
Executes all pending `SQL` [migrations](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/tree/main/runtime/public/assets/migrations) defined in `migrationFiles`.

The method:
- Retrieves previously executed migrations from `__migrations`.
- Creates a set of applied migration names.
- Iterates through the configured migration files.
- Skips migrations that have already been executed.
- Loads the `SQL` file from the application assets.
- Executes the migration inside a database transaction.
- Stores the migration name in `__migrations`.

If the migration `SQL` execution fails, the transaction is rolled back and the migration is not recorded as completed.

- ### Database Access
`PgliteService` provides two ways to access the local database.

Returns the underlying initialized PGlite instance.
```
get database(): PGlite
```
An error is thrown if the database has not been initialized.

- ### query()
Provides a generic interface for executing parameterized SQL queries.
```
async query<T>(
  sql: string,
  params?: any[],
)
```
Application services should use this method when they need to execute `SQL` queries without directly managing the `PGlite` instance.

---

### UserService
Provides access to user-related data stored in the local PGlite database.

- ### getUserId()
Retrieves the identifier of the current user from the local users table.
```
SELECT id
FROM users
LIMIT 1
```
The `Runtime` database [users](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/pglite.md#users) table contains the currently synchronized `user` record.

---
