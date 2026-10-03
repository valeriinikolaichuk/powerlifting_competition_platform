export const UPDATE_COMPETITION_SQL = `
WITH existing_country AS (

    SELECT id
    FROM countries
    WHERE
        LOWER(name) = LOWER($3)
        AND language = $8::"Language"
        AND is_deleted = false
    LIMIT 1
),

new_country AS (

    INSERT INTO countries (
        id,
        name,
        scope,
        language,
        created_by_user_id,
        created_at,
        updated_at
    )
    SELECT
        gen_random_uuid(),
        $3,
        'USER'::"DataScope",
        $8::"Language",
        $7::uuid,
        $9::timestamp,
        $9::timestamp
    WHERE NOT EXISTS (
        SELECT 1 FROM existing_country
    )
    RETURNING id
),

country AS (

    SELECT id FROM existing_country

    UNION ALL

    SELECT id FROM new_country
),

existing_city AS (

    SELECT c.id
    FROM cities c
    WHERE
        LOWER(c.name) = LOWER($4)
        AND c.country_id = (
            SELECT id FROM country
        )
        AND c.language = $8::"Language"
        AND c.is_deleted = false
    LIMIT 1
),

new_city AS (

    INSERT INTO cities (
        id,
        country_id,
        name,
        scope,
        language,
        created_by_user_id,
        created_at,
        updated_at
    )
    SELECT
        gen_random_uuid(),
        (
            SELECT id FROM country
        ),
        $4,
        'USER'::"DataScope",
        $8::"Language",
        $7::uuid,
        $9::timestamp,
        $9::timestamp
    WHERE NOT EXISTS (
        SELECT 1 FROM existing_city
    )
    RETURNING id
),

city AS (

    SELECT id FROM existing_city

    UNION ALL

    SELECT id FROM new_city
)

UPDATE competitions
SET
    name = $2,
    city_id = (
        SELECT id FROM city
    ),
    start_date = $5,
    end_date = $6,
    updated_at = $9::timestamp
WHERE id = $1::uuid
  AND is_deleted = false;
`;