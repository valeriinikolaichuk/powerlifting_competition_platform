import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import type { UpdateCompetitionData } from '#shared-sql';
import { SYNC_OPERATIONS } from '#shared-sql';

import { SyncOperationInterface } from './sync-operation.interface';
import { SyncInboxItem } from '../dto/sync-inbox-item';
import { UserService } from '../user.service';

@Injectable()
export class UpdateCompetitionOperation implements SyncOperationInterface {

    constructor( 
        private readonly userService: UserService,
    ){}

    supports(operationId: string): boolean {
        return operationId === 'UPDATE_COMPETITION'; 
    }

    async execute(
        data: SyncInboxItem, 
        tx: Prisma.TransactionClient,
    ): Promise<void> {

        const userId = await this.userService.getUserId(data.sourceId);

        const competition = data.payload as UpdateCompetitionData;

        await tx.$executeRawUnsafe(
            SYNC_OPERATIONS.UPDATE_COMPETITION,
            competition.id,
            competition.name,
            competition.country,
            competition.city,
            new Date(competition.startDate),
            new Date(competition.endDate),
            userId,
            competition.language,
            new Date(competition.updated_at),
        );
    }
}
