## Authentication System
Orchestrates modular authentication **`Pipeline`**, resolves dynamic login strategies via a **`Factory`** service, initializes secure **`httpOnly`** cookie sessions, and validates environment configurations asynchronously.

The login process consists of two independent stages:
- Determine the authentication method.
- Execute the corresponding authenticator.

<details open="open">
<summary>Contents</summary>  

- [AuthService](#authservice)
- [LanService](#lanservice)
  - [LAN token flow](#lan-token-flow)
- [Login Flow](#login-flow)
- [LoginContext](#logincontext)
- [MethodPipelineService](#methodpipelineservice)
- [AuthFactoryService](#authfactoryservice)
  - [Authenticator Architecture](#authenticator-architecture)
- [SessionPolicyFactoryService](#sessionpolicyfactoryservice)
- [JWT Authentication](#jwt-authentication)
- [TokenService](#tokenservice)
- [Cookie Management](#cookie-management)
- [Design Principles](#design-principles)

</details>

---

### AuthService
Coordinates the authentication process by creating a [LoginContext](#logincontext), executing the login pipeline, and authenticating the user through the configured authentication strategy. It returns the completed [LoginContext](#logincontext) containing the authentication result.

---

### LanService
Responsible for establishing authentication for devices operating in `LAN` mode.

Unlike the standard online authentication flow, LAN devices do not provide login credentials and do not initially have an authentication token. The service identifies the LAN user from the server-side `device_status` data and creates an authentication context for that user.

#### Responsibilities:
- Check whether an `access_token` cookie already exists.
- Reuse the existing authentication session without creating a new token.
- Identify the user associated with the LAN ADMIN device.
- Create a `LoginContext` for the identified user.
- Resolve the appropriate session policy.
- Generate an access token using the existing `TokenService`.
- Return the authentication context to the controller.

The service does **not** manage `HTTP` cookies directly. Cookie management remains the responsibility of `AuthenticationCookieService`.

This keeps `LAN` authentication consistent with the standard authentication architecture while avoiding a separate token-generation mechanism.

#### LAN token flow
<pre>
LAN Runtime
    │
    │ POST /api/lan-token
    ▼
AuthController
    │
    ▼
LanService
    │
    ├── access_token exists?
    │       │
    │       └── YES → reuse existing session
    │
    ├── obtain user data
    │
    ├── create LoginContext
    │
    ├── resolve session policy
    │
    └── generate access token
            │
            ▼
       TokenService
            │
            ▼
      AuthController
            │
            ▼
AuthenticationCookieService
            │
            ▼
       HTTP-only cookie
</pre>

The `LAN` token flow therefore reuses the existing [LoginContext](#logincontext), [SessionPolicyFactoryService](#sessionpolicyfactoryservice), [TokenService](#tokenservice), and [AuthenticationCookieService](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/backend/api/src/modules/auth/cookies/authentication-cookie.service.ts). components instead of introducing a separate authentication mechanism.

---

### Login Flow
<pre>
      HTTP Request
            ↓
          JSON
            ↓
      ValidationPipe
            ↓
    class-transformer
            ↓
        LoginDto
            ↓
    .----------------.
    | AuthController | <────────────────────────────────────────────────────────────.
    '----------------'                                                              |
            |   |                                                                   |
            |   ├───────────> ? AuthenticationCookieService <───────────────────────|
            |   |                         ↓        ↑                                |
            |   └──> HTTP Response     httpOnly    |                                |
            ↓                                      |                                |
        AuthService                                |                                |
            ↓                           SessionPolicyFactoryService ────.           |
       LoginContext                        (TOKEN_COOKIE_POLICY)          |         |
            ↓                              SessionPolicyInterface         |         |
    MethodPipelineService                  ________|________              |         |
      (LOGIN_METHODS)                      ↓               ↓              |         |
  MethodPipelineInterface     PersistentSessionPolicy  RefreshableSessionPolicy     |
            |                                                             |         |
            ├── LoginMethodDefault                                        |         |
            |                                                             |         |
            |                                                             |         |
            ↓                                                             |         |
    AuthFactoryService                                                    |         |
    (LOGIN_STRATEGIES)                                                    |         |
   AuthenticatorAbstract ───────.                                         |         |
    ________|________           |                                         |         |
            ↓                Response,                                    |         |
        AuthDefault        LoginContext                                   |         |
                                |                                         |         |
                                ├── authenticate()                        |         |
                                ├── TokenService                          |         |
                                |         ├── generateToken() ? <─────────|         |
                                |         └── generateToken() ? <─────────'         |
                                └── LoginResultDto ─────────────────────────────────'
</pre>

---

### LoginContext
[LoginContext](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/backend/api/src/modules/auth/login-context.ts) is the central object shared throughout the authentication process.  
Instead of passing multiple DTOs between services, every processing stage enriches the same context.  

The context contains:
- request [LoginDto](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/backend/api/src/modules/auth/dto/login.dto.ts);
- detected authentication `method`;
- authenticated `User`;
- authentication [LoginResultDto](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/backend/api/src/modules/auth/dto/login-result.dto.ts).

This approach keeps the authentication pipeline independent from `HTTP` transport and minimizes parameter passing between services.

---

### MethodPipelineService

The first processing stage determines which authentication method should be used.  
Each pipeline implementation analyzes the incoming request and decides whether it supports the supplied credentials.

Example:
<pre>
login + password
        │
        ▼
method = default
</pre>

---

### AuthFactoryService
Once the authentication method has been determined, the `AuthFactory` selects the corresponding authenticator using `Dependency Injection` and `Injection Tokens`.
```
LoginContext
      │
      ▼
AuthFactoryService
      │
      ├── AuthDefault
      └── ...
```
Each authenticator is responsible for a single authentication method.  
Adding a new authentication method only requires implementing another authenticator and registering it with the factory.

#### Authenticator Architecture

All authenticators inherit from [AuthenticatorAbstract](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/backend/api/src/modules/auth/authentication/authenticator.abstract.ts).

The abstract class implements the common authentication workflow shared by every authentication method, while concrete authenticators are responsible only for validating credentials.
<pre>
execute()
    │
    ├── authenticate()
    │
    ├── SessionPolicyFactory
    │       │
    │       └── SessionPolicyInterface
    │
    ├── tokenService.generateAccessToken()
    │
    ├── tokenService.generateRefreshToken()
    │
    └── populate LoginResultDto
                      │
                      ├── success
                      ├── message
                      ├── role
                      ├── accessToken
                      └── refreshToken
</pre>
Responsibilities of `AuthenticatorAbstract`
- executing the authentication workflow;
- generating `JWT access tokens`;
- generating `JWT refresh tokens` when required by the selected session policy;
- selecting the appropriate session policy;
- populating `LoginResultDto`, including:
  - authentication status;
  - response message;
  - authenticated user `role`;
  - generated authentication `tokens`.

Concrete authenticators implement only the authentication logic specific to their authentication method.

Typical responsibilities include:
- locating the user;
- validating credentials;
- checking account status;
- assigning the authenticated user to the `LoginContext`.

They do not generate tokens or manage session behavior.

---

### SessionPolicyFactoryService
Session behavior is separated from authentication logic through `Session Policies`.

After successful authentication, AuthenticatorAbstract requests the appropriate policy from the `SessionPolicyFactory`.
```
Authenticated User
        │
        ▼
SessionPolicyFactoryService
        │
        ├── PersistentSessionPolicy
        └── RefreshableSessionPolicy
```

The `Policy Factory Session` selects the appropriate policy based on the authenticated user's `ROLE`.

|Policy	|Description|
|-----------|-----------|
|PersistentSessionPolicy|	Long-lived authentication intended for Competition Runtime users.|
|RefreshableSessionPolicy|	Short-lived access tokens with refresh support for users operating exclusively online.|

The selected policy determines:
- `access token` lifetime;
- `refresh token` lifetime;
- whether a `refresh token` should be issued;
- authentication `cookie` lifetime.

---

### JWT Authentication
After successful authentication, the authenticator generates `JWT tokens` according to the selected session policy.

Typical JWT payload:
<pre>
{
  "sub": 15
}
</pre>

The payload intentionally contains only the information required for authorization.

---

### TokenService
The `TokenService` is responsible for generating `JWT` access and refresh tokens for authenticated users. It uses the configured session policy to determine the token expiration time.

---

### Cookie Management

Authentication cookies are managed by a dedicated [AuthenticationCookieService](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/backend/api/src/modules/auth/cookies/authentication-cookie.service.ts).

Responsibilities:
- create authentication cookies;
- remove cookies during logout;
- configure cookie lifetime;
- apply common cookie security options.

Controllers never manipulate cookies directly.

---

### Design Principles
The module is built around the following architectural principles:
- Single Responsibility Principle
- Dependency Injection
- Factory Pattern
- Pipeline Pattern
- Context-based processing
- Open/Closed Principle
