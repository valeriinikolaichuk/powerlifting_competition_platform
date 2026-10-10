import { Injectable } from '@angular/core';
import { PGlite } from '@electric-sql/pglite';

import type { CompetitionData, UpdateCompetitionData } from '#shared-sql';
import { SYNC_OPERATIONS } from '#shared-sql';

import { PgliteService } from '../../database/services/pglite.service';
import { UserService } from '../shared/user.service';

import { SyncQueueService } from '../sync/services/sync-queue.service';

@Injectable({
  providedIn: 'root',
})
export class CompetitionConfigService {
  
  private pg!: PGlite;

  constructor(
    private readonly pgliteService: PgliteService,
    private readonly userService: UserService,
    private readonly syncQueueService: SyncQueueService,
  ) {
    this.pg = this.pgliteService.database;
  }

  async create(data: CompetitionData): Promise<void> {

    const userId = await this.userService.getUserId();

    let deviceId = localStorage.getItem('device_id');

    if (!deviceId) {
      throw new Error('Device ID not found.');
    }

    console.log(data);

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
  }

  async update(data: UpdateCompetitionData): Promise<void> {

    const userId = await this.userService.getUserId();

    let deviceId = localStorage.getItem('device_id');

    if (!deviceId) {
      throw new Error('Device ID not found.');
    }

    console.log(data);

    await this.pg.transaction(async (tx) => {

      await tx.query(
        SYNC_OPERATIONS.UPDATE_COMPETITION,
        [
          data.id,
          data.name,
          data.country,
          data.city,
          data.startDate,
          data.endDate,
          userId,
          data.language,
          data.updated_at,
        ],
      );

      await this.syncQueueService.addQueue(
        tx,
        deviceId,
        'UPDATE_COMPETITION',
        data.id,
        data,
        data.updated_at,
      );
      
    });
  }

  async archive(id: string): Promise<void> {

    const deviceId = localStorage.getItem('device_id');

    if (!deviceId) { throw new Error('Device ID not found'); }

    const now = new Date().toISOString();

    await this.pg.transaction(async (tx) => {

      await tx.query(
        SYNC_OPERATIONS.ARCHIVE_COMPETITION,
         [id, now],
      );

      await this.syncQueueService.addQueue(
        tx,
        deviceId,
        'ARCHIVE_COMPETITION',
        id,
        {
          updated_at: now,
        },
          now,
        );
    });
  }
}
