import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { modeGuard } from './mode-guard';

describe('modeGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => modeGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
