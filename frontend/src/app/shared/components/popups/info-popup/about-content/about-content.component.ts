import { Component, effect, inject, signal } from '@angular/core';
import { TranslationService } from '../../../../../services/translation.service';

@Component({
  selector: 'app-about-content',
  imports: [],
  templateUrl: './about-content.component.html',
})
export class AboutContentComponent {
  tService = inject(TranslationService);

  data = signal<any>(null);

  constructor() {
    this.tService.load('about-popup');

    effect(() => {
      const lang = this.tService.lang();
      const translations = this.tService.translations();

      const content = translations?.[lang]?.['about-popup'];

      if (content) {
        this.data.set(content);
      }
    });
  }
}
