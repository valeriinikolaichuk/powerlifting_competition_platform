## Deployment Architecture
The system uses a central data source for global management and can distribute isolated user datasets to local installations.

The difference between environments is defined by:
- frontend mode;
- database instance;
- available dataset.

The application logic remains identical.

#### Local Deployment Flow
- User authenticates through `Frontend Application`.
- User downloads `project package`.
- Environment is deployed locally.
- Database schema is initialized.
- Required user data is synchronized.
- The project operates independently inside the `local network`.

---

## System Modes (Level 2)

<details open="open">
<summary>Contents</summary>  

- [Frontend Application](#frontend-application)
- [Competition Runtime Application](#competition-runtime-application)
- [PGlite Database](#pglite-database)
- [Backend API](#backend-api)
- [PostgreSQL Database](#postgresql-database)
- [Architecture](#architecture)

</details>

---

### Frontend Application
#### ( frontend/ )
Represents the public-facing system environment.  

**Responsibilities:**
- authentication entry point;
- system information;
- information about platform capabilities;
- `AI` assistant integration;
- runtime package distribution;
- global system management.

---

### Competition Runtime Application
#### ( runtime/ )
**Responsibilities:**  
- competition workflow execution;
- device role operation;
- real-time competition interfaces;
- local-first data processing;
- synchronization with backend services;
- local database management using `PGlite`.

Runtime is a browser-based `Angular` application served as `static content` by `NestJS`.

---

### PGlite Database
Client-side PostgreSQL-compatible database used by the `Competition Runtime Application`.

`PGlite` implements the `offline-first` layer of the system. Instead of communicating directly with the backend for every operation, the `Competition Runtime Application` stores and updates working data `locally`, allowing uninterrupted operation regardless of network availability.

The database is synchronized with the server through the `Angular` synchronization layer.

**Responsibilities**
- stores the user's active working dataset;
- caches frequently accessed data;
- `queues operations` while the server is unavailable;
- enables uninterrupted user interaction during temporary connection loss;
- synchronizes local changes with the server when connectivity is restored.

---

### Backend API
The backend provides centralized business logic and communication between clients and databases.

**Responsibility:**  
- authentication;
- user management;
- competition management;
- `API` endpoints;
- synchronization services;
- `PostgreSQL` communication.

**Technology:**
- NestJS
- Prisma ORM

The same backend codebase is used in both `central` and `local` deployments. The difference is the database instance and available dataset.

---

### PostgreSQL Database
**Responsibility:**  
Primary `server-side` data storage used by the `NestJS` backend.  
The system supports two deployment modes:  

#### Central Database
The central database stores the complete platform dataset, including:  
- all users;
- all competitions;
- athlete registry;
- historical results;
- system configuration.

#### Local Competition Database
The local database allows the `Competition Runtime Application` backend to execute the same `SQL` queries, calculations, and business logic as the central system while remaining fully operational inside a `local network`.

It uses the same schema and business logic as the central database but stores only the subset of data available to the `authenticated user`. 

**Includes:**  
- competitions owned by or assigned to the user;
- related athletes;
- competition results;
- configuration data;
- user-specific settings.

---

### Architecture
<pre>
powerlifting_competition_platform/
		|
		├── frontend/
		|
		├── backend/api/
		|	|
		|	└── prisma/
		|		|
		|		└── migrations/   <- PostgreSQL migrations
		|
		├── shared-sql/   <- SQL requests
		|
		├── runtime/
		|	|
		|	└── src/app/
		|		|
		|		└── services/
		|			|
		|			└── database.service.ts   <- PGlite migrations
		|

DOCKER CONTAINERS:

ONLINE
pcp-frontend
      Angular Frontend
pcp-backend 
      Backend API
	    shared SQL
	    Angular Runtime
pcp-postgres
      Central PostgreSQL

LOCAL
pcp-backend 
      Backend API
	    shared SQL
	    Angular Runtime
pcp-postgres
      Local PostgreSQL
</pre>
