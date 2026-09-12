import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';

import { PrismaService } from '../prisma/prisma.service';
import { SyncGateway } from './sync.gateway';

@Injectable()
export class SyncOutboxDeliveryService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly syncGateway: SyncGateway,
    ) {}

    @Interval(1000)
    async retryPending(): Promise<void> {

        const devices = await this.prisma.syncOutbox.findMany({
            where: {
                processed_at: null,
            },
            select: {
                device_id: true,
            },
            distinct: ['device_id'],
        });

        for (const device of devices) {
            await this.deliver(device.device_id);
        }
    }
    
    async deliver(deviceId: string): Promise<void> {

        const items = await this.prisma.syncOutbox.findMany({
            where: {
                device_id: deviceId,
                processed_at: null,
            },
            orderBy: {
                created_at: 'asc',
            },
        });

        for (const item of items) {

            const success = await this.syncGateway.sendToDevice(
                deviceId,
                item,
            );

            if (success) {

                await this.prisma.syncOutbox.update({
                    where: {
                        id: item.id,
                    },
                    data: {
                        processed_at: new Date(),
                    },
                });
            }
        }
    }
}
