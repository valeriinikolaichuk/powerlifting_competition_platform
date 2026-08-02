import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondTabContentComponent } from './second-tab-content.component';

describe('SecondTabContentComponent', () => {
  let component: SecondTabContentComponent;
  let fixture: ComponentFixture<SecondTabContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondTabContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondTabContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
