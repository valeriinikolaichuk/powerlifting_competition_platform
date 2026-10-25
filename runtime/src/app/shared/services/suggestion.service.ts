import { Injectable } from '@angular/core';
import { PGlite } from '@electric-sql/pglite';

import { PgliteService } from '../../database/services/pglite.service';
import { OrganizationType } from './types/organization-type';

@Injectable({
  providedIn: 'root',
})
export class SuggestionService {

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

  async getRegionSuggestion(value: string): Promise<string | null> {

    const result = await this.pg.query<{ name: string }>(
      `
        SELECT name
        FROM regions
        WHERE name ILIKE $1
          AND is_deleted = false
        ORDER BY name ASC
        LIMIT 1
      `,
      [`${value}%`],
    );

    return result.rows[0]?.name ?? null;
  }

  async getCitySuggestion(
    value: string,
    countryName?: string,
  ): Promise<string | null> {
    const result = await this.pg.query<{ name: string }>(
      `
        SELECT ci.name
        FROM cities ci
        JOIN countries co ON co.id = ci.country_id
        WHERE ci.name ILIKE $1
          AND ci.is_deleted = false
          AND co.is_deleted = false
          AND ($2 = '' OR co.name ILIKE $2)
        ORDER BY ci.name ASC
        LIMIT 1
      `,
      [
        `${value}%`, 
        countryName ? countryName : '',
      ],
    );
  
    return result.rows[0]?.name ?? null;
  }

  async getCityByRegionSuggestion(
    value: string,
    regionName: string,
  ): Promise<string | null> {
        const result = await this.pg.query<{ name: string }>(
        `
            SELECT ci.name
            FROM cities ci
            LEFT JOIN regions r
                ON r.id = ci.region_id
                AND r.is_deleted = false
            WHERE ci.name ILIKE $1
              AND ci.is_deleted = false
              AND (
                  $2 = ''
                  OR r.name ILIKE $2
              )
            ORDER BY ci.name ASC
            LIMIT 1
        `,
        [
            `${value}%`,
            regionName || '',
        ],
    );

    return result.rows[0]?.name ?? null;
  }

  async getAthleteSuggestion(
    value: string,
    federationId: string,
    language: string,
    sex: string,
  ): Promise<string | null> {
    const result = await this.pg.query<{ full_name: string }>(
      `
        SELECT full_name
        FROM athletes
        WHERE full_name ILIKE $1
          AND federation_id = $2
          AND language = $3
          AND sex = $4
          AND is_deleted = false
        ORDER BY full_name ASC
        LIMIT 1
      `,
      [`${value}%`, federationId, language, sex],
    );

    return result.rows[0]?.full_name ?? null;
  }

  async getOrganizationSuggestion(
    value: string,
    organizationType: OrganizationType,
  ): Promise<string | null> {
    
    const result = await this.pg.query<{ organization_code: string }>(
      `
        SELECT organization_code
        FROM organizations
        WHERE organization_code ILIKE $1
          AND type = $2
          AND is_deleted = false
        ORDER BY organization_code ASC
        LIMIT 1
      `,
      [`${value}%`, organizationType],
    );

    return result.rows[0]?.organization_code ?? null;
  }

  async getDateOfBirthByName(
    fullName: string,
    federationId: string,
    language: string,
    sex: string,
  ): Promise<{
    birth_day: number;
    birth_month: number;
    birth_year: number;
  } | null> {
    const result = await this.pg.query<{
      birth_day: number;
      birth_month: number;
      birth_year: number;
    }>(
      `
        SELECT birth_day, birth_month, birth_year
        FROM athletes
        WHERE full_name = $1
          AND federation_id = $2
          AND language = $3
          AND sex = $4
          AND is_deleted = false
        LIMIT 1
      `,
      [fullName, federationId, language, sex],
    );

    return result.rows[0] ?? null;
  }
}
