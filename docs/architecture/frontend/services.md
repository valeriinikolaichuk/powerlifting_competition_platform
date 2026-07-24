### Services

<details open="open">
<summary>Contents</summary>  

- [FrontendSessionService](#frontendsessionservice)
- [PopupService](#popupservice)
- [TranslationService](#translationservice)

</details>

---

#### FrontendSessionService
Controls the lifecycle stored in the local [frontend_session](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/indexed.md) table.

**Responsibilities:**
- Checks the current frontend state when the application starts;
- Detects expired `heartbeat` after abnormal application termination;
- Resets `login_at` and updates `heartbeat` during recovery;
- Maintains the `heartbeat` while the application is running;
- Detects device `wake-up` after sleep mode and updates the `heartbeat`.

<pre>
First application start
        |
        ▼
Check frontend_session table
        |
        ├── Record does not exist
        │       |
        │       ▼
        │   Create record
        │   login_at = NULL
        │   heartbeat = NOW()
        │
        └── Record exists
                |
                ▼
        Check heartbeat
                |
                ├── Heartbeat valid
                │       |
                │       ▼
                │   Continue
                │
                └── Heartbeat expired
                        |
                        ▼
                Reset application state
                login_at = NULL
                heartbeat = NOW()
                        |
                        ▼
                App redirects to [\]
</pre>

- #### `initialize()`  
  - create the local record if missing;
  - verify heartbeat timeout;
  - recover after abnormal termination.

- #### `startHeartbeat()`
  - starts periodic heartbeat updates.
  - indicate active frontend;
  - support abnormal termination detection.

Interval:
```
30 seconds
```
Operation:
```
heartbeat = NOW()
```

- #### `startWakeUpListener()`
  - detects operating system sleep.  
  - browsers suspend JavaScript timers during sleep.

Every
```
10 seconds
```
the service checks:
```
now - lastCheck
```
If the elapsed time exceeds
```
WAKEUP_TIMEOUT
```
the `heartbeat` is immediately refreshed.

- #### `updateHeartbeat()`
  - used by: heartbeat service;
  - used by: wake-up detection.

Updates:  
```
heartbeat = NOW()
```

---

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

