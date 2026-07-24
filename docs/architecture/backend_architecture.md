## Backend Architecture
The backend is built with `NestJS` using a modular architecture.

The backend in this platform is shared between two independent clients:
- [Frontend](frontend_architecture.md) — the public-facing `Angular` application used for authentication, platform information, and system management.
- [Runtime](runtime_architecture.md) — the `Angular` application used during competitions and served as static content by the backend.

Both clients communicate with the same REST API.

This approach allows the Competition `Runtime` Application to execute the same backend logic and SQL queries both in the central platform and in isolated local deployments.
<pre>
                 Frontend Application
                         │
                         ▼
                  ┌──────────────┐
                  │  Backend API │
                  └──────────────┘
                         ▲
                         │
                 Runtime Application
</pre>
