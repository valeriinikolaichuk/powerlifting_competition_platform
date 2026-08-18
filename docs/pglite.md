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
    - [countries](reference.md#countries)
    - [regions](reference.md#regions)
    - [cities](reference.md#cities)
    - [organizations](reference.md#organizations)
    - [athletes](reference.md#athletes)
    - [sport_officials](reference.md#sport_officials)

- **Configuration Tables**
  - [competition_age_groups](configuration.md#competition_age_groups)
  - [user_federations](configuration.md#user_federations)
  - [nomination_status](configuration.md#nomination_status)


  - [referee_competition](configuration.md#referee_competition)



- **Business Data Tables (User Data)**
  - [users](#users) (differs from the server database)
  - [participants](#participants) (differs from the server database)

- **Business Data Tables (Competition Data)**
  - [competitions](competition.md#competitions)


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
