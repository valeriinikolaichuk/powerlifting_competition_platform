import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { DeviceStatusDeliveryService } from '../connections/device-status-delivery.service';
import { SyncGateway } from './sync.gateway';

@Injectable()
export class SyncOutboxDeliveryService {

    private deviceStatusDeliveryRunning = false;

    constructor(
        private readonly prisma: PrismaService,
        private readonly syncGateway: SyncGateway,
        private readonly deviceStatusDeliveryService: DeviceStatusDeliveryService,
    ) {
        console.log('SyncOutboxDeliveryService initialized');
    }

    @Interval(1000)
    async retryPending(): Promise<void> {

        const devices = await this.prisma.deviceStatus.findMany({
            where: {
                device_role: {
                    not: 'ADMIN',
                },
                is_deleted: false,
            },
            distinct: ['device_id'],
        });

        for (const device of devices) {
            await this.deliver(device.device_id);
        }

        if (this.deviceStatusDeliveryRunning) { return; }

        this.deviceStatusDeliveryRunning = true;

        try {
            for (const device of devices) {
                await this.deviceStatusDeliveryService.deliver(device);
            }
        } finally {
            this.deviceStatusDeliveryRunning = false;
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
