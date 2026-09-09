import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import type { SyncQueueDto } from './dto/sync-queue.dto';

@Injectable()
export class SyncInboxService {

    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async receive(data: SyncQueueDto): Promise<void> {

        await this.prisma.syncInbox.create({
            data: {
                id: data.id,
                source_id: data.source_id,
                operation_id: data.operation_id,
                record_id: data.record_id,
                payload: data.payload,
            },
        });
    }
}
