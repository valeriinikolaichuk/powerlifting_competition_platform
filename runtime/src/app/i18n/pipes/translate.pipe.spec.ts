import { TestBed } from '@angular/core/testing';

import { TranslatePipe } from './translate.pipe';

describe('TranslatePipe', () => {
  let service: TranslatePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslatePipe);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
