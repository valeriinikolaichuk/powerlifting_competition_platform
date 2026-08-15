## Runtime Architecture

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The `runtime` is the operational layer where the competition is actually executed. It runs in a web browser on each workstation and provides role-specific interfaces for competition management.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Each runtime instance operates with its own local `PGlite` database and executes the same business logic and data operations independently. This allows workstations to continue operating without a permanent network connection while remaining synchronized with the rest of the system.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The runtime can operate in both `LAN` and `ONLINE` environments. In `LAN` mode, it works entirely within the local deployment, while in `ONLINE` mode it synchronizes local data with the central backend.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This architecture allows the competition to continue operating even when the internet connection is unavailable and synchronize changes when connectivity is restored.

<details open="open">
<summary>Contents</summary>  

- [Systems](#systems)
- [Conponents](#components)
- [Services](#services)
- [LAN Download and Installation](#lan-download-and-installation)
- [Runtime Entry Flow](#runtime-entry-flow)

</details>

---

### Systems

### [popup](runtime/systems/popup-system.md)
Dynamically renders popup components

### [session](runtime/systems/session-system.md)
Controls the frontend session across browser tabs and maintain a consistent application state during the session lifecycle

### [i18n](frontend/systems/i18n.md) Translation Module  
Translation system based on Angular signals and lazy-loaded `JSON` files, supporting multi-language switching

---

### Components

### [entry](runtime/entry.md)   
Starts the `Runtime` initialization process.

### [pages](runtime/pages.md)   
Contains `route-level components` representing the main views of the application.

---

### Services

### [connections](runtime/connection_service.md)
The communication layer between the `Angular application` and the [backend connections API](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/backend/systems/connections.md) which works with the [device_status](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/database/system_runtime.md#device_status) table.

---

### LAN Download and Installation
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

### Runtime Entry Flow
The `ONLINE` Runtime is loaded directly from the central backend.  
The `LAN` Runtime is loaded from `localhost`.

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

---

**2. The [Runtime Module](backend/modules.md#runtime-module)**  
- backend processes and routes requests dynamically based on the network architecture, utilizing one of three distinct `URL` structures:

| Mode | URL Structure | Description |
| --- | --- | --- |
| **LAN (Local)** | `http://localhost:3000/runtime?lang={lang}&device_id={device_id}&mode=lan` | Initialized locally on the host computer. |
| **LAN (Remote)** | `http://<SERVER_IP>:3000/runtime?lang={lang}&mode=lan` | Accessed by other local network endpoints. Requires manual IP setup. |
| **ONLINE** | `${environment.apiUrl}/runtime?lang=${lang}&mode=online` | Powered directly by the central production cloud API. |

- serves the compiled Angular `Runtime` application through the `/runtime` endpoint. The `RuntimeController` returns the Runtime `index.html`, while the `NestJS` application serves the compiled static assets under the `/runtime/` path.

<pre>
          ┌─────────────────────────────┐
          │          Frontend           │
          │       ModeComponent         │
          └──────────────┬──────────────┘
                         │
                         │ openOnline()
                         ▼
┌───────────────────────────────────────────────────┐
│             Clear frontend_session                │
│                                                   │
│  db.table('frontend_session').delete(SESSION_ID)  │
└────────────────────────┬──────────────────────────┘
                         │
                         │ window.location.href
                         ▼
       ┌──────────────────────────────────┐
       │         Backend / Runtime        │
       │                                  │
       │ /runtime?lang={lang}&mode=online │
       └─────────────────┬────────────────┘
                         │
                         │ GET /runtime
                         ▼
          ┌─────────────────────────────┐
          │      RuntimeController      │
          │                             │
          │ returns Runtime index.html  │
          └──────────────┬──────────────┘
                         │
                         ▼
          ┌─────────────────────────────┐
          │       Angular Runtime       │
          │                             │
          │  Loads compiled application │
          │  and static assets          │
          └─────────────────────────────┘
</pre>

This allows the Angular `Runtime` to be executed directly from the same backend without running a separate frontend development server.

---

**3. The [Runtime](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/runtime/src/app/app.ts):**
- initializes the [RuntimeSessionService](runtime/systems/session-system.md), which executes the following startup sequence:
  - **Database Check.** The service verifies the existence of the [runtime_session](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/indexed.md#database-bombingoutruntime) table.
  - **Session Expiration Check.** It checks if the local runtime session has expired using the following logic:
<pre>
    const expired = Date.now() - session.heartbeat > this.HEARTBEAT_TIMEOUT;
</pre>
If the session is indeed expired, a new valid record is created inside the runtime_session table.
  - **Heartbeat Activation.** The service triggers the `startHeartbeat()` method to regularly ping and keep the current session active.
  - **Wake-Up Listener Activation.** The service launches the `startWakeUpListener()` method to monitor system wake-up events (e.g., when the device wakes up from sleep mode).

- The [EntryComponent](runtime/entry.md)
  - creates the current device parameters using [ConnectionsService](runtime/connection_service.md#createparameters).
    - `language`
    - `mode`
    - `user_agent`
    - generates a new `device_id`.
    - if the `Runtime` is running in `LAN mode` on `localhost`, it uses the existing `device_id` provided in the `URL` instead.
  - creates a `DeviceParametersDTO`
  - [checks](runtime/connection_service.md#check) the current device connection state through the backend:
<pre>
    POST /api/connections/entry
</pre>

---

**4. The [Connections Module](backend/systems/connections.md) `/api/connections/entry`**  

The `ConnectionsController`
- retrieves the authenticated `user_id` from the `JWT` payload extracted from the authentication cookie.
- extracts the client's `IP address` directly from the `HTTP` request.
- receives `DeviceParametersDto `and delegates the connection check to `ConnectionsService`.

The service then executes different logic depending on the device mode.

#### LAN

- Find the active LAN `ADMIN` record in `device_status`:
- Use the returned `user_id` as the owner of the `LAN` environment.
- Check whether an active `device_status` registration record exists for the received `device_id`.

- **If the device already exists** (`ADMIN` role):
   * Query all active devices belonging to the same `user_id`.
   * Exclude the `ADMIN` device.
   * Map the records to `ConnectionDto`.
   * Return `ConnectionsResultDto` with:
     * `adminExists = false`
     * `connections` containing the existing `non-ADMIN` connections.

- **If the device does not exist** (`CLIENT` role):
   * Create a new `device_status` record with:
     * `user_id`
     * `device_id`
     * `language`
     * `mode = LAN`
     * `device_role = null`
     * `ip_address`
     * `user_agent`
  
   * Return `ConnectionsResultDto` with:
     * `adminExists = true`
     * an empty `connections` array.

#### ONLINE
- Receives `user_id`.
- Find an active `ADMIN` record for this user:

- **If an `ADMIN` does not exist:**
   * Create the `ADMIN` record
   * Return `ConnectionsResultDto` with:
     * `adminExists = false`
     * `connections` containing the `non-ADMIN` connections.

- **If an `ADMIN` already exists:**
   * Create a new `device_status` record with:
     * `user_id`
     * `device_id`
     * `language`
     * `mode = LAN`
     * `device_role = null`
     * `ip_address` (is taken from `HTTP request`)
     * `user_agent`

   * Query all active connections belonging to the user, including `ADMIN` (excluding the just created one).
   * Map them to `ConnectionDto`.
   * Return `ConnectionsResultDto` with:
     * `adminExists = true`
     * `connections` containing all active connections (excluding the just created one).

**Result**  
The Runtime receives a `ConnectionsResultDto` describing the current connection state:
<pre>
ConnectionsResultDto
├── adminExists
└── connections[]
    ├── device_id
    ├── language
    ├── device_role
    ├── language
    ├── ip_address
    ├── user_agent
    └── created_at 
</pre>

The `device_status` table therefore acts as the **central connection registry**, while `ConnectionsService` contains the mode-specific logic for registering devices and determining which connections are visible to the Runtime.







****




****

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

