import { TestBed } from '@angular/core/testing';

import { ArchiveCompetitionOperation } from './archive-competition-operation';

describe('CreateCompetitionOperation', () => {
  let service: ArchiveCompetitionOperation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArchiveCompetitionOperation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
