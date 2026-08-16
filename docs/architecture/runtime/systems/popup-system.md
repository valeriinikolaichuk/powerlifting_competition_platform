## Popup System
The `popup module` provides a centralized mechanism for displaying modal windows throughout the application. Instead of creating separate modal implementations for each feature, every popup is rendered through a single popup infrastructure.

The system is based on `Angular Signals`, dynamic component rendering (`NgComponentOutlet`), and dependency injection.

### Three-Level Architecture
The popup system is divided into three architectural levels.

<details open="open">
<summary>Contents</summary>  

- [Level 1 - Popup Infrastructure](#level-1-popup-infrastructure)
  - [PopupService](#popupservice)
  - [PopupComponent](#popupcomponent)
  - [POPUP_DATA](#popup_data)
- [Level 2 - Popup Templates)](#level-2-popup-templates)
- [Level 3 - Popup Content)](#level-3-popup-content)
- [Popup Flow](#popup-flow)
- [Components](#components)
- [Design Notes](#design-notes)

</details>

---

## Level 1 (Popup Infrastructure)
Responsible only for opening, closing, and rendering `popup windows`.

**Components:**
* `PopupService` - stores popup state and controls popup lifecycle
* `PopupComponent` - global popup host
* `POPUP_DATA` - passes dynamic data through dependency injection

#### Responsibilities:
* Stores the currently active popup.
* Opens and closes modal windows.
* Stores optional popup data.
* Creates a custom injector.
* Passes data to dynamically created components.
* Controls the HTML `<dialog>` element.
* Dynamically renders popup components using `NgComponentOutlet`.

#### *This layer is completely independent of application business logic.*

---

### PopupService
`PopupService` is the central controller of the popup system.

#### Responsibilities:
* Acts as the communication layer between application components and the global popup host.
* Stores the active popup component.
* Stores popup data.
* Opens popup windows.
* Closes popup windows.
* Returns popup results to the component that opened the popup.

The service uses `Angular Signals` to automatically notify the `UI` whenever the popup state changes.

**Generic popup results**  
The `open()` and `close()` methods use TypeScript generics:  
```
open<T = void>(...): Promise<T>
```
and:  
```
close<T = void>(result?: T): void
```
This allows different popup types to return different result types.

For example, a popup can return:  
```
string[]
```
for deleted device IDs:  
```
this.popup.close<string[]>(this.selectedDeviceIds);
```
while another popup could return:
```
boolean
```
or no result at all.

---

### PopupComponent
`PopupComponent` is the popup host.

#### Responsibilities:
* Watches popup state using `Angular Signals`.
* Opens or closes the native HTML `<dialog>` element.
* Dynamically renders popup components using `NgComponentOutlet`.
* Injects popup-specific data into dynamically created components via the `POPUP_DATA` injection token.

This component acts as the bridge between the popup infrastructure and the popup templates.

#### How it works
1. A component requests a popup by calling `PopupService.open()`.
2. `PopupService` stores the component type and optional data.
3. `PopupComponent` reacts to the updated state.
4. The native `<dialog>` element is opened.
5. The requested component is dynamically rendered inside the dialog.
6. Popup data is provided through Angular's dependency injection using the `POPUP_DATA` token.
7. When the popup is closed, the component is removed and the dialog is closed automatically.

---

#### POPUP_DATA
`POPUP_DATA` is an Angular `InjectionToken`.

#### Responsibilities:
* Transfers data from `PopupService` to dynamically created popup components.
* Eliminates the need for global variables or manual property assignment.

---

## Level 2 (Popup Templates)
Provides reusable popup layouts.

#### Responsibilities:
* Defines popup appearance.
* Provides buttons and layout.
* Hosts dynamically injected content.
* Closes the popup when required.

Each template represents a different popup type while reusing the same infrastructure.

---

## Level 3 (Popup Content)
Contains only feature-specific content.

#### Responsibilities:
* Displays feature-specific information.
* Handles user interaction.
* Uses application services when required.
* Loads translations.
* Performs feature-specific operations.
* Returns the result through `PopupService`.
* Does not control the popup layout or the native `<dialog>` element.
* These components are unaware of how they are displayed and simply render their own content.

---

### Popup Flow

<pre>
Application
      │
      ▼
PopupService.open(...)
      │
      ▼
PopupComponent
      │
      ▼
Popup Template
(Message / Info / System)
      │
      ▼
Popup Content
(SecondTabContent, DeleteConnections, ...)
</pre>

---

### Components

- `ConnectionsPopupComponent`
  - [DeleteConnectionsComponent](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/runtime/delete_connections.md)
  - [ConnectionsPopupService](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/runtime/delete_connections.md#connectionspopupservice)
- `SystemPopupComponent` (The code is duplicated in both apps)
  - `SecondTabContentComponent` (The code is duplicated in both apps)

---

### Design Notes

* Uses `Angular Signals` for reactive popup state management.
* Uses `NgComponentOutlet` for dynamic component rendering.
* Uses `Angular Dependency Injection` for passing popup data.
* Uses a custom `InjectionToken` to decouple dynamic components from the popup host.
* Separates popup infrastructure from popup templates.
* Separates popup templates from feature-specific content.
* Uses `PopupService promises` to return results from popup interactions.
* Keeps connection-management logic inside the feature-specific content component.
* Allows popup templates to be reused with different content components.
* Allows new popup types and content components to be added without modifying the `Level 1` infrastructure.
* Keeps the global popup infrastructure independent from connection-specific business logic.

---
