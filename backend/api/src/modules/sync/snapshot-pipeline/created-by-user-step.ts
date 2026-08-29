import { SnapshotStepInterface } from "./snapshot-pipeline.interface";
import { SnapshotContext } from "../dto/snapshot-context.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { CREATED_BY_USER_TABLES } from '#shared-sql';

export class CreatedByUserStep implements SnapshotStepInterface {

    constructor(
        private readonly prisma: PrismaService, 
    ) {}

    async handle(context: SnapshotContext): Promise<void> {

        for (const table of CREATED_BY_USER_TABLES) {
        
            const result = await this.prisma.$queryRawUnsafe(
                `
                SELECT *
                FROM "${table}"
                WHERE
                    created_by_user_id = $1
                `,
                context.userId,
            );
        
            context.data[table] = result as any[];
        }
    }
}
