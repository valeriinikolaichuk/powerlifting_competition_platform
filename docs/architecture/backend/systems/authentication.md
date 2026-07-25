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
    | AuthController |<---------------------------------.
    '----------------'                                  |
            |   ├──> ? token ---> httpOnly              |
            |   └──> HTTP Response                      |
            ↓                                           |
        AuthService                                     |
            ↓                                           |
       LoginContext                                     |
            ↓                                           |
    MethodPipelineService                               |
      (LOGIN_METHODS)                                   |
  MethodPipelineInterface                               |
            |                                           |
            ├── LoginMethodDefault                      |
            |                                           |
            |                                           |
            ↓                                           |
    AuthFactoryService                                  |
    (LOGIN_STRATEGIES)                                  |
   AuthenticatorAbstract ----.                          |
    ________|________        ├── authenticate()         |
            ↓                ├── generateToken() ?      |
        AuthDefault          └── LoginResultDto --------'
</pre>
