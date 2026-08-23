import { Test, TestingModule } from '@nestjs/testing';
import { LanService } from './lan.service';

describe('LanService', () => {
  let service: LanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LanService],
    }).compile();

    service = module.get<LanService>(LanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
