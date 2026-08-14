### DeleteConnectionsComponent
Contains the actual connection deletion functionality.

Responsibilities:
* Displays the available device connections.
* Displays browser information for each connection.
* Allows the user to select devices.
* Tracks selected device IDs.
* Confirms the deletion operation.
* Deletes selected devices through `ConnectionsService`.
* Displays translated messages.
* Returns deleted device IDs through `PopupService`.

---

### ConnectionsPopupService
Provides popup-specific helper functionality.

Currently, it converts the raw browser user_agent string into a readable browser name:
```
getBrowserName(userAgent: string): string
```
For example:
```
Mozilla/5.0 ... Chrome/...
        ↓
     Chrome
```

---
