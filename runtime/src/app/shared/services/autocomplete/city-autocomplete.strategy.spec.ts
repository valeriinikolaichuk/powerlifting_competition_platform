import { TestBed } from '@angular/core/testing';

import { CityAutocompleteStrategy } from './city-autocomplete.strategy';

describe('SityAutocompleteStrategy', () => {
  let service: CityAutocompleteStrategy;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CityAutocompleteStrategy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
