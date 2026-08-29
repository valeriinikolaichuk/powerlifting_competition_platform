import { SnapshotStepInterface } from "./snapshot-pipeline.interface";
import { SnapshotContext } from "../dto/snapshot-context.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { ADMIN_REFERENCE_TABLES } from '#shared-sql';

export class AdminReferenceStep implements SnapshotStepInterface {

    constructor(
        private readonly prisma: PrismaService, 
    ) {}

    async handle(context: SnapshotContext): Promise<void> {
        
        for (const table of ADMIN_REFERENCE_TABLES) {
    
            const result = await this.prisma.$queryRawUnsafe(
                `
                SELECT *
                FROM "${table}"
                WHERE
                user_id = $1
                `,
                context.userId,
            );
    
            context.data[table] = result as any[];
        }
    }
}
