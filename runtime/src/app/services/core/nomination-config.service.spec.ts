import { TestBed } from '@angular/core/testing';

import { NominationConfigService } from './nomination-config.service';

describe('NominationConfigService', () => {
  let service: NominationConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NominationConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
