### Management Tables

### sync_inbox
Stores synchronization operations received by the backend before they are processed.
* `id` — unique identifier of the synchronization operation.
* `source_id` — identifier of the device that created the operation.
* `operation_id` — identifier of the SQL operation that must be executed.
* `record_id` — identifier of the affected record.
* `payload` — data required to execute the operation.
* `received_at` — timestamp when the backend received the operation.
* `processed_at` — timestamp when the operation was successfully processed.

The backend uses `operation_id` to select the corresponding SQL operation from the shared SQL layer and executes it using the provided `payload`.

#### Synchronization flow
<pre>
Runtime
   │
   │  create change
   ▼
sync_queue
   │
   │  synchronization
   ▼
Backend API
   │
   ▼
sync_inbox
   │
   │  operation_id
   ▼
shared SQL
   │
   ▼
PostgreSQL
</pre>

---

### installations
Stores records of `LAN` application installations created for users. Each record identifies the user for whom the installation was created, the language of the installed application, by `device_id` and the installation creation time.

**Fields:**
| Column | Description |
|--------|-------------|
| id | unique identifier of the installation |
| user_id | identifies the user associated with the installation |
| device_id | unique device identifier |
| runtime_version_id | identifies the runtime version used by the installation |
| language | language of the installed application |
| created_at | date and time when the installation was created |

**Relationships:**
* `user_id` → [users.id](user.md#users) — each installation belongs to one user.
* One `User` can have multiple `Installation` records.
* One `RuntimeVersion` can be associated with multiple `Installation` records.

The table is used to **track `LAN` application installations** and is not involved in the competition runtime data itself.

---

### runtime_versions
Stores runtime application versions and the corresponding data version used by the browser database. Each record identifies a specific application version and the version of the runtime data associated with it.

**Fields:**
| Column |	Description |
|--------|--------------|
| id |	unique identifier of the runtime version |
| application_version |	version of the runtime application |
| data_version |	version of the data used by the runtime database |
| is_required |	indicates whether this version is currently required |
| created_at |	date and time when the runtime version was created |

**Relationships:**
One RuntimeVersion can be associated with multiple `Installation` records.

The table is used to manage runtime application versions and their corresponding data versions.
