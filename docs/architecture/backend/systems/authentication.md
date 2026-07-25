## Authentication System
Orchestrates modular authentication **`Pipeline`**, resolves dynamic login strategies via a **`Factory`** service, initializes secure **`httpOnly`** cookie sessions, and validates environment configurations asynchronously.

The login process consists of two independent stages:
- Determine the authentication method.
- Execute the corresponding authenticator.

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
    | AuthController | <────────────────────────────────────────────────────────.
    '----------------'                                                          |
            |   |                                                               |
            |   ├───────────> ? AuthenticationCookieService <───────────────────|
            |   |                         ↓        ↑                            |
            |   └──> HTTP Response     httpOnly    |                            |
            ↓                                      |                            |
        AuthService                                |                            |
            ↓                               SessionPolicyFactory ───────.       |
       LoginContext                        (TOKEN_COOKIE_POLICY)        |       |
            ↓                              SessionPolicyInterface       |       |
    MethodPipelineService                  ________|________            |       |
      (LOGIN_METHODS)                      ↓               ↓            |       |
  MethodPipelineInterface     OfflineSessionPolicy  OnlineSessionPolicy |       |
            |                                                           |       |
            ├── LoginMethodDefault                                      |       |
            |                                                           |       |
            |                                                           |       |
            ↓                                                           |       |
    AuthFactoryService                                                  |       |
    (LOGIN_STRATEGIES)                                                  |       |
   AuthenticatorAbstract -------.                                       |       |
    ________|________           |                                       |       |
            ↓                Response,                                  |       |
        AuthDefault        LoginContext                                 |       |
                                |                                       |       |
                                ├── authenticate()                      |       |
                                ├── generateToken() ? <─────────────────|       |
                                ├── generateToken() ? <─────────────────'       |
                                └── LoginResultDto ─────────────────────────────'
</pre>
