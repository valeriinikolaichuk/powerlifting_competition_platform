## Admin app pages

<details open="open">
<summary>Contents</summary>  

- [AdminComponent](#admincomponent)
- [MainComponent](#maincomponent)
  - [TABLES](#tables)
    - [NominationTable](#nominationtable)
  - [SERVICES](#services)
    - [AthleteTableOptionsService](#athletetableoptionsservice)
    - [ColumnFactoryService](#columnfactoryservice)
    - [ColspanFactoryService](#colspanfactoryservice)
  - [config](#config)
  - [models](#models)
  - [units](#units)
  - [types](#types)
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

#### - openMainPage()
Navigates the user to the administrator [main](#maincomponent) page:

```ts
await this.router.navigate(['/main']);
```

---

### MainComponent
The component provides access to administrator actions and serves as the entry point for competition management.

#### Responsibilities

- Loads the translations required by the main page using [TranslationService](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/frontend/systems/i18n.md).
- Checks internet connectivity using [CheckOnlineService](services/shared.md#checkonlineservice)
- Opens the competition creation workflow.
- Displays the nomination table for the selected competition.
- Navigates back to the [administrator page](#admincomponent).

#### Features

- TOOLBAR
  - **Create Competition** — Opens a `popup` containing [CreateCompetitionComponent](systems/competition-config-system.md#createcompetitioncomponent) to configure a new competition. If the returned action is `open`, the component stores the created competition and displays its nomination table.
  - **Open Competition** — Opens [OpenCompetitionPopupComponent](systems/competition-config-system.md#opencompetitionpopupcomponent) to select an existing competition. If the returned action is `open`, the component stores the selected competition and displays its nomination table.
  - **Online Registration** — Displays a navigation button to the [registration page](#registrationcomponent) when an internet connection is available.
  - **Return** — Navigates back to the [administrator page](#admincomponent).
- TABLES
  - [Nomination Table](#nominationtable) — Dynamically renders NominationTable using `NgComponentOutlet` and passes the selected competition through its competition input.

#### Methods
* **openCreateCompetition()** — Opens the competition creation popup. If the returned action is `open`, stores the created competition and displays its nomination table.
* **openOpenCompetition()** — Opens the competition selection popup. If the returned action is `open`, stores the selected competition and displays its nomination table.
* **showNomination()** — Sets `NominationTable` as the active table component.
* **backToAdmin()** — Navigates to the administrator page.

#### Initialization

During `ngOnInit()`, the component [checks](services/shared.md#checkonlineservice) internet connectivity, adjusts the navigation button position when online, and loads the page translations.

---

### TABLES

### NominationTable
Provides the nomination table for a selected competition, displaying athlete information, competition details, and nomination data.

#### Responsibilities
- Receives competition details and athlete data through component inputs.
- Configures column visibility and table header spans using [ColumnFactoryService](#columnfactoryservice).
- Loads athlete table translations using [TranslationService](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/frontend/systems/i18n.md).
- Retrieves autocomplete suggestions and athlete date-of-birth data using [SuggestionService](runtime/services/shared.md#suggestionservice).
- Manages the input form for adding athletes to the nomination list.

#### Features
- **Competition Information** — Displays the competition name, location, dates, type, division, sex, age groups, and federation.
- **Dynamic Columns** — Configures column visibility according to the competition level, type, language, and number of age groups.
- **Table Header Configuration** — Calculates `competitionColspan`, `infoColspan`, `referenceColspan`, and `diciplineColspan` through [ColumnFactoryService](#columnfactoryservice).
- **Athlete Display** — Renders athlete data using the configured column definitions.
- **Athlete Registration** — Provides an input row for entering athlete details, including name, date of birth, age group, weight class, group, lot number, and nominations.
- **Age Group Selection** — Allows the user to select an age group when multiple groups are available.
- **Weight Class Selection** — Loads weight classes according to the selected federation category using [AthleteTableOptionsService](#athletetableoptionsservice).
- **Autocomplete Suggestions** — Suggests athlete names, countries, regions, and cities based on the entered text using [SuggestionService](runtime/services/shared.md#suggestionservice).
- **Athlete Date of Birth** — Automatically fills in the athlete's date of birth when an existing athlete is selected from the suggestions.
- **Athlete Suggestion Filtering** — Filters athlete suggestions by federation, language, and sex.
- **Editable Mode** — Controls whether the athlete input form and checkbox controls are enabled through the `editable` input.
- **Dynamic Column Positioning** — Adjusts sticky column positions when only one age group is configured.
- **Date Formatting** — Formats birth date components and displays competition dates using Angular's `DatePipe`.

#### Inputs
- `competition: Competition` — Competition details used to configure the table.
- `athletes: AthleteCompetitionRow[]` — Athletes displayed in the table.
- `categories: string[]` — Category options supplied by the parent component.
- `ageGroups: string[]` — Age group options supplied by the parent component.
- `weightClasses: { id: string; name: string }[]` — Available weight classes.
- `editable: boolean` — Determines whether editing controls are enabled. Defaults to `true`.

#### Services
- [TranslationService](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/frontend/systems/i18n.md) — Loads translations from `tables/athlete-table` and translates column labels and competition attributes.
- [ColumnFactoryService](#columnfactoryservice) — Creates the table configuration, applying column visibility rules and calculating header spans.
- [AthleteTableOptionsService](#athletetableoptionsservice) — Retrieves weight classes for the selected federation category.
- [SuggestionService](runtime/services/shared.md#suggestionservice) — Provides autocomplete suggestions for athlete names, countries, regions, and cities, and retrieves an existing athlete's date of birth.

#### Initialization and Updates
- **`ngOnInit()`** — Loads athlete table translations and initializes the new athlete form.
- **`ngOnChanges()`** — Configures columns when competition data is available. When the competition changes, resets the athlete input form and loads weight classes for the first age group.
- **`configureColumns()`** — Creates the `ColumnContext`, supplies the initial colspan configuration, and updates the table columns and header spans.

#### Methods
- **`getLabel()`** — Returns the translated column label.
- **`trackColumn()`** — Tracks table columns by index.
- **`trackAthlete()`** — Tracks athletes by ID.
- **`getColumnLeft()`** — Calculates sticky column positions based on the number of age groups.
- **`displayValue()`** — Returns the value displayed in an athlete's cell, handling row numbering, empty values, and checkboxes.
- **`setNewNumber()`** — Updates a numeric field in the new athlete form.
- **`setNewText()`** — Updates a text field in the new athlete form.
- **`onDatePartChange()`** — Updates a birth date component.
- **`formatDatePart()`** — Formats day and month values with leading zeros.
- **`onAgeGroupChange()`** — Updates the selected age group, resets the weight class, and loads the corresponding weight classes.
- **`createEmptyAthlete()`** — Creates the initial athlete form data.
- **`resetNewAthlete()`** — Resets the athlete input form.
- **`addAthlete()`** — Validates and normalizes the athlete's full name. Persistence is handled by the parent component.
- **`getSuggestion()`** — Returns the current autocomplete suggestion for the specified field.
- **`onAutocompleteInput()`** — Retrieves autocomplete suggestions for athlete names, countries, regions, and cities.
- **`acceptSuggestion()`** — Accepts an autocomplete suggestion and retrieves the athlete's date of birth when an existing athlete name is selected.
- **`setSuggestion()`** — Updates the autocomplete suggestion for the specified field.
- **`isAutocompleteField()`** — Checks whether a field supports autocomplete.
- **`getTextWidth()`** — Calculates the rendered text width for autocomplete positioning.
- **`getNewAthleteValue()`** — Returns a new athlete form field value as a string.

---

### SERVICES

### AthleteTableOptionsService
The service retrieves weight class options from the local PGlite database based on the selected federation category.

#### Responsibilities
- Uses [PgliteService](services/database_service.md) to access the local database.
- Retrieves the `weight_class_group` associated with a federation category.
- Fetches the corresponding weight classes, ordered by weight, for use in the athlete table.

#### Methods
- **getWeightClasses()** — Returns the IDs and names of weight classes belonging to the selected federation category's weight class group.

---

### ColumnFactoryService
The service configures athlete table columns and calculates table header colspans according to the competition context.

#### Responsibilities
- Applies [COLUMN_PIPELINES](#column_pipelines) to determine which columns should be hidden based on the competition level, competition type, and language.
- Preserves the original column visibility when no pipeline defines a new value.
- Uses [ColspanFactoryService](#colspanfactoryservice) with [COLSPAN_PIPELINES](#colspan_pipelines) to calculate header colspans based on the number of age groups and other competition settings.
- Returns the configured columns and calculated colspans as an `AthleteTableConfig`.

#### Methods
- **`createTableConfig()`** — Applies column visibility rules, calculates header colspans, and combines the results into the table configuration.
- **`hideColumnFactory()`** — Evaluates column pipelines in order and uses the first non-null result to determine column visibility.

---

### ColspanFactoryService
The service provides a reusable mechanism for calculating table header colspans by applying context-dependent deductions to the initial configuration.

#### Responsibilities
- Initializes deductions for each key in the provided configuration.
- Executes configuration pipelines using the supplied context.
- Accumulates numeric deductions returned by the pipelines.
- Calculates the final configuration by subtracting the accumulated deductions from the original values.

#### Method
- **create()** — Generates an adjusted configuration by applying the deductions returned by the specified [COLSPAN_PIPELINES](#colspan_pipelines).

---

### config

#### ColumnContext
```ts
export interface ColumnContext {
  lang: string | null;
  competitionLevel: string;
  competitionType: string;
  ageGroupsCount: number;
}
```

#### AthleteTableConfig
```ts
export interface AthleteTableConfig {
  columns: AthleteTableColumn[];
  competitionColspan: number;
  infoColspan: number;
  referenceColspan: number;
  diciplineColspan: number;
}
```

#### ColspanConfigDto
```ts
export interface ColspanConfigDto {
  competitionColspan: number;
  infoColspan: number;
  referenceColspan: number;
  diciplineColspan: number;
}
```

#### HiddenColspanDto
```ts
export interface HiddenColspanDto {
  competitionColspan: number;
  infoColspan: number;
  referenceColspan: number;
  diciplineColspan: number;
}
```

#### NOMINATION_COLUMNS
Defines the column configuration for the nomination table.  
Each column specifies its index, title, width, position, data field, editor type, sorting behaviour, visibility, and other display properties.  
The configuration is used by `NominationTable` and [ColumnFactoryService](#columnfactoryservice) to render and configure the table columns.

---

### models

#### AthleteTableColumn

Defines the configuration of a column in the athlete table.

| Property | Type | Description |
|---|---|---|
| `index` | `number` | Column position in the table. |
| `key` | `number` | Unique column identifier used by the table configuration. |
| `title` | `string` | Column title. |
| `translationScope` | `string` | Translation scope used to resolve the column title. |
| `width` | `number \| null` | Column width in pixels. |
| `left` | `number \| null` | Left offset in pixels for sticky columns. |
| `sortType` | `string \| null` | Sorting type used by the column. |
| `hidden` | `boolean` | Determines whether the column is hidden. |
| `discipline` | `string \| null` | Associated powerlifting discipline, if applicable. |
| `indexAttr` | `string \| null` | Value used for the column's `data-index` attribute. |
| `draggable` | `boolean` | Determines whether the column can be dragged. |
| `field` | `string \| null` | Data field associated with the column. |
| `editor` | `string` | Specifies the type of editor used to display or edit the cell value. |
| `cancelSorting` | `boolean` | Determines whether sorting is disabled for the column. |

---

### units

#### COLUMN_PIPELINES
Contains conditional pipelines that determine column visibility based on competition settings, language, and federation.

| Pipeline | Description |
|---|---|
| `langPipeline` | Hides the rank classification column when the selected language is not `uk`. |
| `countryPipeline` | Hides the country column for non-international competitions. |
| `regionCityPipeline` | Hides region, city, sport society, and sport school columns for international competitions. |
| `exercisePipeline` | Hides squat, deadlift, and total columns for bench press competitions. |
| `ibsaOrganizationPipeline` | Applies additional column visibility rules for IBSA competitions, hiding sport society and university columns, and club columns in international competitions. |

`COLUMN_PIPELINES` contains all pipelines used to determine column visibility.

#### COLSPAN_PIPELINES
Contains configuration pipelines that determine how column spans are adjusted according to competition settings.

| Pipeline | Description |
|---|---|
| `ageGroupsPipeline` | Adjusts column spans when the competition has only one age group. |
| `rankClassPipeline` | Adjusts column spans when the selected language is not Ukrainian. |
| `countryPipeline` | Adjusts column spans for competitions that are not international. |
| `regionCityPipeline` | Adjusts column spans for international competitions. |
| `disciplinesPipeline` | Adjusts column spans for bench press competitions. |
| `ibsaOrganizationColspanPipeline` | Adjusts column spans for competitions organized under the IBSA federation. |

`COLSPAN_PIPELINES` contains all pipelines applied when calculating the table header column spans.

---

### types
Contains TypeScript interfaces and type definitions used to define data structures and ensure type safety across the application.

- #### [AutocompleteField](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/runtime/src/app/components/admin/main/types/autocomplete-field.type.ts)

- #### Pipeline Types
  - `ColumnPipelineFn` — defines a function that determines column visibility based on an [AthleteTableColumn](#athletetablecolumn) and [ColumnContext](#columncontext). Returns `true`, `false`, or `null`.
  - `ConfigPipelineFn<TContext, TResult>` — defines a configuration function that receives a context and returns a partial result object with numeric values or `null`.

- #### OrganizationTypes
Maps autocomplete fields to their corresponding [OrganizationType](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/runtime/services/shared.md#organizationtype) values.  
The mapping uses `Partial<Record<AutocompleteField, OrganizationType>>`, so only selected autocomplete fields need to be defined.

---

### RegistrationComponent
Provides the interface for viewing competitions and configuring online registration deadlines.

#### Features
- **Load Competitions** — Retrieves competitions available for registration through [OpenCompetitionService](services/shared.md#opencompetitionservice).
- **Online Status** — Checks whether the current user is configured for online mode using [CheckOnlineService](services/shared.md#checkonlineservice) and adjusts the navigation button position accordingly.
- **Select Competition** — Loads the full details of the selected competition.
- **Set Deadlines** — Opens [SetDeadlinesComponent](systems/competition-config-system.md#setdeadlinescomponent) inside `CompetitionPopupComponent` to configure nomination deadlines for the selected competition.
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
