import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from "../../prisma/prisma.service";
import { UserStep } from './user-step';

describe('StaticReferenceStep', () => {

  let step: UserStep;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserStep,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    step = module.get<UserStep>(UserStep);
  });

  it('should be defined', () => {
    expect(step).toBeDefined();
  });

});
