import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from "../../prisma/prisma.service";
import { AdminReferenceStep } from './admin-reference-step';

describe('StaticReferenceStep', () => {

  let step: AdminReferenceStep;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminReferenceStep,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    step = module.get<AdminReferenceStep>(AdminReferenceStep);
  });

  it('should be defined', () => {
    expect(step).toBeDefined();
  });

});
