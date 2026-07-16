## Deployment Architecture
The system uses a unified backend architecture with multiple frontend modes.  
The same NestJS backend application is used both for the central online environment and for local competition execution.

The difference between environments is defined by:
- frontend mode;
- database instance;
- available dataset.

The application logic remains identical.

---

### System Modes (Level 2)
### Portal Mode
Portal mode represents the public-facing system environment.  

**Responsibilities:**
- user authentication;
- system information and documentation;
- AI assistant integration;
- runtime package distribution;
- global system management.

<pre>
Angular Portal
       |
       |
NestJS Backend
       |
       |
Central PostgreSQL Database
</pre>

The central database contains complete system data:
- users;
- competitions;
- athletes;
- historical results;
- configuration data.

---

### Runtime Mode
Runtime mode is a local competition execution environment.  
It is designed to operate inside a local network without dependency on external Internet connectivity.

<pre>

</pre>
