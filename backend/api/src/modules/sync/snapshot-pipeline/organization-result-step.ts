import { SnapshotStepInterface } from "./snapshot-pipeline.interface";
import { SnapshotContext } from "../dto/snapshot-context.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { ORGANIZATION_RESULT_TABLES } from '#shared-sql';

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
                WHERE c.user_id = $1
                `,
                context.userId,
            );

            context.data[table] = result as any[];
        }
    }
}
