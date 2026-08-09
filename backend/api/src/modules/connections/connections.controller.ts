import { Body, Controller, Post, } from '@nestjs/common';

import { ConnectionsService } from './connections.service';
import { DeviceParametersDto } from './dto/device-parameters-dto';

@Controller('api/connections')
export class ConnectionsController {

  constructor(
    private readonly connectionsService: ConnectionsService,
  ) {}

  @Post('entry')
  async admin(
    @Body() dto: DeviceParametersDto,
  ) {
    return this.connectionsService.checkAdmin(dto);
  }
}
