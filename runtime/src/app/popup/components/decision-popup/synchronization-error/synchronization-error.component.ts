import { Component } from '@angular/core';
import { TranslationService } from '../../../../i18n/services/translation.service';
import { TranslatePipe } from '../../../../i18n/pipes/translate.pipe';

@Component({
  selector: 'app-synchronization-error',
  imports: [TranslatePipe],
  templateUrl: './synchronization-error.component.html',
})
export class SynchronizationErrorComponent {

  constructor(
    public tService: TranslationService,    
  ) {
    this.tService.load('popups/decision-popup');
  }
}
