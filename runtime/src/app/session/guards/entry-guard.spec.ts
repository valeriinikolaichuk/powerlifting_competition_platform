import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { entryGuard } from './entry-guard';

describe('modeGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => entryGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
