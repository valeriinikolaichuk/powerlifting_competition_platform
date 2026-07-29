import { Component, effect, inject, signal } from '@angular/core';
import { TranslationService } from '../../../../i18n/services/translation.service';

@Component({
  selector: 'app-login-error',
  imports: [],
  templateUrl: './login-error.component.html',
})
export class LoginErrorComponent {

  tService = inject(TranslationService);

  data = signal<any>(null);

  constructor() {
    this.tService.load('login-error');

    effect(() => {
      const lang = this.tService.lang();
      const translations = this.tService.translations();

      const content = translations?.[lang]?.['login-error'];

      if (content) {
        this.data.set(content);
      }
    });
  }
}
