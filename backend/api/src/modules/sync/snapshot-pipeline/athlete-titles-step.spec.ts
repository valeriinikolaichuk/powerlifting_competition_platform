import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from "../../prisma/prisma.service";
import { AthleteTitlesStep } from './athlete-titles-step';

describe('StaticReferenceStep', () => {

  let step: AthleteTitlesStep;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AthleteTitlesStep,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    step = module.get<AthleteTitlesStep>(AthleteTitlesStep);
  });

  it('should be defined', () => {
    expect(step).toBeDefined();
  });

});
