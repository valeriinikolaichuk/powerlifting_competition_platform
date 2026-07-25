import { Test, TestingModule } from '@nestjs/testing';
import { SessionPolicyFactoryService } from './session-policy-factory.service';

describe('SessionPolicyFactoryService', () => {
  let service: SessionPolicyFactoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionPolicyFactoryService],
    }).compile();

    service = module.get<SessionPolicyFactoryService>(SessionPolicyFactoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
