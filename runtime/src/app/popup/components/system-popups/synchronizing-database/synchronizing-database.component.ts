import { Component } from '@angular/core';
import { TranslationService } from '../../../../i18n/services/translation.service';
import { TranslatePipe } from '../../../../i18n/pipes/translate.pipe';

@Component({
  selector: 'app-synchronizing-database',
  imports: [TranslatePipe],
  templateUrl: './synchronizing-database.component.html',
})
export class SynchronizingDatabaseComponent {

    constructor(
    public tService: TranslationService,    
  ) {
    this.tService.load('popups/synchronizing-database');
  }
}
