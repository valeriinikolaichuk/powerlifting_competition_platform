import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiftingOrderComponent } from './lifting-order.component';

describe('LiftingOrderComponent', () => {
  let component: LiftingOrderComponent;
  let fixture: ComponentFixture<LiftingOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiftingOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiftingOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
