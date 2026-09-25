import { Controller, Get, UseGuards, Query, Post, Body} from '@nestjs/common';

import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CurrentUser } from '../../guards/current-user.decorator';

import { SyncService } from './sync.service';
import type { SyncQueueDto } from './dto/sync-queue.dto';
import { DeviceRoleService } from './device-role.service.service';

@Controller('api/sync')
export class SyncController {

    constructor(
        private readonly syncService: SyncService,
        private readonly deviceRoleService: DeviceRoleService,
    ) {}

    @Get('snapshot')
    @UseGuards(JwtAuthGuard)
    async getSnapshot(
        @CurrentUser() user: any,
        @Query('language') language: string,
        @Query('device_id') deviceId: string,
    ) {
        return this.syncService.getDatabaseSnapshot(
            user.id,
            language,
            deviceId,
        );
    }

    @Post('device-role')
    async updateDeviceRole(
        @Body() dto: SyncQueueDto
    ) {
        return this.deviceRoleService.updateInbox(dto);
    }
}
