import { TestBed } from '@angular/core/testing';

import { DeviceReceiverService } from './device-receiver.service';

describe('DeviceReceiverService', () => {
  let service: DeviceReceiverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceReceiverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
