import { Test, TestingModule } from '@nestjs/testing';

import { UpdateCompetitionOperation } from './update-competition-operation';
import { UserService } from '../user.service';

describe('UpdateCompetitionOperation', () => {

  let operation: UpdateCompetitionOperation;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateCompetitionOperation,
        {
          provide: UserService,
          useValue: {
            getUserId: jest.fn(),
          },
        },
      ],
    }).compile();

    operation = module.get(UpdateCompetitionOperation);
  });

  it('should be defined', () => {
    expect(operation).toBeDefined();
  });
});
