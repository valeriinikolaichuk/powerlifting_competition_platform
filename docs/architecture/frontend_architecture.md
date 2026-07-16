## Frontend Architecture
The frontend is built with **Angular** using the **standalone** component architecture.

### Application Structure
- `App` is the root component of the application.
- The root template contains only a `router-outlet`, which serves as the entry point for all routed pages.
- Application routes are defined in [app.routes.ts](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/frontend/src/app/app.routes.ts).
- The default route (`/`) renders the [HomeComponent](frontend/pages.md).
- Additional routes can be added in app.routes.ts. 

---

### Server-Side Rendering (SSR)  
`SSR` configuration is defined in `app.routes.server.ts`.  
Currently, all routes are configured with **Prerender** mode, meaning pages are generated at build time instead of being rendered dynamically on each request.

---

### Standalone Components
The project uses Angular's standalone component API instead of NgModules. Each component explicitly declares its own dependencies through the `imports` property, resulting in a simpler and more modular project structure.

---

### Components
### [pages/](frontend/pages.md)   
Contains `route-level components` representing the main views of the application.
### [popup/](frontend/popup.md)
Global container that renders dynamic popup components and injects data into them.  
### shared/
Reusable UI components, pipes, directives, and other common functionality shared across multiple features.
- ### [components/](frontend/shared/components.md)
- ### [pipes/](frontend/shared/pipes.md)
- ### [tokens/](frontend/shared/tokens.md)

### [services/](frontend/services.md)
Contains reusable application services that encapsulate business logic, data access, state management, and cross-cutting functionality.

---

### Systems



#### i18n Translation Module  
translation system based on Angular signals and lazy-loaded JSON files, supporting multi-language switching

|Components| Responsibility |
|----------|-----------|
| `TranslationService` | manages language state, loads JSON translations per feature scope, and provides translation lookup API |
| `TranslatePipe` | template pipe for easy key-based translations in HTML |
| Language state (signal-based) | reactive global language switching (en / uk / pl) |
| Feature-based JSON structure | translations split by scope (e.g. `home`, `about-popup`) |
| Lazy loading mechanism | loads translations only when a specific scope is needed |
| Caching layer | stores loaded translations per language and scope to avoid duplicate requests |

---

### Services

#### TranslationService (`services`)
Global i18n service based on Angular signals. Loads language-scoped JSON files lazily per feature, stores translations in a reactive cache, and provides runtime language switching with a simple t(scope, key) API.

#### PopupService (`services`)
Global state service for managing application popups. Controls which popup component is opened and passes optional data to it. Provides a simple API (`open/close`) and works as a centralized communication layer between UI triggers and the 'PopupComponent' container.

---
