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
        |        |
        │        ▼
        └── Record exists ? login -> login_at = NOW()
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





