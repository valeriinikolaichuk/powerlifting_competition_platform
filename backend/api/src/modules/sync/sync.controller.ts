import { Controller, Post, Get, Body, UseGuards, HttpCode, HttpStatus, Query} from '@nestjs/common';
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
    ) {
        return this.syncService.getDatabaseSnapshot(
            user.id,
            language,
        );
    }
}
