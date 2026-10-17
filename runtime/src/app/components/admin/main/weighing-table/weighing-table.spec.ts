import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeighingTable } from './weighing-table';

describe('WeighingTable', () => {
  let component: WeighingTable;
  let fixture: ComponentFixture<WeighingTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeighingTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeighingTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
