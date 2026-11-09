import { Injectable } from '@nestjs/common';

import { SnapshotStepInterface } from "./snapshot-pipeline.interface";
import { SnapshotContext } from "../dto/snapshot-context.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { ATHLETE_TITLES } from '#shared-sql';

@Injectable()
export class AthleteTitlesStep implements SnapshotStepInterface {

    constructor(
        private readonly prisma: PrismaService, 
    ) {}

    async handle(context: SnapshotContext): Promise<void> {

        for (const table of ATHLETE_TITLES) {
        
            const result = await this.prisma.$queryRawUnsafe(
                `
                SELECT t.*
                FROM "${table}" t
                INNER JOIN athletes a ON a.id = t.athlete_id
                WHERE
                    t.created_by_user_id = $1::uuid
                    AND t.is_deleted = false
                    AND a.language = $2::"Language"
                    AND (
                            (
                            a.scope = 'GLOBAL'
                            AND EXISTS (
                                SELECT 1
                                FROM user_federations uf
                                WHERE uf.user_id = $1::uuid
                                AND uf.federation_id = a.federation_id
                            )
                        )
                        OR
                        (
                            a.scope = 'USER'
                            AND a.created_by_user_id = $1::uuid
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
