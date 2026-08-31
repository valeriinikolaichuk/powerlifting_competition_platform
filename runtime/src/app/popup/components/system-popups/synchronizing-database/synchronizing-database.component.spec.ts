import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SynchronizingDatabaseComponent } from './synchronizing-database.component';

describe('SynchronizingDatabaseComponent', () => {
  let component: SynchronizingDatabaseComponent;
  let fixture: ComponentFixture<SynchronizingDatabaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SynchronizingDatabaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SynchronizingDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
