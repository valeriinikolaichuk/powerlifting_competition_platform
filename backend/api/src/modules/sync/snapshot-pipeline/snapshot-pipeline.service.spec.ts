import { Test, TestingModule } from '@nestjs/testing';
import { SnapshotPipelineService } from './snapshot-pipeline.service';

describe('SnapshotPipelineService', () => {
  let service: SnapshotPipelineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SnapshotPipelineService],
    }).compile();

    service = module.get<SnapshotPipelineService>(SnapshotPipelineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
