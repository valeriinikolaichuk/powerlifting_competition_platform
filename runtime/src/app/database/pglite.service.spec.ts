import { TestBed } from '@angular/core/testing';

import { PgliteService } from './pglite.service';

describe('PgliteService', () => {
  let service: PgliteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PgliteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
