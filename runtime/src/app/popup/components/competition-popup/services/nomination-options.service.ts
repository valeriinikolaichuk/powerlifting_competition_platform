import { Injectable } from '@angular/core';

import { PGlite } from '@electric-sql/pglite';
import { PgliteService } from '../../../../database/services/pglite.service';
import { NominationDates } from '../dto/nomination-dates.dto';

@Injectable({
  providedIn: 'root',
})
export class NominationOptionsService {

  private pg!: PGlite;
    
    constructor(
      private readonly pgliteService: PgliteService,
    ) {
      this.pg = this.pgliteService.database;
    }

  async getNominationDates(competitionId: string): Promise<NominationDates | null> {

    const result = await this.pg.query<{
      preliminary_date: string | null;
      final_date: string | null;
    }>(
        `
        SELECT
            preliminary_date,
            final_date
        FROM nomination_status
        WHERE competition_id = $1
        `,
        [competitionId],
    );

    return result.rows[0] ?? null;
  }
}
