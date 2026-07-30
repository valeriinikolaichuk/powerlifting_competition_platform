import { Component } from '@angular/core';
import { TranslationService } from '../../../../i18n/services/translation.service';
import { TranslatePipe } from '../../../../i18n/pipes/translate.pipe';

@Component({
  selector: 'app-login-error',
  imports: [TranslatePipe],
  templateUrl: './login-error.component.html',
})
export class LoginErrorComponent {

  constructor(
    public tService: TranslationService,    
  ) {
    this.tService.load('popups/login-error');
  }
}
