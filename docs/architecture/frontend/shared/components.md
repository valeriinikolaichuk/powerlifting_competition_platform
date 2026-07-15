## Components

<details open="open">
<summary>Contents</summary>  

- [login-form](#login-form)
- [info-popup](#info-popup)

</details>

---

## login-form

#### LoginFormComponent

---

## popups

### info-popup
The popup content components are presentation-focused components rendered dynamically inside the `InfoPopupComponent`.  
Each component represents a separate informational section of the application and is responsible only for displaying localized content.  
Popup content components do not manage popup lifecycle or business logic; they rely on the shared popup infrastructure and translation system.  
The selected content component is dynamically rendered by the popup system through the `PopupService`.

<details open="open">
<summary>Contents</summary>  

- [AboutContentComponent](#aboutcontentcomponent)
- [ClientsContentComponent](#clientscontentcomponent)
- [SetupContentComponent](#setupcontentcomponent)
- [DataContentComponent](#datacontentcomponent)
- [RunContentComponent](#runcontentcomponent)
- [ExtrasContentComponent](#extrascontentcomponent)

</details>

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

