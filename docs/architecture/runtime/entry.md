## Entry

### EntryComponent
The entry point of the `Runtime` application. It starts the `Runtime` initialization process by calling `EntryService.check()` when the component is initialized.

### EntryService
Determines the Runtime environment and prepares the device parameters required to establish the administrator connection.

**Initialization logic**  
- Reads `lang` and `mode` from the Runtime `URL`.
- Generates a unique `device_id` using `crypto.randomUUID()`.
- In `LAN` mode, if the `Runtime` is running on `localhost`, the service uses the existing `device_id` from the `URL`. This allows the installed `LAN` Runtime to keep the device identity created during installation.
- In `ONLINE` mode, a new `device_id` is generated for the current Runtime instance.
- Creates a `DeviceParameters` DTO containing the device ID, language, and mode.
- Sends the `DTO` to `POST /api/connections/admin`.
- Uses `firstValueFrom()` to wait for the `HTTP` request to complete before continuing Runtime initialization.

The service therefore provides a single entry point for identifying the Runtime environment and registering the current device with the backend.

### DeviceParameters
Defines the parameters sent by the `Runtime` when establishing the administrator connection:

|Field	|Description|
|---|---|
|device_id	|Unique identifier of the Runtime device|
|language	|Selected application language|
|mode	|Runtime operation mode (`lan` or `online`)|
