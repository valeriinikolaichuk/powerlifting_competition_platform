import { Body, Controller, Post, Req, UseGuards, Delete } from '@nestjs/common';
import type { Request } from 'express';

import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CurrentUser } from '../../guards/current-user.decorator';

import { ConnectionsService } from './connections.service';
import { DeviceParametersDto } from './dto/device-parameters-dto';
import { DeleteDevicesDto } from './dto/delete-devices';

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

  @Delete('exit')
    async deleteDevices(
    @Body() dto: DeleteDevicesDto,
  ) {
    return this.connectionsService.deleteDevices(
      dto.device_ids,
    );
  }

  @Post('exit-client')
    async softDeleteDevices(
    @Body() dto: DeleteDevicesDto,
  ) {
    return this.connectionsService.softDeleteDevices(
      dto.device_ids,
    );
  }
}
