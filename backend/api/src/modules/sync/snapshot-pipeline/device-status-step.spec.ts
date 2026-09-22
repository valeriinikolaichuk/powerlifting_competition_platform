import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from "../../prisma/prisma.service";
import { DeviceStatusStep } from './device-status-step';

describe('StaticReferenceStep', () => {

  let step: DeviceStatusStep;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeviceStatusStep,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    step = module.get<DeviceStatusStep>(DeviceStatusStep);
  });

  it('should be defined', () => {
    expect(step).toBeDefined();
  });

});