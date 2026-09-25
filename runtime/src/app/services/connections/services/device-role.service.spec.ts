import { TestBed } from '@angular/core/testing';

import { DeviceRoleService } from './device-role.service';

describe('DeviceRoleService', () => {
  let service: DeviceRoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceRoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
