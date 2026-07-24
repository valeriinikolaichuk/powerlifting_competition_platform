import { Test, TestingModule } from '@nestjs/testing';
import { AuthDefaultService } from './auth-default.service';

describe('AuthDefaultService', () => {
  let service: AuthDefaultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthDefaultService],
    }).compile();

    service = module.get<AuthDefaultService>(AuthDefaultService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
