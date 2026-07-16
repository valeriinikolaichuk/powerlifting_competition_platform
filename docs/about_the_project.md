## Architecture Overview
### Core Concept

The **Powerlifting Competition System** is designed to support reliable competition management in environments with `limited` or `unreliable` internet connectivity.  

The primary design `goal` is to allow every workstation involved in a competition to operate independently while remaining synchronized with the rest of the system. 
Each device maintains its own `local database` and executes the same business rules, calculations, and `SQL` queries, ensuring consistent behavior regardless of where an operation is performed.

Instead of continuously exchanging large datasets, devices `communicate` using compact `raw string` messages that describe only the required actions or state changes. 
This `minimizes network traffic` and allows the system to remain responsive even on slow or unstable networks.

The entire application is distributed as `Docker containers`, allowing organizers to `deploy` the system on a `local network` without installing additional software. 
Users access the application through a standard `web browser`, enabling rapid deployment across multiple devices. The system allows organizers to run competitions fully offline (`LAN/local setup`) or `online` via a central server, with later `synchronization` of all competition data.

The system can operate `completely offline` during a competition and `synchronize` data with a central server whenever an Internet connection becomes available.

---

### System Context (Level 1)

The system allows organizers to configure multiple computers, each performing a dedicated role during a powerlifting competition. Every device connects to the same application and selects a predefined operating scenario according to its purpose.

<pre>
                                                  ADMIN Device
                                   (manages competitions, registrations,
                                        start groups, session updates,
                                   pre- and post-competition documentation)
                                                      ↓
                                     +---------------------------------+
                                     | Powerlifting Competition System |
                                     +---------------------------------+
                                                      ↓
     ---------------------------------------------------------------------------------------------
     ↓                   ↓                    ↓                ↓                ↓                ↓
SCOREBOARD            LIFTING               DISCS         INFORMATION         TIMER           WEIGHING
 Display               ORDER               SEQUENCE         Display          Display             IN
 (Shows               Display              Display         (Athlete           (Lift            Device
 results,            (Order of            (Order of          info)          countdown,        (manages 
 predict              athlete             plates for                      session start)      weighing in
 results)            attempts)           current/next                                         procedure)
</pre>

### Actors:
#### ADMIN (Administrator)
Responsible for configuring and managing competitions, user registration, maintaining competition flow.

#### USER
Operates the competition by managing attempts, updating competition data, and monitoring live sessions.

#### PARTICIPANT
Registers for competitions and accesses published competition results.

---

### Client Roles
Each connected device can operate in one of several predefined scenarios.
|Role	|Responsibility|
|-----|--------------|
|Admin Device	|Competition administration, registrations, start groups, documentation, and live updates.|
|Scoreboard |Display	Displays current standings, rankings, and projected results.|
|Lifting Order |Display	Shows the current and upcoming lifting order.|
|Discs Sequence |Display	Displays the required plate configuration for current and upcoming attempts.|
|Information |Display	Presents athlete information for spectators and officials.|
|Timer Display	|Controls countdown timers for attempts and competition sessions.|
|Weigh-In Device	|Handles athlete weigh-in and submits measurements directly to the competition system.|
