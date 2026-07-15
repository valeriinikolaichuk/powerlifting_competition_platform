### PopupComponent
Acts as the global host for the application's popup system. It dynamically renders popup components requested through the `PopupService` and manages the native HTML dialog lifecycle.

#### Responsibilities
- Listens for popup state changes from the `PopupService`.
- Opens and closes the native HTML `<dialog>` element automatically.
- Dynamically renders popup components using `NgComponentOutlet`.
- Injects popup-specific data into dynamically created components via the `POPUP_DATA` injection token.
- Ensures a single reusable popup container is shared across the application.

#### How it works
1. A component requests a popup by calling `PopupService.open()`.
2. `PopupService` stores the component type and optional data.
3. `PopupComponent` reacts to the updated state.
4. The native `<dialog>` element is opened.
5. The requested component is dynamically rendered inside the dialog.
6. Popup data is provided through Angular's dependency injection using the `POPUP_DATA` token.
7. When the popup is closed, the component is removed and the dialog is closed automatically.

#### Dependencies

* `PopupService`
* `NgComponentOutlet`
* `POPUP_DATA`
* Native HTML `<dialog>` element

#### Popup system
```
Popup system
│
├── PopupComponent
│   └── Global dialog host
│
├── InfoPopupComponent (shared/components/popups)
│   └── Reusable information popup layout
│
└── Content components (shared/components/popups/info-popup)
    ├── AboutContentComponent
    ├── ClientsContentComponent
    ├── SetupContentComponent
    ├── DataContentComponent
    ├── RunContentComponent
    └── ExtrasContentComponent
```
