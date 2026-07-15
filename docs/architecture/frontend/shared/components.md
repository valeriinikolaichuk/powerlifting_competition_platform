## Components

<details open="open">
<summary>Contents</summary>  

- [login-form/](#login-form)
- [info-popup/](#info-popup)

</details>

---

## login-form/

#### LoginFormComponent

---

## popups

### info-popup/

### InfoPopupComponent
Reusable informational popup component responsible for displaying dynamic content inside a consistent modal layout.  
The component acts as a presentation layer between the global popup system and individual content components.
The selected content component is dynamically rendered by the popup system through the `PopupService`.

**Responsibilities**
- Receives the content component type through POPUP_DATA.
- Dynamically renders the provided content component using NgComponentOutlet.
- Provides a common popup layout and styling.
- Handles popup closing through the PopupService.
- Provides reusable controls such as close and return actions.

**Data Flow**
- HomeComponent or another application component requests an informational popup.
- PopupService opens InfoPopupComponent and passes the required content component.
- InfoPopupComponent receives the content through the POPUP_DATA injection token.
- The selected content component is dynamically rendered inside the popup.
- The user can close the popup through the provided actions.

**Dependencies**  
`PopupService`  
`POPUP_DATA`  
`NgComponentOutlet`  

The same popup container can display different content components:
- [AboutContentComponent](#aboutcontentcomponent)
- [ClientsContentComponent](#clientscontentcomponent)
- [SetupContentComponent](#setupcontentcomponent)
- [DataContentComponent](#datacontentcomponent)
- [RunContentComponent](#runcontentcomponent)
- [ExtrasContentComponent](#extrascontentcomponent)

---

- #### AboutContentComponent
Displays general information about the application.

**Responsibilities:**
- Loads localized about information.
- Displays introductory content.
- Shows application scenarios and usage examples.
- Renders structured informational sections from translation data.

---

- #### ClientsContentComponent
Displays information about supported clients and target users.

**Responsibilities:**
- Presents client-related information.
- Displays localized descriptions and categories.
- Renders structured client data from translation files.

---

- #### SetupContentComponent
Displays setup and configuration information.

**Responsibilities:**
- Provides instructions related to application setup.
- Displays configuration requirements and steps.
- Uses localized content from translation resources.

---

- #### DataContentComponent
Displays information about data management and processing.

**Responsibilities:**
- Presents data-related features.
- Explains available data operations.
- Renders localized structured content.

---

- #### RunContentComponent
Displays information about application execution and runtime processes.

**Responsibilities:**
- Describes application workflows.
- Provides information about execution scenarios.
- Uses the translation system for localized content.

---

- #### ExtrasContentComponent
Displays additional information and optional features.

**Responsibilities:**
- Presents supplementary application capabilities.
- Contains extended informational sections.
- Allows adding new informational content without modifying popup infrastructure.

---

