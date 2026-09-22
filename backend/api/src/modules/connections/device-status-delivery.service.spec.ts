import { Test, TestingModule } from '@nestjs/testing';
import { DeviceStatusDeliveryService } from './device-status-delivery.service';

describe('DeviceStatusDeliveryService', () => {
  let service: DeviceStatusDeliveryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeviceStatusDeliveryService],
    }).compile();

    service = module.get<DeviceStatusDeliveryService>(DeviceStatusDeliveryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
