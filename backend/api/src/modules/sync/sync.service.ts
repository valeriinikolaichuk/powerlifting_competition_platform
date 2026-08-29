import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { SnapshotPipelineService } from './snapshot-pipeline/snapshot-pipeline.service';
import { SyncChange } from './dto/sync-change.dto';
import { SnapshotContext } from './dto/snapshot-context.dto';

@Injectable()
export class SyncService {

    constructor(
        private readonly prisma: PrismaService, 
        private readonly pipeline: SnapshotPipelineService,
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

        const context = new SnapshotContext(
            userId,
            language
        );

        return await this.pipeline.execute(context);
    }
}
