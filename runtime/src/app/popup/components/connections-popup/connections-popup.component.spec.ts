import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionsPopupComponent } from './connections-popup.component';

describe('ConnectionsPopup', () => {
  let component: ConnectionsPopupComponent;
  let fixture: ComponentFixture<ConnectionsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectionsPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectionsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
