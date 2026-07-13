### Business Data Tables
#### Competition Data Tables

<details open="open">
<summary>Contents</summary>  

- [competitions](#competitions)
- [athlete_registrations](#athlete_registrations)

</details>

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

---

### athlete_registrations
Stores athlete registrations for competitions.  
Each record contains the athlete's competition entry, nomination attempts, competition category, represented organizations, assigned trainers, weigh-in information, session assignment, and registration status.

| Column | Description |
|--------|-------------|
| id | Unique registration identifier |
| athlete_id | Registered athlete |
| competition_id | Competition |
| country_id | Country represented by the athlete (optional) |
| region_id | Region represented by the athlete (optional) |
| city_id | City represented by the athlete (optional) |
| sport_society_id | Sport society represented by the athlete (optional) |
| club_id | Club represented by the athlete (optional) |
| sport_school_id | Sport school represented by the athlete (optional) |
| university_id | University represented by the athlete (optional) |
| competition_age_group_id | Competition age group |
| trainer_1_id | Primary trainer (optional) |
| trainer_2_id | Additional trainer (optional) |
| trainer_3_id | Additional trainer (optional) |
| trainer_4_id | Additional trainer (optional) |
| sport_rank_class | Athlete's sport rank or class |
| sport_titles | Athlete's sport titles |
| squat_nominated | Nominated squat weight |
| bench_press_nominated | Nominated bench press weight |
| deadlift_nominated | Nominated deadlift weight |
| total_nominated | Total nominated weight |
| weight_class_id | Assigned weight class (optional) |
| bodyweight | Official bodyweight after weigh-in (optional) |
| athlete_coefficient | Calculated competition coefficient |
| group_in_session_id | Assigned competition group (optional) |
| lot | Lot number |
| double | Indicates participation outside the main classification |
| status | Participation status (`AthleteRegistrationStatus` enum) |
| verification_status | Registration verification status (`VerificationStatus` enum) |
| created_at | Record creation timestamp |
| updated_at | Record update timestamp |
| is_deleted | Soft delete flag |

#### AthleteRegistrationStatus
Defines the athlete's participation status in a competition.

| Value | Description |
|--------|-------------|
| TEAM | The athlete competes as a member of a team. |
| PERSONALLY | The athlete competes individually. |
| OUT_OF_COMP | The athlete competes outside the official competition standings. |

#### VerificationStatus
Defines the verification status of a referee assignment.

| Value | Description |
|--------|-------------|
| PENDING | Verification has not yet been completed. |
| APPROVED | The referee assignment has been verified and approved. |
| REJECTED | The referee assignment has been rejected. |

#### Relations
- related with **athletes** by `athlete_id`
- related with [competitions](#competitions) by `competition_id`
- related with **countries** by `country_id`
- related with **regions**) by `region_id`
- related with **cities** by `city_id`
- related with **organizations** by `sport_society_id`
- related with **organizations** by `club_id`
- related with **organizations** by `sport_school_id`
- related with **organizations** by `university_id`
- related with ➡ [competition_age_groups](configuration.md) by `competition_age_group_id`
- related with **sport_officials** by `trainer_1_id`
- related with **sport_officials** by `trainer_2_id`
- related with **sport_officials** by `trainer_3_id`
- related with **sport_officials** by `trainer_4_id`
- related with **weight_classes** by `weight_class_id`
- related with **groups_in_session** by `group_in_session_id`

#### Business Rules
- An athlete may be registered for the same competition only once within the same competition age group.
- Registration may include the athlete's represented country, region, city, and organizations.
- Up to four trainers may be assigned.
- The competition age group determines the available weight classes.
- Weight class and bodyweight may be assigned after weigh-in.
- A competition group and lot number may be assigned after registration.
- Online registrations are created with the `PENDING` verification status.
- Registrations created directly by a USER are automatically assigned the `APPROVED` status.
- Athletes with the `REJECTED` verification status are automatically removed after the nomination period closes.
- If both the `AthleteRegistrations` and `Athletes` records were created at the same time during online registration, both records are removed automatically.

---
