import { Test, TestingModule } from '@nestjs/testing';
import { SyncOutboxDeliveryService } from './sync-outbox-delivery.service';

describe('SyncOutboxDeliveryService', () => {
  let service: SyncOutboxDeliveryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SyncOutboxDeliveryService],
    }).compile();

    service = module.get<SyncOutboxDeliveryService>(SyncOutboxDeliveryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
