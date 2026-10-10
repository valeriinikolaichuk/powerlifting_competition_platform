import { Injectable } from '@angular/core';

import type { ArchiveCompetitionData } from '#shared-sql';
import { SYNC_OPERATIONS } from '#shared-sql';

import { SyncOperationInterface } from './sync-operation.interface';
import { SyncOutboxDto } from '../../dto/sync-outbox.dto';

@Injectable({
  providedIn: 'root',
})
export class ArchiveCompetitionOperation implements SyncOperationInterface {

  supports(operationId: string): boolean {
      return operationId === 'ARCHIVE_COMPETITION'; 
  }

  async execute(
    data: SyncOutboxDto,
    tx: any
  ): Promise<void> {

    const competition = data.payload as ArchiveCompetitionData;

    await tx.$executeRawUnsafe(
      SYNC_OPERATIONS.ARCHIVE_COMPETITION,
      data.recordId,
      competition.updated_at,
    );
  }
}
