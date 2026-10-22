import { TestBed } from '@angular/core/testing';

import { CheckOnlineService } from './check-online.service';

describe('CheckOnlineService', () => {
  let service: CheckOnlineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckOnlineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
