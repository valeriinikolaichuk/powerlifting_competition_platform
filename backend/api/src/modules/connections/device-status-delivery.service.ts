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

        console.log('Sending device-status to ADMIN:', admin.device_id);

        const success = await this.deviceGateway.sendToAdmin(admin.device_id, device);

        if (!success) { return; }

        const currentDevice = await this.prisma.deviceStatus.findUnique({
            where: {
                id: device.id,
            },
            select: {
                updated_at: true,
            },
        });

        if (!currentDevice) { return; }

        await this.prisma.deviceStatus.update({
            where: {
                id: device.id,
            },
            data: {
                sent_at: currentDevice.updated_at,
            },
        });
    }
}
