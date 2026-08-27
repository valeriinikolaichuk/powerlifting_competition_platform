import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { SyncChange } from './dto/sync-change.dto';

import { 
    STATIC_REFERENCE_TABLES, 
    ADMIN_REFERENCE_TABLES, 
    USER_REFERENCE_TABLES, 
    USER_REFERENCE_FEDERATIONS, 
    COMPETITION_TABLES, 
    COMPETITION_SESSION_TABLES, 
    COMPETITION_GROUP_TABLES, 
    CREATED_BY_USER_TABLES, 
    COMPETITION_RUNTIME_TABLES, 
    ORGANIZATION_RESULT_TABLES, 
} from '#shared-sql';

@Injectable()
export class SyncService {

    constructor(
        private readonly prisma: PrismaService
    ) {}

    async processQueueSync(
        changes: SyncChange[],
    ) {

        if (!changes || changes.length === 0) {
            return {
                success: true,
                received: 0,
            };
        }

        try {
            await this.prisma.syncInbox.createMany({
                data: changes.map(change => ({
                    id: change.id,
                    source_id: change.source_id,
                    operation_id: change.operation_id,
                    record_id: change.record_id,
                    payload: change.payload,
                })),
                skipDuplicates: true,
            });

//          process();

            return {
                success: true,
                received: changes.length,
            };
        } catch (error) {

            const message = error instanceof Error
                    ? error.message
                    : 'Unknown sync error';

            throw new InternalServerErrorException(`Sync failed: ${message}`,);
        }
    }

    async getDatabaseSnapshot(
        userId: string,
        language: string,
    ){

        const data: Record<string, any[]> = {};

        for (const table of STATIC_REFERENCE_TABLES) {

            const result = await this.prisma.$queryRawUnsafe(
                `SELECT * FROM ${table}`
            );

            data[table] = result as any[];
        }

        for (const table of ADMIN_REFERENCE_TABLES) {

            const result = await this.prisma.$queryRawUnsafe(
                `
                SELECT *
                FROM "${table}"
                WHERE
                    user_id = $1
                `,
                userId,
            );

            data[table] = result as any[];
        }

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
                            AND created_by_user_id = $1
                        )
                    )
                    AND language = $2
                `,
                userId,
                language,
            );

            data[table] = result as any[];
        }

        for (const table of USER_REFERENCE_FEDERATIONS) {

            const result = await this.prisma.$queryRawUnsafe(
                `
                SELECT t.*
                FROM "${table}" t
                WHERE
                    t.language = $2
                    AND (
                        (
                            t.scope = 'GLOBAL'
                            AND EXISTS (
                                SELECT 1
                                FROM user_federations uf
                                WHERE uf.user_id = $1
                                AND uf.federation_id = t.federation_id
                            )
                        )
                        OR
                        (
                            t.scope = 'USER'
                            AND t.created_by_user_id = $1
                        )
                    )
                `,
                userId,
                language,
            );

            data[table] = result as any[];
        }
        
        for (const table of COMPETITION_TABLES) {

            const result = await this.prisma.$queryRawUnsafe(
                `
                SELECT t.*
                FROM "${table}" t
                INNER JOIN competitions c
                    ON c.id = t.competition_id
                WHERE c.created_by_user_id = $1
                `,
                userId,
            );

            data[table] = result as any[];
        }

        for (const table of COMPETITION_SESSION_TABLES) {

            const result = await this.prisma.$queryRawUnsafe(
                `
                SELECT t.*
                FROM "${table}" t
                INNER JOIN competition_sessions cs
                    ON cs.id = t.competition_session_id
                INNER JOIN competitions c
                    ON c.id = cs.competition_id
                WHERE c.created_by_user_id = $1
                `,
                userId,
            );

            data[table] = result as any[];
        }

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
                userId,
            );

            data[table] = result as any[];
        }

        data['users'] = [{ id: userId }];

        for (const table of CREATED_BY_USER_TABLES) {

            const result = await this.prisma.$queryRawUnsafe(
                `
                SELECT *
                FROM "${table}"
                WHERE
                    created_by_user_id = $1
                `,
                userId,
            );

            data[table] = result as any[];
        }

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
                userId,
            );

            data[table] = result as any[];
        }

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
                userId,
            );

            data[table] = result as any[];
        }

        return {
            data,
        };
    }
}
