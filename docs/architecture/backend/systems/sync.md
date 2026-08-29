## Synchronization
The synchronization system keeps the local [browser database](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/pglite.md) consistent with the [server database](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/database.md) and allows the competition [Runtime](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/runtime_architecture.md) to continue working when the network connection is unavailable.

* Manages synchronization between the Competition `Runtime` and the backend.
* Receives local changes from the `Runtime` and stores them in the `PostgreSQL` [sync_inbox](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/database/management.md#sync_inbox) table.
* Provides database snapshots used to initialize or restore the [Runtime database](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/pglite.md).
* Uses a `Pipeline` architecture to build database snapshots from multiple independent steps.


Contents

* [SyncController](#synccontroller)
* [SyncService](#syncservice)
* [SnapshotPipelineService](#snapshotpipelineservice)
* [Snapshot Steps](#snapshot-steps)
* [DTOs](#dtos)

---

### SyncController
Provides `HTTP` endpoints for synchronization operations.

#### `POST /api/sync` endpoint
* Receives changes produced by the Runtime `synchronization queue`.
* Delegates processing to `SyncService.processQueueSync()`.
* Returns the number of received changes.
* Stores received changes in the `PostgreSQL` [sync_inbox](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/database/management.md#sync_inbox) table.
* Uses duplicate protection when inserting synchronization records.

The endpoint is intended to receive synchronization changes and persist them for subsequent processing.

#### `GET /api/sync/snapshot` endpoint
* Requires `JWT` authentication.
* Receives the requested `language` through the query string.
* Obtains the authenticated user's `ID` from the `JWT` context.
* Delegates snapshot generation to `SyncService.getDatabaseSnapshot()`.
* Returns the generated database snapshot to the `Runtime`.

---

### SyncService
Contains the main synchronization logic.

- #### processQueueSync()
Processes synchronization changes received from the `Runtime`.
* Returns a successful empty result when no changes are provided.
* Maps incoming [SyncChange](#syncchange) objects to `sync_inbox` records.
* Stores changes using Prisma `createMany()`.
* Uses `skipDuplicates` to prevent duplicate synchronization records.
* Returns the number of received changes.
* Converts database errors into an `InternalServerErrorException`.

The actual processing of queued changes is intentionally separated from receiving and storing them.

- #### getDatabaseSnapshot()
Creates a [SnapshotContext](#snapshotcontext) containing:
* authenticated `userId`;
* requested `language`.

The context is passed to `SnapshotPipelineService`, which executes all registered snapshot steps.

---

### SnapshotPipelineService
Orchestrates database snapshot generation.

The service receives an ordered collection of [SnapshotStepInterface](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/backend/api/src/modules/sync/snapshot-pipeline/snapshot-pipeline.interface.ts) implementations through the [SNAPSHOT_PIPELINE](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/backend/api/src/modules/sync/sync.tokens.ts) injection token.
<pre>
 SnapshotContext
       │
       ▼
SnapshotPipelineService
       │
       ├── StaticReferenceStep, 
       ├── AdminReferenceStep, 
       ├── UserReferenceStep, 
       ├── UserReferenceFederationsStep, 
       ├── CompetitionStep, 
       ├── CompetitionSessionStep, 
       ├── CompetitionGroupStep, 
       ├── UserStep, 
       ├── CreatedByUserStep, 
       ├── CompetitionRuntimeStep, 
       ├── OrganizationResultStep
       │
       ▼
  context.data
       │
       ▼
Database Snapshot
</pre>

Each step is responsible for retrieving a specific category of data and adding it to `context.data`.

The pipeline allows snapshot generation to be extended by adding new steps without modifying `SyncService` or `SnapshotPipelineService`.

---

### Snapshot Steps
Snapshot steps implement the `SnapshotStepInterface`:
```ts
interface SnapshotStepInterface {
    handle(context: SnapshotContext): Promise<void>;
}
```

Each step:
* receives the shared [SnapshotContext](#snapshotcontext);
* retrieves the data required by its responsibility;
* stores the resulting records in `context.data`;
* can use `Prisma` for database access.

For example, `AdminReferenceStep` retrieves reference data from the tables defined in `ADMIN_REFERENCE_TABLES` and filters the records by the authenticated user's ID.

Individual snapshot steps are not documented separately because they follow the same pipeline contract and are independently responsible for their corresponding data set.

---

### DTOs

#### SyncChange
Represents a single synchronization change received from the Runtime.  
Contains the identifiers and payload required to store the change in the backend synchronization inbox.

Fields:
* `id` — synchronization record identifier.
* `source_id` — identifier of the source Runtime.
* `operation_id` — synchronization operation identifier.
* `record_id` — identifier of the affected database record.
* `payload` — serialized change data.
* `created_at`

#### SnapshotContext
Represents the shared context used during database snapshot generation.

Contains:
* `userId` — authenticated user identifier used to restrict snapshot data.
* `language` — requested language for language-dependent data.
* `data` — accumulated snapshot data produced by the pipeline.

The context is passed through all registered snapshot steps and returned as the final database snapshot.
