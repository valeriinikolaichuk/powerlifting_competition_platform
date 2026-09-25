import { TestBed } from '@angular/core/testing';

import { CompetitionConfigService } from './competition-config.service';

describe('CompetitionPopupService', () => {
  let service: CompetitionConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompetitionConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
