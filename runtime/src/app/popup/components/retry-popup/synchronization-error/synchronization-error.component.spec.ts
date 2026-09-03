import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SynchronizationErrorComponent } from './synchronization-error.component';

describe('SynchronizationErrorComponent', () => {
  let component: SynchronizationErrorComponent;
  let fixture: ComponentFixture<SynchronizationErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SynchronizationErrorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SynchronizationErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
