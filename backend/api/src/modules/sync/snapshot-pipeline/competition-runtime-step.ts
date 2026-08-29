import { SnapshotStepInterface } from "./snapshot-pipeline.interface";
import { SnapshotContext } from "../dto/snapshot-context.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { COMPETITION_RUNTIME_TABLES } from '#shared-sql';

export class CompetitionRuntimeStep implements SnapshotStepInterface {

    constructor(
        private readonly prisma: PrismaService, 
    ) {}

    async handle(context: SnapshotContext): Promise<void> {
        
        for (const table of COMPETITION_RUNTIME_TABLES) {
        
            const result = await this.prisma.$queryRawUnsafe(
                `
                SELECT t.*
                FROM "${table}" t
                INNER JOIN athlete_registrations ar
                    ON ar.id = t.athlete_registration_id
                INNER JOIN competitions c
                    ON c.id = ar.competition_id
                WHERE c.created_by_user_id = $1
                `,
                context.userId,
            );
        
            context.data[table] = result as any[];
        }
    }
}
