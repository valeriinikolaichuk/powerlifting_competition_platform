import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NominationTable } from './nomination-table';

describe('NominationTable', () => {
  let component: NominationTable;
  let fixture: ComponentFixture<NominationTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NominationTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NominationTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
