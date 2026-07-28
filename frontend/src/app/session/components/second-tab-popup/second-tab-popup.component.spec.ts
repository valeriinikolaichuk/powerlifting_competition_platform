import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondTabPopupComponent } from './second-tab-popup.component';

describe('SecondTabPopupComponent', () => {
  let component: SecondTabPopupComponent;
  let fixture: ComponentFixture<SecondTabPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondTabPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondTabPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
