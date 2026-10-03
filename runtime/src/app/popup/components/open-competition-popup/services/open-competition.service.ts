import { Injectable } from '@angular/core';
import { PGlite } from '@electric-sql/pglite';

import { PgliteService } from '../../../../database/services/pglite.service';
import { UserService } from '../../../../services/shared/user.service';
import { CompetitionListItem } from '../dto/competition-list-item';
import { Competition } from '../dto/competition.dto';

@Injectable({
  providedIn: 'root',
})
export class OpenCompetitionService {
    
  private pg!: PGlite;
  
  constructor(
    private readonly pgliteService: PgliteService,
    private readonly userService: UserService,
  ) {
    this.pg = this.pgliteService.database;
  }

  async getCompetitions(): Promise<CompetitionListItem[]> {

    const userId = await this.userService.getUserId();

    const result = await this.pg.query<CompetitionListItem>(
      `
        SELECT
          id,
          name
        FROM competitions
        WHERE created_by_user_id = $1
          AND is_deleted = false
          AND status = 'ACTIVE'
        ORDER BY start_date
      `,
      [userId],
    );

    return result.rows;
  }

  async getCompetitionData(id: string): Promise<Competition> {

    const result = await this.pg.query<Competition>(
      `
        SELECT
          c.id,
          c.start_date,
          c.end_date,
          c.competition_level,
          c.type,

          c.name AS competition_name,
          ci.name AS city,
          co.name AS country,
          f.id AS federation_id,
          f.federation_code AS federation_code,
          fd.name AS division_name,

          COALESCE(
            jsonb_agg(
              jsonb_build_object(
                'id', ag.id,
                'name', ag.name,
                'sex', ag.sex,
                'federation_category_id', cag.federation_category_id
              )
            ) FILTER (WHERE ag.id IS NOT NULL),
            '[]'::jsonb
          ) AS age_groups

        FROM competitions AS c

        JOIN cities AS ci
          ON ci.id = c.city_id
        JOIN countries AS co
          ON co.id = ci.country_id

        LEFT JOIN competition_age_groups AS cag
          ON cag.competition_id = c.id
          AND cag.is_deleted = false
        LEFT JOIN federation_categories AS fc
          ON fc.id = cag.federation_category_id
        LEFT JOIN federations AS f
          ON f.id = fc.federation_id
        LEFT JOIN age_groups AS ag
          ON ag.id = fc.age_group_id
        LEFT JOIN federation_divisions AS fd
          ON fd.federation_id = fc.federation_id
          AND fd.division = c.division

        WHERE c.id = $1
          AND c.is_deleted = false
          AND ci.is_deleted = false
          AND co.is_deleted = false

        GROUP BY
          c.id,
          c.start_date,
          c.end_date,
          c.competition_level,
          c.type,
          c.name,
          ci.name,
          co.name,
          f.id,
          f.federation_code,
          fd.name
      `,
      [id],
    );

    return result.rows[0];
  }
}
