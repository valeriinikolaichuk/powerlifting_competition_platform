export const SET_NOMINATION_DATES_SQL = `
INSERT INTO nomination_status (
    id,
    competition_id,
    preliminary_date,
    final_date
)
VALUES (
    gen_random_uuid(),
    $1,
    $2,
    $3
)
ON CONFLICT (competition_id)
DO UPDATE SET
    preliminary_date = EXCLUDED.preliminary_date,
    final_date = EXCLUDED.final_date,
    updated_at = CURRENT_TIMESTAMP
`;