import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from "../../prisma/prisma.service";
import { UserReferenceFederationsStep } from './user-reference-federations-step';

describe('StaticReferenceStep', () => {

  let step: UserReferenceFederationsStep;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserReferenceFederationsStep,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    step = module.get<UserReferenceFederationsStep>(UserReferenceFederationsStep);
  });

  it('should be defined', () => {
    expect(step).toBeDefined();
  });

});
