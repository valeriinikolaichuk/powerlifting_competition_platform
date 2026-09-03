import { Component, inject, Type } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';

import { PopupService } from '../../services/popup.service';
import { POPUP_DATA } from '../../tokens/popup-data.token';

@Component({
  selector: 'app-competition-popup',
  standalone: true,
  imports: [NgComponentOutlet],
  templateUrl: './competition-popup.component.html',
})
export class CompetitionPopupComponent {

  popup = inject(PopupService);

  data = inject(POPUP_DATA) as {
    content: Type<any>;
  };
}
