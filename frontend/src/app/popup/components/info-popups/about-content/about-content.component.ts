import { Component } from '@angular/core';
import { TranslationService } from '../../../../i18n/services/translation.service';
import { TranslatePipe } from '../../../../i18n/pipes/translate.pipe';

@Component({
  selector: 'app-about-content',
  imports: [TranslatePipe],
  templateUrl: './about-content.component.html',
})
export class AboutContentComponent {

  items = [
    { title: 'CLIENT_1_TITLE', text: 'CLIENT_1_TEXT' },
    { title: 'CLIENT_2_TITLE', text: 'CLIENT_2_TEXT' },
  ];

  constructor(
    public tService: TranslationService,
  ) {
    this.tService.load('popups/about-popup');
  }
}
