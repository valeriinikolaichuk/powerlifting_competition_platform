### EntryComponent
**Runtime bootstrap/orchestration component**  
The entry point of the `Runtime` application responsible for determining the current application flow, checking device connections, and initializing the local database synchronization.

#### Responsibilities
- Creates the current device parameters using [ConnectionsService](connection_service.md).
- Checks existing device connections through the [backend](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/backend/systems/connections.md).
- Determines whether an administrator connection already exists.
- Opens the [connections popup](delete_connections.md) when existing connections are found.
- Waits for the popup result using [PopupService](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/runtime/systems/popup-system.md#popupservice).
- Re-checks connections after a deletion.
- Initializes the local database [synchronization](systems/sync-system.md#syncservice).
- Displays a blocking [synchronization popup](systems/popup-system.md#components) while the [database](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/pglite.md) is being initialized.
- Handles synchronization errors and allows the user to retry.
- Selects the appropriate application flow between [AdminComponent](pages.md#admincomponent) and [RoleComponent](pages.md#rolecomponent).

#### Initialization
When the component is initialized, it first checks whether a device role already exists in `sessionStorage`.

#### Administrator Session
If the current device role is `ADMIN`, the component:
1. Sets `adminExists` to false.  
2. Starts the local database synchronization.  
3. Skips the connection check.

This allows the administrator device to proceed directly to the administrator flow after synchronization.

#### Other Devices
If the device does not already have the `ADMIN` role, the component:
- Creates the current device parameters using [ConnectionsService.createParameters()](connection_service.md#createparameters).
- Calls [check()](#check) to retrieve the current connection state from the backend.

#### Navigation
The component selects the application flow using the `adminExists` state.
```
@if (adminExists) {
  <app-role></app-role>
} @else {
  <app-admin></app-admin>
}
```
- `adminExists` === true — displays [RoleComponent](pages.md#rolecomponent).
- `adminExists` === false — displays [AdminComponent](pages.md#admincomponent).

**Notes:**  
For a detailed description of the process, see ➡ [Runtime Entry Flow](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/runtime_architecture.md#runtime-entry-flow).

---

- ### check()
Requests the current connection state from [ConnectionsService](connection_service.md).

The returned ConnectionsResultDto provides:  
`adminExists` — whether an administrator connection exists.  
`connections` — existing device connections.  

- If no connections exist, the component proceeds directly to database [synchronization](#synchronize).  
- If connections exist, the component opens [ConnectionsPopupComponent](delete_connections.md#connectionspopupcomponent).

---

- ### synchronize()
Opens a blocking system popup showing `SynchronizingDatabaseComponent` and initializes the local `pgLite` database via [SyncService](systems/sync-system.md#syncservice).

If synchronization succeeds, the popup closes, and the component proceeds to navigation.
If synchronization fails, the component catches the error, closes the loader, and opens `RetryPopupComponent` with `SynchronizationErrorComponent`. 

If the user clicks to retry, the component calls `synchronize()` again to re-attempt the database initialization.

---

- ### openConnectionsPopup()
uses the generic `PopupService` to open the connections popup and waits for its result:
```
return this.popup.open<string[]>(
  ConnectionsPopupComponent,
  {
    connections,
  },
);
```
The returned `string[]` contains the IDs of devices deleted by the user.

If the user closes the popup without deleting anything, the component proceeds to database [synchronization](#synchronize).
After devices are deleted, the component calls check(dto) again to obtain the updated connection state.

---
