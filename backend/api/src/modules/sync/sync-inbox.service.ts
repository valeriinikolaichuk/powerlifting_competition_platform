import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { SyncOutboxService } from './sync-outbox.service';
import type { SyncQueueDto } from './dto/sync-queue.dto';

@Injectable()
export class SyncInboxService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly syncOutboxService: SyncOutboxService,
    ) {
        console.log('SyncInboxService initialized');
    }

    async receive(data: SyncQueueDto): Promise<void> {

        const existing = await this.prisma.syncInbox.findUnique({
            where: { id: data.id },
        });

        if (existing) { 
            if (data.processed_at !== null) {

                await this.prisma.syncInbox.update({
                    where: {
                        id: data.id,
                    },
                    data: {
                        processed_by_browser: data.processed_at,
                    },    
                });
            } 
            
            return; 
        }

        await this.prisma.$transaction(async (tx) => {

            await tx.syncInbox.create({
                data: {
                    id: data.id,
                    source_id: data.source_id,
                    operation_id: data.operation_id,
                    record_id: data.record_id,
                    payload: data.payload,
                },
            });

            await this.syncOutboxService.createForDevices(data, tx);
        });
    }
}
