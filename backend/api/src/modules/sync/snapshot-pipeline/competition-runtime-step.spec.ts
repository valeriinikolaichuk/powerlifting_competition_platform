import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from "../../prisma/prisma.service";
import { CompetitionRuntimeStep } from './competition-runtime-step';

describe('StaticReferenceStep', () => {

  let step: CompetitionRuntimeStep;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompetitionRuntimeStep,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    step = module.get<CompetitionRuntimeStep>(CompetitionRuntimeStep);
  });

  it('should be defined', () => {
    expect(step).toBeDefined();
  });

});
