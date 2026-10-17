import { TestBed } from '@angular/core/testing';

import { AthleteTableOptionsService } from './athlete-table-options.service';

describe('AthleteTableOptionsService', () => {
  let service: AthleteTableOptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AthleteTableOptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
