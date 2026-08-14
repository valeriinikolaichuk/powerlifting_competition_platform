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

⚠️ **WARNING**
#### *The same implementation of `Level 1` is used by both the `Frontend Application` and the `Competition Runtime Application`. The code is duplicated in both apps. Other levels differ in their implementation.*

**Components:**
* `PopupService` - stores popup state and controls popup lifecycle
* `PopupComponent` - global popup host
* `POPUP_DATA` - passes dynamic data through dependency injection

#### Responsibilities:
* Stores the currently active popup.
* Opens and closes modal windows.
* Creates a custom injector.
* Passes data to dynamically created components.
* Controls the HTML `<dialog>` element.

#### *This layer is completely independent of application business logic.*

---

### PopupService
`PopupService` is the central controller of the popup system.

#### Responsibilities:
* Acts as the communication layer between application components and the global popup host.
* Stores the active popup component.
* Stores popup data.
* Opens popups.
* Closes popups.

The service uses `Angular Signals` to automatically notify the `UI` whenever the popup state changes.

**Public methods:**
* `open(component, data)`
* `close()`

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
* Displays popup information.
* Loads translations.
* Contains no popup management logic.
* Can be reused inside different popup templates.

These components are unaware of how they are displayed and simply render their own content.

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
(LoginError, About, ...)
</pre>

#### Example

Displaying the login error popup:

<pre>
this.popupService.open(MessagePopupComponent, {
    content: LoginErrorComponent,
});
</pre>

**Execution flow:**
<pre>
PopupService
      │
      ▼
PopupComponent
      │
      ▼
MessagePopupComponent
      │
      ▼
LoginErrorComponent
</pre>

---

### Components

#### `Fontend`
- `InfoPopupComponent`
  - `AboutContentComponent`
- `MessagePopupComponent`
  - `LoginErrorComponent`
- `SystemPopupComponent` (The code is duplicated in both apps)
  - `SecondTabContentComponent` (The code is duplicated in both apps)

#### `Runtime`
- `SystemPopupComponent` (The code is duplicated in both apps)
  - `SecondTabContentComponent` (The code is duplicated in both apps)

---

### Design Notes

* Uses `Angular Signals` for reactive popup state management.
* Uses `NgComponentOutlet` to dynamically render popup components.
* Uses `Angular Dependency Injection` for passing popup data.
* Separates popup infrastructure from popup layouts and popup content.
* Allows new popup types and popup content to be added without modifying the popup infrastructure.
* Promotes reusable, modular, and feature-independent popup components.

---
