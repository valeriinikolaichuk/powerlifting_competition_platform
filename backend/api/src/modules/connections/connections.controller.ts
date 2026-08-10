import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
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
    console.log('COOKIES:', request.cookies);
    console.log('USER:', user);
    console.log('MODE:', dto.mode);

    return this.connectionsService.checkAdmin(dto, user?.id,);
  }
}
