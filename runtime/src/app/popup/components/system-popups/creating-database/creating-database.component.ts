import { Component } from '@angular/core';
import { TranslationService } from '../../../../i18n/services/translation.service';
import { TranslatePipe } from '../../../../i18n/pipes/translate.pipe';

@Component({
  selector: 'app-creating-database',
  imports: [TranslatePipe],
  templateUrl: './creating-database.component.html',
})
export class CreatingDatabaseComponent {

  constructor(
    public tService: TranslationService,    
  ) {
    this.tService.load('popups/synchronizing-database');
  }
}
