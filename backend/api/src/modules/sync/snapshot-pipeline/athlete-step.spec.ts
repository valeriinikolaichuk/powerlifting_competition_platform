import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from "../../prisma/prisma.service";
import { AthleteStep } from './athlete-step';

describe('StaticReferenceStep', () => {

  let step: AthleteStep;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AthleteStep,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    step = module.get<AthleteStep>(AthleteStep);
  });

  it('should be defined', () => {
    expect(step).toBeDefined();
  });

});
