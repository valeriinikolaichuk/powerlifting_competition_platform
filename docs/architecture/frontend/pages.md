## pages

<details open="open">
<summary>Contents</summary>  

- [HomeComponent](#homecomponent)

</details>

---

### HomeComponent
The main application page responsible for composing the user interface and coordinating the primary application features.

#### Responsibilities:
- Displays the landing page layout.
- Renders the fullscreen background video.
- Hosts the `LoginFormComponent`.
- Provides language selection (`English`, `Ukrainian`, `Polish`).
- Loads page-specific translations during initialization.
- Opens informational popup dialogs through the `PopupService`.
- Hosts the global [PopupComponent](popup.md) used to render modal windows.

#### Features
- Displays a fullscreen background video.
- Provides a language switcher with support for:
  - English (`en`)
  - Ukrainian (`uk`)
  - Polish (`pl`)
- Loads page-specific translations on initialization.
- Displays the `login form` in the center of the page.
- Provides navigation buttons that open informational popup dialogs.
- Renders a global popup container used throughout the application.

#### Internationalization
Translations are managed by the `TranslationService`.
- Page translations are loaded when the component is initialized.
- Users can switch the active language without reloading the application.
- Text is rendered using a custom `TranslatePipe`.

#### Popup System
The application uses a centralized `PopupService` to display modal windows.  
Instead of embedding modal content directly into the page, the service dynamically renders the requested popup component. This allows different informational dialogs to reuse the same popup infrastructure.

#### Component Composition
The `HomeComponent` integrates the following `UI` components:
- `LoginFormComponent` – user authentication form.
- [PopupComponent](popup.md) – global popup host.
- `InfoPopupComponent` – reusable informational modal.
- `AboutContentComponent` – example popup content rendered inside the modal.

The component is implemented as a standalone Angular component and imports only the dependencies it requires.

```
HomeComponent
│
├── LoginFormComponent
├── PopupComponent
│       │
│       └── PopupService
│               │
│               └── InfoPopupComponent
│                       │
│                       └── AboutContentComponent
│
└── TranslationService
```

---


