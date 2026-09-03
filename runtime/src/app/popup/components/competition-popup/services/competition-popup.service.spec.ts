import { TestBed } from '@angular/core/testing';

import { CompetitionPopupService } from './competition-popup.service';

describe('CompetitionPopupService', () => {
  let service: CompetitionPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompetitionPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
