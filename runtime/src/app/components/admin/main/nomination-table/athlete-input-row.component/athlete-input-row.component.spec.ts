import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteInputRowComponent } from './athlete-input-row.component';

describe('AthleteInputRowComponent', () => {
  let component: AthleteInputRowComponent;
  let fixture: ComponentFixture<AthleteInputRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AthleteInputRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AthleteInputRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
