import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemPopupComponent } from './system-popup.component';

describe('SessionPopupComponent', () => {
  let component: SystemPopupComponent;
  let fixture: ComponentFixture<SystemPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
