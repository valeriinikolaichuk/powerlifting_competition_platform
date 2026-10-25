import { TestBed } from '@angular/core/testing';

import { FullnameAutocompleteStrategy } from './fullname-autocomplete.strategy';

describe('FullnameAutocompleteStrategy', () => {
  let service: FullnameAutocompleteStrategy;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FullnameAutocompleteStrategy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
