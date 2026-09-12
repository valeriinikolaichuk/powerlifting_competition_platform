import { Test, TestingModule } from '@nestjs/testing';
import { SyncProcessorService } from './sync-processor.service';

describe('SyncProcessorService', () => {
  let service: SyncProcessorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SyncProcessorService],
    }).compile();

    service = module.get<SyncProcessorService>(SyncProcessorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
