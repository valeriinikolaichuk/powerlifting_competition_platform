### Calculated Tables

---

### organization_results
Stores the final team results for each competition organization within a competition age group.  
The table is generated from `athlete_registrations`, `competition_organizations`, `competition_age_groups`, and the calculated competition results after all individual athlete results have been finalized.

| Column | Description |
|--------|-------------|
| id | Unique record identifier |
| competition_organization_id | Competition organization |
| competition_age_group_id | Competition age group |
| total_points | Total team points |
| weight_points | Total weight points used for tie-breaking |
| place | Final team placing |
| updated_at | Record update timestamp |
| is_deleted | Soft delete flag |

#### Relations
- related with **competition_organizations** by `competition_organization_id`
- related with **competition_age_groups** by `competition_age_group_id`

#### Constraints
- `UNIQUE (competition_organization_id, competition_age_group_id)`

#### Indexes
- `INDEX (competition_age_group_id)`

#### Business Rules
- One record exists for each competition organization within a competition age group.
- Team results are calculated using the competition's configured team scoring rules.
- `total_points` stores the total points earned by the organization.
- `weight_points` stores the total weight points used as a tie-breaker when organizations have equal team points.
- `place` stores the final team placing.
- The table is recalculated when team results are requested by the UI.
- The table is recalculated again during competition finalization to store the final official standings.
