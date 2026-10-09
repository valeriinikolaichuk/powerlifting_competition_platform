## Admin app pages

<details open="open">
<summary>Contents</summary>  

- [AdminComponent](#admincomponent)
- [MainComponent](#maincomponent)
- [RegistrationComponent](#registrationcomponent)

</details>

---

### AdminComponent
The administrator entry page of the `Runtime` application.

It initializes the local `pgLite` database, loads the translations required by the page, and provides the user with two actions: continue to the administrator main page or exit the current `Runtime` session.

**UI**  
The page uses a full-screen background video and provides two actions:
- `ADMIN` — opens the administrator [main](#maincomponent) page.
- `EXIT` — leaves the current Runtime session through [ExitService](services/shared.md#backtomode).

#### Responsibilities
- Injects [DeviceReceiverService](services/connection_service.md#devicereceiverservice) to initialize the listener for incoming `device-status` events.
- [Initializes](services/database_service.md#pgliteservice) the local [pgLite](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/pglite.md) database.
- starts the [SyncQueueService](services/sync-service.md#syncqueueservice), which continuously checks the local [sync_queue](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/pglite.md#sync_queue) and automatically sends pending synchronization operations to the backend.
- Loads the translations required by the administrator entry page.
- Displays a loading state while the local database is being initialized.
- Navigates to the administrator [main](#maincomponent) page.
- Delegates the exit workflow to [ExitService](services/shared.md#exitservice).
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

#### Features

- **Create Competition** — Opens a `popup` containing [CreateCompetitionComponent](systems/competition-config-system.md#createcompetitioncomponent) to configure a new competition.
- **Open Competition** — Opens [OpenCompetitionPopupComponent](systems/competition-config-system.md#opencompetitionpopupcomponent) to select an existing competition.
- **Online Registration** — Displays a navigation button to the [registration page](#registrationcomponent) when an internet connection is available.
- **Return** — Navigates back to the [administrator page](#admincomponent).

#### Initialization

During `ngOnInit()`, the component [checks](services/shared.md#checkonlineservice) internet connectivity, adjusts the navigation button position when online, and loads the page translations.

---

### RegistrationComponent
Provides the interface for viewing competitions and configuring online registration deadlines.

#### Features
- **Load Competitions** — Retrieves competitions available for registration through [OpenCompetitionService](services/shared.md#opencompetitionservice).
- **Online Status** — Checks whether the current user is configured for online mode using [CheckOnlineService](services/shared.md#checkonlineservice) and adjusts the navigation button position accordingly.
- **Select Competition** — Loads the full details of the selected competition.
- **Set Deadlines** — Opens [SetDeadlinesComponent](systems/competition-config-system.mdSS#setdeadlinescomponent) inside `CompetitionPopupComponent` to configure nomination deadlines for the selected competition.
- **Return Navigation** — Uses a dynamically positioned navigation button in the component template.

#### Services
- `TranslationService` — Loads translations from `pages/registration`.
- `PgliteService` — Provides access to the local PGlite database.
- [CheckOnlineService](services/shared.md#checkonlineservice) — Checks whether the current user has an ADMIN device configured for online mode.
- [OpenCompetitionService](services/shared.md#opencompetitionservice) — Retrieves the competition list and selected competition details.
- [PopupService](systems/popup-system.md) — Opens the deadline configuration popup.

#### Initialization
The constructor initializes the local database reference, loads page translations, and starts loading competitions.

During `ngOnInit()`, the component checks online mode and updates the navigation button position.

#### Methods
- **`loadCompetitions()`** — Retrieves the competition list.
- **`selectCompetition()`** — Loads the details of the selected competition.
- **`openDeadline()`** — Opens the [deadline configuration popup](systems/competition-config-system.mdSS#setdeadlinescomponent) if a competition is selected.

---