### Configuration Tables
<details open="open">
<summary>Contents</summary>  

- [competition_age_groups](#competition_age_groups)
- [user_federations](#user_federations)

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

### Relations

- related with ➡ [competitions](competitions.md) by `competition_id`
- related with **federation_categories** by `federation_category_id`

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

### user_federations
Defines which federations are accessible to each user.
This table maps users to the federations they are allowed to work with.

#### Relations
- related with ➡ [**federations**](reference.md) by `federation_id`
- related with ➡ [**user**](business.md) by `created_by_user_id`

#### Business Rules
- A `USER` may have access to one or more federations.
- Access to federations is assigned by `ADMIN` users.
- Users can work only with federations assigned to them.
- The combination of `user_id` and `federation_id` must be `unique`.

---
