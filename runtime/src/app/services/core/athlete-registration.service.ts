import { Injectable } from '@angular/core';
import { PGlite } from '@electric-sql/pglite';

import { SYNC_OPERATIONS } from '#shared-sql';

import { PgliteService } from '../../database/services/pglite.service';

import { SyncQueueService } from '../sync/services/sync-queue.service';

@Injectable({
  providedIn: 'root',
})
export class AthleteRegistrationService {
    
  private pg!: PGlite;
  
  constructor(
    private readonly pgliteService: PgliteService,
    private readonly syncQueueService: SyncQueueService,
  ) {
    this.pg = this.pgliteService.database;
  }
/*
  async create(

  ): Promise<void>{

  }

  async update(

  ): Promise<void>{

    let deviceId = localStorage.getItem('device_id');

    if (!deviceId) {
      throw new Error('Device ID not found.');
    }

    await this.pg.transaction(async (tx) => {
      await tx.query(
        SYNC_OPERATIONS.UPDATE_ATHLETE_REGISTRATION,
        [
          // параметри SQL
        ],
      );

      await this.syncQueueService.addQueue(
        tx,
        deviceId,
        'UPDATE_ATHLETE_REGISTRATION',
        data.id,
        data,
        data.updated_at,
      );
    });
  }
    */
}
