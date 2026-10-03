import { Injectable } from '@angular/core';

import type { UpdateCompetitionData } from '#shared-sql';
import { SYNC_OPERATIONS } from '#shared-sql';

import { SyncOperationInterface } from './sync-operation.interface';
import { SyncOutboxDto } from '../../dto/sync-outbox.dto';

import { UserService } from '../../../shared/user.service';

@Injectable({
  providedIn: 'root',
})
export class UpdateCompetitionOperation implements SyncOperationInterface {

  constructor(
    private readonly userService: UserService,
  ){}

  supports(operationId: string): boolean {
      return operationId === 'UPDATE_COMPETITION'; 
  }

  async execute(
    data: SyncOutboxDto,
    tx: any
  ): Promise<void> {

    const userId = await this.userService.getUserId();

    const competition = data.payload as UpdateCompetitionData;

    await tx.query(
      SYNC_OPERATIONS.UPDATE_COMPETITION,
      [
        competition.id,
        competition.name,
        competition.country,
        competition.city,
        competition.startDate,
        competition.endDate,
        userId,
        competition.language,
        competition.updated_at,
      ],
    );
  }
}
