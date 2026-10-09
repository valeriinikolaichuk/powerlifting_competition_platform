export const UPDATE_NOMINATION_STATUS_SQL = `
UPDATE nomination_status ns
SET
    status = CASE
        WHEN CURRENT_TIMESTAMP >= c.start_date
            THEN 'CLOSED'

        WHEN ns.final_date IS NOT NULL
              AND CURRENT_TIMESTAMP >= ns.final_date
            THEN 'CLOSED'

        WHEN ns.preliminary_date IS NOT NULL
              AND CURRENT_TIMESTAMP >= ns.preliminary_date
            THEN 'FINAL'

        ELSE ns.status
    END,
    updated_at = CURRENT_TIMESTAMP
FROM competitions c
WHERE ns.competition_id = c.id
  AND ns.competition_id = $1
`;