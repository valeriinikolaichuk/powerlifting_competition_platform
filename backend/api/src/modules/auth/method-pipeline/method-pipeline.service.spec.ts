import { Test, TestingModule } from '@nestjs/testing';
import { MethodPipelineService } from './method-pipeline.service';

describe('MethodPipelineService', () => {
  let service: MethodPipelineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MethodPipelineService],
    }).compile();

    service = module.get<MethodPipelineService>(MethodPipelineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
