import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

import { PGlite } from '@electric-sql/pglite';
import { SYNC_OPERATIONS } from '#shared-sql';

import { TranslationService } from '../../i18n/services/translation.service';

import { PgliteService } from '../../database/services/pglite.service';

@Injectable({
  providedIn: 'root',
})
export class NominationConfigService {

  private pg!: PGlite;

  constructor(
    private readonly pgliteService: PgliteService,
    private readonly http: HttpClient,
    public tService: TranslationService,
  ) {
    this.pg = this.pgliteService.database;
  }

  async setNominationDates(
    competitionId: string,
    preliminaryDate: string,
    finalDate: string,
  ): Promise<void> {

    try {

      await firstValueFrom(
        this.http.post(`${environment.apiUrl}/api/nominations/nomination-dates`,
          {
            competitionId,
            preliminaryDate,
            finalDate,
          },
        ),
      );

      await this.pg.query(
        SYNC_OPERATIONS.SET_NOMINATION_DATES,
        [
          competitionId,
          preliminaryDate,
          finalDate,
        ],
      );

    } catch (error) {

      console.error('Failed to save nomination dates', error);

      alert(this.tService.t(
        'popups/competition-popup',
        'Failed_to_save_nomination_dates'
      ));

      return;
    }
  }


/** update Nomination Status */  
  private async updateNominationStatus(
    competitionId: string,
  ): Promise<void> {

    await this.pg.query(
      SYNC_OPERATIONS.UPDATE_NOMINATION_STATUS,
      [competitionId],
    );
/*
    await this.http.post(
      `${environment.apiUrl}/competitions/${competitionId}/nomination-status/sync`,
      {},
    ).toPromise();
*/
  }
}
