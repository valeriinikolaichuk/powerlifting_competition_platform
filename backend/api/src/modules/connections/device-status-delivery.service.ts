import { Injectable } from '@nestjs/common';
import { DeviceStatus } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { DeviceGateway } from './device.gateway';

@Injectable()
export class DeviceStatusDeliveryService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly deviceGateway: DeviceGateway,
    ) {}

    async deliver(device: DeviceStatus): Promise<void> {
        if (
            device.sent_at && 
            device.updated_at.getTime() === device.sent_at.getTime()
        ) {
            return;
        }

        const admin = await this.prisma.deviceStatus.findFirst({
            where: {
                created_by_user_id: device.created_by_user_id,
                device_role: 'ADMIN',
                is_deleted: false,
            },
                select: {
                    device_id: true,
            },
        });

        if (!admin) { return; }

        const success = await this.deviceGateway.sendToAdmin(admin.device_id, device);

        if (!success) { return; }

        await this.prisma.$transaction(async (tx) => {

            if (device.is_deleted) {
                await tx.deviceStatus.delete({
                    where: {
                        id: device.id,
                    },
                });
            } else {
                await tx.deviceStatus.update({
                    where: {
                        id: device.id,
                    },
                    data: {
                        sent_at: device.updated_at,
                    },
                });
            }
        });
    }
}
