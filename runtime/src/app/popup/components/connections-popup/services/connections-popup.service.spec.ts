import { TestBed } from '@angular/core/testing';

import { ConnectionsPopupService } from './connections-popup.service';

describe('ConnectionsPopupService', () => {
  let service: ConnectionsPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConnectionsPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
