### Services

PopupService (services)

Global state service responsible for managing the application's popup system. Maintains the currently active popup component and its associated data, providing a centralized API for opening and closing modal dialogs.

Responsibilities:

Stores the active popup component.
Stores optional popup data.
Opens popup components dynamically.
Clears popup state when closed.
Acts as the communication layer between application components and the global popup host.

---

TranslationService (services)

Global internationalization service built with Angular Signals. Lazily loads feature-scoped JSON translation files, caches translations per language and scope, and provides reactive runtime language switching through the t(scope, key) API.

Responsibilities:

Manages the active application language.
Lazily loads translation files on demand.
Caches previously loaded translations to avoid redundant HTTP requests.
Provides reactive translation updates using Angular Signals.
Exposes a simple t(scope, key) method for retrieving localized strings.



#### TranslationService (`services`)
Global i18n service based on Angular signals. Loads language-scoped JSON files lazily per feature, stores translations in a reactive cache, and provides runtime language switching with a simple t(scope, key) API.

#### PopupService (`services`)
Global state service for managing application popups. Controls which popup component is opened and passes optional data to it. Provides a simple API (`open/close`) and works as a centralized communication layer between UI triggers and the 'PopupComponent' container.

---

