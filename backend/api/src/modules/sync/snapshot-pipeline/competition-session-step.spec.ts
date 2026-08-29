import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from "../../prisma/prisma.service";
import { CompetitionSessionStep } from './competition-session-step';

describe('StaticReferenceStep', () => {

  let step: CompetitionSessionStep;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompetitionSessionStep,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    step = module.get<CompetitionSessionStep>(CompetitionSessionStep);
  });

  it('should be defined', () => {
    expect(step).toBeDefined();
  });

});
