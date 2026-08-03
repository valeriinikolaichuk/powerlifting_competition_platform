## Frontend Session System

<details open="open">
<summary>Contents</summary>  

- [Description](#description)
  - [Architecture](#architecture)
  - [Session Storage](#session-storage)
- [FrontendSessionService](#frontendsessionservice)
  - [initialize()](#initialize)
  - [startHeartbeat()](#startheartbeat)
  - [startWakeUpListener()](#startwakeuplistener)
  - [updateHeartbeat()](#updateheartbeat)
  - [lockLogin()](#locklogin)
  - [clearLogin()](#clearlogin)
  - [isCurrentTab()](#iscurrenttab)
  - [createSession()](#createsession)
  - [clearSession()](#clearsession)
  - [ngOnDestroy()](#ngondestroy)
- [Session Guard](#session-guard)
- [Session Lifecycle](#session-lifecycle)
- [Design Notes](#design-notes)

</details>

### Description
The frontend session module provides client-side session state management for the application. It uses **`Dexie.js`** with [IndexedDB](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/indexed.md) to maintain a persistent session record shared between browser tabs.

The main purpose of the system is to control the frontend session across browser tabs and maintain a consistent application state during the session lifecycle.

**The system:**
- prevents the same application session from being used simultaneously in `multiple browser tabs`;
- identifies which browser tab currently owns the session;
- prevents other tabs from accessing protected application areas;
- detects an `inactive` or `suspended` session using `heartbeat` monitoring;
- recovers the frontend session after an unexpected application or browser termination;
- restores the session state after the `computer wakes from sleep` or the `browser resumes execution`;
- automatically invalidates stale session data when the previous session can no longer be considered active.

### Architecture
<pre>
Angular Application
        │
        ▼
FrontendSessionService
        │
        ├── Session initialization
        ├── Login locking
        ├── Tab identification
        ├── Heartbeat
        └── Wake-up detection
        │
        ▼
    Dexie.js
        │
        ▼
    IndexedDB
BombingOutFrontend
        │
        ▼
  frontend_session
</pre>

Route access is additionally protected by `sessionGuard`:
<pre>
    Route
      │
      ▼
  sessionGuard
      │
      ▼
FrontendSessionService
      │
      ▼
Is this the current tab?
      |
      ├── No → System popup → Block navigation
      └── Yes → Allow navigation
</pre>

---

### Session Storage
- The session is stored in an IndexedDB database named: [BombingOutFrontend](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/indexed.md).   
- **Dexie.js** provides the database abstraction.  
- The database currently contains the `frontend_session` table:

| Field       | Purpose                                                     |
| ----------- | ----------------------------------------------------------- |
| `id`        | Unique session record identifier.                           |
| `login_at`  | Indicates that a login is currently in progress/active.     |
| `heartbeat` | Timestamp of the last activity update.                      |
| `tab_id`    | Unique identifier of the browser tab that owns the session. |

Only one session record is used by the frontend:
```
SESSION_ID = 1
```

Each browser tab receives its own UUID:
```
crypto.randomUUID()
```

This allows the application to distinguish between different browser tabs.

---

## FrontendSessionService
`FrontendSessionService` is responsible for managing the lifecycle of the frontend session.

**Responsibilities:**
- Checks the current frontend state when the application starts;
- Detects expired `heartbeat` after abnormal application termination;
- Resets `login_at` and updates `heartbeat` during recovery;
- Maintains the `heartbeat` while the application is running;
- Detects device `wake-up` after sleep mode and updates the `heartbeat`.

---

- ### initialize()
  - checks whether the session record exists;
  - create the local record if missing;
  - verify `heartbeat` timeout;
  - checks whether the previous `heartbeat` has expired;
  - clears an expired login state;
  - resets the associated tab identifier when the session expires

A session is considered expired when no heartbeat has been received for more than **90 seconds**.


- ### startHeartbeat()
  - starts periodic `heartbeat` updates;
  - indicates active frontend;
  - supports abnormal termination detection;
  - updates the `heartbeat` field every **30 seconds** while the document is visible;
  - if the browser tab is hidden, the heartbeat update is skipped. This prevents the application from continuously treating an inactive background tab as an active session;
  - the subscription is automatically replaced if `startHeartbeat()` is called again.  

Operation:
```
heartbeat = NOW()
```

- ### startWakeUpListener()
  - detects operating system sleep;
  - browsers suspend `JavaScript` timers during sleep;
  - checks the elapsed time every **10 seconds**;
  - if the difference between checks exceeds **120 seconds**, the application assumes that the computer or browser was suspended and immediately updates the `heartbeat`;
  - this allows the session to recover correctly after:
    - computer sleep;
    - system suspension;
    - browser suspension;
    - long periods without JavaScript execution.

- ### updateHeartbeat()
  - used by: heartbeat service;
  - used by: wake-up detection.

Updates:  
```
heartbeat = NOW()
```

- ### lockLogin()
  - prevents multiple browser tabs from simultaneously acquiring the same frontend session;
  - checks whether another login/session is already active;
  - if `login_at` is already set:
    - the login attempt is rejected;
    - a system popup is displayed;
    - the user remains on the current page.
  - if no active login exists:
    - `login_at` is set;
    - `heartbeat` is updated;
    - the current browser tab's `tab_id` is stored.

- ### clearLogin()
  - clears `login_at`;
  - updates the heartbeat;
  - removes the `tab_id`.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This is used when authentication fails or when the current login session needs to be released.

- ### isCurrentTab()
  - checks whether the current browser tab owns the active frontend session.
  - compares the stored `tab_id` with the `UUID` generated for the current tab.
  - returns: `true`.
  - if the current tab owns the session, otherwise: `false`

- ### createSession()
  - сreates the frontend session record in [IndexedDB](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/indexed.md).
  - stores the current login timestamp, heartbeat timestamp, and browser tab identifier. If a session record with the same ID already exists, it is replaced.
 
- ### clearSession()
  - removes the current frontend session record from [IndexedDB](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/indexed.md).

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This is used before leaving the main application for the Runtime application.

- ### ngOnDestroy()
  - cleans up RxJS subscriptions when the service is destroyed.
  - the following subscriptions are terminated:
    - heartbeat subscription;
    - wake-up detection subscription.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This prevents unnecessary background timers and memory leaks.

---

## Session Guard
Protects routes that require ownership of the current frontend session.

It is implemented as an Angular `CanActivateFn`.

Before navigation, it calls: `sessionService.isCurrentTab()`

If the current tab does not own the session:  
1. Navigation is blocked.  
2. A system popup is displayed.  
3. The user remains outside the protected route.  

If the current tab owns the session, navigation is allowed.

**Example:**
```
{
    path: 'mode',
    component: ModeComponent,
    canActivate: [sessionGuard],
}
```

The same protection is currently applied to:
<pre>
/mode
/lan
</pre>

The home page remains publicly accessible.

---

## Session Lifecycle

The complete lifecycle can be summarized as:

<pre>
Application starts
       │
       ▼
initialize()
       │
       ▼
Check IndexedDB session
       │
       ├── No session -> Create session -> login_at = NULL heartbeat = NOW() tab_id: this.currentTabId
       │
       └── Existing session
                │
                ▼
          Check heartbeat
                │
          ┌─────┴─────┐
          ▼           ▼
       Active       Expired
          │           │
          │           ▼
          │      Reset session -> App redirects to [\]
          │
          ▼
    Start heartbeat
          │
          ▼
      User login
          │
          ▼
     lockLogin()
          │
      ┌───┴────┐
      ▼        ▼
    Locked   Available
      │        │
      ▼        ▼
    Popup   Set tab_id
               │
               ▼
          Authentication
               │
          ┌────┴────┐
          ▼         ▼
        Failed    Success
          │         │
          ▼         ▼
     clearLogin()  Protected routes
                       │
                       ▼
                 sessionGuard
                       │
                       ▼
                isCurrentTab()
</pre>

---

### Design Notes

* Uses **Dexie.js** as the `IndexedDB` abstraction layer.
* Keeps frontend session state persistent across browser tabs.
* Uses a `unique UUID` to identify the session-owning tab.
* Uses `heartbeat` timestamps instead of relying only on browser lifecycle events.
* Detects inactive/suspended sessions automatically.
* Prevents multiple tabs from simultaneously using the same frontend session.
* Separates session management from route protection.
* `FrontendSessionService` manages the session state, while `sessionGuard` controls access to protected routes.
* System popups are reused to inform the user when another tab already owns the session.
