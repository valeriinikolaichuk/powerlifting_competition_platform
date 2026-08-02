import { TestBed } from '@angular/core/testing';

import { RuntimeSessionService } from './runtime-session.service';

describe('RuntimeSessionService', () => {
  let service: RuntimeSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RuntimeSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
