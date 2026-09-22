import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscsSequenceComponent } from './discs-sequence.component';

describe('DiscsSequenceComponent', () => {
  let component: DiscsSequenceComponent;
  let fixture: ComponentFixture<DiscsSequenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscsSequenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscsSequenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
