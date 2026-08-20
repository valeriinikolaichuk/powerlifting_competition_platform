## AI Assistant Chat Integration

This module provides a real-time `AI Assistant` chat interface integrated into the `Angular` application using the official `@n8n/chat` library. It uses a reactive service layer to handle the visibility state of the chat window dynamically.

#### Features
* **Lazy Initialization:** The `n8n chat widget` initializes when the chat container is opened.
* **State Management:** Reactive visibility control via RxJS `BehaviorSubject`.
* **Clean UI Handling:** Embeds seamlessly into a dedicated DOM target (`#n8n-chat-container`) in fullscreen mode.

---

### PowerliftingChatComponent
The `UI` controller that renders the `chat container` and triggers the `n8n` script.

* **Lifecycle Lifecycle (`ngOnInit`):** Subscribes to `chatState$`. When the chat opens for the first time, it executes `initN8nChat()`.
* **Initialization Guard:** Uses a private `isInitialized` flag to ensure `createChat()` is called exactly once, preventing duplicate widget instances.
* **Configuration:** Pulls the webhook endpoint from `Angular` environment files (`environment.n8nChatUrl`).

#### Configuration Details
The `@n8n/chat` instance is configured with the following parameters:
* **Target:** `#n8n-chat-container` (Requires an element with this ID to exist in the component's HTML template).
* **Mode:** `fullscreen`
* **Welcome Screen:** Disabled (`showWelcomeScreen: false`)
* **Session Persistence:** Disabled (`loadPreviousSession: false`)
* **Authentication:** Set to `Guest` metadata by default.

### powerlifting-chat.component.html
   Ensure your template contains the matching target container and a close action.

---

### PowerliftingChatService
A singleton service responsible for managing the global visibility state of the chat overlay.

* **State:** `isChatOpened$` (`BehaviorSubject<boolean>`) tracks whether the chat UI is visible.
* **Methods:**
  * `toggleChat()` - Flips the current open/closed state.
  * `openChat()` - Explicitly forces the chat to open.



