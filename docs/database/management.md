### Management Tables

### installations
Stores records of `LAN` application installations created for users. Each record identifies the user for whom the installation was created, the language of the installed application, and the installation creation time.

**Fields:**
* `id` — unique identifier of the installation.
* `user_id` — identifies the user associated with the installation.
* `language` — language of the installed application.
* `created_at` — date and time when the installation was created.

**Relationships:**
* `user_id` → [users.id](user.md#users) — each installation belongs to one user.
* One `User` can have multiple `Installation` records.

The table is used to **track `LAN` application installations** and is not involved in the competition runtime data itself.
