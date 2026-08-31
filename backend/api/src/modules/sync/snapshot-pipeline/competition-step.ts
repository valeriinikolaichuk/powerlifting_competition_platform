import { Injectable } from '@nestjs/common';

import { SnapshotStepInterface } from "./snapshot-pipeline.interface";
import { SnapshotContext } from "../dto/snapshot-context.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { COMPETITION_TABLES } from '#shared-sql';

@Injectable()
export class CompetitionStep implements SnapshotStepInterface {

    constructor(
        private readonly prisma: PrismaService, 
    ) {}

    async handle(context: SnapshotContext): Promise<void> {

        for (const table of COMPETITION_TABLES) {
        
            const result = await this.prisma.$queryRawUnsafe(
                `
                SELECT t.*
                FROM "${table}" t
                INNER JOIN competitions c
                    ON c.id = t.competition_id
                WHERE c.created_by_user_id = $1::uuid
                `,
                context.userId,
            );
        
            context.data[table] = result as any[];

            console.log(`Processing table: ${table}`);
        }
    }
}
