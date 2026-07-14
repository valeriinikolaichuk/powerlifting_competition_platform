### Competition Runtime Tables
<details open="open">
<summary>Contents</summary>

- [athlete_lifts](#athlete_lifts)
- [competition_results](#competition_results)

[Competition Result Calculation Flow](#competition-result-calculation-flow)
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

---

### competition_results
Stores the aggregated competition results for an athlete registration.  
This table extends `athlete_registrations` by storing the final and predicted overall competition results calculated from the corresponding `athlete_lifts` records.

| Column | Description |
|--------|-------------|
| id | Unique record identifier |
| athlete_registration_id | Athlete registration |
| total | Final total |
| total_predicted | Predicted total |
| total_coefficient | Final competition coefficient |
| total_coefficient_predicted | Predicted competition coefficient |
| overall_place | Final overall placing |
| overall_place_predicted | Predicted overall placing |
| overall_points | Final overall points |
| overall_points_predicted | Predicted overall points |
| best_lifter_place | Final Best Lifter placing |
| best_lifter_place_predicted | Predicted Best Lifter placing |
| updated_at | Record update timestamp |
| is_deleted | Soft delete flag |

#### Relations

- related with **athlete_registrations** by `athlete_registration_id`

#### Business Rules
- One record exists for each athlete registration.
- Stores the aggregated competition results calculated from `athlete_lifts`.
- Predicted values are calculated while the competition is in progress.
- Final values are calculated after all competition lifts have been completed.
- This table stores dynamic competition data, while `athlete_registrations` stores the static registration data.

---

### Competition Result Calculation Flow
Competition results are calculated entirely by the application logic. No database triggers or stored procedures are used.

#### Input
The UI submits the following data:
- `competition_id`
- `athlete_registration_id`
- `AthleteLifts.id` (The system determines the corresponding: `SQUAT`, `BENCH_PRESS`, `DEADLIFT`)
- `attempt_N_requested` / `attempt_N_result`
- `attempt_N_status` (`REQUESTED`, `GOOD_LIFT` `NO_LIFT`)
- `AthleteRegistrations.status` (`TEAM`, `PERSONALLY`, `OUT_OF_COMP`)
- attempt (`1`, `2`, `3`, `4`)

#### Step 1. Update `athlete_lifts`
The athlete's attempt result and attempt status is stored in the corresponding [athlete_lifts](#athlete_lifts) record.

The system then retrieves all attempts for the current lift from [athlete_lifts](#athlete_lifts) together with the athlete coefficient from `AthleteRegistrations.athlete_coefficient` and recalculates:
- `best_attempt`
- `best_attempt_predicted`
- `lift_coefficient`
- `lift_coefficient_predicted`

The calculated values are written back to [athlete_lifts](#athlete_lifts).

#### Step 2. Update `competition_results`
The system retrieves the best attempts for all competition lifts (`SQUAT`, `BENCH_PRESS`, `DEADLIFT`) from [athlete_lifts](#athlete_lifts) for the current athlete and recalculates:

- `total`
- `total_predicted`
- `total_coefficient`
- `total_coefficient_predicted`

The calculated values are written to [competition_results](#competition_results).

#### Step 3. Update Lift Rankings
If `AthleteRegistrations.status` == `TEAM` or `PERSONALLY` the system retrieves the athlete's `weight_class_id` from `athlete_registrations`.  
Then retrieves the best lift results for all athletes in the same weight class and for the current lift from [athlete_lifts](#athlete_lifts).  
The athletes are sorted according to the competition rules. Based on the sorted order, the system assigns places and calculates the corresponding competition points using the configured scoring table.

The following fields are updated for every athlete in the weight class:
- `lift_place`
- `lift_place_predicted`
- `lift_points`
- `lift_points_predicted`

The calculated values are written back to [athlete_lifts](#athlete_lifts).

#### Step 4. Update Overall Rankings
The system retrieves the calculated totals for all athletes in the same weight class from [competition_results](#competition_results).  
The athletes are sorted according to the competition rules. Based on the sorted order, the system assigns overall places and calculates the corresponding competition points using the configured scoring table.

The following fields are updated for every athlete in the weight class:
- `overall_place`
- `overall_place_predicted`
- `overall_points`
- `overall_points_predicted`

The calculated values are written back to [competition_results](#competition_results).

### Step 5. Update Best Discipline Rankings

The system retrieves the calculated lift coefficients for all athletes participating in the competition for the current lift from [athlete_lifts](#athlete_lifts).

The athletes are sorted by lift coefficient in descending order according to the competition rules.

Based on the sorted order, the system assigns:

- `best_discipline_place`
- `best_discipline_place_predicted`

The calculated values are written back to [athlete_lifts](#athlete_lifts).

#### Step 6. Update Best Lifter Rankings
The system retrieves the calculated total coefficients for all athletes participating in the competition from [competition_results](#competition_results).  
The athletes are sorted by total coefficient in descending order according to the competition rules.

Based on the sorted order, the system assigns:
- `best_lifter_place`
- `best_lifter_place_predicted`

The calculated values are written back to [competition_results](#competition_results).

#### Step 7. Return Updated Data
After all calculations have been completed successfully, the API returns all updated records to the UI.  

All calculations and database updates are executed within a single transaction to ensure data consistency.
