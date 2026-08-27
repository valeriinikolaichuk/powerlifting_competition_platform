### Configuration Tables
<details open="open">
<summary>Contents</summary>  

- [competition_age_groups](#competition_age_groups)
  - [TeamScoringMethod enum](#teamscoringmethod-enum)
- [nomination_status](#nomination_status)
  - [NominationStatusType enum](#nominationstatustype-enum)
- [competition_sessions](#competition_sessions)
  - [CompetitionSessionStatus enum](#competitionsessionstatus-enum)
- [groups_in_session](#groups_in_session)
- [weight_classes_in_group](#weight_classes_in_group)
- [referee_competition](#referee_competition)
- [referee_nominations](#referee_nominations)
  - [VerificationStatus enum](#verificationstatus)
- [referee_competition_roles](#referee_competition_roles)

</details>

---

### competition_age_groups
Stores the age groups included in a competition.  
Each record references a federation category and contains competition-specific team scoring settings.

| Field | Description |
|------|-------------|
| id | Unique record identifier |
| competition_id | Competition |
| federation_category_id | Federation category used as the template |
| sort_order | Display order within the competition |
| team_scoring_limit | Maximum number of athlete results counted for team scoring. `NULL` when `ALL_POINTS` is used |
| team_scoring_method | Team scoring method (`TeamScoringMethod` enum) |
| created_at | Record creation timestamp |
| updated_at | Record update timestamp |
| is_deleted | Soft delete flag |

#### Relations

- related with ➡ [competitions](competition.md#competitions) by `competition_id`
- related with ➡ [federation_categories](reference.md#federation_categories) by `federation_category_id`
- related with ➡ [athlete_registrations](competition.md#athlete_registrations)
- related with ➡ [athlete_nominations](competition.md#athlete_nominations)
- related with ➡ [organization_results](calculated.md)

#### TeamScoringMethod enum
Defines how team scores are calculated.

| Value | Description |
|--------|-------------|
| BEST_POINTS | Only the specified number of best athlete results are counted. |
| ALL_POINTS | All athlete results are counted. |

#### Business Rules
- A competition may contain one or more age groups.
- Age groups can only be selected from `federation_categories`.
- Each federation category can be added only once to the same competition.
- When a record is created:
  - `team_scoring_limit` is initialized from `FederationCategories.default_team_scoring_limit`.
  - `team_scoring_method` is initialized as `BEST_POINTS`.
- If `team_scoring_method` is changed to `ALL_POINTS`, `team_scoring_limit` must be set to `NULL`.
- Team scoring settings can be modified independently for each competition without affecting federation defaults.

---

### nomination_status
Stores the current nomination stage of a competition.  
Each competition has a single nomination status record that is updated as the nomination process progresses.

| Field | Description |
|------|-------------|
| id | Unique record identifier |
| competition_id | Competition |
| preliminary_date | Preliminary nomination date |
| final_date | Final nomination date |
| status | Nomination stage ([NominationStatusType enum](#nominationstatustype-enum)) |
| created_at | Record creation timestamp |
| updated_at | Record update timestamp |

#### Relations

- related with ➡ [**competitions**](competition.md#competitions) by `competition_id`

#### NominationStatusType enum
- `PRELIMINARY`
- `FINAL`
- `CLOSED`

#### Business Rules
- Each competition has exactly one nomination status record.
- The nomination process progresses through the following stages:
  - `PRELIMINARY`
  - `FINAL`
  - `CLOSED`
- The current stage is stored in `status`.
- `competition_id` must be unique.

---

### competition_sessions
Stores the competition sessions.  
Each session belongs to a competition and represents a group of weight classes processed together.

| Field | Description |
|------|-------------|
| id | Unique session identifier |
| competition_id | Competition |
| name | Session name |
| start_date | Session start date and time |
| end_of_weighing_in | End of the weigh-in period |
| status | Session status ([CompetitionSessionStatus enum](#competitionsessionstatus-enum)) |
| updated_at | Record update timestamp |
| is_deleted | Soft delete flag |

#### Relations
- related with ➡ [**competitions**](competition.md#competitions) by `competition_id`
- related with [groups_in_session](#groups_in_session)
- related with [referee_competition_roles](#referee_competition_roles)
- related with [global_state](system_runtime.md#global_state)

#### CompetitionSessionStatus enum
- `CREATED`
- `READY`

#### Business Rules
- Stores the list of competition sessions.
- Session names must be unique within a competition.
- The session name typically contains the weight classes included in the session (for example: `56 | 60 | 67,5 | 75 | 82,5`).
- `end_of_weighing_in` marks the end of the weigh-in period.
- Once `end_of_weighing_in` is set, users with the `WEIGHING_IN` role can no longer modify weigh-in data for the session.
- Setting the session status to `READY` also blocks users with the `WEIGHING_IN` role, even if `end_of_weighing_in` has not been set.

---

### groups_in_session
Stores the groups within a competition session.  
Each group belongs to a single competition session and defines the order in which athletes compete.

| Field | Description |
|------|-------------|
| id | Unique group identifier |
| competition_session_id | Competition session |
| name | Group name |
| order | Display and processing order within the session |
| updated_at | Record update timestamp |
| is_deleted | Soft delete flag |

#### Relations

- related with [competition_sessions](#competition_sessions) by `competition_session_id`
- related with [weight_classes](reference.md#weight_classes)
- related with [athlete_registrations](competition.md#athlete_registrations)
- related with [global_state](system_runtime.md#global_state)

#### Business Rules
- Stores the list of groups within a competition session.
- Group names must be unique within a session.
- Group order must be unique within a session.
- The group name typically contains the weight classes and the group identifier (for example: `56 | 60 | 67,5 | 1grp`).

---

### weight_classes_in_group
Stores the weight classes assigned to a group within a competition session.  
This table links `GroupsInSession` with `WeightClasses`.  

| Field | Description |
|------|-------------|
| id | Unique record identifier |
| groups_in_session_id | Group within a competition session |
| weight_class_id | Weight class |
| updated_at | Record update timestamp |
| is_deleted | Soft delete flag |

#### Relations
- related with [groups_in_session](#groups_in_session) by `groups_in_session_id`
- related with [weight_classes](reference.md#weight_classes) by `weight_class_id`

#### Business Rules
- Stores the list of weight classes assigned to a group.
- A weight class can be assigned only once to the same group.
- If a competition uses parallel platforms or parallel groups, identical weight classes may be assigned to multiple groups by creating separate records.
- The user interface displays a merged list of unique weight classes, while the system maintains separate group assignments internally.

---

### referee_competition
Stores the referees assigned to a competition.  
Each record links a sport official to a competition, specifies the referee category.

| Field | Description |
|------|-------------|
| id | Unique record identifier |
| competition_id | Competition |
| referee_id | Assigned sport official |
| referee_category_id | Referee qualification category |
| country_id | Country represented by the referee (optional) |
| region_id | Region represented by the referee (optional) |
| city_id | City represented by the referee (optional) |
| created_at | Record creation timestamp |
| updated_at | Record update timestamp |
| is_deleted | Soft delete flag |

### Relations

- related with ➡ [**competitions**](competition.md#competitions) by `competition_id`
- related with ➡ [**sport_officials**](reference.md#sport_officials) by `referee_id`
- related with ➡ [**referee_categories**](reference.md#referee_categories) by `referee_category_id`
- related with ➡ [**countries**](reference.md#countries) by `country_id`
- related with ➡ [**regions**](reference.md#regions) by `region_id`
- related with ➡ [**cities**](reference.md#cities) by `city_id`
- related with ➡ [**referee_competition_roles**](#referee_competition_roles)

#### Business Rules
- A referee may be assigned to multiple competitions.
- A competition may have multiple referees.
- A referee can only be assigned once to the same competition.
- The referee category is selected from `referee_categories`.
- Country, region, and city may be specified when applicable.

---

### referee_nominations
Stores online referee applications for participation in a competition before they are reviewed and approved.  
A nomination may reference an existing referee using `referee_id`, or contain the referee's information directly if the referee does not yet exist in the database.

After approval, the nomination can be used to create a [referee_competition](#referee_competition) record.  
New assignments are created with the `PENDING` verification status by default.  

|Column	|Type	|NULL	|Description |
|-------|-----|-----|------------|
| id	|UUID	|No	|Unique nomination identifier|
| competition_id	|UUID	|No	|Competition for which the nomination was submitted|
| referee_id	|UUID	|Yes	|Existing referee identifier|
| full_name	|TEXT	|Yes	|Referee's full name submitted in the nomination|
| referee_category_id	|UUID	|No	|Referee category|
| country_id	|UUID	|Yes	|Existing country identifier|
| country_name	|TEXT	|Yes	|Country name submitted in the nomination|
| region_id	|UUID	|Yes	|Existing region identifier|
| region_name	|TEXT	|Yes	|Region name submitted in the nomination|
| city_id	|UUID	|Yes	|Existing city identifier|
| city_name	|TEXT	|Yes	|City name submitted in the nomination|
| verification_status	|[VerificationStatus](#verificationstatus)	|No	|Nomination verification status|
| created_by_participant_id	|UUID	|No	|Participant who submitted the nomination|
| created_at	|TIMESTAMP	|No	|Creation timestamp|
| updated_at	|TIMESTAMP	|No	|Last update timestamp|
| is_deleted	|BOOLEAN	|No	|Indicates whether the nomination has been logically deleted|

### Relations
* related with ➡ [**competitions**](competition.md#competitions) by `competition_id`
* related with ➡ [**sport_officials**](reference.md#sport_officials) by `referee_id`
* related with ➡ [**referee_categories**](reference.md#referee_categories) by `referee_category_id`
* related with ➡ [**countries**](reference.md#countries) by `country_id`
* related with ➡ [**regions**](reference.md#regions) by `region_id`
* related with ➡ [**cities**](reference.md#cities) by `city_id`
* related with ➡ [**participants**](user.md#participants) by `created_by_participant_id`


#### VerificationStatus
Defines the verification status of a referee assignment.

| Value | Description |
|--------|-------------|
| PENDING | Verification has not yet been completed. |
| APPROVED | The referee assignment has been verified and approved. |
| REJECTED | The referee assignment has been rejected. |

---

### referee_competition_roles
Stores referee role assignments for individual competition sessions.  
Each record assigns a role to a referee participating in a specific competition session.  

| Field | Description |
|------|-------------|
| id | Unique record identifier |
| competition_session_id | Competition session |
| referee_competition_id | Competition referee assignment |
| referee_role_id | Assigned referee role |
| created_at | Record creation timestamp |
| updated_at | Record update timestamp |
| is_deleted | Soft delete flag |

#### Relations
- related with [competition_sessions](#competition_sessions) by `competition_session_id`
- related with [referee_competition](#referee_competition) by `referee_competition_id`
- related with ➡ [**referee_roles**](reference.md#referee_roles) by `referee_role_id`

#### Business Rules
- A referee may perform different roles in different competition sessions.
- Each role assignment belongs to a single competition session.
- Referee roles are selected from `RefereeRoles`.

---
