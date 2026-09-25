import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { SyncQueueDto } from './dto/sync-queue.dto';

@Injectable()
export class DeviceRoleService {

    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async updateInbox(data: SyncQueueDto){

        console.log('DeviceRoleService sent to frontend: '+data);

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
