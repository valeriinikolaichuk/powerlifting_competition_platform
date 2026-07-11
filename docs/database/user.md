### Business Data Tables
#### User Data Tables

---

### users

The `Users` table stores all system users and defines their access level and account status.

A user can have one of the following roles:

- `ADMIN` — full system access. Can manage users, competitions, reference data, and system settings.
- `USER` — regular system user. Has access only to assigned federations and can manage own data according to permissions.
- `PARTICIPANT` — user account created for online competition registration. Access is limited to data created by the related `USER` or `ADMIN`.

| Field | Description |
|---|---|
| `id` | UUID primary key |
| `username` | Unique username used for authentication |
| `password` | Hashed user password |
| `role` | User access role (`ADMIN`, `USER`, `PARTICIPANT`) |
| `status` | Account status (`ACTIVE`, `BLOCKED`) |
| `blocked_by` | Reference to the user who blocked this account |
| `blocked_at` | Date and time when the account was blocked |
| `created_at` | Account creation timestamp |
| `updated_at` | Last update timestamp |
| `last_login` | Last successful login timestamp |

#### Relations

- `blocked_by` is a self-reference to the `Users` table.
- A user can block multiple users.
- A `PARTICIPANT` account is created and managed by a `USER` or `ADMIN`.

#### Business Rules

- Usernames must be unique.
- Passwords are stored only in hashed form.
- Blocked users cannot access the system.
- `PARTICIPANT` users can only access data created by their owner (`USER`).
- `ADMIN` users can manage all users and system data.

---

### participants
Defines participant accounts and their registration access scope.  
Each participant is associated with exactly one user account.  
The registration scope determines which athlete records the participant is allowed to register or manage.  

#### Relations
- related with - [users](#users) by `user_id`
- related with - [users](#users) by `created_by_user_id`
- related with **`countries`** by `country_id`
- related with **`regions`** by `region_id`
- related with **`cities`** by `city_id`

#### Business Rules
- Each `PARTICIPANT` is linked to exactly one user account.
- `PARTICIPANT` accounts are created by `USER` or `ADMIN` users.
- `registration_scope` defines the `PARTICIPANT`'s technical access restrictions.
- The participant `email` is used for notifications and automatic participant account creation (in some particular cases).
- Depending on the selected registration scope, the `PARTICIPANT` may be restricted to a **country**, **region**, or **city**.
- `created_by_user_id` identifies the `USER` who created the participant account.

#### Automatic Participant Registration
If no participant account exists for the specified `email`, the system automatically:
- Creates a new `USER` record with the `PARTICIPANT` role.
- Creates a related `PARTICIPANT` record.
- Generates a unique username from the `email` prefix (the part before `@`).
- Generates a password.
- Sends the account credentials to the participant by `email`.

If an account already exists for the specified `email`, the existing participant account is used.

---
