import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetryPopupComponent } from './retry-popup.component';

describe('DecisionPopupComponent', () => {
  let component: RetryPopupComponent;
  let fixture: ComponentFixture<RetryPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetryPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetryPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
