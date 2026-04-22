<div align="center">
  <h2>Powerlifting Competition Platform</h2>
  <h4>An offline-first and cloud-synced platform for managing powerlifting competitions.</h4>
</div>

---
<details open="open">
<summary>Contents</summary>  

- [About the project](#about-the-project)
- [Built With](#built-with)
- [Setup and Run Instructions](#setup-and-run-instructions)

</details>

---

## About the Project

## Level 1 – System Context

### Core concept
The system allows organizers to run competitions either fully offline (LAN/local setup) or online via a central server, 
with later synchronization of all competition data.

### Actors

#### Admin
Manages users, platform access, and global configuration.

#### User
Creates and runs competitions. Can operate offline or online.

#### Participant
Registers for competitions and views results only.

### System behavior
- Supports offline competition execution
- Synchronizes data with central backend when online
- Provides global athlete registry
- Allows multi-device competition setup

### Core idea
The system separates runtime competition execution (offline) from global data storage (online).

---

### Built With
#### [Node.js](https://nodejs.org/en)
- NestJS

---

### Setup and Run Instructions  

#### How to run the project:  

➡ [backend_setup](docs/setup/backend_setup.md)
➡ [frontend_setup](docs/setup/frontend_setup.md)

---
