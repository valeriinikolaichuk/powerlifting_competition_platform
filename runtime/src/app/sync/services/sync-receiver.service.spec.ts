import { TestBed } from '@angular/core/testing';

import { SyncReceiverService } from './sync-receiver.service';

describe('SyncReceiverService', () => {
  let service: SyncReceiverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SyncReceiverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
