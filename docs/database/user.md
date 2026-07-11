### Users

The `Users` table stores all system users and defines their access level and account status.

A user can have one of the following roles:

- `ADMIN` — full system access. Can manage users, competitions, reference data, and system settings.
- `USER` — regular system user. Has access only to assigned federations and can manage own data according to permissions.
- `PARTICIPANT` — user account created for online competition registration. Access is limited to data created by the related `USER` or `ADMIN`.

#### Fields

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
- `PARTICIPANT` users can only access data created by their owner (`USER` or `ADMIN`).
- `ADMIN` users can manage all users and system data.
