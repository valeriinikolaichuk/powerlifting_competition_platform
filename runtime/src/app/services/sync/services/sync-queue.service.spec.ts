import { TestBed } from '@angular/core/testing';

import { SyncQueueService } from './sync-queue.service';

describe('SyncQueueService', () => {
  let service: SyncQueueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SyncQueueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
