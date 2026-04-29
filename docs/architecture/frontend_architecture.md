## Frontend Architecture (Angular)

### Components

#### HomeComponent (`pages/home`)
Main application page. Responsible for layout and composing the UI.

- **LoginFormComponent** (`shared/components/login-form`)  
Reusable login form component. Handles user credentials input and authentication trigger.

- **InfoPopupComponent** (`shared/components/popups/info-popup`)  
Displays informational content and handles its own close action via the `PopupService`.

#### PopupComponent (`popup`)
Global container that renders dynamic popup components and injects data into them.  
Contains no business logic. Has no knowledge of specific popups.  
Listens to `PopupService`. Uses `POPUP_DATA (popup-data.token)`. 
