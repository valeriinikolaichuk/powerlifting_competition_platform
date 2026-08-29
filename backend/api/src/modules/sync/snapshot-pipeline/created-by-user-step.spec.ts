import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from "../../prisma/prisma.service";
import { CreatedByUserStep } from './created-by-user-step';

describe('StaticReferenceStep', () => {

  let step: CreatedByUserStep;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatedByUserStep,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    step = module.get<CreatedByUserStep>(CreatedByUserStep);
  });

  it('should be defined', () => {
    expect(step).toBeDefined();
  });

});
