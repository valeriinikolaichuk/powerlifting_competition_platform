import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerliftingChatComponent } from './powerlifting-chat.component';

describe('PowerliftingChatComponent', () => {
  let component: PowerliftingChatComponent;
  let fixture: ComponentFixture<PowerliftingChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PowerliftingChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PowerliftingChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
