import { Controller, Post, Get, Body, HttpCode, HttpStatus, } from '@nestjs/common';
import { SyncService } from './sync.service';

interface SyncDto {
    changes: any[];
}

@Controller('api/sync')
export class SyncController {

    constructor(
        private readonly syncService: SyncService,
    ) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    async syncData(@Body() syncDto: SyncDto) {

        return await this.syncService.processQueueSync(
            syncDto.changes,
        );
    }

    @Get('snapshot')
    async getSnapshot() {
        return await this.syncService.getDatabaseSnapshot();
    }
}
