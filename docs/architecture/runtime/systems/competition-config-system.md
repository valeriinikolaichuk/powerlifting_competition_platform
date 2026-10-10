## Competition Configuration System
Manages the general information and configuration of a competition within the `Runtime` application.  
It is responsible for defining and maintaining the fundamental competition parameters required before other competition workflows can be configured.

<details open="open">
<summary>Contents</summary>  

- [Components](#components)
  - [CreateCompetitionComponent](#createcompetitioncomponent)
  - [OpenCompetitionPopupComponent](#opencompetitionpopupcomponent)
  - [EditCompetitionComponent](#editcompetitioncomponent)
  - [SetDeadlinesComponent](#setdeadlinescomponent)
- [Services](#services)
  - [CompetitionOptionsService](#competitionoptionsservice)
  - [NominationOptionsService](#nominationoptionsservice)
  - [CompetitionConfigService](#competitionconfigservice)
  - [NominationConfigService](#nominationconfigservice)
- [Creation Flow](#creation-flow)
- [DTO / configuration models](#dto-and-configuration-models)
  - [FederationOption](#federationoption)
  - [DivisionOption](#divisionoption)
  - [AgeGroupOption](#agegroupoption)
  - [Competition Options](#competition-options)

</details>

#### Responsibilities
- Creates the initial competition configuration.
- Manages general competition information.
- Configures the competition location.
- Configures competition dates.
- Configures competition level and type. divisions, and age groups.
- Manages application submission periods.
- Manages nomination submission periods.
- Persists configuration changes to the local database.
- Registers configuration changes for synchronization.

---

## Components
The `CompetitionPopupComponent` contains specialized components for different competition management operations.

### CreateCompetitionComponent
The `form` component responsible for creating a new competition in the `Runtime` application.

The component manages competition data input, loads available federation-related options from the local database, handles dependent form fields, validates user input, and delegates competition creation to `CompetitionConfigService`.

#### Responsibilities
* Creates and manages the competition creation form.
* Loads the `popups/competition-popup` [translation scope](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/frontend/systems/i18n.md).
* Provides the competition creation form with available options from the local [PGlite](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/pglite.md) database using [CompetitionOptionsService](#competitionoptionsservice)
* Loads available federations from the local database.
* Loads divisions based on the selected federation.
* Loads age groups based on the selected federation and sex.
* Restricts available competition levels depending on the current language.
* Ensures that the competition end date cannot be earlier than the start date.
* Manages multiple age group selection.
* Validates required form fields before creating a competition.
* Generates a unique competition identifier.
* Delegates competition creation to [CompetitionConfigService](#competitionconfigservice).
* Closes the popup through [PopupService](popup-system.md#popupservice).

#### Form Initialization
The component creates a reactive form during construction.

The form contains the following fields:

| Field             | Description                                 |
| ----------------- | ------------------------------------------- |
| `competitionName` | Competition name                            |
| `country`         | Competition country                         |
| `city`            | Competition city                            |
| `startDate`       | Competition start date                      |
| `endDate`         | Competition end date                        |
| `federation`      | Selected federation                         |
| `level`           | Competition level                           |
| `type`            | Competition type                            |
| `division`        | Federation division                         |
| `sex`             | Selected sex                                |
| `ageGroup`        | Selected federation categories / age groups |

Both `startDate` and `endDate` are initialized with the current date.

```ts
const today = new Date().toISOString().slice(0, 10);
```

The component ensures that the competition date range is valid.

#### Start Date Change
If the selected start date becomes later than the current end date, the end date is automatically updated to match the start date.

```text
Start Date > End Date
        │
        ▼
End Date = Start Date
```

#### End Date Change

If the selected end date becomes earlier than the start date, it is automatically reset to the start date.

This guarantees:

```text
startDate ≤ endDate
```

Available competition levels are determined dynamically based on the current application `language`.

```ts
readonly levels = computed(() => {
  const lang = this.tService.lang();

  if (lang === 'en') {
    return COMPETITION_LEVELS;
  }

  return COMPETITION_LEVELS.filter(
    level => level !== 'INTERNATIONAL'
  );
});
```

The `INTERNATIONAL` level is available only when the application language is set to English.  
For other languages, the level is excluded from the available options.

#### Dependent Form Fields
Some form fields depend on the value of other fields.

- #### Federation → Division
When the selected federation changes:  
1. The current division is cleared.
2. Available divisions for the selected federation are loaded.
3. The first available division is selected automatically.

If no federation is selected, the divisions list is cleared.

- #### Federation / Sex → Age Groups
Age groups depend on both the selected federation and sex.

The component listens for changes to:
* `federation`
* `sex`

Both changes trigger `loadAgeGroups()`.

- ### ngOnInit()
When the component is initialized, it loads the available federations using [competitionOptionsService.getFederations()](#getfederations).  
The first available federation is automatically selected.  
Selecting a federation triggers the dependent federation and age group loading workflows.  

- ### loadAgeGroups()
Loads available age groups using [CompetitionOptionsService](#getagegroups).

The method requires both:
* a federation ID;
* a selected sex.

If either value is missing, the age groups list is cleared.

After the age groups are loaded, the component disables the loading state.
```ts
this.isLoading = false;
```
The loading state prevents the user from creating a competition before the required options have been loaded.

#### Age Group Selection
Age groups are selected using checkboxes.

The selected age group IDs are stored in the reactive form as an array:
```ts
ageGroup: this.fb.control<string[]>([])
```

- ### isAgeGroupSelected()
Checks whether a specific age group is currently selected.
```ts
isAgeGroupSelected(ageGroupId: string): boolean
```

- ### onAgeGroupChange()
Adds or removes an age group ID from the selected age group array when the corresponding checkbox changes.  
Multiple age groups can be selected.

- ### getAgeGroupLabel()
Generates the translation key for an age group label.
```ts
const key = `${ageGroup.federation_code}_${ageGroup.name}_${ageGroup.sex}`;
```

The component attempts to translate the generated key using [TranslationService](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/frontend/systems/i18n.md).  
If no translation exists, the original age group name is returned.

- ### create()
Creates a new competition.

The method performs the following steps:
1. Retrieves the current form values.
2. [Validates](#validateform) the required fields.
3. Generates a `UUID` for the competition.
4. Retrieves the current application `language`.
5. Generates the current `timestamp`.

The competition is created through `CompetitionConfigService` [create()](#async-create)

The component does not directly persist the competition data.

[Validates](#validateform) the required competition fields before creation.

The following fields are required:
* Competition name.
* Country.
* City.
* At least one age group.

If validation fails, the component displays a localized validation message and stops the creation process.

- ### close()
Closes the current competition popup.
```ts
this.popup.close();
```

The component delegates popup management to the generic [PopupService](popup-system.md#popupservice).

---

### OpenCompetitionPopupComponent
Displays a list of active competitions created by the current user and provides actions to open, edit, or archive a selected competition.

- ### Load Competitions
Retrieves the competition list using [OpenCompetitionService](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/runtime/services/shared.md#opencompetitionservice).
- ### Select Competition
Loads the selected competition's details, including location, dates, type, division, federation, and age groups.
- ### Open Competition
Handles the action for opening the selected competition.
- ### Edit Competition
Opens [EditCompetitionComponent](#editcompetitioncomponent) inside `CompetitionPopupComponent`, passing the selected competition's data.
- **Archive Competition** — Requests user confirmation before [archiving](#archive) the selected competition. After archiving, clears the selection and refreshes the list.
- **Close Popup** — Closes the popup without performing an action.

#### Services

- [TranslationService](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/frontend/systems/i18n.md) — Loads translations from `popups/competition-popup` and provides localized confirmation messages.
- [PopupService](popup-system.md) — Closes the current popup and opens the competition editing popup.
- [OpenCompetitionService](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/runtime/services/shared.md#opencompetitionservice) — Retrieves the competition list and detailed competition data.
- [CompetitionConfigService](#archive) — Archives the selected competition.

#### Initialization
The constructor loads the popup translations and retrieves the competition list.

#### User Interface
The popup consists of two main sections:

- **Competition List** — Displays available competitions and highlights the selected item.
- **Action Panel** — Provides buttons for opening, editing, and archiving a competition, displays its details, and includes a cancel button.

Competition dates are displayed in `dd.MM.yyyy` format.

---

### EditCompetitionComponent
Provides a form for editing the configurable details of an existing competition.

- **Form Initialization** — Initializes the reactive form using the selected competition's data, including its name, country, city, start date, and end date.
- **Country Autocomplete** — Retrieves country suggestions through [CompetitionOptionsService](#competitionoptionsservice) and allows the user to select a matching country.
- **City Autocomplete** — Provides city suggestions based on the selected country.
- **Date Validation** — Ensures the end date is not earlier than the start date. Updates the end date when necessary after the start date changes.
- **Age Groups** — Loads available age groups based on the competition's federation and sex. Identifies existing age groups using their federation category IDs and displays translated labels.
- **Update Competition** — Validates the form and submits the modified competition details through [CompetitionConfigService](#update).
- **Synchronization** — Saves the changes to the local database and adds an `UPDATE_COMPETITION` operation to the synchronization queue.
- **Popup Navigation** — Closes the editing popup and returns to the competition list after saving or cancelling.

#### Services
- [TranslationService](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/frontend/systems/i18n.md) — Provides translations for age-group labels and other localized text.
- [CompetitionOptionsService](#competitionoptionsservice) — Retrieves country and city suggestions and available age-group options.
- [CompetitionConfigService](#update) — Updates competition details and queues changes for synchronization.
- [PopupService](popup-system.md) — Manages popup navigation.

#### Methods
- **`ngOnInit()`** — Initializes the form using the selected competition's data and prepares the component for editing.
- **`loadAgeGroups()`** — Loads age groups available for the competition's federation and sex, identifies existing groups, and prepares translated labels.
- **`edit()`** — Retrieves the form values, validates the competition name, country, and city, adds the current language and update timestamp, and calls `CompetitionConfigService.update()`. After a successful update, closes the editing popup and opens the competition list popup.
- **`close()`** — Closes the editing popup and returns to the competition list.

## Data Handling

The component receives the selected competition through the required `competition` input.

The editable fields are:
- Competition name
- Country
- City
- Start date
- End date

The component uses reactive forms to manage input values and date validation. After a successful update, the modified data is stored locally and queued for synchronization with the server.

---







### SetDeadlinesComponent
Provides an interface for configuring preliminary and final nomination deadlines for a selected competition.

- **Form Initialization** — Initializes the form with existing nomination dates retrieved through [NominationOptionsService](#nominationoptionsservice). If no dates are configured, calculates default deadlines: 60 days before the competition start date for preliminary nominations and 30 days before for final nominations.
- **Preliminary Deadline** — Allows the user to configure the preliminary nomination deadline and automatically updates the displayed number of days before the competition.
- **Final Deadline** — Allows the user to configure the final nomination deadline and automatically updates the displayed number of days before the competition.
- **Date Validation** — Ensures that both nomination deadlines are earlier than the competition start date.
- **Deadline Consistency** — Keeps the preliminary and final dates in chronological order. If the preliminary date is later than the final date, updates the final date. If the final date is earlier than the preliminary date, adjusts the final date accordingly.
- **Days Calculation** — Calculates the number of days between each nomination deadline and the competition start date. Uses UTC-based date calculations to avoid discrepancies caused by time zones.
- **Age Groups** — Loads available age groups based on the competition's federation and sex.
- **Age Group Labels** — Retrieves translated age-group names using the federation code, age-group name, and sex.
- **Existing Age Groups** — Identifies age groups already assigned to the competition using their federation category IDs.
- **Set Deadlines** — Validates that both dates are provided and saves them through [NominationConfigService](#nominationconfigservice).
- **Close Popup** — Closes the popup without saving changes.

#### Services
- [TranslationService](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/frontend/systems/i18n.md) — Loads translations from `popups/competition-popup` and provides translated age-group labels.
- [PopupService](popup-system.md) — Controls the popup's visibility.
- [NominationConfigService](#nominationconfigservice) — Saves preliminary and final nomination deadlines.
- [NominationOptionsService](#nominationoptionsservice) — Retrieves previously configured nomination dates for the selected competition.
- [CompetitionOptionsService](#competitionoptionsservice) — Retrieves available age groups for the competition's federation and sex.

#### Methods
- **`ngOnInit()`** — Retrieves existing nomination dates, calculates defaults when dates are unavailable, initializes the reactive form, subscribes to date changes, updates the displayed day counts, and loads available age groups.
- **`getDateBefore(date, days)`** — Calculates a date a specified number of days before the given date and returns it in `YYYY-MM-DD` format.
- **`updateNominationDays()`** — Updates the displayed number of days between the competition start date and each nomination deadline.
- **`getDaysBetween(nominationDate, competitionDate)`** — Calculates the difference in calendar days between two dates using UTC timestamps.
- **`toDateParts(date)`** — Converts a date string or `Date` object into year, month, and day components for consistent date calculations.
- **`toDateString(date)`** — Converts a date string or `Date` object into `YYYY-MM-DD` format.
- **`loadAgeGroups()`** — Retrieves age groups for the selected competition's federation and sex. If either value is unavailable, clears the age-group list.
- **`getAgeGroupLabel(ageGroup)`** — Returns the translated age-group label when a translation exists; otherwise, returns the original age-group name.
- **`isExistingAgeGroup(id)`** — Checks whether an age group is already assigned to the selected competition.
- **`setDeadlines()`** — Retrieves the dates from the form, checks that both are provided, saves them through [NominationConfigService](#setnominationdates), and closes the popup after saving.
- **`close()`** — Closes the popup without saving changes.

#### Data Handling
The component receives the selected competition through the required `competition` input.

The reactive form contains two fields:

- `preliminaryDate` — The preliminary nomination deadline.
- `finalDate` — The final nomination deadline.

Default dates are calculated for the form only. They are not saved until the user submits the form using `setDeadlines()`.

---

## Services

### CompetitionOptionsService
Provides competition-related reference data required by the `Competition Popup Components` with available options from the local [PGlite](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/pglite.md) database.

#### Responsibilities
* Loads federations available to the current user.
* Loads divisions for the selected federation.
* Loads age groups for the selected federation and sex.
* Provides database-backed option data for [CreateCompetitionComponent](#createcompetitioncomponent).

The service uses [PgliteService](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/runtime/services/database_service.md#pgliteservice) to access the local `Runtime` database.

- ### getFederations()
  - Returns the federations available to the current user.  
  - The query retrieves federations associated with the synchronized user through the [user_federations](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/database/reference.md#user_federations) table.  
  - The result is returned as an array of [FederationOption](#federationoption).  

- ### getDivisions()
  - Returns the divisions available for a selected federation.  
  - The divisions are retrieved from the [federation_divisions](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/database/reference.md#federation_divisions) table and ordered by `sort_order`.  
  - The result is returned as an array of [DivisionOption](#divisionoption).

- ### getAgeGroups()
Returns the `age groups` available for the selected `federation` and `sex`.  
The query retrieves federation categories associated with:
* the selected `federation`;
* the selected `sex`.

The results are ordered according to `federation_categories.sort_order`.  
Each result is represented by [AgeGroupOption](#agegroupoption).

- ### validateForm()
Validates the required competition fields before creation.

The following fields are required:
* Competition name.
* Country.
* City.

- ### validateageGroupForm()
Validates at least one age group

---

### NominationOptionsService
Retrieves nomination deadlines configured for a specific competition from the local [PGlite](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/pglite.md) database.

- ### getNominationDates(competitionId) 
Retrieves the preliminary and final nomination dates from the `nomination_status` table for the specified competition. Returns a `NominationDates` object containing `preliminary_date` and `final_date`, or `null` if no record exists.

The service initializes its database reference through `PgliteService` and executes a parameterized SQL query using the competition ID.

The method returns the first matching record or `null` when no nomination settings have been configured. It only retrieves data and does not modify the database.

---

### CompetitionConfigService
Handles persistence and synchronization of competition configuration changes.  
The service ensures that the local database update and synchronization queue entry are created within the same database transaction.

#### Responsibilities
* Provides access to the local [PGlite](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/pglite.md) database.
* Handles competition configurations and adds them to the local database.
* Adds competition changes to the `synchronization queue`.
* Starts `synchronization` after a successful local `transaction`.


- #### Initialization
  - Initializes access to the local [PGlite](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/pglite.md) database using [pgliteService.database](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/runtime/services/database_service.md#database-access).  
  - The database must already be initialized by [PgliteService](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/runtime/services/database_service.md#pgliteservice).
  - Initializes access to the local [PGlite](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/pglite.md) database using [pgliteService.database](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/runtime/database_service.md#database-access).  
  - The database must already be initialized by [PgliteService](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/runtime/database_service.md#pgliteservice).

- ### async create()
Creates a new competition and adds the corresponding synchronization operation to the local `queue` and starts `synchronization`.  

#### User and Device Context
Before creating the competition, the service retrieves:
* the current `user ID` through [UserService](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/runtime/services/shared.md#userservice);
* the current `device ID` from `localStorage`.

#### Local Database Transaction
Competition creation and queue registration are executed inside a single `PGlite` transaction.
```text
Transaction
     │
     ├── Create Competition
     │
     └── Add Sync Queue Operation
```

```ts
await this.pg.transaction(async (tx) => {
  // create competition
  // register synchronization operation
});
```

This ensures that the competition cannot be created locally without registering the corresponding synchronization operation.

If either operation fails, the transaction is rolled back.

#### Competition Creation
The competition is created using the `#shared-sql` operation:

[SYNC_OPERATIONS.CREATE_COMPETITION](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/shared-sql.md#synchronization-operations)

The operation receives the `#shared-sql` DTO [competition data](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/shared-sql.md#competitiondata) together with the current user ID.

#### Synchronization Queue
After the competition is created locally, the service registers a synchronization operation through [syncQueueService.addQueue](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/runtime/services/sync-service.md#addqueue).

The queued operation contains:

* The current device ID.
* Operation type: `CREATE_COMPETITION`.
* Competition ID.
* Competition data payload.
* Update timestamp.

The operation remains in the local `synchronization queue` until it is processed by the `synchronization service`.  

After the `transaction` is successfully committed, the [SyncQueueService](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/runtime/services/sync-service.md#sync) automatically detects the pending operation and sends it to the backend.

- ### update()
Updates competition details in the local database and adds an `UPDATE_COMPETITION` operation to the `synchronization queue` within the same transaction.

- ### archive()
Archives a competition in the local database and adds an `ARCHIVE_COMPETITION` operation to the `synchronization queue` within the same transaction.

---

### NominationConfigService
Manages nomination-related operations, including nomination deadline configuration, status updates, and communication with the [backend API](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/backend/modules.md#nominations-module) and local [PGlite](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/pglite.md) database.

#### Services
- `PgliteService` — Provides access to the local PGlite database.
- `HttpClient` — Sends HTTP requests to the backend API.
- `TranslationService` — Provides localized messages for nomination-related operations.

#### Methods
- ### setNominationDates
Sends nomination deadline data to the [backend API](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/backend/modules.md#nominations-module) and updates the local database after a successful `HTTP` request. If saving fails, logs the error and displays a translated error message.

- ### updateNominationStatus
Updates the nomination status for the specified competition in the local database. This method is private and is not currently called by other methods in the service.

#### Responsibilities
The service is designed to centralize nomination-related business operations, including:
- Configuring preliminary and final nomination deadlines.
- Managing nomination statuses.
- Communicating with the backend API.
- Updating nomination data in the local database.
- Supporting synchronization between local and server-side data.

Additional nomination-related operations can be implemented in this service as the platform evolves.

---

### Creation Flow

<pre>
CreateCompetitionComponent
         │
         ├── Load Federations
         │         │
         │         ▼
         │   CompetitionOptionsService
         │
         ├── Select Federation
         │         │
         │         ├── Load Divisions
         │         │
         │         └── Load Age Groups
         │
         ├── Select Sex
         │       │
         │       ▼
         │ Load Age Groups
         │
         ├── Validate Form
         │
         ▼
CompetitionConfigService.create()
         │
         ├── UserService.getUserId()
         │
         ├── Get device_id
         │
         ▼
  PGlite Transaction
         │
         ├── CREATE_COMPETITION
         │
         └── SyncQueueService.addQueue()
</pre>

---

## DTO and configuration models

### FederationOption
* id
* code

### DivisionOption
* division
* name

### AgeGroupOption
* id
* name
* sex
* federation_code

### Competition Options
The competition creation workflow uses predefined option constants for levels, types, and sexes.

#### Competition Levels
```text
INTERNATIONAL
NATIONAL
REGIONAL_OPEN
REGIONAL_ONLY
LOCAL_OPEN
LOCAL_ONLY
```

The available levels may be filtered by `CreateCompetitionComponent` depending on the current application language.

#### Competition Types
```text
POWERLIFT
BENCH_PRESS
```

#### Sexes
```text
MEN
WOMEN
```

---
