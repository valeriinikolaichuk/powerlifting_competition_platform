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
- [DeleteConnectionsComponent](delete_connections.md) after the user confirms the deletion.

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





---
---

## Device Identification

The frontend maintains a persistent device identifier using `localStorage`.

When the application starts, `createParameters()` checks whether a device ID already exists:

```typescript
let deviceId = localStorage.getItem('device_id');
```

If no ID exists, a new UUID is generated:

```typescript
deviceId = crypto.randomUUID();
localStorage.setItem('device_id', deviceId);
```

This allows the application to identify the same browser/device across subsequent sessions.

The resulting parameters are represented by `DeviceParameters`:

```typescript
export interface DeviceParameters {
  device_id: string;
  language: string;
  mode: string;
  user_agent: string | null;
}
```

---

## URL Parameters

`ConnectionsService` reads application parameters from the current URL:

```typescript
const params = new URLSearchParams(window.location.search);
```

The following parameters are currently used:

* `lang` — application language.
* `mode` — application operating mode.
* `device_id` — device identifier used in the LAN/local development scenario.

For example:

```text
?lang=en&mode=LAN
```

The values are converted to uppercase by `createParameters()`.

---

## LAN Device Identification

The service contains special handling for the local LAN development environment.

When:

```typescript
mode === 'LAN'
```

and the application is running on:

```typescript
window.location.hostname === 'localhost'
```

the device ID can be explicitly provided through the URL:

```typescript
deviceId = params.get('device_id') ?? '';
```

This allows a locally running runtime application to operate as a specific LAN device during development or testing.

---

## Connection Check

The `check()` method sends the current device parameters to the backend:

```typescript
async check(
  dto: DeviceParameters,
): Promise<ConnectionsResultDto> {
  return await firstValueFrom(
    this.http.post<ConnectionsResultDto>(
      '/api/connections/entry',
      dto,
    ),
  );
}
```

The request is handled by the backend `ConnectionsModule`.

The backend returns a `ConnectionsResultDto` containing:

```typescript
export interface ConnectionsResultDto {
  adminExists: boolean;
  connections: ConnectionDto[];
}
```

This result is used by the frontend entry flow to determine:

* whether an administrator device already exists;
* whether there are existing connections that need to be displayed to the user.

---



---

## Device Deletion

The service also provides a method for deleting selected devices:

```typescript
async deleteDevices(
  deviceIds: string[]
): Promise<void>
```

The selected device IDs are sent to the backend through:

```text
DELETE /api/connections/entry
```

The request uses:

```typescript
withCredentials: true
```

so that authentication credentials, such as cookies, are included with the request.

The actual deletion is performed by the backend `ConnectionsModule`. The frontend service only sends the selected device IDs.

---

## Exit Parameters

`exitParameters()` creates a `DeviceParameters` object used when the device leaves the connection flow.

Unlike `createParameters()`, the exit request does not send the browser user agent:

```typescript
user_agent: null
```

The method uses the same device identification and application mode information so that the backend can identify the corresponding device connection.

---

# Frontend ↔ Backend Relationship

The frontend `ConnectionsService` is directly related to the backend `ConnectionsModule`.

```text
Angular Runtime
      │
      ▼
ConnectionsService
      │
      │ HTTP
      ▼
Backend API
      │
      ▼
ConnectionsModule
      │
      ├── Controller
      ├── Service
      └── Database
```

The frontend defines the API-facing DTO contracts:

```text
DeviceParameters
ConnectionDto
ConnectionsResultDto
```

while the backend `ConnectionsModule` processes these requests and performs the actual connection management.

This separation keeps frontend communication logic independent from backend business logic.

---

## Connections Flow

The entry flow uses the service as follows:

```text
EntryComponent
      │
      ▼
ConnectionsService.createParameters()
      │
      ▼
DeviceParameters
      │
      ▼
ConnectionsService.check()
      │
      ▼
POST /api/connections/entry
      │
      ▼
Backend ConnectionsModule
      │
      ▼
ConnectionsResultDto
      │
      ├── adminExists
      │
      └── connections[]
                │
                ▼
       ConnectionsPopupComponent
                │
                ▼
       DeleteConnectionsComponent
                │
                ▼
       ConnectionsService.deleteDevices()
                │
                ▼
       DELETE /api/connections/entry
                │
                ▼
       Backend ConnectionsModule
```

---

# Design Notes

* `ConnectionsService` acts as the frontend API layer for the backend `ConnectionsModule`.
* Device identification is persisted using `localStorage`.
* New device IDs are generated using `crypto.randomUUID()`.
* URL parameters are used to configure language and application mode.
* LAN/local development has special device ID handling.
* `ConnectionDto`, `ConnectionsResultDto`, and `DeviceParameters` define the frontend API contracts.
* HTTP communication is isolated inside `ConnectionsService`.
* Backend connection management remains inside the backend `ConnectionsModule`.
* `ConnectionsService` does not contain popup or UI logic.
* `ConnectionsService` does not perform connection deletion itself; it delegates the operation to the backend API.
* `firstValueFrom()` is used to convert Angular `HttpClient` observables into promises, allowing the service API to be used with `async/await`.

