import { Injectable } from '@nestjs/common';

import { SnapshotStepInterface } from "./snapshot-pipeline.interface";
import { SnapshotContext } from "../dto/snapshot-context.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { ATHLETE_TABLES } from '#shared-sql';

@Injectable()
export class AthleteStep implements SnapshotStepInterface {

    constructor(
        private readonly prisma: PrismaService, 
    ) {}

    async handle(context: SnapshotContext): Promise<void> {

        for (const table of ATHLETE_TABLES) {
        
            const result = await this.prisma.$queryRawUnsafe(
                `
                SELECT t.*
                    FROM "${table}" t
                    INNER JOIN competition_age_groups cag
                        ON cag.id = t.competition_age_group_id
                    INNER JOIN competitions c
                        ON c.id = cag.competition_id
                    INNER JOIN athletes a
                        ON a.id = t.athlete_id
                    WHERE c.created_by_user_id = $1::uuid
                        AND a.language = $2::"Language"
                `,
                context.userId,
                context.language,
            );
        
            context.data[table] = result as any[];

            console.log(`Processing table: ${table}`);
        }
    }
}
