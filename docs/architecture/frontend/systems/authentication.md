## auth/
The authentication module is responsible for user login, communication with the backend authentication `API`, frontend session validation, and routing users according to their `roles`.

<details open="open">
<summary>Contents</summary>  

- [LoginFormComponent](#loginformcomponent)
  - [Authentication flow](#authentication-flow)
- [AuthService](#services)
- [RoleRouterService](#rolerouterservice)
- [LoginResponse DTO](#dtos)
- [UserRole enum](#enums)
- [Design Notes](#design-notes)

</details>

---

### Components

#### LoginFormComponent
The login form is implemented using Angular `Reactive Forms`.

**Responsibilities:**
* Initializes the login form with required validation.
* Loads translations for all form labels using [i18n Translation Module](i18n.md).
* Prevents multiple simultaneous login attempts using [FrontendSessionService](session-system.md).
* Detects the optional `JUDGE` login suffix before sending credentials to the backend.
* Removes the `JUDGE` suffix from the login before sending the authentication request.
* Sends login credentials to the backend through [AuthService](#services).
* Clears the frontend login lock after unsuccessful authentication.
* Displays an error popup when authentication fails by [LoginErrorComponent](popup-system.md#components).
* Navigates users authenticated with the `JUDGE` suffix to the Judge interface.
* Redirects authenticated users according to their assigned `role` through [RoleRouterService](#rolerouterservice).

#### Authentication flow:

```
User submits form
        │
        ▼
Validate form
        │
        ▼
Acquire frontend login lock
        │
        ▼
Check login suffix
        │
        ├── Ends with "JUDGE" ────> Remove "JUDGE" ────> Send cleaned credentials
        │
        ▼
Send credentials
        │
        ▼
POST /api/login
        │
        ▼
Login successful?
        ├── No → Show error popup → Release login lock
        └── Yes
             │
             ▼
        Judge login?
             ├── Yes → Navigate to Judge interface
             │
             └── No  → Navigate according to UserRole
```

#### Judge login mode
The frontend supports a special `JUDGE` login suffix.  
A user can enter:
```
usernameJUDGE
```
The frontend detects the suffix and removes it before sending the credentials to the backend.  
The backend therefore receives a regular username and password and performs the standard authentication flow. `JUDGE` is not a `UserRole` and does not require a separate backend authentication method.

---

### Services
#### AuthService
Provides communication with the backend authentication API.

**Responsibilities:**
* Sends login requests to the [backend](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/backend/systems/authentication.md).
* Includes authentication cookies (`withCredentials`) in every request.
* Sends logout requests.

**Public methods:**
* `login(data)` – authenticates the user.
* `logout()` – terminates the current session.

---

#### RoleRouterService
Centralizes role-based navigation.

**Responsibilities:**
* Redirects authenticated users to the appropriate application module.
* Provides navigation for the Judge interface.
* Prevents routing logic from being duplicated across components.

Current routing:
| Role        | Route           |
| ----------- | --------------- |
| USER        | [/mode](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/architecture/frontend/pages.md#modecomponent) |
| ADMIN       | `/admin`        |
| PARTICIPANT | `/registration` |
| JUDGE login mode | `/judge`   |

---

### DTOs
#### LoginResponse
Represents the backend response after authentication.

Fields:
| Field   | Description                                         |
| ------- | --------------------------------------------------- |
| success | Indicates whether authentication succeeded.         |
| message | Human-readable response message.                    |
| role    | User role returned after successful authentication. |

---

### Enums
#### UserRole

Defines all supported application roles.

| Role        | Description                |
| ----------- | -------------------------- |
| USER        | Standard application user. |
| ADMIN       | Competition administrator. |
| PARTICIPANT | Competition participant.   |

---

### Design Notes
* Uses Angular **Reactive Forms** for form management and validation.
* Keeps HTTP communication isolated inside `AuthService`.
* Keeps routing logic isolated inside `RoleRouterService`.
* Uses the `JUDGE` login suffix as a frontend-only navigation mode without introducing a separate `UserRole` or backend authentication method.
* Uses popup components instead of browser alerts for authentication errors.
* Integrates with the frontend session locking mechanism to prevent concurrent login attempts.
* Supports internationalization through the translation service and `TranslatePipe`.
