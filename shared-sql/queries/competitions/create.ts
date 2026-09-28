export const CREATE_COMPETITION_SQL = `
WITH existing_country AS (

    SELECT id
    FROM countries
    WHERE
        LOWER(name) = LOWER($4) 
        AND language = $6::"Language"
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
        $4,
        'USER'::"DataScope",
        $6::"Language",
        $2::uuid,
        $13::timestamp,
        $13::timestamp
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
        LOWER(c.name) = LOWER($5)
        AND c.country_id = (
            SELECT id FROM country
        )
        AND c.language = $6::"Language"
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
        $5,
        'USER'::"DataScope",
        $6::"Language",
        $2::uuid,
        $13::timestamp,
        $13::timestamp
    WHERE NOT EXISTS (
        SELECT 1 FROM existing_city
    )
    RETURNING id
),

city AS (

    SELECT id FROM existing_city

    UNION ALL

    SELECT id FROM new_city
),

new_competition AS (

    INSERT INTO competitions (
        id,
        created_by_user_id,
        name,
        city_id,
        start_date,
        end_date,
        competition_level,
        type,
        division,
        status,
        created_at,
        updated_at
    )
    VALUES (
        $1::uuid,
        $2::uuid,
        $3,
        (
            SELECT id FROM city
        ),
        $7,
        $8,
        $9::"CompetitionLevel",
        $10::"CompetitionType",
        $11::"CompetitionDivision",
        'ACTIVE',
        $13::timestamp,
        $13::timestamp
    )
    RETURNING id
)

INSERT INTO competition_age_groups (
    id,
    competition_id,
    federation_category_id,
    sort_order,
    team_scoring_limit,
    team_scoring_method,
    created_at,
    updated_at
)

SELECT
    gen_random_uuid(),
    nc.id,
    fc.id,
    ROW_NUMBER() OVER (
        ORDER BY array_position(
            $12::uuid[], 
            fc.id
        )
    ),
    fc.default_team_scoring_limit,
    'BEST_POINTS',
    $13::timestamp,
    $13::timestamp

FROM new_competition nc

JOIN federation_categories fc
    ON fc.id = ANY(
        $12::uuid[]
    );
`;