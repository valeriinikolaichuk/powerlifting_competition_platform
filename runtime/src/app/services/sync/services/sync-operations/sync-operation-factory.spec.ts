import { TestBed } from '@angular/core/testing';

import { SyncOperationFactory } from './sync-operation-factory';

describe('SyncOperationFactory', () => {
  let service: SyncOperationFactory;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SyncOperationFactory);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
