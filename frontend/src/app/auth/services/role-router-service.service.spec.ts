import { TestBed } from '@angular/core/testing';

import { RoleRouterServiceService } from './role-router-service.service';

describe('RoleRouterServiceService', () => {
  let service: RoleRouterServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleRouterServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
