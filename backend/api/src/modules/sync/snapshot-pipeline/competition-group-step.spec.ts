import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from "../../prisma/prisma.service";
import { CompetitionGroupStep } from './competition-group-step';

describe('StaticReferenceStep', () => {

  let step: CompetitionGroupStep;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompetitionGroupStep,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    step = module.get<CompetitionGroupStep>(CompetitionGroupStep);
  });

  it('should be defined', () => {
    expect(step).toBeDefined();
  });

});