### Prisma Module

Provides a globally available `PrismaService` for database access throughout the backend.

**PrismaService**

* Extends `PrismaClient`.
* Establishes the database connection when the module is initialized.
* Closes the database connection when the module is destroyed.

**PrismaModule**

* Registers `PrismaService` as a global provider.
* Exports `PrismaService` so it can be injected into any backend service without importing `PrismaModule` into each module.

---

### Runtime Module

Provides the Angular **Runtime Application** through the NestJS backend.

**RuntimeController**

* Handles `GET /runtime`.
* Serves the built Angular Runtime `index.html` from the `runtime/dist/runtime/browser` directory.

**RuntimeModule**

* Configures `ServeStaticModule` to serve the compiled Angular Runtime static files under `/runtime`.
* Registers `RuntimeController` to provide the Runtime entry point.

The Runtime is therefore accessed through the NestJS backend, for example:

```
/runtime?lang=${lang}&mode=online
```

The controller returns the Angular application's `index.html`, while `ServeStaticModule` provides its JavaScript, CSS, assets, and other static files.

---

### Nominations Module
Manages competition nomination settings, including nomination deadlines and status updates, through a REST API and database services.

### NominationsController
Handles `HTTP` requests related to competition nominations and delegates operations to `NominationOptionsService`.

- **`setNominationDates(data)`** — Handles `POST /api/nominations/nomination-dates`. Receives nomination deadline data through [SetNominationDatesDto](#setnominationdatesdto) and delegates the operation to `NominationOptionsService`.

### NominationOptionsService
`NominationOptionsService` handles nomination-related operations on the backend using [PrismaService](#prisma-module) and the shared SQL synchronization queries.

- ### setNominationDates()
Executes `SYNC_OPERATIONS.SET_NOMINATION_DATES` to save the preliminary and final nomination deadlines for the specified competition.

#### Data Handling
The service uses `$executeRawUnsafe()` to execute the shared SQL statement with the competition ID and nomination dates as parameters. The SQL operation is defined in `SYNC_OPERATIONS`, allowing the same query to be reused by the frontend and backend.

---

### SetNominationDatesDto
Defines the request data required to configure nomination deadlines.

```ts
import { IsDateString, IsUUID } from 'class-validator';

export class SetNominationDatesDto {
  @IsUUID()
  competitionId!: string;

  @IsDateString()
  preliminaryDate!: string;

  @IsDateString()
  finalDate!: string;
}
```

The DTO defines the expected request structure for the `setNominationDates()` endpoint.

---