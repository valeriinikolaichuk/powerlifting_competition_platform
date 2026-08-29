import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from "../../prisma/prisma.service";
import { StaticReferenceStep } from './static-reference-step';

describe('StaticReferenceStep', () => {

  let step: StaticReferenceStep;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StaticReferenceStep,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    step = module.get<StaticReferenceStep>(StaticReferenceStep);
  });

  it('should be defined', () => {
    expect(step).toBeDefined();
  });

});
