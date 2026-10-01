import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenCompetitionPopupComponent } from './open-competition-popup.component';

describe('OpenCompetitionPopupComponent', () => {
  let component: OpenCompetitionPopupComponent;
  let fixture: ComponentFixture<OpenCompetitionPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenCompetitionPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenCompetitionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
