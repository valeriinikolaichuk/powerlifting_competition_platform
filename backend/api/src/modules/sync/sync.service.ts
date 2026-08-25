import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { USER_TABLES } from '#shared-sql';
import { SyncChange } from './dto/sync-change.dto';

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

    async getDatabaseSnapshot(){

        const data: Record<string, any[]> = {};

        for (const table of USER_TABLES) {

            const result = await this.prisma.$queryRawUnsafe(
                `SELECT * FROM ${table}`
            );

            data[table] = result as any[];
        }

        return {
            data,
        };
    }
}
