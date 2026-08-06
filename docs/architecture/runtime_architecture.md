## Runtime Architecture

The `runtime` is the operational layer where the competition is actually executed. It runs in a web browser on each workstation and provides role-specific interfaces for competition management.

Each runtime instance operates with its own local `PGlite` database and executes the same business logic and data operations independently. This allows workstations to continue operating without a permanent network connection while remaining synchronized with the rest of the system.

The runtime can operate in both `LAN` and `ONLINE` environments. In `LAN` mode, it works entirely within the local deployment, while in `ONLINE` mode it synchronizes local data with the central backend.

This architecture allows the competition to continue operating even when the internet connection is unavailable and synchronize changes when connectivity is restored.

---

### Systems

### [popup](frontend/systems/popup-system.md)
Dynamically renders popup components

### [session](runtime/systems/session-system.md)
Controls the frontend session across browser tabs and maintain a consistent application state during the session lifecycle

### [i18n](frontend/systems/i18n.md) Translation Module  
Translation system based on Angular signals and lazy-loaded `JSON` files, supporting multi-language switching
