import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import type { ArchiveCompetitionData } from '#shared-sql';
import { SYNC_OPERATIONS } from '#shared-sql';

import { SyncOperationInterface } from './sync-operation.interface';
import { SyncInboxItem } from '../dto/sync-inbox-item';

@Injectable()
export class ArchiveCompetitionOperation implements SyncOperationInterface {

    supports(operationId: string): boolean {
        return operationId === 'ARCHIVE_COMPETITION'; 
    }

    async execute(
        data: SyncInboxItem, 
        tx: Prisma.TransactionClient,
    ): Promise<void> {

        const competition = data.payload as ArchiveCompetitionData;

        await tx.$executeRawUnsafe(
            SYNC_OPERATIONS.ARCHIVE_COMPETITION,
            data.recordId,
            competition.updated_at,
        );
    }
}
