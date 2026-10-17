import { TestBed } from '@angular/core/testing';

import { ColspanFactoryService } from './colspan-factory.service';

describe('ColspanFactoryService', () => {
  let service: ColspanFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColspanFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
