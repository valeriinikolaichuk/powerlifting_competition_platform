### Competition Runtime Tables
<details open="open">
<summary>Contents</summary>

- [athlete_lifts](#athlete_lifts)

</details>

---

### athlete_lifts
Stores the dynamic competition data for an athlete registration.  
Each athlete registration has one record for each competition lift (`SQUAT`, `BENCH_PRESS`, or `DEADLIFT`).  
This table extends `athlete_registrations` by storing lift attempts, competition results, calculated rankings, points, and coefficients that are updated during the competition.

| Column | Description |
|--------|-------------|
| id | Unique record identifier |
| athlete_registration_id | Athlete registration |
| lift_type | Competition lift (`LiftType` enum) |
| attempt_1_requested | Requested weight for the first attempt |
| attempt_1_result | Completed weight for the first attempt |
| attempt_1_status | Status of the first attempt (`AttemptStatus` enum) |
| attempt_2_requested | Requested weight for the second attempt |
| attempt_2_result | Completed weight for the second attempt |
| attempt_2_status | Status of the second attempt (`AttemptStatus` enum) |
| attempt_3_requested | Requested weight for the third attempt |
| attempt_3_result | Completed weight for the third attempt |
| attempt_3_status | Status of the third attempt (`AttemptStatus` enum) |
| attempt_4_requested | Requested weight for the fourth attempt (if granted) |
| attempt_4_result | Completed weight for the fourth attempt |
| attempt_4_status | Status of the fourth attempt (`AttemptStatus` enum) |
| best_attempt | Best successful attempt |
| best_attempt_predicted | Predicted best attempt |
| lift_coefficient | Calculated lift coefficient |
| lift_coefficient_predicted | Predicted lift coefficient |
| lift_place | Final place in the lift |
| lift_place_predicted | Predicted place in the lift |
| lift_points | Final points awarded for the lift |
| lift_points_predicted | Predicted points for the lift |
| best_discipline_place | Final place among all disciplines |
| best_discipline_place_predicted | Predicted place among all disciplines |
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

#### AttemptStatus
Defines the status of a competition attempt.

| Value | Description |
|--------|-------------|
| REQUESTED | The attempt has been declared but has not yet been performed. |
| GOOD_LIFT | The attempt was successful. |
| NO_LIFT | The attempt was unsuccessful. |
| WITHDRAWN | The athlete was withdrawn from the competition by the competition doctor before performing the attempt. |

#### Relations
- related with **athlete_registrations** by `athlete_registration_id`

#### Business Rules
- Each record represents one competition lift (`SQUAT`, `BENCH_PRESS`, or `DEADLIFT`).
- Each athlete registration may have only one record for each lift type.
- Each lift stores up to four attempts.
- Attempts 1–3 represent the regular competition attempts.
- Attempt 4 is reserved for special cases permitted by the Technical Rules (for example, when an additional attempt is granted due to an official technical error, such as an incorrectly loaded barbell).
- Only one record for each `lift_type` is allowed per athlete registration.
- Requested and completed attempts are stored separately.
- Predicted values are used before the competition results are finalized.
- Final values are calculated from completed attempts.
- This table stores dynamic competition data, while `athlete_registrations` stores the static registration data.


