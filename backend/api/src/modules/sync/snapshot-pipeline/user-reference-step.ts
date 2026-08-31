import { Injectable } from '@nestjs/common';

import { SnapshotStepInterface } from "./snapshot-pipeline.interface";
import { SnapshotContext } from "../dto/snapshot-context.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { USER_REFERENCE_TABLES } from '#shared-sql';

@Injectable()
export class UserReferenceStep implements SnapshotStepInterface {

    constructor(
        private readonly prisma: PrismaService, 
    ) {}

    async handle(context: SnapshotContext): Promise<void> {

        for (const table of USER_REFERENCE_TABLES) {

            const result = await this.prisma.$queryRawUnsafe(
                `
                SELECT *
                FROM "${table}"
                WHERE
                    (
                        scope = 'GLOBAL'
                        OR (
                            scope = 'USER'
                            AND created_by_user_id = $1::uuid
                        )
                    )
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
