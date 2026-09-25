import { Test, TestingModule } from '@nestjs/testing';
import { DeviceRoleService } from './device-role.service.service';

describe('DeviceRoleServiceService', () => {
  let service: DeviceRoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeviceRoleService],
    }).compile();

    service = module.get<DeviceRoleService>(DeviceRoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
