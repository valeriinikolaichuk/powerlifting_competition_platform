## Connections Module
- Manages device registration and connection state for the Competition `Runtime`.
- Handles both `LAN` and `ONLINE` modes.
- Works with the ``PostgreSQL [device_status](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/database/system_runtime.md#device_status) table, which stores the current state of devices connected to a user's competition environment.

### ConnectionsController
- Provides the `/api/connections/entry` endpoint.  
- `POST /api/connections/entry` receives `DeviceParametersDto` and delegates the connection check to `ConnectionsService`.
- Extracts the client's `IP address` directly from the `HTTP` request and passes it to the `ConnectionsService`.

### ConnectionsService
Contains the main connection management logic.

- #### checkAdmin()
Determines the connection flow based on the requested device mode:
* `LAN` → processes the request using the existing LAN `ADMIN` device as the source of `user_id`.
* `ONLINE` → uses the authenticated user's ID and verifies the current `ADMIN` device on every request.

- #### checkLan()
Handles initial `LAN` device registration.
* Finds the active LAN `ADMIN` device.
* Uses its `user_id` as the owner of the local connections.
* Checks whether the requesting device is already registered.
* Registers a new LAN device when necessary.
* Returns the available connections and whether an `ADMIN` already exists.

- #### checkOnline()
Handles `ONLINE` device registration.
* Requires an authenticated `user_id`.
* Checks whether an active `ADMIN` device exists.
* Creates the `ADMIN` record when none exists.
* Otherwise registers the current device without a role.
* Returns the current connection state.

The `ADMIN` device is checked on every request to ensure that the connection state remains consistent.

- #### findConnectionsWithoutAdmin()
Returns active connections belonging to the user while excluding the `ADMIN` device.

- #### findConnectionsWithoutCurrentDevice()
Returns all active device connections belonging to the user, including the `ADMIN` device and excluding the currunt device.

---

### DeviceParametersDto
Defines and validates the parameters received from the Runtime:
* `device_id` — device identifier.
* `language` — supported system language.
* `mode` — `LAN` or `ONLINE`.
* `user_agent` — device browser

Input values for `language` and `mode` are normalized to uppercase before enum validation.

### ConnectionDto
Represents a registered device connection:
* `device_id`
* `language`
* `device_role`
* `mode`
* `ip_address`
* `user_agent`
* `created_at`

`device_role` can be `null` because newly connected devices do not necessarily have an assigned role yet.

### ConnectionsResultDto
Represents the result returned to the Runtime:
<pre>
adminExists
connections[]
</pre>

`adminExists` indicates whether an `ADMIN` connection already exists, while `connections` contains the devices currently available to the Runtime.

