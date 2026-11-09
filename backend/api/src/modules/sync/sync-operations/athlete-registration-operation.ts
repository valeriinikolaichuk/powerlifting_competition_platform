import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import type { AthleteChange } from '#shared-sql';
import { SYNC_OPERATIONS } from '#shared-sql';

import { SyncOperationInterface } from './sync-operation.interface';
import { SyncInboxItem } from '../dto/sync-inbox-item';
import { UserService } from '../user.service';

@Injectable()
export class AthleteRegistrationOperation implements SyncOperationInterface {

    constructor( 
        private readonly userService: UserService,
    ){}

    supports(operationId: string): boolean {
        return operationId === 'CREATE_ATHLETE_REGISTRATION'; 
    }

    async execute(
        data: SyncInboxItem, 
        tx: Prisma.TransactionClient,
    ): Promise<void> {

        const userId = await this.userService.getUserId(data.sourceId);

        const athlete = data.payload as AthleteChange;

        await tx.$executeRawUnsafe(
            SYNC_OPERATIONS.CREATE_ATHLETE_REGISTRATION,
            athlete.data.id,                            // $1
            athlete.data.athlete_id,                    // $2

            athlete.data.country ?? null,               // $3
            athlete.data.region ?? null,                // $4
            athlete.data.city ?? null,                  // $5

            athlete.data.sport_society_code ?? null,    // $6
            athlete.data.club_code ?? null,             // $7
            athlete.data.sport_school_code ?? null,     // $8
            athlete.data.university_code ?? null,       // $9

            athlete.competition_id,                     // $10
            athlete.data.federation_category_id,        // $11

            athlete.data.trainer_1 ?? null,             // $12
            athlete.data.trainer_2 ?? null,             // $13
            athlete.data.trainer_3 ?? null,             // $14
            athlete.data.trainer_4 ?? null,             // $15

            athlete.data.category_id ?? null,           // $16
            athlete.data.group_order ?? 1,              // $17
            athlete.data.lot ?? null,                   // $18
            athlete.data.sport_rank_class ?? null,      // $19

            athlete.data.squat_nominated ?? null,       // $20
            athlete.data.bench_press_nominated ?? null, // $21
            athlete.data.deadlift_nominated ?? null,    // $22
            athlete.data.total_nominated ?? null,       // $23
            athlete.data.status ?? 'TEAM',              // $24
            athlete.data.qualification ?? 'QUALIFIED',  // $25

            athlete.updated_at,                         // $26

            athlete.language,                           // $27
            userId,                                     // $28
            athlete.createAthlete,                              // $29
            athlete.federation_id,                      // $30

            athlete.data.full_name,                     // $31
            athlete.data.birth_day,                     // $32
            athlete.data.birth_month,                   // $33
            athlete.data.birth_year,                    // $34
            athlete.sex,                                // $35

            athlete.data.titles ?? null                 // $36
        );
    }
}
