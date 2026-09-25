import { Test, TestingModule } from '@nestjs/testing';

import { CreateCompetitionOperation } from './create-competition-operation';
import { UserService } from '../user.service';

describe('CreateCompetitionOperation', () => {

  let operation: CreateCompetitionOperation;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCompetitionOperation,
        {
          provide: UserService,
          useValue: {
            getUserId: jest.fn(),
          },
        },
      ],
    }).compile();

    operation = module.get(CreateCompetitionOperation);
  });

  it('should be defined', () => {
    expect(operation).toBeDefined();
  });
});
