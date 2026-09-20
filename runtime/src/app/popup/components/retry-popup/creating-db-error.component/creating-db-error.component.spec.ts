import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatingDbErrorComponent } from './creating-db-error.component';

describe('CreatingDbErrorComponent', () => {
  let component: CreatingDbErrorComponent;
  let fixture: ComponentFixture<CreatingDbErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatingDbErrorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatingDbErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
