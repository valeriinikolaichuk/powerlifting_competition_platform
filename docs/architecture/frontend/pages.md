## pages

<details open="open">
<summary>Contents</summary>  

- [HomeComponent](#homecomponent)
- [ModeComponent](#modecomponent)
- [LanComponent](#lancomponent)

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

- #### ngOnInit()
The component loads the `pages/home` translation scope during initialization:
```
this.tService.load('pages/home');
```

The page uses `TranslatePipe` for user-facing text:
```
{{ 'ABOUT' | t:'pages/home' }}
{{ 'CLIENTS' | t:'pages/home' }}
{{ 'SETUP' | t:'pages/home' }}
{{ 'ASSISTANT' | t:'pages/home' }}
```

- #### setLang()
Changes the current application language:
```
setLang(lang: 'en' | 'uk' | 'pl') {
  this.tService.setLang(lang);
}
```

The selected language is reflected immediately throughout the application through the centralized `TranslationService`.

The active language button is visually highlighted using the current value of:
```
tService.lang()
```

- #### onResize()

The component detects whether the current viewport is mobile-sized:
```
isMobile = window.innerWidth < 768;
```

The `@HostListener('window:resize')` listener updates this value whenever the browser window is resized.

The template then uses Angular's conditional rendering:
```
@if (!isMobile) {
    ...
} @else {
    ...
}
```

This provides separate layouts for:

* desktop/tablet-sized screens;
* mobile screens.

On desktop, the login form and assistant button are displayed. On mobile, the layout is simplified and the assistant button is presented separately.

#### Login Form

The authentication form is provided by the reusable `LoginFormComponent`:
```
<app-login-form></app-login-form>
```

The `HomeComponent` therefore does not contain authentication logic. Authentication is delegated to the dedicated authentication module.

#### Background
The page uses a full-screen background video:
```
<video autoplay muted loop playsinline preload="auto">
```

The video is positioned as a background layer while the application's interactive elements are rendered above it.

#### Design Notes

* Acts as the main public entry point of the application.
* Uses the centralized internationalization system.
* Uses the centralized popup infrastructure.
* Delegates authentication to `LoginFormComponent`.
* Supports runtime language switching.
* Provides separate desktop and mobile layouts.
* Keeps authentication, popup management, and translation logic outside the page component itself.
* Uses Angular standalone components and modern Angular control flow (`@if`).
* Uses `Type<any>` to allow the popup content component to be selected dynamically.

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
The [`[/lan]`](#lancomponent) route is protected by [sessionGuard](systems/session-system.md#session-guard), so only the browser tab that owns the current frontend session can access it.

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

---

### LanComponent
Provides the initial screen for the local network (LAN) mode.

The page is displayed after the user selects `LAN` from the mode selection screen. It currently provides information about the `LAN` mode and the planned runtime download process.

### Architecture
<pre>
ModeComponent
      │
      │ Select LAN
      ▼
    /lan
      │
      ▼
LanComponent
      │
      ├── Display LAN information
      │
      ├── Display runtime download information
      │
      └── Return → /mode
</pre>

#### Responsibilities:
* Displays information about the LAN mode.
* Loads translations for the LAN page.
* Provides navigation back to the mode selection page.
* Keeps the page independent from the actual LAN runtime implementation.

- #### return()
Navigates the user back to the mode selection page:
```
await this.router.navigate(['/mode']);
```

The [`[/mode]`](#modecomponent) route is protected by [sessionGuard](systems/session-system.md#session-guard), ensuring that the current browser tab still owns the frontend session.

### Internationalization
The component loads the dedicated translation scope:
```
this.tService.load('pages/lan');
```

The template uses [TranslationService](systems/i18n.md) and [TranslatePipe](systems/i18n.md#translatepipe) for all user-facing text:

```html id="aj5f47"
{{ 'TITLE' | t:'pages/lan' }}
{{ 'MESSAGE' | t:'pages/lan' }}
{{ 'DOWNLOAD' | t:'pages/lan' }}
{{ 'RETURN' | t:'pages/lan' }}
```

#### Design Notes

* Uses Angular `Router` for navigation.
* Uses the centralized `i18n` system.
* Contains no authentication or session-management logic.
* Relies on the global `sessionGuard` for protected route access.
* Currently serves as the entry point for the `LAN` workflow, with the runtime download functionality to be implemented as part of the next stage of the LAN architecture.
