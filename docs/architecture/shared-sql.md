## Shared SQL

The `shared-sql` module contains shared database definitions, synchronization configuration, and reusable `SQL` queries used by both
the backend and browser runtime.

It provides a single source of truth for database-related constants and `SQL` logic shared between `PostgreSQL` and `PGlite`.

---

### Synchronization Table Configuration
The synchronization system groups database tables according to their ownership, visibility, and relationship to competition data.

These groups are defined in [sync.config.ts](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/shared-sql/sync.config.ts) and are used by the snapshot pipeline to determine which tables must be synchronized and which selection rules must be applied.

#### STATIC_REFERENCE_TABLES
Contains system-wide reference data that does not belong to a specific user or competition.
- `federations`
- `coefficients`
- `federation_coefficients`
- `age_groups`
- `weight_classes`
- `federation_categories`
- `referee_categories`
- `referee_roles`

#### ADMIN_REFERENCE_TABLES
Contains configuration data managed by administrators.
- `user_federations`

Relationship: `record → user_id`

#### USER_REFERENCE_TABLES
Contains reference data that may be either global or created by a user.
- `countries`
- `regions`
- `cities`
- `organizations`

`GLOBAL` records are available according to the applicable visibility rules, while `USER` records are selected by `created_by_user_id` and `language`.  

#### USER_REFERENCE_FEDERATIONS
Contains `USER`-related records whose visibility is additionally determined by the federations accessible to the current user.
- `athletes`
- `sport_officials`

Relationship: `record → federation_id → user_federations → user_id`

#### Competition Tables

`COMPETITION_TABLES`

Contains the main configuration and registration data belonging to a
user's competitions.

- `competition_age_groups`
- `nomination_status`
- `competition_sessions`
- `referee_competition`
- `referee_nominations`
- `athlete_registrations`
- `athlete_nominations`
- `competition_organizations`

Records are selected through their relationship with the user's
competitions.

#### Competition Session Tables

`COMPETITION_SESSION_TABLES`

Contains data belonging to competition sessions.

- `groups_in_session`
- `referee_competition_roles`

Records are selected through their relationship with
`competition_sessions`.

#### Competition Group Tables

`COMPETITION_GROUP_TABLES`

Contains data belonging to groups within competition sessions.

- `weight_classes_in_group`

Records are selected through `groups_in_session`.

#### User Table

`TABLE_USERS`

Contains the minimal user information required by the browser runtime.

- `users`

Only the current user's `id` is stored locally.

#### User-Owned Tables

`CREATED_BY_USER_TABLES`

Contains records directly owned by the current user.

- `participants`
- `competitions`
- `device_status`
- `global_state`

Records are selected using `created_by_user_id`.

#### Competition Runtime Tables

`COMPETITION_RUNTIME_TABLES`

Contains dynamic data generated during competition execution.

- `athlete_lifts`
- `competition_results`

Records are selected through their relationship with the user's
competitions.

#### Organization Result Tables

`ORGANIZATION_RESULT_TABLES`

Contains calculated team results.

- `organization_results`

Records are selected through `competition_organizations` and therefore
belong to the user's competitions.
