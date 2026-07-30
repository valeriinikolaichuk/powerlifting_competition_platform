import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { TranslationService } from '../../i18n/services/translation.service';
import { TranslatePipe } from '../../i18n/pipes/translate.pipe';

@Component({
  selector: 'app-lan',
  imports: [TranslatePipe,],
  templateUrl: './lan.component.html',
})
export class LanComponent {

  constructor(
    private readonly router: Router,
    public tService: TranslationService,
  ) {
    this.tService.load('pages/lan');
  }

  async return(): Promise<void> {
    await this.router.navigate(['/mode']);
  }
}
