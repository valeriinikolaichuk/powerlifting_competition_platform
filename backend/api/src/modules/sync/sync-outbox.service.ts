import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import type { SyncQueueDto } from './dto/sync-queue.dto';

@Injectable()
export class SyncOutboxService {

    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async createForDevices(data: SyncQueueDto): Promise<void> {

        const devices = await this.prisma.deviceStatus.findMany({
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

        await this.prisma.syncOutbox.createMany({
            data: devices.map((device) => ({
                device_id: device.device_id,
                operation_id: data.operation_id,
                record_id: data.record_id,
                payload: data.payload,
            })),
        });
    }
}
