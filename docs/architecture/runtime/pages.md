### AdminComponent

---

### RoleComponent

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
  - `LAN` — closes the Runtime window.

