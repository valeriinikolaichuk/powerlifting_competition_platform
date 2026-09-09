## Admin app pages

<details open="open">
<summary>Contents</summary>  

- [AdminComponent](#admincomponent)
- [RoleComponent](#rolecomponent)
  - [ExitService](#exitservice)
- [MainComponent](#maincomponent)

</details>

---

### AdminComponent
The administrator entry page of the `Runtime` application.

It initializes the local `pgLite` database, loads the translations required by the page, and provides the user with two actions: continue to the administrator main page or exit the current `Runtime` session.

**UI**  
The page uses a full-screen background video and provides two actions:
- `ADMIN` — opens the administrator [main](#maincomponent) page.
- `EXIT` — leaves the current Runtime session through [ExitService](#exitservice).

#### Responsibilities

- [Initializes](database_service.md#pgliteservice) the local [pgLite](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/pglite.md) database.
- Loads the translations required by the administrator entry page.
- Displays a loading state while the local database is being initialized.
- Navigates to the administrator [main](#maincomponent) page.
- Delegates the exit workflow to [ExitService](#exitservice).
- Loads the `pages/entry` translation scope using [TranslationService](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/frontend/systems/i18n.md)

While initialization is in progress, the page displays a loading indicator.

### - openMainPage()
Navigates the user to the administrator [main](#maincomponent) page:

```ts
await this.router.navigate(['/main']);
```

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
  - `LAN` — Clears cookies with token using `clearCookies()`. Closes the Runtime window.

- #### clearCookies()
Sends a request to the backend `${environment.apiUrl}/api/logout` to clear the  'LAN' authentication token cookies.

---

### MainComponent
The component provides access to administrator actions and serves as the entry point for competition management.

#### Responsibilities

- Loads the translations required by the main page using [TranslationService](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/frontend/systems/i18n.md).
- Opens the competition creation workflow.
- Navigates back to the [administrator page](#admincomponent).

---

