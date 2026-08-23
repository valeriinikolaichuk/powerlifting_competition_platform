import { TestBed } from '@angular/core/testing';

import { LanTokenService } from './lan-token.service';

describe('LanTokenService', () => {
  let service: LanTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
