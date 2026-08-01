## pages

<details open="open">
<summary>Contents</summary>  

- [HomeComponent](#homecomponent)
- [ModeComponent](#modecomponent)

</details>

---

### HomeComponent
The main application page responsible for composing the user interface and coordinating the primary application features.

#### Responsibilities:
- Displays the landing page layout.
- Renders the fullscreen background video.
- Displays the [LoginFormComponent](systems/authentication.md) in the center of the page.
- Provides language selection:
  - English (`en`)
  - Ukrainian (`uk`)
  - Polish (`pl`)
- Translations are managed by the [TranslationService](systems/i18n.md).
  - Page translations are loaded when the component is initialized.
  - Users can switch the active language without reloading the application.
  - Text is rendered using a custom [TranslatePipe](systems/i18n.md#translatepipe).
- Provides navigation buttons that open informational popup dialogs through the [PopupService](systems/popup-system.md).
- Hosts the global `PopupComponent` used to render modal windows.

#### Component Composition
<pre>
HomeComponent
│
├── LoginFormComponent
|
├── PopupComponent
│       │
│       └── PopupService
│               │
│               ├── InfoPopupComponent
│               │
|               ├── MessagePopupComponent
|               |
│               └── SystemPopupComponent
│
└── TranslationService
</pre>

---

### ModeComponent
Provides the mode selection screen for authenticated users.

After successful authentication, a user with the `USER` role is redirected to this page and can choose how to continue working with the application.

**Available actions:**
* **LAN** — opens the local network mode.
* **ONLINE** — opens the online runtime application.
* **Logout** — terminates the current authentication session and returns the user to the home page.

#### Architecture
<pre>
ModeComponent
      │
      ├── LAN
      │    └── Angular Router → /lan
      │
      ├── ONLINE
      │    └── Backend Runtime → /runtime
      │
      └── Logout
           ├── AuthService
           ├── FrontendSessionService
           └── Angular Router → /
</pre>

#### Responsibilities:
* Displays the available application modes.
* Loads translations for the mode selection page.
* Navigates to the `LAN` mode.
* Opens the online runtime.
* Logs the user out through `AuthService`.
* Clears the frontend session after logout.
* Returns the user to the home page after logout.

- #### openLan()
Navigates the user to the local network mode:
```
await this.router.navigate(['/lan']);
```
The `/lan` route is protected by [sessionGuard](systems/session-system.md#session-guard), so only the browser tab that owns the current frontend session can access it.

- #### openOnline()
Opens the online runtime using the backend URL configured in the Angular environment:
```
window.location.href = `${environment.apiUrl}/runtime`;
```
The `URL` is constructed from `environment.apiUrl`, allowing the same component to work with different backend environments without hardcoding the server address.

- #### logout()
Terminates the authenticated session.

**The method:**
1. Sends a logout request through [AuthService](systems/authentication.md#services).
2. Clears the frontend session through [FrontendSessionService](systems/session-system.md#clearlogin).
3. Navigates the user back to [`[/]`](#homecomponent).

The frontend session is cleared both when the backend logout request succeeds and when it fails. This ensures that a failed logout request does not leave the local frontend session locked.

#### Internationalization
The page uses the centralized [TranslationService](systems/i18n.md) and [TranslatePipe](systems/i18n.md#translatepipe).

The component loads:
```
this.tService.load('pages/mode');
```

The template then accesses translations through the `t` pipe:
```
{{ 'TITLE' | t:'pages/mode' }}
{{ 'MESSAGE' | t:'pages/mode' }}
{{ 'LOGOUT' | t:'pages/mode' }}
```

Translations are stored in the corresponding language-specific files under:
```
assets/i18n/pages/mode/
```

#### Design Notes

* Uses Angular Router for internal navigation.
* Uses environment configuration for the online runtime URL.
* Reuses the centralized `AuthService` instead of performing HTTP requests directly from the component.
* Reuses `FrontendSessionService` to release the frontend session.
* Integrates with the application's session guard architecture.
* Uses the centralized i18n system for multilingual UI.
* Keeps mode-selection logic inside the page component while delegating authentication and session management to dedicated services.

