import { Test, TestingModule } from '@nestjs/testing';
import { SyncInboxService } from './sync-inbox.service';

describe('SyncInboxService', () => {
  let service: SyncInboxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SyncInboxService],
    }).compile();

    service = module.get<SyncInboxService>(SyncInboxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
