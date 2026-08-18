### Browser Database
The browser database is a local `PGlite` database used by the offline competition runtime.

#### ER Diagram
![ER Diagram]()

#### Tables
**Some tables differ from the server database. Browser-specific differences are described in the corresponding table documentation.**  

The following tables are available in the browser database:

- **Reference Tables**
  - Static Reference Tables
    - [federations](database/reference.md#federations)



    - [age_groups](database/reference.md#age_groups)
    - [weight_classes](database/reference.md#weight_classes)
    - [federation_categories](database/reference.md#federation_categories)
    - [referee_categories](database/reference.md#referee_categories)
    - [referee_roles](database/reference.md#referee_roles)
  - User Reference Tables
    - [countries](database/reference.md#countries)
    - [regions](database/reference.md#regions)
    - [cities](database/reference.md#cities)
    - [organizations](database/reference.md#organizations)
    - [athletes](database/reference.md#athletes)
    - [sport_officials](database/reference.md#sport_officials)

- **Configuration Tables**
  - [competition_age_groups](database/configuration.md#competition_age_groups)
  - [user_federations](database/configuration.md#user_federations)
  - [nomination_status](database/configuration.md#nomination_status)
  - [competition_sessions](database/configuration.md#competition_sessions)
  - [groups_in_session](database/configuration.md#groups_in_session)
  - [weight_classes_in_group](database/configuration.md#weight_classes_in_group)
  - [referee_competition](database/configuration.md#referee_competition)



  - [referee_competition_roles](database/configuration.md#referee_competition_roles)

- **Business Data Tables (User Data)**
  - [users](#users) (differs from the server database)
  - [participants](#participants) (differs from the server database)

- **Business Data Tables (Competition Data)**
  - [competitions](database/competition.md#competitions)
  - [athlete_registrations](database/competition.md#athlete_registrations)



  - [competition_organizations](database/competition.md#competition_organizations)

- **Competition Runtime Tables**
  - [athlete_lifts](database/competition_runtime.md#athlete_lifts)
  - [competition_results](database/competition_runtime.md#competition_results)

- **Calculated Tables**
  - [organization_results](database/calculated.md)

- **System Runtime Tables**




---

#### users
Only the following columns are stored locally:

| Column | Type |
|---|---|
| id | UUID |

Server-specific authentication fields are not stored in the browser database.

---

#### participants
Stores the local participant identity associated with a user account.

Only the information required by the offline-first application is stored locally.

|Field	|Description|
|-------|-----------|
|id	|UUID primary key. Identifies the participant.|
|user_id	|UUID identifying the related user account.|

**Browser-specific notes**  
The browser database does not define a foreign key between `participants.user_id` and `users.id`.

`user_id` is stored only as an identifier used by the application to associate the local participant with the corresponding local user.
