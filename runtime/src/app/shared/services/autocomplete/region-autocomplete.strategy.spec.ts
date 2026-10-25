import { TestBed } from '@angular/core/testing';

import { RegionAutocompleteStrategy } from './region-autocomplete.strategy';

describe('RegionAutocompleteStrategy', () => {
  let service: RegionAutocompleteStrategy;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegionAutocompleteStrategy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
