## Runtime Architecture

The `runtime` is the operational layer where the competition is actually executed. It runs in a web browser on each workstation and provides role-specific interfaces for competition management.

Each runtime instance operates with its own local `PGlite` database and executes the same business logic and data operations independently. This allows workstations to continue operating without a permanent network connection while remaining synchronized with the rest of the system.

The runtime can operate in both `LAN` and `ONLINE` environments. In `LAN` mode, it works entirely within the local deployment, while in `ONLINE` mode it synchronizes local data with the central backend.

This architecture allows the competition to continue operating even when the internet connection is unavailable and synchronize changes when connectivity is restored.

---

### LAN Download / Installation
The `LAN` installation flow prepares and installs an isolated local competition environment for a user.

#### Flow
**1. The Frontend** generates a `device_id` and sends the selected language (`lang`) and `device_id` to:
```
POST /api/download/parameters
```

**2. The backend**
- identifies the user from the authentication cookie (`user_id`) and creates a [device_status](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/database/system_runtime.md#device_status) record containing:
<pre>
user_id
device_id
language
device_role = ADMIN
mode = LAN
</pre>

- generates the `LAN` installation package containing the required `DOCKER` application containers and database image.  
**Installation package:**
<pre>
- Docker containers
- Database image
- Launcher
- Installer
- Installation parameters (`device_id`, `language`)
</pre>

**3. During deployment** `device_id` `language` are automatically saved into a local `config.json` file on the device.
<pre>
{
  "device_id": "the-unique-device-id-here",
   "language": "en",
    "mode": "lan"
}
</pre>

**4. After installation** the `Frontend` sends the `language` and previously generated `device_id` to:
```
POST /api/download/database
```

**5. The backend**
   - Extracts the `user_id` from the cookies.
   - Retrieves data from the database based on the `user_id`, `device_id`, and `lang` parameters.
   - Sends the data to the local installed service.

**6. After successful installation**, the local application sends `success = true`:
```
POST /api/download/completed
```

The backend removes the temporary `device_status` record from the central database (the `device_status` record on `localhost` is not deleted) and creates an [installations](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/database/management.md) record representing the installed device.

**7. How the Launcher works**  
When the `application icon` is clicked, the launcher performs the following sequence:
- reads the local `config.json` file.
- extracts the local variables: `device_id` and `language` and `mode`.
- opens the default browser with the formatted URL:
   `http://localhost:3000/runtime?lang={language}&device_id={device_id}&mode=lan`

**8. Running on Other LAN Devices**
To connect other devices within the same local network (LAN), you need to manually construct the `URL` in the remote device's browser by specifying your host machine's `IP address` and your preferred `language`: 
<pre>
http://<SERVER_IP>:3000/runtime?lang=<LANGUAGE_CODE>&mode=lan 
</pre>

**Parameters to Fill Manually:**  
* **<SERVER_IP>**: The local `IP address` of the machine running the backend (e.g., 192.168.1.50).
* **<LANGUAGE_CODE>**: The desired `language` for the interface (e.g., uk for Ukrainian, en for English).

*Example:* `http://192.168.1.50:3000/runtime?lang=en&mode=lan`
#### Notes:
The full installation process is described here: [local installation](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/installation.md)

---

### Runtime Entry Prosess
The `ONLINE` Runtime is loaded directly from the central backend.  
The `LAN` Runtime is loaded from `localhost`.

#### Flow
**1. if `ONLINE` the `Frontend`** ([ModeComponent](frontend/pages.md#openonline)) 
- deletes the record:
```
async clearSession(): Promise<void> {
  await db.table('frontend_session').delete(this.SESSION_ID);
}
```
This ensures that upon return, a new record is created so the system does not block the return due to an expired `heartbeat` or a deleted and recreated `currentTabId` (`currentTabId` must match the `tab_id` of [frontend_session](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/indexed.md)).

- redirects the user to the `Runtime` using:
```
const url = `${environment.apiUrl}/runtime?lang=${lang}`;
window.location.href = url;
```

**2. The `NestJS` backend**  
- serves the compiled Angular `Runtime` application through the `/runtime` endpoint. The `RuntimeController` returns the Runtime `index.html`, while the `NestJS` application serves the compiled static assets under the `/runtime/` path.

This allows the Angular `Runtime` to be executed directly from the same backend without running a separate frontend development server.

**3. The `Runtime`:**
- initializes the [RuntimeSessionService](runtime/systems/session-system.md), which executes the following startup sequence:
  - **Database Check.** The service verifies the existence of the [runtime_session](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/indexed.md#database-bombingoutruntime) table.
  - **Session Expiration Check.** It checks if the local runtime session has expired using the following logic:
<pre>
    const expired = Date.now() - session.heartbeat > this.HEARTBEAT_TIMEOUT;
</pre>
If the session is indeed expired, a new valid record is created inside the runtime_session table.
  - **Heartbeat Activation.** The service triggers the `startHeartbeat()` method to regularly ping and keep the current session active.
  - **Wake-Up Listener Activation.** The service launches the `startWakeUpListener()` method to monitor system wake-up events (e.g., when the device wakes up from sleep mode).


*****


- Reads the language from the `URL`.
```
?lang={language}
```
- Generates a new `device_id`.  
4. Sends the language and device ID to:  
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

---

### Components
### [entry](runtime/entry.md)   
Starts the `Runtime` initialization process.

---
