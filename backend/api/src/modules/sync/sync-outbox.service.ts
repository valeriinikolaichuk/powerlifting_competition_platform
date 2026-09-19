import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import type { SyncQueueDto } from './dto/sync-queue.dto';

@Injectable()
export class SyncOutboxService {

    async createForDevices(
        data: SyncQueueDto,
        tx: Prisma.TransactionClient,
    ): Promise<void> {

        const devices = await tx.deviceStatus.findMany({
            where: {
                device_id: {
                    not: data.source_id,
                },
                is_deleted: false,
            },
            select: {
                device_id: true,
            },
            distinct: ['device_id'],
        });

        if (devices.length === 0) {
            return;
        }

        await tx.syncOutbox.createMany({
            data: devices.map((device) => ({
                sync_id: data.id,
                device_id: device.device_id,
                operation_id: data.operation_id,
                record_id: data.record_id,
                payload: data.payload,
            })),
            skipDuplicates: true,
        });
    }
}
