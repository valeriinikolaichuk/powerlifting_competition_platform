import { Component, inject, Type } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { PopupService } from '../../services/popup.service';
import { POPUP_DATA } from '../../tokens/popup-data.token';
import { TranslationService } from '../../../i18n/services/translation.service';
import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';

@Component({
  selector: 'app-retry-popup',
  standalone: true,
  imports: [
    NgComponentOutlet,
    TranslatePipe,
  ],
  templateUrl: './retry-popup.component.html',
})
export class RetryPopupComponent {

  popup = inject(PopupService);

  data = inject(POPUP_DATA) as {
    content: Type<any>;
  };

  constructor(
    public tService: TranslationService,    
  ) {
    this.tService.load('popups/retry-popup');
  }

  retry(): void {
    this.popup.close(true);
  }
}
