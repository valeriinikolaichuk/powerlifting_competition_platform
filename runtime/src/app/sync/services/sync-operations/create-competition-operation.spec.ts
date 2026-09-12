import { TestBed } from '@angular/core/testing';

import { CreateCompetitionOperation } from './create-competition-operation';

describe('CreateCompetitionOperation', () => {
  let service: CreateCompetitionOperation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateCompetitionOperation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
