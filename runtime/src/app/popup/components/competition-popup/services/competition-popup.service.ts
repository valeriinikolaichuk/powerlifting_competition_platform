import { Injectable } from '@angular/core';
import { PGlite } from '@electric-sql/pglite';

import { SYNC_OPERATIONS } from '#shared-sql';
import { SyncQueueService } from '../../../../sync/services/sync-queue.service';

import { PgliteService } from '../../../../database/services/pglite.service';
import { UserService } from '../../../../database/services/user.service';
import { CompetitionData } from '../dto/competitionData';

@Injectable({
  providedIn: 'root',
})
export class CompetitionPopupService {
  
  private pg!: PGlite;

  constructor(
    private readonly pgliteService: PgliteService,
    private readonly userService: UserService,
    private readonly syncQueueService: SyncQueueService,
  ) {}

  async initialize(): Promise<void> {
    this.pg = this.pgliteService.database;
  }

  async create(data: CompetitionData): Promise<void> {

    const userId = await this.userService.getUserId();

    let deviceId = localStorage.getItem('device_id');

    if (!deviceId) {
      throw new Error('Device ID not found.');
    }

    const operationId = crypto.randomUUID();
    const payload = JSON.stringify(data);

    await this.pg.transaction(async (tx) => {

      await tx.query(
        SYNC_OPERATIONS.CREATE_COMPETITION,
        [
          data.id,
          userId,
          data.name,
          data.country,
          data.city,
          data.language,
          data.startDate,
          data.endDate,
          data.level,
          data.type,
          data.division,
          data.federationCategoryIds,
          data.updated_at,
        ],
      );

      await this.syncQueueService.addQueue(
        tx,
        deviceId,
        'CREATE_COMPETITION',
        data.id,
        data,
        data.updated_at,
      );
      
    });

    await this.syncQueueService.sync();
  }
}
