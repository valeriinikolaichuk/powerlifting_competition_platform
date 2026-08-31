import { Injectable } from '@nestjs/common';

import { SnapshotStepInterface } from "./snapshot-pipeline.interface";
import { SnapshotContext } from "../dto/snapshot-context.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { ORGANIZATION_RESULT_TABLES } from '#shared-sql';

@Injectable()
export class OrganizationResultStep implements SnapshotStepInterface {

    constructor(
        private readonly prisma: PrismaService, 
    ) {}

    async handle(context: SnapshotContext): Promise<void> {

        for (const table of ORGANIZATION_RESULT_TABLES) {

            const result = await this.prisma.$queryRawUnsafe(
                `
                SELECT orr.*
                FROM "${table}" orr
                INNER JOIN competition_organizations co
                    ON co.id = orr.competition_organization_id
                INNER JOIN competitions c
                    ON c.id = co.competition_id
                WHERE c.created_by_user_id = $1::uuid
                `,
                context.userId,
            );

            context.data[table] = result as any[];

            console.log(`Processing table: ${table}`);
        }
    }
}
