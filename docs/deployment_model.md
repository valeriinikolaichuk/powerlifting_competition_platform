## Deployment Architecture
The system uses a central data source for global management and can distribute isolated user datasets to local installations.

The difference between environments is defined by:
- frontend mode;
- database instance;
- available dataset.

The application logic remains identical.

#### Local Deployment Flow
- User authenticates through Portal.
- User downloads Runtime package.
- `Runtime` environment is deployed locally.
- Database schema is initialized.
- Required user data is synchronized.
- `Runtime` operates independently inside the local network.

---

## System Modes (Level 2)

<details open="open">
<summary>Contents</summary>  

- [Portal Mode](#portal-mode)
- [Runtime Mode](#runtime-mode)
- [PGlite Database](#pglite-database)
- [NestJS Backend](#nestjs-backend)
- [PostgreSQL Database](#postgresql-database)
- [Architecture](#architecture)

</details>

---

### Portal Mode
Portal mode represents the public-facing system environment.  

**Responsibilities:**
- authentication entry point;
- system information;
- `AI` assistant integration;
- runtime package distribution;
- global system management.

---

### Runtime Mode
**Responsibilities:**  
- Main competition operation interface.
- Provides user interaction with competition workflows, device roles, and real-time competition displays.  
- Runtime can operate in two deployment scenarios:
  - Online mode — connected to the central backend.
  - Local LAN mode — connected to a local backend instance.

---

### PGlite Database
Client-side PostgreSQL-compatible database used by the `Runtime` application.

`PGlite` implements the `offline-first` layer of the system. Instead of communicating directly with the backend for every operation, the `Runtime` application stores and updates working data locally, allowing uninterrupted operation regardless of network availability.

The database is synchronized with the server through the Angular synchronization layer.

**Responsibilities**
- stores the user's active working dataset;
- caches frequently accessed data;
- `queues operations` while the server is unavailable;
- enables uninterrupted user interaction during temporary connection loss;
- synchronizes local changes with the server when connectivity is restored.

---

### NestJS Backend
**Responsibility:**  
Central application logic layer shared by both `Portal` and `Runtime` environments.  

Provides:
- authentication and authorization;
- user and device management;
- competition management;
- validation and calculations;
- synchronization services;
- `API` communication between frontend and database.

The same backend codebase is used in both 'central' and 'local' deployments. The difference is the database instance and available dataset.

---

### PostgreSQL Database
**Responsibility:**  
Primary 'server-side' data storage used by the 'NestJS' backend.  
The system supports two deployment modes:  

#### Central Database
The central database stores the complete platform dataset, including:  
- all users;
- all competitions;
- athlete registry;
- historical results;
- system configuration.

#### Local Competition Database
The local database allows the 'Runtime' backend to execute the same SQL queries, calculations, and business logic as the central system while remaining fully operational inside a 'local network'.

It uses the same schema and business logic as the central database but stores only the subset of data available to the `authenticated user`.  
Includes:
- competitions owned by or assigned to the user;
- related athletes;
- competition results;
- configuration data;
- user-specific settings.

---

### Architecture
<pre>
ONLINE

 Angular Portal
       |
Angular Runtime
       |
     PGlite
       |
NestJS Backend
       |
Central PostgreSQL


LOCAL

Angular Runtime
       |
     PGlite
       |
NestJS Backend
       |
Local PostgreSQL
</pre>
