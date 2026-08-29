import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from "../../prisma/prisma.service";
import { CompetitionStep } from './competition-step';

describe('StaticReferenceStep', () => {

  let step: CompetitionStep;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompetitionStep,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    step = module.get<CompetitionStep>(CompetitionStep);
  });

  it('should be defined', () => {
    expect(step).toBeDefined();
  });

});
