import { TestBed } from '@angular/core/testing';

import { CountryAutocompleteStrategy } from './country-autocomplete.strategy';

describe('CountryAutocompleteStrategy', () => {
  let service: CountryAutocompleteStrategy;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CountryAutocompleteStrategy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
