### HomeComponent

#### Responsibilities:
- Displays the landing page layout.
- Renders the fullscreen background video.
- Hosts the `LoginFormComponent`.
- Provides language selection (`English`, `Ukrainian`, `Polish`).
- Loads page-specific translations during initialization.
- Opens informational popup dialogs through the `PopupService`.
- Hosts the global `PopupComponent` used to render modal windows.

- **LoginFormComponent** (`shared/components/login-form`)  
Reusable login form component. Handles user credentials input and authentication trigger.

- **InfoPopupComponent** (`shared/components/popups/info-popup`)  
Displays informational content and handles its own close action via the `PopupService`.

- **AboutContentComponent** (`shared/components/popups/info-popup/about-content`)  
Dynamic content component rendered inside the `InfoPopupComponent`.
Displays localized structured content loaded from feature-based JSON files.
Fully presentation-only, with no business logic; relies on TranslationService for data and adapts content based on the current language.
