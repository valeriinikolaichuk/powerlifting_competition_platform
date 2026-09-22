import { Controller, Get, UseGuards, Query} from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CurrentUser } from '../../guards/current-user.decorator';
import { SyncService } from './sync.service';

@Controller('api/sync')
export class SyncController {

    constructor(
        private readonly syncService: SyncService,
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
}
