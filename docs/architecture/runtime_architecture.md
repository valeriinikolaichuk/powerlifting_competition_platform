## Runtime Architecture

The `runtime` is the operational layer where the competition is actually executed. It runs in a web browser on each workstation and provides role-specific interfaces for competition management.

Each runtime instance operates with its own local `PGlite` database and executes the same business logic and data operations independently. This allows workstations to continue operating without a permanent network connection while remaining synchronized with the rest of the system.

The runtime can operate in both `LAN` and `ONLINE` environments. In `LAN` mode, it works entirely within the local deployment, while in `ONLINE` mode it synchronizes local data with the central backend.

This architecture allows the competition to continue operating even when the internet connection is unavailable and synchronize changes when connectivity is restored.

---

### LAN Download / Installation
The `LAN` installation flow prepares and installs an isolated local competition environment for a user.

#### Flow
1. The Frontend generates a `device_id` and sends the selected language and device ID to:
```
POST /api/download/parameters
```

2. The backend identifies the user from the authentication cookie and creates a `device_status` record containing:
<pre>
user_id
device_id
language
device_role = ADMIN
mode = LAN
</pre>

3. The backend generates the `LAN` installation package containing the required `DOCKER` application containers and database image.

4. After installation, the local application sends the language and previously generated `device_id` to:
```
POST /api/download/database
```

5. The backend retrieves the user's required dataset using:
```
user_id
device_id
language
```
and transfers the data to the local installation.

6. After successful installation, the local application sends:
```
POST /api/download/completed
```

The backend removes the temporary `device_status` record from the central database and creates an `installations` record representing the installed device.

The local `device_status` record remains available to the installed application and is used when establishing the connection with the central server.

---

### ONLINE Runtime

The `ONLINE` Runtime does not require a local installation package. It is loaded directly from the central backend.

Before leaving the main Frontend, the frontend session record is removed from the local browser database. This allows the user to return to the main Frontend later without being blocked by the previous session state.

The Frontend then redirects the user to:
```
/runtime?lang={language}
```

The Runtime:

1. Reads the language from the `URL`.  
2. Generates a new `device_id`.  
3. Sends the language and device ID to:  
```
POST /api/connections/check
```

4. Waits for the connection state returned by the backend.

5. Initializes the Runtime according to the returned connection state.

Unlike `LAN` installation, `ONLINE` Runtime does not create an installation package or transfer a local `PostgreSQL` database during startup.

---

### `/api/connections/check`

`/api/connections/check` provides the common connection initialization logic for both `LAN`and `ONLINE` Runtime.

The endpoint receives:
<pre>
language
device_id
</pre>

The `user_id` is obtained either from the request or from the authentication cookie.

#### Connection initialization
The backend first checks `device_status` for an active `ADMIN` device belonging to the user:
<pre>
user_id = current user
device_role = ADMIN
is_deleted = false
</pre>

#### No active ADMIN exists:
A new `ADMIN` connection is created using:
<pre>
user_id
device_id
language
</pre>

The response contains:
```
adminExists = false
```

#### ADMIN already exists:
The backend compares the current `device_id` and connection mode with the existing LAN ADMIN connection.

* **ONLINE** — a new connection is created without an assigned role.
* **LAN with a different `device_id`** — a new connection is created without an assigned role.
* **LAN with the same `device_id`** — no new connection is created.

The response contains:
```
adminExists = true
```

The backend then retrieves the user's active device connections from `device_status` and returns them to the Runtime as a DTO.

#### Runtime initialization
After receiving the DTO, the Runtime:

1. Reads `adminExists`.
2. Starts `EntryComponent`.
3. Loads the available administrator/device role information.
4. Initializes `RuntimeSessionService`.
5. Checks and initializes the local `runtime_session`.
6. Starts heartbeat and wake-up monitoring.
7. Opens the connections popup.

The connections popup displays the available device connections, including stale or "phantom" connections when present.

The user can select connections for deletion.

#### Connection deletion
Selected connections are sent to:
```
POST /api/connections/delete
```

The backend removes the selected `device_status` records and returns the result.

After deletion:

* **LAN Runtime** repeats the local connection check.
* **ONLINE Runtime** reloads `/runtime?lang={language}` and repeats the Runtime initialization flow.

This allows the user to clean up stale device connections and establish a new valid connection without restarting the entire application.

---

### Systems

### [popup](frontend/systems/popup-system.md)
Dynamically renders popup components

### [session](runtime/systems/session-system.md)
Controls the frontend session across browser tabs and maintain a consistent application state during the session lifecycle

### [i18n](frontend/systems/i18n.md) Translation Module  
Translation system based on Angular signals and lazy-loaded `JSON` files, supporting multi-language switching
