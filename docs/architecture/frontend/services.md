### Services

#### PopupService
Global state service responsible for managing the application's popup system. Maintains the currently active popup component and its associated data, providing a centralized `API` for opening and closing modal dialogs.

**Responsibilities:**
- Stores the active popup component.
- Stores optional popup data.
- Opens popup components dynamically.
- Clears popup state when closed.
- Acts as the communication layer between application components and the global popup host.

---

#### TranslationService
Global internationalization service built with Angular Signals. Lazily loads feature-scoped `JSON` translation files, caches translations per language and scope, and provides reactive runtime language switching through the `t(scope, key)` API.

**Responsibilities:**
- Manages the active application language.
- Lazily loads translation files on demand.
- Caches previously loaded translations to avoid redundant `HTTP` requests.
- Provides reactive translation updates using `Angular Signals`.
- Exposes a simple `t(scope, key)` method for retrieving localized strings.

---

