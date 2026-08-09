### Prisma Module

Provides a globally available `PrismaService` for database access throughout the backend.

**PrismaService**

* Extends `PrismaClient`.
* Establishes the database connection when the module is initialized.
* Closes the database connection when the module is destroyed.

**PrismaModule**

* Registers `PrismaService` as a global provider.
* Exports `PrismaService` so it can be injected into any backend service without importing `PrismaModule` into each module.

---

### Runtime Module

Provides the Angular **Runtime Application** through the NestJS backend.

**RuntimeController**

* Handles `GET /runtime`.
* Serves the built Angular Runtime `index.html` from the `runtime/dist/runtime/browser` directory.

**RuntimeModule**

* Configures `ServeStaticModule` to serve the compiled Angular Runtime static files under `/runtime`.
* Registers `RuntimeController` to provide the Runtime entry point.

The Runtime is therefore accessed through the NestJS backend, for example:

```text
/runtime?lang=en
```

The controller returns the Angular application's `index.html`, while `ServeStaticModule` provides its JavaScript, CSS, assets, and other static files.

