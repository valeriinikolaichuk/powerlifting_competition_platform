import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatingDatabaseComponent } from './creating-database.component';

describe('CreatingDatabaseComponent', () => {
  let component: CreatingDatabaseComponent;
  let fixture: ComponentFixture<CreatingDatabaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatingDatabaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatingDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
