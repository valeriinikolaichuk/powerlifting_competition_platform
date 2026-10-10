import { TestBed } from '@angular/core/testing';

import { NominationOptionsService } from './nomination-options.service';

describe('NominationOptionsService', () => {
  let service: NominationOptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NominationOptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
