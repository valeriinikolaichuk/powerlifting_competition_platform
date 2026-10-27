import { TestBed } from '@angular/core/testing';

import { ColumnResizeService } from './column-resize.service';

describe('ColumnResizeService', () => {
  let service: ColumnResizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColumnResizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
