export const SET_NOMINATION_DATES_SQL = `
INSERT INTO nomination_status (
    id,
    competition_id,
    preliminary_date,
    final_date,
    status,
    updated_at
)
VALUES (
    gen_random_uuid(),
    $1::uuid,
    $2::date,
    $3::date,
    'PRELIMINARY',
    CURRENT_TIMESTAMP
)
ON CONFLICT (competition_id)
DO UPDATE SET
    preliminary_date = EXCLUDED.preliminary_date,
    final_date = EXCLUDED.final_date,
    updated_at = CURRENT_TIMESTAMP;
`;