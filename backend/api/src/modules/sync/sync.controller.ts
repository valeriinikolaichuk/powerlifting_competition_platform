import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { SyncService } from './sync.service';

interface SyncDto {
    userId: string;
    userTables: string[];
    changes: any;
}

@Controller('api/sync')
export class SyncController {

    constructor(
        private readonly syncService: SyncService
    ) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    async syncData(@Body() syncDto: SyncDto) {
        return await this.syncService.processSync(
            syncDto.userId,
            syncDto.userTables,
//            syncDto.changes,
        );
    }
}
