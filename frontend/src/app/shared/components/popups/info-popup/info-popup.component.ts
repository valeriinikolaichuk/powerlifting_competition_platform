import { Component, inject } from '@angular/core';
import { PopupService } from '../../../../services/popup.service';
import { POPUP_DATA } from '../../../tokens/popup-data.token';

@Component({
  selector: 'app-info-popup',
  standalone: true,
  imports: [],
  templateUrl: './info-popup.component.html',
})
export class InfoPopupComponent {
  popup = inject(PopupService);
  data = inject(POPUP_DATA);

  close() {
    this.popup.close();
  }
}
