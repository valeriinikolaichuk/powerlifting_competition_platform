export type AthleteCellValue = string | number | boolean | null | undefined;

export interface AthleteCompetitionRow {
    [key: string]: AthleteCellValue;
    id: string;
    athlete_id?: string | null;
    
    full_name?: string | null;
    birth_day?: number | null;
    birth_month?: number | null;
    birth_year?: number | null;

    titles?: string | null;

    federation_category_id?: string | null;
    age_group?: string | null;

    category_id?: string | null;
    weight_class?: string | null;

    group_order?: number | null;
    lot?: number | null;
    sport_rank_class?: string | null;

    country_id?: string | null;
    country?: string | null;
    region_id?: string | null;
    region?: string | null;
    city_id?: string | null;
    city?: string | null;

    sport_society_id?: string | null;
    sport_society_code?: string | null;
    club_id?: string | null;
    club_code?: string | null;
    sport_school_id?: string | null;
    sport_school_code?: string | null;
    university_id?: string | null;
    university_code?: string | null;

    trainer_1_id?: string | null;
    trainer_1?: string | null;
    trainer_2_id?: string | null;
    trainer_2?: string | null;
    trainer_3_id?: string | null;
    trainer_3?: string | null;
    trainer_4_id?: string | null;
    trainer_4?: string | null;

    squat_nominated?: number | null;
    bench_press_nominated?: number | null;
    deadlift_nominated?: number | null;
    total_nominated?: number | null;
    status: string | null;
    qualification: string | null;
}

export interface AthleteChange {

    data: AthleteCompetitionRow;
    sex: string;
    federation_id: string;
    language: string;
    updated_at: string;
    competition_id: string;
    createAthlete: boolean;
    updateBirthDate: boolean;
}
