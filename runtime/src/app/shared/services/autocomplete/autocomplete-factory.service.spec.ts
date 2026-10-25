import { TestBed } from '@angular/core/testing';

import { AutocompleteFactoryService } from './autocomplete-factory.service';

describe('AutocompleteFactoryService', () => {
  let service: AutocompleteFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutocompleteFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
