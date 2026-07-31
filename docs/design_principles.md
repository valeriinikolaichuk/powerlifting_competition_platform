## Design Principles (Architecture Decisions)
The platform is designed around a **single business logic implementation** that can operate in both `online` and `local` competition environments. 
Instead of maintaining separate `online` and `offline` systems, the project keeps the application architecture identical across deployments. The execution environment changes, while the application logic remains the same.

This approach was chosen for several reasons:
* reduces code duplication;
* minimizes maintenance costs;
* allows features to be implemented once and reused in both deployments;
* ensures identical competition behavior regardless of the environment;
* simplifies testing and debugging.

[Why two Angular applications?](why-two-angular-applications?)  
[Why identical backend logic?](Why-identical-backend-logic?)  
[Why PGlite?](why-pglite?)  
[Why shared SQL Layer?](why-shared-sql-layer?)

---

### Why two Angular applications?
The project separates the user experience into two independent applications.

**Frontend Application**  
The frontend serves as the public entry point to the platform.

Its responsibilities include:
* authentication;
* platform presentation;
* user management;
* `runtime` distribution;
* `AI` assistant access.

**It contains only functionality required before a competition starts.**

**Competition Runtime Application**  
The runtime contains everything required during a competition.  
Separating it from the frontend keeps the competition environment lightweight and independent from public website functionality.  
The runtime can therefore continue operating even when `Internet` connectivity is unavailable.  

`Frontend Application` and `Competition Runtime Application` are independent Angular applications designed for different purposes.

The `Frontend Application` provides access to the platform, user management, and runtime distribution.

The `Competition Runtime Application` is dedicated exclusively to competition execution.

**Local deployment does not include the `Frontend Application`.**

Only the `Competition Runtime Application`,` NestJS Backend API`, and a local `PostgreSQL` database are deployed.

The `Frontend Application` is used only as the public entry point where users authenticate and download the runtime package.

A limited amount of infrastructure code is intentionally **`duplicated`** between the `Frontend Application` and the `Competition Runtime Application`. This allows each Angular application to remain independently deployable while preserving identical behavior for common functionality.

---

### Why identical backend logic?
Both the `online` platform and the `locally` deployed competition environment execute the same `NestJS` backend.

Only two things change:
* `PostgreSQL` database instance;
* available dataset.

This guarantees that:
* validation rules remain identical;
* calculations always produce the same results;
* 'SQL' queries are not duplicated;
* competition behavior is deterministic in every environment.

**Running the same backend locally eliminates the need to reimplement business rules inside the browser. Competition validation, calculations, synchronization logic, and SQL access remain identical in every deployment, significantly reducing maintenance complexity.**

---

### Why PGlite?
During a competition, continuous Internet access cannot be assumed.  
`PGlite` provides a PostgreSQL-compatible local database running directly inside the browser.

This enables:
* `offline-first` execution;
* instant `UI` updates;
* `local` transaction processing;
* synchronization after connectivity is restored.

**The browser becomes the local execution environment while still preserving PostgreSQL-compatible data structures.**

---

### Why shared SQL Layer?
The project contains a `shared SQL module` that stores `raw SQL` queries used by both database environments.

The same `SQL` definitions are executed against:
* the **central PostgreSQL database**;
* the **local PostgreSQL-compatible PGlite database** in the `Competition Runtime`.

The backend uses two database access strategies:
* **Prisma ORM** for standard operations on the central `PostgreSQL` database (`Frontend Application`);
* **Shared `raw SQL` queries** for operations that must behave identically in both the central `PostgreSQL` database and the local `PGlite` database (`Competition Runtime`).

Sharing `SQL` definitions ensures that both environments execute the same queries, produce identical results, and remain consistent while avoiding duplicate `SQL` code.



