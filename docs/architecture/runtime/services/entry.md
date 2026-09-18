## Core  Services

<details open="open">
<summary>Contents</summary>

- [EntryService](#entryservice)
- [ExitService](#exitservice)

</details>

---

### EntryService
**Runtime bootstrap/orchestration component**  
The entry point of the `Runtime` application responsible for determining the current application flow, checking device connections.

#### Responsibilities
- Creates the current device parameters using [ConnectionsService](connection_service.md).
- Checks existing device connections through the [backend](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/backend/systems/connections.md).
- Determines whether an administrator connection already exists.
- Opens the [connections popup](connection_service.md#connectionspopupcomponent) when existing connections are found.
- Waits for the popup result using [PopupService](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/runtime/systems/popup-system.md#popupservice).
- Re-checks connections after a deletion.
- Triggers the initial database synchronization through [SyncService](systems/sync-system.md#syncservice).
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
- If connections exist, the component opens [ConnectionsPopupComponent](connection_service.md#connectionspopupcomponent).

---

- ### synchronize()
Opens a blocking system popup showing `SynchronizingDatabaseComponent` and performs the local `pgLite` database synchronization via [SyncService](systems/sync-system.md#syncservice).

If synchronization succeeds, the popup closes, and the component proceeds to navigation.
If synchronization fails, the component catches the error, closes the loader, and opens `RetryPopupComponent` with `SynchronizationErrorComponent`. 

If the user clicks to retry, the component calls `synchronize()` again to re-attempt the database synchronization.

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

### ExitService

- #### backToMode()
Provides the centralized exit workflow for the `Runtime` application.

- Retrieves the current `device_id`, `mode`, and `language` using [ConnectionsService.exitParameters()](connection_service.md#exitparameters)
- If a `device_id` exists, removes the current device connection through [ConnectionsService.deleteDevices()](connection_service.md#deletedevices).
- Removes the `device_id` from `localStorage`.
- Removes the `device_role` from `sessionStorage`.
- Clears the current local `runtime_session` using [RuntimeSessionService.clearSession()](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/runtime/systems/session-system.md#clearsession).
- Handles the final exit according to the `mode`:
  - `ONLINE` — redirects the user back to the [Frontend mode page](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/frontend/pages.md#modecomponent) while preserving the selected `language`.
  - `LAN` — Clears cookies with token using `clearCookies()`. Closes the Runtime window.

- #### clearCookies()
Sends a request to the backend [${environment.apiUrl}/api/logout](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/backend/systems/authentication.md#authcontroller) to clear the  'LAN' authentication token cookies.

---