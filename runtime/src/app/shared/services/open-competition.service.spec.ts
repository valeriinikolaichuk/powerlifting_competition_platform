import { TestBed } from '@angular/core/testing';

import { OpenCompetitionService } from './open-competition.service';

describe('OpenCompetitionService', () => {
  let service: OpenCompetitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenCompetitionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
