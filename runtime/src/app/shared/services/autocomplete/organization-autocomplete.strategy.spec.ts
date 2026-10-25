import { TestBed } from '@angular/core/testing';

import { OrganizationAutocompleteStrategy } from './organization-autocomplete.strategy';

describe('OrganizationAutocompleteStrategy', () => {
  let service: OrganizationAutocompleteStrategy;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrganizationAutocompleteStrategy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
