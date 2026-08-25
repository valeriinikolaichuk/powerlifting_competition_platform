## ConnectionsService
Manages the identification and registration of the current device and communicates with the backend [ConnectionsModule](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/backend/systems/connections.md#dtos).  
The frontend uses `ConnectionsService` as the communication layer between the Angular application and the backend connections `API`.  
It uses Angular `HttpClient` for HTTP communication.

<details open="open">
<summary>Contents</summary>  

- [createParameters()](#createparameters)
- [check()](#check)
- [exitParameters()](#exitparameters)
- [deleteDevices()](#deletedevices)
- [DTOs](#dtos)

</details>

### Responsibilities
* Creates device identification parameters.
* Generates and stores a persistent device ID.
* Reads `lang`, `mode`, and other parameters from the URL.
* Handles the special `LAN` local development case.
* Provides the browser `user_agent`.
* Sends connection checks to the backend.
* Sends device deletion requests to the backend.
* Providing a consistent `DTO` contract between the frontend and backend.
* Converts Angular `HTTP` observables into promises.

---

- ### createParameters()
Creates the device parameters used when entering the application.

#### Responsibilities:
- Reads the `lang` parameter from the `URL`.
- Reads the `mode` parameter from the `URL`.
- Retrieves the persistent `device_id` from `localStorage`.
- Generates a new `UUID` if the device does not have an `ID` yet.
- Handles the special `LAN`/`ONLINE` development case.
- Ensuring that a `LAN` authentication token exists before the device parameters are returned.
- Adds the current browser user_agent.
- Returns a [DeviceParameters](#deviceparameters) object.

The device ID is persisted in localStorage:
```
const deviceId = localStorage.getItem('device_id');
```
If the `ID` does not exist, a new one is generated:
```
deviceId = crypto.randomUUID();
localStorage.setItem('device_id', deviceId);
```
For a local `LAN` runtime, the device `ID` can instead be supplied through the URL:
```
?mode=LAN&device_id=<device-id>
```

For `ONLINE` mode, the existing authentication session is used.

For `LAN` mode, [LanTokenService](cookies.md) is called before returning the parameters. The service requests the server to ensure that an `access_token` cookie exists. If the cookie already exists, it is preserved; otherwise, the server creates and sets a new token.

The method therefore guarantees that `LAN` authentication is established before the runtime proceeds with the connection flow.

#### Flow
<pre>
  createParameters()
       │
       ├── Read URL parameters
       │
       ├── Get/create device_id
       │
       ├── LAN?
       │     │
       │     └── YES → LanTokenService.ensureToken()
       │                       │
       │                       ▼
       │                  POST /api/lan-token
       │                       │
       │                       ├── token exists → keep it
       │                       │
       │                       └── token missing → create token
       │
       ▼
Return DeviceParameters
</pre>

---

- ### check()
Checks the current device connection state through the backend [ConnectionsModule](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/backend/systems/connections.md#connectionscontroller).

#### Responsibilities:
* Sends device information to the backend.
* Requests the current connection state.
* Returns the backend result to the calling component.
* Does not perform connection-related business logic locally.

The method converts the Angular `HttpClient` observable into a promise using `firstValueFrom()`.

The method sends the device parameters to:
```
POST /api/connections/entry
```
The backend returns [ConnectionsResultDto](#connectionsresultdto) with [ConnectionDto](#connectiondto)

---

- ### exitParameters()
Creates the device parameters required when leaving the Runtime application.

The method retrieves the information required by the exit flow:
* `device_id` — identifies the current device connection.
* `language` — preserves the current application language.
* `mode` — determines how the Runtime should be closed or where the user should be redirected.
* `user_agent` — set to null because browser information is not required during the exit flow.

The returned parameters are consumed by the [Runtime exit logic] rather than being sent directly to the backend.

---

- ### deleteDevices()
Deletes selected device connections through the backend.

#### Responsibilities:
- Sends selected `device IDs` to the backend.
- Uses the authenticated `HTTP` request.
- Delegates the actual deletion to the backend ConnectionsModule.
- Does not modify the local connection state directly.

The method sends the selected device IDs to:
```
DELETE /api/connections/entry
```

The method is used by: 
- [ConnectionsPopupComponent](delete_connections.md) after the user confirms the deletion.

---

### DTOs

### DeviceParameters

Defines the device and application parameters sent by the frontend when checking or identifying a device connection.

* `device_id` — unique identifier of the device.
* `language` — current application language.
* `mode` — current application mode (`ONLINE` or `LAN`).
* `user_agent` — browser/device user-agent string; `null` when not required.

### ConnectionDto

`ConnectionDto` represents an existing device connection returned by the backend:

```typescript
export interface ConnectionDto {
  device_id: string;
  language: string;
  device_role: string | null;
  mode: string;
  ip_address: string;
  user_agent: string;
  created_at: Date;
}
```

The DTO contains both device identification information and connection metadata.

It is used by the frontend connection popup to display existing devices and allow the user to select connections for deletion.

### ConnectionsResultDto

Defines the result returned by the backend after checking the current device connection state.

* `adminExists` — indicates whether an administrator connection already exists.
* `connections` — list of existing device connections represented by `ConnectionDto`.

