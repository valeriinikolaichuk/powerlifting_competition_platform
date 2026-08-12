## Runtime Session System

<details open="open">
<summary>Contents</summary>  

- [Description](#description)
  - [Architecture](#architecture)
  - [Session Storage](#session-storage)
- [RuntimeSessionService](#runtimesessionservice)
  - [initialize()](#initialize)
  - [startHeartbeat()](#startheartbeat)
  - [startWakeUpListener()](#startwakeuplistener)
  - [updateHeartbeat()](#updateheartbeat)
  - [isCurrentTab()](#iscurrenttab)
  - [createSession()](#createsession)
  - [clearSession()](#clearsession)
  - [ngOnDestroy()](#ngondestroy)
- [Session Guard](#session-guard)
- [Entry Guard](#entry-guard)
- [Session Lifecycle](#session-lifecycle)
- [Design Notes](#design-notes)

</details>

### Description
The frontend session module provides client-side session state management for the application. It uses **`Dexie.js`** with [IndexedDB](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/indexed.md#database-bombingoutruntime) to maintain a persistent session record shared between browser tabs.

The main purpose of the system is to control the frontend session across browser tabs and maintain a consistent application state during the session lifecycle.

**The system:**
- prevents the same application session from being used simultaneously in `multiple browser tabs`;
- identifies which browser tab currently owns the session;
- prevents other tabs from accessing protected application areas;
- detects an `inactive` or `suspended` session using `heartbeat` monitoring;
- recovers the session after an unexpected application or browser termination;
- restores the session state after the `device wakes from sleep` or the `browser resumes execution`;
- automatically invalidates stale session data when the previous session can no longer be considered active.

### Architecture
<pre>
Angular Application
        │
        ▼
RuntimeSessionService
        │
        ├── Session initialization
        ├── Tab identification
        ├── Heartbeat
        └── Wake-up detection
        │
        ▼
    Dexie.js
        │
        ▼
    IndexedDB
BombingOutRuntime
        │
        ▼
  runtime_session
</pre>

Route access is additionally protected by `sessionGuard`:
<pre>
    Route
      │
      ▼
  sessionGuard
      │
      ▼
RuntimeSessionService
      │
      ▼
Is this the current tab?
      |
      ├── No → System popup → Block navigation
      └── Yes → Allow navigation
</pre>

---

### Session Storage
- The session is stored in an IndexedDB database named: [BombingOutRuntime](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/indexed.md#database-bombingoutruntime).   
- **Dexie.js** provides the database abstraction.  
- The database currently contains the `runtime_session` table:

| Field       | Purpose                                                     |
| ----------- | ----------------------------------------------------------- |
| `id`        | Unique session record identifier.                           |
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

## RuntimeSessionService
`RuntimeSessionService` is responsible for managing the lifecycle of the frontend session.

**Responsibilities:**
- Checks the current frontend state when the application starts;
- Detects expired `heartbeat` after abnormal application termination;
- Updates `heartbeat` during recovery;
- Maintains the `heartbeat` while the application is running;
- Detects device `wake-up` after sleep mode and updates the `heartbeat`.

**Runtime session state is stored in `IndexedDB`. Each browser tab has a unique `tab_id` stored in `sessionStorage`, so page reloads do not invalidate the current tab while a new tab is detected as a separate session.**

---

- ### initialize()
  - checks whether the session record exists;
  - create the local record if missing;
  - verify `heartbeat` timeout;
  - checks whether the previous `heartbeat` has expired;
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

- ### isCurrentTab()
  - checks whether the current browser tab owns the active frontend session.
  - compares the stored `tab_id` with the `UUID` generated for the current tab.
  - returns: `true`.
  - if the current tab owns the session, otherwise: `false`

- ### createSession()
  - сreates the runtime session record in [IndexedDB](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/indexed.md#database-bombingoutruntime).
  - stores the current heartbeat timestamp, and browser tab identifier. If a session record with the same ID already exists, it is replaced.
 
- ### clearSession()
  - removes the current runtime session record from [IndexedDB](https://github.com/valeriinikolaichuk/powerlifting_competition_platform/blob/main/docs/indexed.md#database-bombingoutruntime).

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This is used before leaving the main application for the Frontend application.

- ### ngOnDestroy()
  - cleans up RxJS subscriptions when the service is destroyed.
  - the following subscriptions are terminated:
    - heartbeat subscription;
    - wake-up detection subscription.

This prevents unnecessary background timers and memory leaks.

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

---

## Entry Guard
Controls access to the `/entry` route.

- If the `runtime_session` record does not exist, the guard creates a new runtime session.  
- If the record already exists, the guard verifies that the current browser tab is the active session tab.  
- If the current tab is not the active tab, the guard opens the second-tab system popup and blocks navigation.  

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
Check IndexedDB runtime_session
       │
       ├── No session -> Create session -> heartbeat = NOW() tab_id = NULL
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
          │      Reset session
          │
          ▼
    Start heartbeat
          │
          ▼
Start wake-up listener
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
* `RuntimeSessionService` manages the session state, while `sessionGuard` controls access to protected routes.
* System popups are reused to inform the user when another tab already owns the session.
