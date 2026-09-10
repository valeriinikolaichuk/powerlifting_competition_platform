import { Test, TestingModule } from '@nestjs/testing';
import { SyncOutboxService } from './sync-outbox.service';

describe('SyncOutboxService', () => {
  let service: SyncOutboxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SyncOutboxService],
    }).compile();

    service = module.get<SyncOutboxService>(SyncOutboxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
