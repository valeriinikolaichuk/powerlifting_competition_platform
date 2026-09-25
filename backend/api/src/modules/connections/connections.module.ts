import { Module } from '@nestjs/common';

import { ConnectionsController } from './connections.controller';
import { ConnectionsService } from './connections.service';
import { DeviceGateway } from './device.gateway';
import { DeviceStatusDeliveryService } from './device-status-delivery.service';

@Module({
  controllers: [ConnectionsController],
  providers: [
    ConnectionsService,
    DeviceGateway,
    DeviceStatusDeliveryService,
  ],
  exports: [
    DeviceStatusDeliveryService,
  ],
})
export class ConnectionsModule {}
