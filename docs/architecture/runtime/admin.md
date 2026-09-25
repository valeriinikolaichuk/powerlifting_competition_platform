## Admin app pages

<details open="open">
<summary>Contents</summary>  

- [AdminComponent](#admincomponent)
- [MainComponent](#maincomponent)

</details>

---

### AdminComponent
The administrator entry page of the `Runtime` application.

It initializes the local `pgLite` database, loads the translations required by the page, and provides the user with two actions: continue to the administrator main page or exit the current `Runtime` session.

**UI**  
The page uses a full-screen background video and provides two actions:
- `ADMIN` — opens the administrator [main](#maincomponent) page.
- `EXIT` — leaves the current Runtime session through [ExitService](entry.md#backtomode).

#### Responsibilities
- Injects [DeviceReceiverService](services/connection_service.md#devicereceiverservice) to initialize the listener for incoming `device-status` events.
- [Initializes](services/database_service.md#pgliteservice) the local [pgLite](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/pglite.md) database.
- starts the [SyncQueueService](services/sync-service.md#syncqueueservice), which continuously checks the local [sync_queue](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/pglite.md#sync_queue) and automatically sends pending synchronization operations to the backend.
- Loads the translations required by the administrator entry page.
- Displays a loading state while the local database is being initialized.
- Navigates to the administrator [main](#maincomponent) page.
- Delegates the exit workflow to [ExitService](entry.md#exitservice).
- Loads the `pages/entry` translation scope using [TranslationService](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/frontend/systems/i18n.md)

While initialization is in progress, the page displays a loading indicator.

### - openMainPage()
Navigates the user to the administrator [main](#maincomponent) page:

```ts
await this.router.navigate(['/main']);
```

---

### MainComponent
The component provides access to administrator actions and serves as the entry point for competition management.

#### Responsibilities

- Loads the translations required by the main page using [TranslationService](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/frontend/systems/i18n.md).
- Opens the competition creation workflow.
- Navigates back to the [administrator page](#admincomponent).

---

