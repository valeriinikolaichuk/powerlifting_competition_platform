import { Body, Controller, Post, Req, UseGuards, Delete, Query } from '@nestjs/common';
import type { Request } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/guards/current-user.decorator';

import { ConnectionsService } from './connections.service';
import { DeviceParametersDto } from './dto/device-parameters-dto';

@Controller('api/connections')
export class ConnectionsController {

  constructor(
    private readonly connectionsService: ConnectionsService,
  ) {}

  @Post('entry')
  @UseGuards(JwtAuthGuard)
  async admin(
    @Body() dto: DeviceParametersDto,
    @CurrentUser() user: any,
    @Req() request: Request,
  ) {
    const ipAddress =
    request.headers['x-forwarded-for']?.toString().split(',')[0].trim()
    ?? request.socket.remoteAddress
    ?? null;

    return this.connectionsService.checkAdmin(
      dto, 
      user?.id,
      ipAddress,
    );
  }

  @Delete('entry')
  @UseGuards(JwtAuthGuard)
  async deleteEntry(
    @Query('device_id') deviceId: string,
    @CurrentUser() user: any,
  ) {
    return this.connectionsService.deleteDevice(
      deviceId,
      user?.id,
    );
  }
}
