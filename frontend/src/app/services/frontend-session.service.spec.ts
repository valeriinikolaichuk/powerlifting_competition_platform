import { TestBed } from '@angular/core/testing';

import { FrontendSessionService } from './frontend-session.service';

describe('FrontendSessionService', () => {
  let service: FrontendSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FrontendSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
