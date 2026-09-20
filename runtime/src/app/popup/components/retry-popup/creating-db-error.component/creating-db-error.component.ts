import { Component } from '@angular/core';
import { TranslationService } from '../../../../i18n/services/translation.service';
import { TranslatePipe } from '../../../../i18n/pipes/translate.pipe';

@Component({
  selector: 'app-creating-db-error',
  imports: [TranslatePipe],
  templateUrl: './creating-db-error.component.html',
})
export class CreatingDbErrorComponent {

  constructor(
    public tService: TranslationService,    
  ) {
    this.tService.load('popups/retry-popup');
  }
}
