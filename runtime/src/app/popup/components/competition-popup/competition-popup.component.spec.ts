import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitionPopupComponent } from './competition-popup.component';

describe('CompetitionPopupComponent', () => {
  let component: CompetitionPopupComponent;
  let fixture: ComponentFixture<CompetitionPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompetitionPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompetitionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
