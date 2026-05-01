## Frontend Architecture (Angular)

### Components

#### HomeComponent (`pages/home`)
Main application page. Responsible for layout and composing the UI.

- **LoginFormComponent** (`shared/components/login-form`)  
Reusable login form component. Handles user credentials input and authentication trigger.

- **InfoPopupComponent** (`shared/components/popups/info-popup`)  
Displays informational content and handles its own close action via the `PopupService`.

- **AboutContentComponent** (`shared/components/popups/info-popup/about-content`)  
Dynamic content component rendered inside the `InfoPopupComponent`. Displays localized structured content loaded from feature-based JSON files. Fully presentation-only, with no business logic; relies on TranslationService for data and adapts content based on the current language.

---

### Systems

#### PopupComponent (`popup`)
Global container that renders dynamic popup components and injects data into them.  
Contains no business logic. Has no knowledge of specific popups.  
Listens to `PopupService`. Uses `POPUP_DATA (popup-data.token)`.

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
