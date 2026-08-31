import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionPopupComponent } from './decision-popup.component';

describe('DecisionPopupComponent', () => {
  let component: DecisionPopupComponent;
  let fixture: ComponentFixture<DecisionPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DecisionPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DecisionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
