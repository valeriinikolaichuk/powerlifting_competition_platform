import { Injectable } from '@angular/core';
import { PGlite } from '@electric-sql/pglite';

import { PgliteService } from '../../../../database/services/pglite.service';
import { AthleteCompetitionRow } from '../models/athlete-competition-row.interface';
import { UserService } from '../../../../shared/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AthleteTableOptionsService {

  private pg!: PGlite;
    
  constructor(
    private readonly pgliteService: PgliteService,
    private readonly userService: UserService,
  ) {
    this.pg = this.pgliteService.database;
  }

  async getWeightClasses(
    federationCategoryId: string
  ): Promise<{ id: string; name: string }[]> {

    const result = await this.pg.query<{
      id: string;
      name: string;
    }>(
      `
        SELECT id, name
        FROM weight_classes
        WHERE weight_class_group = (
          SELECT weight_class_group
          FROM federation_categories
          WHERE id = $1
        )
        ORDER BY weight_class
      `,
      [federationCategoryId],
    );

    return result.rows;  
  }

  async getAthletes(
    competitionId: string
  ): Promise<AthleteCompetitionRow[]> {

    const result = await this.pg.query<AthleteCompetitionRow>(
      `
        SELECT
          ar.id,
          a.full_name,
          a.birth_day,
          a.birth_month,
          a.birth_year,
          a.sport_titles AS titles,

          ag.name AS age_group,
          wc.name AS weight_class,

          ar.group_order,
          ar.lot,
          ar.sport_rank_class,

          co.name AS country,
          r.name AS region,
          c.name AS city,

          so.organization_code AS sport_society_code,
          cl.organization_code AS club_code,
          ss.organization_code AS sport_school_code,
          un.organization_code AS university_code,

          t1.full_name AS trener_1,
          t2.full_name AS trener_2,
          t3.full_name AS trener_3,
          t4.full_name AS trener_4,

          ar.squat_nominated,
          ar.bench_press_nominated,
          ar.deadlift_nominated,
          ar.total_nominated,

          ar.status,
          ar.qualification

        FROM athlete_registrations ar

        JOIN athletes a
          ON a.id = ar.athlete_id

        JOIN competition_age_groups cag
          ON cag.id = ar.competition_age_group_id

        JOIN federation_categories fc
          ON fc.id = cag.federation_category_id

        JOIN age_groups ag
          ON ag.id = fc.age_group_id

        LEFT JOIN weight_classes wc
          ON wc.id = ar.weight_class_id

        LEFT JOIN countries co
          ON co.id = ar.country_id

        LEFT JOIN regions r
          ON r.id = ar.region_id

        LEFT JOIN cities c
          ON c.id = ar.city_id

        LEFT JOIN organizations so
          ON so.id = ar.sport_society_id

        LEFT JOIN organizations cl
          ON cl.id = ar.club_id

        LEFT JOIN organizations ss
          ON ss.id = ar.sport_school_id

        LEFT JOIN organizations un
          ON un.id = ar.university_id

        LEFT JOIN sport_officials t1
          ON t1.id = ar.trainer_1_id

        LEFT JOIN sport_officials t2
          ON t2.id = ar.trainer_2_id

        LEFT JOIN sport_officials t3
          ON t3.id = ar.trainer_3_id

        LEFT JOIN sport_officials t4
          ON t4.id = ar.trainer_4_id

        WHERE ar.competition_id = $1
          AND ar.is_deleted = false
          AND a.is_deleted = false

        ORDER BY
          cag.sort_order,
          ar.group_order,
          ar.lot NULLS LAST
      `,
      [competitionId],
    );

    return result.rows;
  }

  async createAthleteRegistration(
    competitionId: string,
    athlete: Partial<AthleteCompetitionRow>,
    federationCategoryId: string,
    federationId: string,
    sex: 'MAN' | 'WOMAN',
    scope: string,
    language: string,
  ): Promise<void> {

    const userId = await this.userService.getUserId();

    const athleteId = crypto.randomUUID();

    
    const registrationId = crypto.randomUUID();

    await this.pg.transaction(async (tx) => {

      // 1. Find the competition age group.
      const ageGroupResult = await tx.query<{
        id: string;
      }>(
        `
          SELECT cag.id
          FROM competition_age_groups cag
          JOIN federation_categories fc
            ON fc.id = cag.federation_category_id
          WHERE cag.competition_id = $1
            AND fc.id = $2
        `,
        [competitionId, federationCategoryId],
      );

      const competitionAgeGroupId = ageGroupResult.rows[0]?.id;

      if (!competitionAgeGroupId) {
        throw new Error('Competition age group not found.');
      }

      // 2. Find existing athlete.
      const existingAthlete = await tx.query<{
        id: string;
      }>(
        `
          SELECT id
          FROM athletes
          WHERE full_name = $1
            AND birth_day IS NOT DISTINCT FROM $2
            AND birth_month IS NOT DISTINCT FROM $3
            AND birth_year IS NOT DISTINCT FROM $4
            AND sex = $5
            AND federation_id = $6
            AND is_deleted = false
          LIMIT 1
        `,
        [
          athlete.full_name?.trim(),
          athlete.birth_day || null,
          athlete.birth_month || null,
          athlete.birth_year || null,
          sex,
          federationId,
        ],
      );

let athleteId: string;

if (existingAthlete.rows.length > 0) {
  athleteId = existingAthlete.rows[0].id;
} else {
  athleteId = crypto.randomUUID();

      // 3. Create athlete.
      await tx.query(
        `
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
          VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
            NOW(), NOW(), false
          )
        `,
        [
          athleteId,
          athlete.full_name?.trim(),
          athlete.birth_day || null,
          athlete.birth_month || null,
          athlete.birth_year || null,
          sex,
          federationId,
          userId,
          scope,
          language,
        ],
      );

    }

      // 4. Create competition registration.
      await tx.query(
        `
          INSERT INTO athlete_registrations (
            id,
            athlete_id,
            competition_id,
            competition_age_group_id,
            weight_class_id,
            group_order,
            lot,
            country_id,
            region_id,
            city_id,
            sport_rank_class,
            sport_titles,
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
            $1, $2, $3, $4, $5,
            $6, $7, $8,
            $9, $10, $11, $12,
            $13, $14, $15, $16,
            $17, $18,
            NOW(), NOW(), false
          )
        `,
        [
          registrationId,
          athleteId,
          competitionId,
          competitionAgeGroupId,
          athlete.weight_class || null,
          athlete.group_order ?? 1,
          athlete.lot ?? null,
  //        athlete.country_id || null,
  //  athlete.region_id || null,
  //  athlete.city_id || null,
          athlete.sport_rank_class || null,
          athlete.titles || null,
          athlete.squat_nominated ?? null,
          athlete.bench_press_nominated ?? null,
          athlete.deadlift_nominated ?? null,
          athlete.total_nominated ?? null,
          athlete.status ?? 'TEAM',
          athlete.qualification ?? 'QUALIFIED',
        ],
      );
    });
  }
}
