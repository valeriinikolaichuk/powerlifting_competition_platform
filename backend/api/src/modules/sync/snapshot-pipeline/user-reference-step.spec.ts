import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from "../../prisma/prisma.service";
import { UserReferenceStep } from './user-reference-step';

describe('StaticReferenceStep', () => {

  let step: UserReferenceStep;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserReferenceStep,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    step = module.get<UserReferenceStep>(UserReferenceStep);
  });

  it('should be defined', () => {
    expect(step).toBeDefined();
  });

});
