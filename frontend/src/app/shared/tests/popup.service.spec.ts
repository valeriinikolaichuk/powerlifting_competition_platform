import { TestBed } from '@angular/core/testing';

import { PopupService } from '../../../../../shared/frontend/src/services/popup.service';

describe('PopupInfoService', () => {
  let service: PopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
