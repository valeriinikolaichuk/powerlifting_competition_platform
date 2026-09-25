import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import type { DeviceRole } from '#shared-sql';
import { SYNC_OPERATIONS } from '#shared-sql';

import { SyncOperationInterface } from './sync-operation.interface';
import { SyncInboxItem } from '../dto/sync-inbox-item';

@Injectable()
export class DeviceRoleOperation implements SyncOperationInterface {

    supports(operationId: string): boolean {
        return operationId === 'UPDATE_DEVICE_ROLE'; 
    }

    async execute(
        data: SyncInboxItem, 
        tx: Prisma.TransactionClient,
    ): Promise<void> {

        const device = data.payload as DeviceRole;

        await tx.$executeRawUnsafe(
            SYNC_OPERATIONS.UPDATE_DEVICE_ROLE,
            device.id,
            device.clientRole,
            device.updated_at
        );
    }
}
