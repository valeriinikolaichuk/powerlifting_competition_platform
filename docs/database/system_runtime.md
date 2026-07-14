### System Runtime Tables

<details open="open">
<summary>Contents</summary>  

- [device_status](#device_status)
- [global_state](#global_state)

</details>

---

### device_status
Stores information about currently connected devices and their active roles within the system.  
The table is used for device coordination, localization, and real-time communication between different competition workstations.

| Column | Description |
|--------|-------------|
| id | Unique record identifier |
| user_id | Logged-in user |
| language | User interface language (`Language` enum) |
| device_role | Assigned device role (`DeviceRole` enum) |
| ip_address | Device IP address |
| user_agent | Device user agent |
| created_at | Record creation timestamp |
| updated_at | Record update timestamp |
| is_deleted | Soft delete flag |

#### Language (enum)
Defines the user interface language.

| Value | Description |
|--------|-------------|
| EN | English |
| UK | Ukrainian |
| PL | Polish |

#### DeviceRole (enum)
Defines the purpose of a connected device.

| Value | Description |
|--------|-------------|
| ADMIN | Administration workstation |
| SCOREBOARD | Competition scoreboard display |
| LIFTING_ORDER | Lifting order display |
| DISCS_SEQUENCE | Plate loading display |
| INFORMATION | Information display |
| TIMER | Competition timer |
| WEIGHING_IN | Weigh-in workstation |

#### Relations

- related with ➡ [**users**](user.md) by `user_id`

#### Business Rules
- One record represents one active device session.
- A user may have multiple active devices.
- Device role determines the functionality available on the device.
- The table is cleared automatically when users sign out or the competition session ends.

---

### global_state
Stores the current global competition state shared by all connected devices.  
The table is used for real-time synchronization between competition workstations.

| Column | Description |
|--------|-------------|
| id | Unique record identifier |
| competition_id | Current competition |
| competition_session_id | Current competition session |
| groups_in_session_id | Current competition group |
| current_discipline | Active discipline (`LiftType` enum) |
| current_attempt | Active attempt number |
| created_at | Record creation timestamp |
| updated_at | Record update timestamp |
| is_deleted | Soft delete flag |

#### LiftType (enum)
Defines the competition lift.

| Value | Description |
|--------|-------------|
| SQUAT | Squat. |
| BENCH_PRESS | Bench press. |
| DEADLIFT | Deadlift. |

#### Relations
- related with ➡ [competitions](competition.md) by `competition_id`
- related with **competition_sessions** by `competition_session_id`
- related with **groups_in_session** by `groups_in_session_id`

#### Business Rules
- The table contains the current competition state shared by all connected devices.
- The active discipline and attempt determine the current stage of the competition.
- All competition displays read their current state from this table.
- The table is cleared automatically when users sign out or the competition session ends.
