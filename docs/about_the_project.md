## Architecture Overview
### Core Concept

The **Powerlifting Competition System** is designed to support reliable competition management in environments with `limited` or `unreliable` internet connectivity.  

The primary design `goal` is to allow every workstation involved in a competition to operate independently while remaining synchronized with the rest of the system. 
Each device maintains its own `local database` and executes the same business rules, calculations, and `SQL` queries, ensuring consistent behavior regardless of where an operation is performed.

Instead of continuously exchanging large datasets, devices `communicate` using compact `raw string` messages that describe only the required actions or state changes. 
This `minimizes network traffic` and allows the system to remain responsive even on slow or unstable networks.

The entire application is distributed as `Docker containers`, allowing organizers to `deploy` the system on a `local network` without installing additional software. 
Users access the application through a standard `web browser`, enabling rapid deployment across multiple computers.

The system can operate `completely offline` during a competition and `synchronize` data with a central server whenever an Internet connection becomes available.

---
