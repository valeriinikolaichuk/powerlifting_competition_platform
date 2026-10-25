import { Injectable } from '@nestjs/common';

import { SnapshotStepInterface } from "./snapshot-pipeline.interface";
import { SnapshotContext } from "../dto/snapshot-context.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { COMPETITIONS_TABLE } from '#shared-sql';

@Injectable()
export class CompetitionsTableStep implements SnapshotStepInterface {

    constructor(
        private readonly prisma: PrismaService, 
    ) {}

    async handle(context: SnapshotContext): Promise<void> {

        for (const table of COMPETITIONS_TABLE) {
        
            const result = await this.prisma.$queryRawUnsafe(
                `
                SELECT *
                FROM "${table}"
                WHERE created_by_user_id = $1::uuid
                    AND language = $2::"Language"
                `,
                context.userId,
                context.language,
            );
        
            context.data[table] = result as any[];

            console.log(`Processing table: ${table}`);
        }
    }
}