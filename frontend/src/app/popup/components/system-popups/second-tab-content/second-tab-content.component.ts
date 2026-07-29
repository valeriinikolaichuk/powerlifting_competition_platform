import { Component, effect, inject, signal } from '@angular/core';
import { TranslationService } from '../../../../i18n/services/translation.service';

@Component({
  selector: 'app-second-tab-content',
  imports: [],
  templateUrl: './second-tab-content.component.html',
})
export class SecondTabContentComponent {

  tService = inject(TranslationService);

  data = signal<any>(null);

  constructor() {
    this.tService.load('second-tab-popup');

    effect(() => {
      const lang = this.tService.lang();
      const translations = this.tService.translations();

      const content = translations?.[lang]?.['second-tab-popup'];

      if (content) {
        this.data.set(content);
      }
    });
  }
}
