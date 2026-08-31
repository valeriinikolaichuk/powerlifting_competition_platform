import { Injectable } from '@nestjs/common';

import { SnapshotStepInterface } from "./snapshot-pipeline.interface";
import { SnapshotContext } from "../dto/snapshot-context.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { USER_REFERENCE_FEDERATIONS } from '#shared-sql';

@Injectable()
export class UserReferenceFederationsStep implements SnapshotStepInterface {

    constructor(
        private readonly prisma: PrismaService, 
    ) {}

    async handle(context: SnapshotContext): Promise<void> {

        for (const table of USER_REFERENCE_FEDERATIONS) {
        
            const result = await this.prisma.$queryRawUnsafe(
                `
                SELECT t.*
                FROM "${table}" t
                WHERE
                    t.language = $2::"Language"
                    AND (
                        (
                            t.scope = 'GLOBAL'
                            AND EXISTS (
                                SELECT 1
                                FROM user_federations uf
                                WHERE uf.user_id = $1::uuid
                                AND uf.federation_id = t.federation_id
                            )
                        )
                        OR
                        (
                            t.scope = 'USER'
                            AND t.created_by_user_id = $1::uuid
                        )
                    )
                `,
                context.userId,
                context.language,
            );
        
            context.data[table] = result as any[];

            console.log(`Processing table: ${table}`);
        }
    }
}
