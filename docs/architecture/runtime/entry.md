### EntryComponent
The entry point of the `Runtime` application responsible for checking the current device connection state before allowing the user to continue to the appropriate application flow.

#### Responsibilities
- Creates the current device parameters using [ConnectionsService](connection_service.md).
- Checks existing device connections through the [backend](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/backend/systems/connections.md).
- Determines whether an administrator connection already exists.
- Opens the [connections popup](delete_connections.md) when existing connections are found.
- Waits for the popup result using [PopupService](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/runtime/systems/popup-system.md#popupservice).
- Re-checks connections after a deletion.
- Navigates to the appropriate route based on the administrator state.

#### Initialization
When the component is initialized, it creates the device parameters and starts the connection check  

#### Navigation
  - Determines the next route based on `adminExists`.  
  - Acts as the entry decision point between the administrator setup and the role-selection flow.

```
@if (adminExists) {
  <app-role></app-role>
} @else {
  <app-admin></app-admin>
}
```

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
