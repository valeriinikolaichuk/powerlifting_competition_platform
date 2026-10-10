import { Test, TestingModule } from '@nestjs/testing';
import { NominationOptionsService } from './nomination-options.service';

describe('NominationOptionsService', () => {
  let service: NominationOptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NominationOptionsService],
    }).compile();

    service = module.get<NominationOptionsService>(NominationOptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
