import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import type { CompetitionData } from '#shared-sql';
import { SYNC_OPERATIONS } from '#shared-sql';

import { SyncOperationInterface } from './sync-operation.interface';
import { SyncInboxItem } from '../dto/sync-inbox-item';
import { UserService } from './user.service';

@Injectable()
export class CreateCompetitionOperation  implements SyncOperationInterface {

    constructor( 
        private readonly userService: UserService,
    ){}

    supports(operationId: string): boolean {
        return operationId === 'CREATE_COMPETITION'; 
    }

    async execute(
        data: SyncInboxItem, 
        tx: Prisma.TransactionClient,
    ): Promise<void> {

        const userId = await this.userService.getUserId(data.sourceId);

        const competition = data.payload as CompetitionData;

        await tx.$executeRawUnsafe(
            SYNC_OPERATIONS.CREATE_COMPETITION,
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
        );
    }
}
