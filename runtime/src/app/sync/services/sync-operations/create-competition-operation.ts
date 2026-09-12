import { Injectable } from '@angular/core';

import type { CompetitionData } from '#shared-sql';
import { SYNC_OPERATIONS } from '#shared-sql';

import { SyncOperationInterface } from './sync-operation.interface';
import { SyncOutboxDto } from '../../dto/sync-outbox.dto';

import { PgliteService } from '../../../database/services/pglite.service';
import { UserService } from '../../../database/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class CreateCompetitionOperation implements SyncOperationInterface {

  constructor(
    private readonly pgliteService: PgliteService,
    private readonly userService: UserService,
  ){}

  supports(operationId: string): boolean {
      return operationId === 'CREATE_COMPETITION'; 
  }

  async execute(data: SyncOutboxDto): Promise<void> {

    const userId = await this.userService.getUserId();

    const competition = data.payload as CompetitionData;

    await this.pgliteService.database.query(
      SYNC_OPERATIONS.CREATE_COMPETITION,
      [
        competition.id,
        userId,
        competition.name,
        competition.country,
        competition.city,
        competition.language,
        competition.startDate,
        competition.endDate,
        competition.level,
        competition.type,
        competition.division,
        competition.federationCategoryIds,
        competition.updated_at,
      ],
    );
  }
}
