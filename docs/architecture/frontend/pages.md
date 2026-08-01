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
- Displays the [LoginFormComponent](systems/authentication.md) in the center of the page.
- Provides language selection:
  - English (`en`)
  - Ukrainian (`uk`)
  - Polish (`pl`)
- Translations are managed by the [TranslationService](systems/i18n.md).
  - Page translations are loaded when the component is initialized.
  - Users can switch the active language without reloading the application.
  - Text is rendered using a custom `TranslatePipe`.
- Provides navigation buttons that open informational popup dialogs through the [PopupService](systems/popup-system.md).
- Hosts the global `PopupComponent` used to render modal windows.

#### Component Composition
<pre>
HomeComponent
│
├── LoginFormComponent
|
├── PopupComponent
│       │
│       └── PopupService
│               │
│               ├── InfoPopupComponent
│               │
|               ├── MessagePopupComponent
|               |
│               └── SystemPopupComponent
│
└── TranslationService
</pre>

---


