import { Component } from '@angular/core';
import { TranslationService } from '../../../../i18n/services/translation.service';
import { TranslatePipe } from '../../../../i18n/pipes/translate.pipe';

@Component({
  selector: 'app-delete-connections',
  imports: [TranslatePipe],
  templateUrl: './delete-connections.component.html',
})
export class DeleteConnectionsComponent {

  constructor(
    public tService: TranslationService,    
  ) {
    this.tService.load('popups/delete-connections');
  }
}
