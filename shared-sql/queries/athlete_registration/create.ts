export const CREATE_ATHLETE_REGISTRATION_SQL = `
WITH new_athlete AS (
    INSERT INTO athletes (
        id,
        full_name,
        birth_day,
        birth_month,
        birth_year,
        sex,
        federation_id,
        created_by_user_id,
        scope,
        language,
        created_at,
        updated_at,
        is_deleted
    )
    SELECT
        $2::uuid,
        $31,
        $32::smallint,
        $33::smallint,
        $34::smallint,
        $35::"AthleteSex",
        $30::uuid,
        $28::uuid,
        'USER'::"DataScope",
        $27::"Language",
        $26::timestamp,
        $26::timestamp,
        false
    WHERE $29::boolean = true
    RETURNING id
),

athlete AS (
    SELECT $2::uuid AS id
    WHERE $29::boolean = false

    UNION ALL

    SELECT id FROM new_athlete
),

athlete_title AS (
    INSERT INTO athlete_titles (
        id,
        athlete_id,
        sport_titles,
        created_by_user_id,
        created_at,
        updated_at,
        is_deleted
    )
    SELECT
        gen_random_uuid(),
        athlete.id,
        NULLIF(TRIM($36), ''),
        $28::uuid,
        $26::timestamp,
        $26::timestamp,
        false
    FROM athlete
        ON CONFLICT (athlete_id, created_by_user_id)
        DO UPDATE SET
            sport_titles = EXCLUDED.sport_titles,
            updated_at = EXCLUDED.updated_at,
            is_deleted = false
    RETURNING id
),

existing_country AS (
    SELECT id
    FROM countries
    WHERE LOWER(TRIM(name)) = LOWER(TRIM($3))
        AND language = $27::"Language" 
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
        TRIM($3),
        'USER'::"DataScope",
        $27::"Language",
        $28::uuid,
        $26::timestamp,
        $26::timestamp
    WHERE NULLIF(TRIM($3), '') IS NOT NULL
        AND NOT EXISTS (SELECT 1 FROM existing_country)
    RETURNING id
),

country AS (
    SELECT id FROM existing_country
    UNION ALL
    SELECT id FROM new_country
),

existing_region AS (
    SELECT id
    FROM regions
    WHERE LOWER(TRIM(name)) = LOWER(TRIM($4))
        AND country_id = (SELECT id FROM country)
        AND language = $27::"Language"
        AND is_deleted = false
    LIMIT 1
),

new_region AS (
    INSERT INTO regions (
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
        (SELECT id FROM country),
        TRIM($4),
        'USER'::"DataScope",
        $27::"Language",
        $28::uuid,
        $26::timestamp,
        $26::timestamp
    WHERE NULLIF(TRIM($4), '') IS NOT NULL
        AND EXISTS (SELECT 1 FROM country)
        AND NOT EXISTS (SELECT 1 FROM existing_region)
    RETURNING id
),

region AS (
    SELECT id FROM existing_region
    UNION ALL
    SELECT id FROM new_region
),

existing_city AS (
    SELECT id
    FROM cities
    WHERE LOWER(TRIM(name)) = LOWER(TRIM($5))
        AND country_id = (SELECT id FROM country)
        AND region_id IS NOT DISTINCT FROM (SELECT id FROM region)
        AND language = $27::"Language"
        AND is_deleted = false
    LIMIT 1
),

new_city AS (
    INSERT INTO cities (
        id, 
        country_id, 
        region_id, 
        name,
        scope, 
        language, 
        created_by_user_id,
        created_at, 
        updated_at
    )
    SELECT
        gen_random_uuid(),
        (SELECT id FROM country),
        (SELECT id FROM region),
        TRIM($5),
        'USER'::"DataScope",
        $27::"Language",
        $28::uuid,
        $26::timestamp,
        $26::timestamp
    WHERE NULLIF(TRIM($5), '') IS NOT NULL
        AND EXISTS (SELECT 1 FROM country)
        AND NOT EXISTS (SELECT 1 FROM existing_city)
    RETURNING id
),

city AS (
    SELECT id FROM existing_city
    UNION ALL
    SELECT id FROM new_city
), 
        
organization_inputs AS (
    SELECT *
    FROM (
        VALUES
            (NULLIF(TRIM($6), ''), 'SPORT_SOCIETY'::"OrganizationType"),
            (NULLIF(TRIM($7), ''), 'CLUB'::"OrganizationType"),
            (NULLIF(TRIM($8), ''), 'SPORT_SCHOOL'::"OrganizationType"),
            (NULLIF(TRIM($9), ''), 'UNIVERSITY'::"OrganizationType")
    ) AS v(organization_code, type)
    WHERE organization_code IS NOT NULL
),

existing_organizations AS (
    SELECT
        o.id,
        o.organization_code,
        o.type
    FROM organizations o
    INNER JOIN organization_inputs oi
        ON oi.organization_code = o.organization_code
        AND oi.type = o.type
    WHERE o.is_deleted = false
),

new_organizations AS (
    INSERT INTO organizations (
        id,
        organization_code,
        type,
        language,
        scope,
        created_by_user_id,
        created_at,
        updated_at,
        is_deleted
    )
    SELECT
        gen_random_uuid(),
        oi.organization_code,
        oi.type,
        $27::"Language",
        'USER'::"DataScope",
        $28::uuid,
        $26::timestamp,
        $26::timestamp,
        false
    FROM organization_inputs oi
    WHERE NOT EXISTS (
        SELECT 1
        FROM existing_organizations eo
        WHERE eo.organization_code = oi.organization_code
            AND eo.type = oi.type
    )
    RETURNING id, organization_code, type
),

organization_ids AS (
    SELECT 
        id, 
        organization_code, 
        type
    FROM existing_organizations

    UNION ALL

    SELECT 
        id, 
        organization_code, 
        type
    FROM new_organizations
), 
        
trainer_inputs AS (
    SELECT *
    FROM (
        VALUES
            (1, NULLIF(TRIM($12), '')),
            (2, NULLIF(TRIM($13), '')),
            (3, NULLIF(TRIM($14), '')),
            (4, NULLIF(TRIM($15), ''))
    ) AS v(slot, full_name)
    WHERE full_name IS NOT NULL
),

trainer_names AS (
    SELECT
        LOWER(TRIM(full_name)) AS normalized_name,
        MIN(full_name) AS full_name
    FROM trainer_inputs
        GROUP BY LOWER(TRIM(full_name))
),

existing_trainers AS (
    SELECT DISTINCT ON (tn.normalized_name)
        so.id,
        tn.normalized_name
    FROM trainer_names tn
    INNER JOIN sport_officials so
        ON LOWER(TRIM(so.full_name)) = tn.normalized_name
    WHERE so.federation_id = $30::uuid
        AND so.language = $27::"Language"
        AND so.trainer_role = true
        AND so.is_deleted = false
    ORDER BY 
        tn.normalized_name, 
        so.created_at
),

new_trainers AS (
    INSERT INTO sport_officials (
        id,
        full_name,
        trainer_role,
        referee_role,
        federation_id,
        language,
        scope,
        created_by_user_id,
        created_at,
        updated_at,
        is_deleted
    )
    SELECT
        gen_random_uuid(),
        tn.full_name,
        true,
        false,
        $30::uuid,
        $27::"Language",
        'USER'::"DataScope",
        $28::uuid,
        $26::timestamp,
        $26::timestamp,
        false
    FROM trainer_names tn
    WHERE NOT EXISTS (
        SELECT 1
        FROM existing_trainers et
        WHERE et.normalized_name = tn.normalized_name
    )
    RETURNING id, full_name
),

trainer_ids AS (
    SELECT 
        id, 
        normalized_name
    FROM existing_trainers

    UNION ALL

    SELECT
        id,
        LOWER(TRIM(full_name)) AS normalized_name
    FROM new_trainers
),

trainer_slots AS (
    SELECT
        ti.slot,
        tids.id
    FROM trainer_inputs ti
    INNER JOIN trainer_ids tids
        ON tids.normalized_name = LOWER(TRIM(ti.full_name))
)

INSERT INTO athlete_registrations (
    id,
    athlete_id,

    country_id,
    region_id,
    city_id,

    sport_society_id,
    club_id,
    sport_school_id,
    university_id,
    competition_age_group_id,

    trainer_1_id,
    trainer_2_id,
    trainer_3_id,
    trainer_4_id,

    weight_class_id,
    group_order,
    lot,
    sport_rank_class,

    squat_nominated,
    bench_press_nominated,
    deadlift_nominated,
    total_nominated,
    status,
    qualification,

    created_at,
    updated_at,
    is_deleted
)
VALUES (
    $1::uuid, 
    $2::uuid, 
    (SELECT id FROM country),
    (SELECT id FROM region),
    (SELECT id FROM city),
    (SELECT id FROM organization_ids WHERE type = 'SPORT_SOCIETY'),
    (SELECT id FROM organization_ids WHERE type = 'CLUB'),
    (SELECT id FROM organization_ids WHERE type = 'SPORT_SCHOOL'),
    (SELECT id FROM organization_ids WHERE type = 'UNIVERSITY'),
    (SELECT id
        FROM competition_age_groups
        WHERE competition_id = $10::uuid
            AND federation_category_id = $11::uuid
            AND is_deleted = false
        LIMIT 1
    ),
    (SELECT id FROM trainer_slots WHERE slot = 1),
    (SELECT id FROM trainer_slots WHERE slot = 2),
    (SELECT id FROM trainer_slots WHERE slot = 3),
    (SELECT id FROM trainer_slots WHERE slot = 4),

    $16::uuid,
    $17, 
    $18,
    $19,

    $20::DECIMAL(4,1),
    $21::DECIMAL(4,1),
    $22::DECIMAL(4,1),
    $23::DECIMAL(5,1),
    $24::"AthleteRegistrationStatus",
    $25::"AthleteQualification",

    $26::timestamp, 
    $26::timestamp, 
    false
)
`;