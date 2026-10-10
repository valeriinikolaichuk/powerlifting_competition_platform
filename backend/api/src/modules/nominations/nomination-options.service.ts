import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { SYNC_OPERATIONS } from '#shared-sql';

@Injectable()
export class NominationOptionsService {

    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async setNominationDates(
        competitionId: string,
        preliminaryDate: string,
        finalDate: string,
    ): Promise<void> {

        await this.prisma.$executeRawUnsafe(
            SYNC_OPERATIONS.SET_NOMINATION_DATES,
            competitionId,
            preliminaryDate,
            finalDate,
        );
    }
}
