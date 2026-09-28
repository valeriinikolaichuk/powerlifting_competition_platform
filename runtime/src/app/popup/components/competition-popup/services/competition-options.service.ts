import { Injectable } from '@angular/core';
import { PGlite } from '@electric-sql/pglite';
import { PgliteService } from '../../../../database/services/pglite.service';

import { 
  FederationOption, 
  DivisionOption, 
  AgeGroupOption,  
} from '../dto/competition-options.dtos';

@Injectable({
  providedIn: 'root',
})
export class CompetitionOptionsService {
  
  private pg!: PGlite;
  
  constructor(
    private readonly pgliteService: PgliteService,
  ) {
    this.pg = this.pgliteService.database;
  }

  async getCountrySuggestion(value: string): Promise<string | null> {
    const result = await this.pg.query<{ name: string }>(
      `
        SELECT name
        FROM countries
        WHERE name ILIKE $1
          AND is_deleted = false
        ORDER BY name ASC
        LIMIT 1
      `,
      [`${value}%`],
    );

    return result.rows[0]?.name ?? null;
  }

  async getCitySuggestion(value: string): Promise<string | null> {
    const result = await this.pg.query<{ name: string }>(
      `
        SELECT name
        FROM cities
        WHERE name ILIKE $1
          AND is_deleted = false
        ORDER BY name ASC
        LIMIT 1
      `,
      [`${value}%`],
    );

    return result.rows[0]?.name ?? null;
  }

  async getFederations(): Promise<FederationOption[]> {

    const result = await this.pg.query<FederationOption>(
      `
        SELECT
          f.id,
          f.federation_code AS code
        FROM user_federations uf
        JOIN federations f
          ON f.id = uf.federation_id
        ORDER BY f.federation_code
      `);

    return result.rows;
  }

  async getDivisions(
    federationId: string,
  ): Promise<DivisionOption[]> {

    const result = await this.pg.query<DivisionOption>(
      `
        SELECT
          division,
          name
        FROM federation_divisions
        WHERE federation_id = $1
        ORDER BY sort_order
      `,
      [federationId],
    );

    return result.rows;
  }

  async getAgeGroups(
    federationId: string,
    sex: string,
  ): Promise<AgeGroupOption[]> {

    const result = await this.pg.query<AgeGroupOption>(
      `
        SELECT
          fc.id,
          ag.name,
          ag.sex,
          f.federation_code
        FROM federation_categories fc
        JOIN age_groups ag
          ON ag.id = fc.age_group_id
        JOIN federations f
          ON f.id = fc.federation_id
        WHERE
          fc.federation_id = $1
          AND ag.sex = $2
        ORDER BY fc.sort_order
      `,
      [
        federationId,
        sex,
      ],
    );

    return result.rows;
  }
}
