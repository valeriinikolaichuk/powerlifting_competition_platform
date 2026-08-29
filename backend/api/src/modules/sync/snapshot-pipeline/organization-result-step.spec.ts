import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from "../../prisma/prisma.service";
import { OrganizationResultStep } from './organization-result-step';

describe('StaticReferenceStep', () => {

  let step: OrganizationResultStep;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationResultStep,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    step = module.get<OrganizationResultStep>(OrganizationResultStep);
  });

  it('should be defined', () => {
    expect(step).toBeDefined();
  });

});
