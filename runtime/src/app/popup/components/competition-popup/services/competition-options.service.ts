import { Injectable } from '@angular/core';
import { PGlite } from '@electric-sql/pglite';
import { PgliteService } from '../../../../database/services/pglite.service';

import { 
  FederationOption, 
  DivisionOption,  
} from '../dto/competition-options.dtos';

@Injectable({
  providedIn: 'root',
})
export class CompetitionOptionsService {
  
  private pg!: PGlite;
  
  constructor(
    private readonly pgliteService: PgliteService,
  ) {}

  async getFederations(): Promise<FederationOption[]> {

    this.pg = this.pgliteService.database;

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

  async getDivisions(): Promise<DivisionOption[]> {

    const result = await this.pg.query<DivisionOption>(
      `
        SELECT DISTINCT
          fd.division,
          fd.name
        FROM user_federations uf
        JOIN federation_divisions fd
          ON fd.federation_id = uf.federation_id
        ORDER BY fd.sort_order
      `
    );

    return result.rows;
  }
}
