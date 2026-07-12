### Business Data Tables
#### Competition Data Tables

---

### competitions
Stores competition events created by `USER`.  
Each competition belongs to a city (region, country) and is associated with a predefined competition age group.  
The competition configuration defines the competition level, discipline, division, and current status.  

| Field | Description |
|------|-------------|
| id | Unique competition identifier |
| user_id | User who created and manages the competition |
| name | Competition name |
| city_id | Competition location |
| start_date | Competition start date |
| end_date | Competition end date |
| competition_level | Competition level (`CompetitionLevel` enum) |
| type | Competition discipline (`CompetitionType` enum) |
| division | Equipment division (`CompetitionDivision` enum) |
| status | Competition status (`CompetitionStatus` enum) |
| archived_at | Archive timestamp |
| created_at | Record creation timestamp |
| updated_at | Record update timestamp |
| is_deleted | Soft delete flag |

#### CompetitionLevel enum
Defines the competition level.

| Value | Description |
|--------|-------------|
| INTERNATIONAL | International competition. |
| NATIONAL | National competition. |
| REGIONAL_OPEN | Regional competition open to participants from any region. |
| REGIONAL_ONLY | Regional competition restricted to participants from the selected region. |
| LOCAL_OPEN | Local competition open to participants from any location. |
| LOCAL_ONLY | Local competition restricted to participants from the selected city. |

#### CompetitionType enum
Defines the competition discipline.

| Value | Description |
|--------|-------------|
| POWERLIFT | Full powerlifting competition (Squat, Bench Press, Deadlift). |
| BENCH_PRESS | Bench Press competition only. |

#### CompetitionDivision enum
Defines the equipment division.

| Value | Description |
|--------|-------------|
| CLASSIC | Classic (raw) division. |
| EQUIPPED | Equipped division. |

#### CompetitionStatus enum
Defines the current competition status.

| Value | Description |
|--------|-------------|
| ACTIVE | Competition is active and available for management. |
| ARCHIVED | Competition has been archived and is no longer active. |

#### Relations
- related with ➡ [**users**](user.md) by `user_id`
- related with **cities** by `city_id`
- related with  ➡ [сompetition_age_groups](configuration.md) (not directly)

#### Business Rules
- Each competition is created and managed by a single `USER`.
- The competition location is defined by the selected **city (region, country)**
- A competition may contain one or more age groups.
- Soft deletion is supported through the `is_deleted` flag.

#### Competition Creation Workflow
- The `USER` selects one federation.
- The `USER` selects one or more federation age groups. These are required fields.
- The application looks up the corresponding record in `federation_categories` table
- When a competition is created, the system creates a record in `сompetitions` and one or more corresponding records in `сompetition_age_groups`.
- Each `сompetition_age_groups` record defines a competition category and stores its team scoring settings (`team_scoring_limit` and `team_scoring_method`).
