export const ARCHIVE_COMPETITION_SQL = `
UPDATE competitions
SET
    status = 'ARCHIVED',
    archived_at = $2::timestamp,
    updated_at = $2::timestamp
WHERE id = $1::uuid
    AND is_deleted = false
    AND status = 'ACTIVE';
`;