import { TestBed } from '@angular/core/testing';

import { AthleteRegistrationService } from './athlete-registration.service';

describe('AthleteRegistrationService', () => {
  let service: AthleteRegistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AthleteRegistrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
