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
- [SyncOutboxDeliveryService](#syncoutboxdeliveryservice)
  - [Delivery Flow](#delivery-flow)
- [SyncProcessorService](syncprocessorservice)
  - [SyncOperationFactoryService](#syncoperationfactoryservice)
  - [Synchronization Operations](#synchronization-operations)
  - [UserService](#userservice)
- [Notes (**processed_at** handling)](#notes)
- [DTOs](#dtos)
  - [SyncQueueDto](#syncqueuedto)
  - [SnapshotContext](#snapshotcontext)
  - [SyncInboxItem](#syncinboxitem)

---

### SyncController
Provides `HTTP` endpoints for synchronization operations.

#### `GET /api/sync/snapshot` endpoint
* Requires [JWT](authentication.md#jwt-authentication) authentication.
* Receives the requested `language` through the query string.
* Obtains the authenticated user's `ID` from the `JWT` context.
* Delegates snapshot generation to [SyncService.getDatabaseSnapshot()](#getdatabasesnapshot).
* Returns the generated database snapshot to the `Runtime`.

---

### SyncService
Contains the database synchronization logic when the `Runtime` **starts**.

- ### getDatabaseSnapshot()
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

After the `inbox` record is successfully created, `receive()` calls [SyncOutboxService.createForDevices()](#createfordevices) to create outgoing records for other active devices.

---

### SyncOutboxService
Creates outgoing synchronization records for all active devices except the device that originated the operation.

- ### createForDevices()
  - Finds all active devices registered in [device_status](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/database/system_runtime.md#device_status).
  - Excludes the source device from synchronization.
  - Creates a separate [sync_outbox](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/database/management.md#sync_outbox) record for each target device.
  - Stores the `operation ID`, `record ID`, and payload required for synchronization.
  - Does nothing when there are no available target devices.

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

### SyncOutboxDeliveryService
Delivers pending synchronization operations from the backend `syncOutbox` to `Runtime` devices.

#### Responsibilities
- Periodically check for pending synchronization operations.
- Group pending operations by target device.
- Deliver operations to the target device through [SyncGateway](#syncgateway).
- Process pending operations in creation order for each device.
- Mark successfully delivered operations as processed.
- Retry operations that have not been successfully delivered.

### retryPending()
Runs automatically every second using the **`@Interval(1000)`** decorator.

It finds all devices with unprocessed records in [sync_outbox](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/database/management.md#sync_outbox) and starts delivery for each device:
```ts
@Interval(1000)
async retryPending(): Promise<void>
```

Only distinct device `IDs` are selected to avoid processing the same device multiple times during one interval.

- ### deliver()
Retrieves all unprocessed synchronization records for the specified device and orders them by `created_at`.

The service reads pending synchronization records from the [sync_outbox](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/database/management.md#sync_outbox) table, which contains operations created by [SyncOutboxService](#syncoutboxservice) for target devices. Target device information is derived from the [device_status](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/database/system_runtime.md#device_status) table when the outbox records are created.

Each operation is sent through `SyncGateway` [sendToDevice()](#sendtodevice).

If the gateway confirms successful **delivery**, the corresponding [sync_outbox](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/database/management.md#sync_outbox) record is marked as processed by setting `processed_at`.

If delivery fails, the record remains unprocessed and will be retried during a subsequent execution of [retryPending()](#retrypending).

---

### Delivery Flow
<pre>
SyncOutboxDeliveryService
            |
            ├── @Interval(1000)
            |   retryPending() ──► sync_outbox ──► device_id ?
            |
            └── deliver()
                   |
        syncGateway.sendToDevice()
                    | 
                    └── Socket.IO

        Server                    Client

        emit('sync', data)
        ────────────────────────>
                                 apply(data)
                                 callback({ success: true })
        <────────────────────────
               ACK

        ↓
    sync_outbox
processed_at: new Date()
</pre>

---

### SyncProcessorService
Processes pending synchronization operations stored in the backend [sync_inbox](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/database/management.md#sync_inbox).

#### Responsibilities
- Periodically check for unprocessed synchronization operations.
- Process operations in the order they were received.
- Create the corresponding synchronization operation through [SyncOperationFactoryService](#syncoperationfactoryservice).
- Execute the selected operation.
- Mark successfully processed inbox records as `processed`.
- Keep failed operations unprocessed for subsequent processing attempts.

#### Data Source
`SyncProcessorService` processes pending records from the [sync_inbox](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/database/management.md#sync_inbox) table. The records contain the source device, operation type, affected record, and operation payload received from [SyncGateway](#syncgateway).

- ### processPending()
Runs automatically every second using the **`@Interval(1000)`** decorator.

It retrieves records from [sync_inbox](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/database/management.md#sync_inbox) where `processed_at` is `null`, ordered by `received_at`:
```ts
@Interval(1000)
async processPending(): Promise<void>
```

For each record, the service:  
1. Creates the appropriate synchronization operation using [SyncOperationFactoryService](#syncoperationfactoryservice).  
2. Executes the operation with the data received from [sync_inbox](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/database/management.md#sync_inbox).  
3. Sets `processed_at` after successful execution.  

If processing fails, the error is logged and the inbox record remains unprocessed, allowing it to be retried during a subsequent execution.

---

### SyncOperationFactoryService
Provides an extensible mechanism for executing different types of synchronization operations.

Each synchronization operation implements [SyncOperationInterface](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/backend/api/src/modules/sync/sync-operations/sync-operation.interface.ts) and is responsible for handling one specific operation type. `SyncOperationFactoryService` selects the appropriate implementation based on the `operation ID`.

If no implementation supports the requested operation, an error is thrown.

#### SyncOperationInterface
Defines the common contract for all synchronization operations.  
Uses [SyncInboxItem]([#syncinboxitem) DTO which contains the operation metadata.  
```ts
interface SyncOperationInterface {
  supports(operationId: string): boolean;
  execute(data: SyncInboxItem): Promise<void>;
}
```
- `supports()` determines whether the operation handles a specific `operation ID`.
- `execute()` performs the actual synchronization logic for the received data.

This allows new synchronization operations to be added independently without modifying the synchronization processor.

---

### Synchronization Operations
Each concrete operation contains only the logic required for its specific synchronization operation.

Its `execute()` method contains the database-specific logic required to apply that operation.

Concrete synchronization operations use the shared `#shared-sql` package to keep synchronization logic consistent between the frontend and backend.

The package provides:
* **Shared SQL queries** for synchronization operations such as create, update, and delete.
* **Shared DTOs/types** describing the data exchanged between the frontend and backend.
* **Shared operation definitions** through `SYNC_OPERATIONS`.

This ensures that the **same data structures and SQL operations are used on both sides**, avoiding duplicated `SQL` and `DTO` definitions between the `Angular` frontend and `NestJS` backend.

New synchronization operations can therefore be added by creating another `SyncOperationInterface` implementation and registering it in `SYNC_OPERATIONS`.

```text
SyncProcessorService
        │
        │ operationId
        ▼
SyncOperationFactoryService
        │
        │ create()
        ▼
SyncOperationInterface
        │
        ├──► CreateCompetitionOperation
        ├──► UpdateCompetitionOperation
        ├──► DeleteCompetitionOperation
        └──► ...
```

---

### UserService

`UserService` is a supporting service used only by synchronization operations that need to resolve the user associated with the source device.

`getUserId()` looks up the active [device_status](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/database/system_runtime.md#device_status) record using the source device ID and returns its `created_by_user_id`.

This service is used only by operations that require the source user's ID and is not required by every synchronization operation.

---

### Notes

- `syncInbox.processed_at` is set after a synchronization operation is successfully processed by [SyncProcessorService](syncprocessorservice).
- `syncOutbox.processed_at` is set after a synchronization operation is successfully delivered to the target device by [SyncOutboxDeliveryService](#syncoutboxdeliveryservice).

If processing or delivery fails, `processed_at` remains `NULL`, allowing the operation to be retried.




---

### DTOs

### SyncQueueDto
Represents a single synchronization change received from the `Runtime`.  
Contains the identifiers and payload required to store the change in the backend synchronization inbox.

Fields:
* `id` — synchronization record identifier.
* `source_id` — identifier of the source Runtime.
* `operation_id` — synchronization operation identifier.
* `record_id` — identifier of the affected database record.
* `payload` — serialized change data.
* `created_at`

### SnapshotContext
Represents the shared context used during database snapshot generation.

Contains:
* `userId` — authenticated user identifier used to restrict snapshot data.
* `language` — requested language for language-dependent data.
* `data` — accumulated snapshot data produced by the pipeline.

The context is passed through all registered snapshot steps and returned as the final database snapshot.

### SyncInboxItem
Represents a normalized synchronization item used internally by the synchronization process. It contains the operation metadata and payload required to execute the corresponding sync operation.

Fields:
* id
* sourceId
* operationId
* recordId
* payload

---
