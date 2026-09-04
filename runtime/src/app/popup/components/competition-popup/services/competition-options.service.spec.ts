import { TestBed } from '@angular/core/testing';

import { CompetitionOptionsService } from './competition-options.service';

describe('CompetitionOptionsService', () => {
  let service: CompetitionOptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompetitionOptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
