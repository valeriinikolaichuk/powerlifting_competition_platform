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



- **Configuration Tables**


- **Business Data Tables (User Data)**
  - [users](#users) (differs from the server database)




---

#### users
Only the following columns are stored locally:

| Column | Type |
|---|---|
| id | UUID |

Server-specific authentication fields are not stored in the browser database.
