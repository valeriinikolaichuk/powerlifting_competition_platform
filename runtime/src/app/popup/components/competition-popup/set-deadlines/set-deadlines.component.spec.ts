import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetDeadlinesComponent } from './set-deadlines.component';

describe('SetDeadlinesComponent', () => {
  let component: SetDeadlinesComponent;
  let fixture: ComponentFixture<SetDeadlinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetDeadlinesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetDeadlinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
