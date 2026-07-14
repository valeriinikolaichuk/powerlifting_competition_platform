### System Runtime Tables

<details open="open">
<summary>Contents</summary>  

- [device_status](#device_status)

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
