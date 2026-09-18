## Core  Services

<details open="open">
<summary>Contents</summary>

- [EntryService](#entryservice)
- [ExitService](#exitservice)

</details>

---

### EntryService
Сontrols the runtime entry flow and determines which interface should be opened after the application **starts**.

#### Responsibilities
- Creates the current device parameters using [ConnectionsService](connection_service.md).
- Checks existing device connections through the [backend](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/backend/systems/connections.md).
- Determines whether an administrator connection already exists.
- Opens the [connections popup](connection_service.md#connectionspopupcomponent) when existing connections are found.
- Waits for the popup result using [PopupService](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/runtime/systems/popup-system.md#popupservice).
- Re-checks connections after a deletion.
- Triggers the initial database synchronization through [SyncService](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/runtime/systems/sync-system.md#syncservice).
- Displays a blocking [synchronization popup](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/runtime/systems/popup-system.md#components) while the [database](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/pglite.md) is being initialized.
- Handles synchronization errors and allows the user to retry.
- Selects the appropriate application flow between [AdminComponent](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/runtime/admin.md#admincomponent) and [RoleComponent](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/runtime/client.md#rolecomponent).

---

- ### entry()
The initial entry point of the `Runtime`.

- Checks whether a device role already exists in `sessionStorage`.
- If the device is already assigned the `ADMIN` role, the local database is synchronized and the device is redirected to [/admin](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/runtime/admin.md#admincomponent).
- Otherwise, the service creates the device connection parameters using [ConnectionsService.createParameters()](connection_service.md#createparameters) and starts the connection check through `check()`.

---

- ### check()
Requests the current connection state from [ConnectionsService](connection_service.md).

The returned ConnectionsResultDto provides:  
`adminExists` — whether an administrator connection exists.  
`connections` — existing device connections.  

- If no connections exist, the component proceeds directly to database [synchronization](#synchronize).  
- If connections exist, the component opens [ConnectionsPopupComponent](connection_service.md#connectionspopupcomponent).
- Then the device is redirected to [/admin](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/runtime/admin.md#admincomponent) or [/client](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/runtime/client.md#rolecomponent).

**Notes:**  
For a detailed description of the process, see ➡ [Runtime Entry Flow](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/runtime_architecture.md#runtime-entry-flow).

---

- ### synchronize()
Opens a blocking system popup showing `SynchronizingDatabaseComponent` and performs the local `pgLite` database synchronization via [SyncService](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/runtime/systems/sync-system.md#syncservice).

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