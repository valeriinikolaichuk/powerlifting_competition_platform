import { Component } from '@angular/core';
import { TranslationService } from '../../../../i18n/services/translation.service';
import { TranslatePipe } from '../../../../i18n/pipes/translate.pipe';

@Component({
  selector: 'app-second-tab-content',
  imports: [TranslatePipe],
  templateUrl: './second-tab-content.component.html',
})
export class SecondTabContentComponent {

  constructor(
    public tService: TranslationService,    
  ) {
    this.tService.load('popups/second-tab-popup');
  }
}
