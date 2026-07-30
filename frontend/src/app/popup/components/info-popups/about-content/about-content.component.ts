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
    { title: 'CLIENT_3_TITLE', text: 'CLIENT_3_TEXT' },
    { title: 'CLIENT_4_TITLE', text: 'CLIENT_4_TEXT' },
    { title: 'CLIENT_5_TITLE', text: 'CLIENT_5_TEXT' },
    { title: 'CLIENT_6_TITLE', text: 'CLIENT_6_TEXT' },
  ];

  constructor(
    public tService: TranslationService,
  ) {
    this.tService.load('popups/about-popup');
  }
}
