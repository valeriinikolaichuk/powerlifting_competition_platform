import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from "../../prisma/prisma.service";
import { CompetitionsTableStep } from "./competitions-table-step";

describe('StaticReferenceStep', () => {

  let step: CompetitionsTableStep;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompetitionsTableStep,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    step = module.get<CompetitionsTableStep>(CompetitionsTableStep);
  });

  it('should be defined', () => {
    expect(step).toBeDefined();
  });

});
