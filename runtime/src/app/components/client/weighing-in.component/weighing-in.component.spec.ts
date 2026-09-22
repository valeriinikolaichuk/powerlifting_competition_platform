import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeighingInComponent } from './weighing-in.component';

describe('WeighingInComponent', () => {
  let component: WeighingInComponent;
  let fixture: ComponentFixture<WeighingInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeighingInComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeighingInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
