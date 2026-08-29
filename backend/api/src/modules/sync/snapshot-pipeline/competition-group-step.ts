import { SnapshotStepInterface } from "./snapshot-pipeline.interface";
import { SnapshotContext } from "../dto/snapshot-context.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { COMPETITION_GROUP_TABLES } from '#shared-sql';

export class CompetitionGroupStep implements SnapshotStepInterface {

    constructor(
        private readonly prisma: PrismaService, 
    ) {}

    async handle(context: SnapshotContext): Promise<void> {
        
        for (const table of COMPETITION_GROUP_TABLES) {
        
            const result = await this.prisma.$queryRawUnsafe(
                `
                SELECT t.*
                FROM "${table}" t
                INNER JOIN groups_in_session gis
                    ON gis.id = t.groups_in_session_id
                INNER JOIN competition_sessions cs
                    ON cs.id = gis.competition_session_id
                INNER JOIN competitions c
                    ON c.id = cs.competition_id
                WHERE c.created_by_user_id = $1
                `,
                context.userId,
            );
        
            context.data[table] = result as any[];
        }
    }
}
