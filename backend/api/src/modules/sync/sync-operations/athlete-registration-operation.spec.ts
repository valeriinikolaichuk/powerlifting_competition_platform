import { Test, TestingModule } from '@nestjs/testing';

import { AthleteRegistrationOperation } from './athlete-registration-operation';
import { UserService } from '../user.service';

describe('AthleteRegistrationOperation', () => {

  let operation: AthleteRegistrationOperation;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AthleteRegistrationOperation,
        {
          provide: UserService,
          useValue: {
            getUserId: jest.fn(),
          },
        },
      ],
    }).compile();

    operation = module.get(AthleteRegistrationOperation);
  });

  it('should be defined', () => {
    expect(operation).toBeDefined();
  });
});
