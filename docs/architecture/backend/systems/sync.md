## Synchronization
The synchronization system keeps the local [browser database](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/pglite.md) consistent with the [server database](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/database.md) and allows the competition [Runtime](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/runtime_architecture.md) to continue working when the network connection is unavailable.

* Manages synchronization between the Competition `Runtime` and the backend.
* Receives local changes from the `Runtime` and stores them in the `PostgreSQL` [sync_inbox](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/database/management.md#sync_inbox) table.
* Provides database snapshots used to initialize or restore the [Runtime database](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/pglite.md).
* Uses a `Pipeline` architecture to build database snapshots from multiple independent steps.


Contents

- [SyncController](#synccontroller)
- [SyncService](#syncservice)
- [SnapshotPipelineService](#snapshotpipelineservice)
  - [Snapshot Steps](#snapshot-steps)
- [SyncGateway](#syncgateway)
- [SyncInboxService](#syncinboxservice)
- [SyncOutboxService](#syncoutboxservice)
  - [Communication Flow](#communication-flow)
- [DTOs](#dtos)

---

### SyncController
Provides `HTTP` endpoints for synchronization operations.

⚠️
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
* Maps incoming [SyncQueueDto](#syncqueuedto) objects to `sync_inbox` records.
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

[snapshot steps](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/tree/main/backend/api/src/modules/sync/snapshot-pipeline)

---

### SyncGateway
Provides the `WebSocket` communication layer for synchronization between `Runtime` devices and the `Backend`.

#### Responsibilities
- Accept `Socket.IO` connections from `Runtime` devices.
- Validate the `device ID` provided during connection.
- Associate each connected client with its `device ID`.
- Receive synchronization operations from `Runtime clients`.
- Pass received operations to [SyncInboxService](#syncinboxservice).
- Send synchronization data from the backend to a `specific device`.
- Report whether delivery to the target device was successful.

`SyncGateway` is responsible only for `WebSocket` communication.

- ### handleConnection()
Retrieves the `deviceId` from the `Socket.IO` handshake query.

If the `device ID` is missing or is not a string, the connection is immediately disconnected.

Valid clients join a `Socket.IO room` identified by their `device ID`:
```ts
client.join(deviceId);
````

This allows synchronization messages to be addressed to a specific device.

### Receiving Synchronization Operations
The `sync` event receives synchronization data from a Runtime client:

```ts
@SubscribeMessage('sync')
async handleSync(@MessageBody() data: SyncQueueDto)
```

The received operation is passed to [SyncInboxService](#syncinboxservice) for processing.

After successful reception, the gateway returns:
```ts
{
  success: true,
}
```

The response is used by the client to determine whether the synchronization operation was successfully received by the backend.

- ### sendToDevice()
Sends synchronization data to a specific device using its `Socket.IO room`.

The message is emitted with a `5-second` acknowledgement `timeout`.

The method returns:
* `true` when the target device acknowledges the message;
* `false` when delivery times out or fails.

---

### SyncInboxService 
Receives synchronization operations from `SyncGateway` and stores them in the backend synchronization inbox.

- ### receive()
- Receive synchronization data from connected `Runtime` devices.
- Persist received synchronization operations in the [sync_inbox](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/database/management.md#sync_inbox) table.
- Preserve the `operation ID`, source `device ID`,`record ID`, and `payload` for further processing.
- Store the received synchronization operation using [PrismaService](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/backend/modules.md#prismaservice).

The following data is persisted ([SyncQueueDto](#syncqueuedto)):
* `id` — unique synchronization operation ID;
* `source_id` — ID of the device that created the operation;
* `operation_id` — synchronization operation type;
* `record_id` — ID of the affected record;
* `payload` — operation data.

After the `inbox` record is successfully created, `receive()` calls [SyncOutboxService.createForDevices()](#createForDevices) to create outgoing records for other active devices.

---

### SyncOutboxService
Creates outgoing synchronization records for all active devices except the device that originated the operation.

- ### createForDevices()
* Finds all active devices registered in [device_status](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/database/system_runtime.md#device_status).
* Excludes the source device from synchronization.
* Creates a separate [sync_outbox](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/database/management.md#sync_outbox) record for each target device.
* Stores the `operation ID`, `record ID`, and payload required for synchronization.
* Does nothing when there are no available target devices.

Creates synchronization tasks for every active device except `data.source_id`.
The method uses distinct `device_id` values, so a device receives only one outbox record even if it has multiple [device_status](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/database/system_runtime.md#device_status) records.

For each target device, an entry is created in the syncOutbox table containing:
* device_id — target device;
* operation_id — synchronization operation type;
* record_id — affected record;
* payload — operation data.

---

### Communication Flow
```text
       SyncGateway
       handleSync()
            |
      SyncInboxService
            |
        SyncQueueDto
            |
        receive()
            |
            ├──► sync_inbox table
            │
     SyncOutboxService
     createForDevices()
            │
            ├──► Device B → syncOutbox
            ├──► Device C → syncOutbox      
            ├──► ...
```

---

### DTOs

#### SyncQueueDto
Represents a single synchronization change received from the `Runtime`.  
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
