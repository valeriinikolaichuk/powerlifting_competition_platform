import { Injectable } from '@angular/core';
import { PGlite } from '@electric-sql/pglite';

import { PgliteService } from '../../../../database/services/pglite.service';
import type { AthleteCompetitionRow } from '#shared-sql';
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
          ar.athlete_id,

          a.full_name,
          a.birth_day,
          a.birth_month,
          a.birth_year,
          at.sport_titles AS titles,

          cag.federation_category_id AS federation_category_id,
          ag.name AS age_group,
          ar.weight_class_id AS category_id,
          wc.name AS weight_class,

          ar.group_order,
          ar.lot,
          ar.sport_rank_class,

          ar.country_id,
          co.name AS country,
          ar.region_id,
          r.name AS region,
          ar.city_id,
          c.name AS city,

          ar.sport_society_id,
          so.organization_code AS sport_society_code,
          ar.club_id,
          cl.organization_code AS club_code,
          ar.sport_school_id,
          ss.organization_code AS sport_school_code,
          ar.university_id,
          un.organization_code AS university_code,

          ar.trainer_1_id,
          t1.full_name AS trainer_1,
          ar.trainer_2_id,
          t2.full_name AS trainer_2,
          ar.trainer_3_id,
          t3.full_name AS trainer_3,
          ar.trainer_4_id,
          t4.full_name AS trainer_4,

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

        JOIN competitions comp
          ON comp.id = cag.competition_id

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

        LEFT JOIN athlete_titles at
          ON at.athlete_id = ar.athlete_id
          AND at.created_by_user_id = comp.created_by_user_id
          AND at.is_deleted = false

        WHERE cag.competition_id = $1
          AND cag.is_deleted = false
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

}
