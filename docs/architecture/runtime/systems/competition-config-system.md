## Competition Configuration System
Manages the general information and configuration of a competition within the `Runtime` application.  
It is responsible for defining and maintaining the fundamental competition parameters required before other competition workflows can be configured.

<details open="open">
<summary>Contents</summary>  

- [Components](#components)
  - [CreateCompetitionComponent](#createcompetitioncomponent)
- [Services](#services)
  - [CompetitionOptionsService](#competitionoptionsservice)
  - [CompetitionPopupService](#competitionpopupservice)
- [DTO / configuration models](#dto-and-configuration-models)

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

The component manages competition data input, loads available federation-related options from the local database, handles dependent form fields, validates user input, and delegates competition creation to `CompetitionPopupService`.

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
* Delegates competition creation to [CompetitionPopupService](#competitionpopupservice).
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

Available competition levels are determined dynamically based on the current application language.

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
Loads available age groups using `CompetitionOptionsService`.

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






---

- ### create()
Creates a new competition.

The method performs the following steps:
1. Retrieves the current form values.
2. [Validates](#validateform) the required fields.
3. Generates a `UUID` for the competition.
4. Retrieves the current application `language`.
5. Generates the current `timestamp`.

The competition is created through:

```ts
await this.competitionPopupService.create({
  ...
});
```

The component does not directly persist the competition data.


- ### validateForm()
Validates the required competition fields before creation.

The following fields are required:
* Competition name.
* Country.
* City.
* At least one age group.

If validation fails, the component displays a localized validation message and stops the creation process.

---

- ### close()

Closes the current competition popup.

```ts
this.popup.close();
```

The component delegates popup management to the generic `PopupService`.

For a detailed description of the popup architecture, see [Popup System](../../../systems/popup-system.md).

---

## Services

### CompetitionOptionsService
Provides competition-related reference data required by the `Competition Popup Components` with available options from the local [PGlite](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/pglite.md) database.

#### Responsibilities
* Loads federations available to the current user.
* Loads divisions for the selected federation.
* Loads age groups for the selected federation and sex.
* Provides database-backed option data for [CreateCompetitionComponent](#createcompetitioncomponent).

The service uses [PgliteService](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/runtime/database_service.md#pgliteservice) to access the local `Runtime` database.

- ### getFederations()
  - Returns the federations available to the current user.  
  - The query retrieves federations associated with the synchronized user through the [user_federations](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/database/reference.md#user_federations) table.  
  - The result is returned as an array of `FederationOption`.  




---

### CompetitionPopupService

---

## DTO and configuration models

---








```text
CompetitionPopupComponent
        │
        ▼
CreateCompetitionComponent
        │
        ├── CompetitionOptionsService
        │       │
        │       ▼
        │    PGlite Database
        │
        └── CompetitionPopupService
                │
                ├── PGlite Database
                │
                └── SyncQueueService
```

---

# CompetitionOptionsService



---





---

## getDivisions()

Returns the divisions available for a selected federation.

```ts
getDivisions(
  federationId: string,
): Promise<DivisionOption[]>
```

The divisions are retrieved from the `federation_divisions` table and ordered by `sort_order`.

```sql
SELECT
  division,
  name
FROM federation_divisions
WHERE federation_id = $1
ORDER BY sort_order
```

The result is returned as an array of `DivisionOption`.

```ts
interface DivisionOption {
  division: string;
  name: string;
}
```

---

## getAgeGroups()

Returns the age groups available for the selected federation and sex.

```ts
getAgeGroups(
  federationId: string,
  sex: string,
): Promise<AgeGroupOption[]>
```

The query retrieves federation categories associated with:

* the selected federation;
* the selected sex.

```text
Federation
     │
     ├── Federation Categories
     │         │
     │         ▼
     │     Age Groups
     │
     └── Federation Code
```

The results are ordered according to `federation_categories.sort_order`.

Each result is represented by `AgeGroupOption`.

```ts
interface AgeGroupOption {
  id: string;
  name: string;
  sex: string;
  federation_code: string;
}
```

---

# CompetitionPopupService

`CompetitionPopupService` is responsible for creating a competition in the local database and registering the operation for synchronization.

The service ensures that the local database update and synchronization queue entry are created within the same database transaction.

#### Responsibilities

* Provides access to the local `PGlite` database.
* Retrieves the current user identifier.
* Retrieves the current device identifier.
* Creates a competition in the local database.
* Registers the competition creation operation in the synchronization queue.
* Ensures both operations are executed atomically.

---

## initialize()

Initializes access to the local `PGlite` database.

```ts
this.pg = this.pgliteService.database;
```

The database must already be initialized by `PgliteService`.

---

## create()

Creates a new competition and adds the corresponding synchronization operation to the local queue.

```ts
create(
  data: CompetitionData,
): Promise<void>
```

### User and Device Context

Before creating the competition, the service retrieves:

* the current user ID through `UserService`;
* the current device ID from `localStorage`.

```ts
const userId = await this.userService.getUserId();

const deviceId = localStorage.getItem('device_id');
```

If no device ID exists, the operation cannot continue.

```text
Device ID not found.
```

---

### Local Database Transaction

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

---

### Competition Creation

The competition is created using the shared SQL operation:

```ts
SYNC_OPERATIONS.CREATE_COMPETITION
```

The operation receives the competition data together with the current user ID.

The created competition contains:

* Competition ID.
* User ID.
* Name.
* Country.
* City.
* Language.
* Start date.
* End date.
* Competition level.
* Competition type.
* Division.
* Selected federation category IDs.
* Update timestamp.

---

### Synchronization Queue

After the competition is created locally, the service registers a synchronization operation through `SyncQueueService`.

```ts
await this.syncQueueService.addQueue(
  tx,
  deviceId,
  'CREATE_COMPETITION',
  data.id,
  data,
  data.updated_at,
);
```

The queued operation contains:

* The current device ID.
* Operation type: `CREATE_COMPETITION`.
* Competition ID.
* Competition data payload.
* Update timestamp.

The operation remains in the local synchronization queue until it is processed by the synchronization system.

For a detailed description of the synchronization queue, see [Sync System](../../systems/sync-system.md).

---

# CompetitionData

`CompetitionData` represents the data required to create a competition.

```ts
interface CompetitionData {
  id: string;
  name: string;
  country: string;
  city: string;
  language: string;
  startDate: string;
  endDate: string;
  level: string;
  type: string;
  division: string;
  federationCategoryIds: string[];
  updated_at: string;
}
```

The object is created by `CreateCompetitionComponent` and passed to `CompetitionPopupService.create()`.

---

# Competition Options

The competition creation workflow uses predefined option constants for levels, types, and sexes.

## Competition Levels

```text
INTERNATIONAL
NATIONAL
REGIONAL_OPEN
REGIONAL_ONLY
LOCAL_OPEN
LOCAL_ONLY
```

The available levels may be filtered by `CreateCompetitionComponent` depending on the current application language.

---

## Competition Types

```text
POWERLIFT
BENCH_PRESS
```

---

## Sexes

```text
MEN
WOMEN
```

---

# Complete Creation Flow

```text
User
 │
 ▼
CreateCompetitionComponent
 │
 ├── Load Federations
 │       │
 │       ▼
 │ CompetitionOptionsService
 │
 ├── Select Federation
 │       │
 │       ├── Load Divisions
 │       │
 │       └── Load Age Groups
 │
 ├── Select Sex
 │       │
 │       ▼
 │ Load Age Groups
 │
 ├── Validate Form
 │
 ▼
CompetitionPopupService.create()
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
        │
        ▼
   Synchronization Queue
```

---

## Важливий архітектурний момент

Оце місце дуже добре виглядає для документації:

```ts
await this.pg.transaction(async (tx) => {

  await tx.query(
    SYNC_OPERATIONS.CREATE_COMPETITION,
    [...]
  );

  await this.syncQueueService.addQueue(
    tx,
    deviceId,
    'CREATE_COMPETITION',
    ...
  );

});
```

Бо це фактично **local-first + transactional outbox pattern**.

Тобто:

```text
Database State Change
        +
Synchronization Event
        │
        ▼
Single Transaction
```

Я б навіть у документації Sync System потім окремо описав цей принцип як:

## Local Transaction and Synchronization Queue

> All local data modifications that require server synchronization should create the corresponding synchronization queue entry within the same database transaction.

Це буде важливим архітектурним правилом для всіх майбутніх операцій:

* `CREATE_COMPETITION`
* `UPDATE_COMPETITION`
* `DELETE_COMPETITION`
* create athlete
* update athlete
* create result

і так далі.

Так документація пояснюватиме не просто конкретний код, а загальний принцип Runtime architecture.
