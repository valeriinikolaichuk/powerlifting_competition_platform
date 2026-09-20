import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { Prisma } from '@prisma/client';

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

                if (item.processed_at === null) {

                    await this.prisma.syncOutbox.update({
                    where: {
                        id: item.id,
                    },
                    data: {
                        payload: Prisma.DbNull,
                        processed_at: new Date(),
                    },
                    });

                } else {

                    await this.prisma.syncOutbox.delete({
                    where: {
                        id: item.id,
                    },
                    });
                }
            }
        }
    }
}
