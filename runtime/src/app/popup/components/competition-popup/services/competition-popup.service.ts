import { Injectable } from '@angular/core';
import { PGlite } from '@electric-sql/pglite';
import { SYNC_OPERATIONS } from '#shared-sql';

import { PgliteService } from '../../../../database/services/pglite.service';
import { CompetitionData } from '../dto/competitionData';
import { UserService } from '../../../../shared/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class CompetitionPopupService {
  
  private pg!: PGlite;

  constructor(
    private readonly pgliteService: PgliteService,
    private readonly userService: UserService,
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

      await tx.query(
        `
        INSERT INTO sync_queue (
          id,
          source_id,
          operation_id,
          record_id,
          payload,
          created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [
          operationId,
          deviceId,
          'CREATE_COMPETITION',
          data.id,
          payload,
          data.updated_at
        ],
      );
      
    });
  }
}
