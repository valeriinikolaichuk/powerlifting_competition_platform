<div align="center">
  <h2>Powerlifting Competition Platform</h2>
  <h4>An offline-first and cloud-synced platform for managing powerlifting competitions.</h4>
</div>

---
<details open="open">
<summary>Contents</summary>  

- [About the project](#about-the-project)
- [Project Structure](#project-structure)
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

## Project Structure

For a detailed explanation of the system architecture see:    
➡ [frontend documentation](docs/architecture/frontend_architecture.md)  
➡ [backend documentation](docs/architecture/backend_architecture.md)

---

### Built With

- NestJS
- Docker
- PostgreSQL
- Prisma
- Angular
- Tailwind

---

### Setup and Run Instructions  

#### How to run the project:  

➡ [frontend_setup](docs/setup/frontend_setup.md)  
➡ [backend_setup](docs/setup/backend_setup.md)  

---


