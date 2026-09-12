import { Test, TestingModule } from '@nestjs/testing';
import { SyncOperationFactoryService } from './sync-operation-factory.service';

describe('SyncOperationFactoryService', () => {
  let service: SyncOperationFactoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SyncOperationFactoryService],
    }).compile();

    service = module.get<SyncOperationFactoryService>(SyncOperationFactoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
