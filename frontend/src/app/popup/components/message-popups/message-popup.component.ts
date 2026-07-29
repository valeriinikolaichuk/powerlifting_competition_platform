import { Component, inject, Type } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { PopupService } from '../../services/popup.service';
import { POPUP_DATA } from '../../tokens/popup-data.token';

@Component({
  selector: 'app-message-popup',
  standalone: true,
  imports: [NgComponentOutlet],
  templateUrl: './message-popup.component.html',
})
export class MessagePopupComponent {

  private readonly popupService = inject(PopupService);

  data = inject(POPUP_DATA) as {
    content: Type<any>;
  };

  close(): void {
    this.popupService.close();
  }
}
