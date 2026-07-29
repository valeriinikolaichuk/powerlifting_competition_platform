import { Component, signal, effect } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { FrontendSessionService } from '../../session/services/frontend-session.service';
import { TranslationService } from '../../i18n/services/translation.service';

@Component({
  selector: 'app-mode',
  standalone: true,
  imports: [],
  templateUrl: './mode.component.html',
})
export class ModeComponent {

  data = signal<any>(null);

  constructor(
    private readonly authService: AuthService,
    private readonly frontendSessionService: FrontendSessionService,
    private readonly router: Router,
    public tService: TranslationService,
  ) {
    this.tService.load('pages/mode');

    effect(() => {
      const lang = this.tService.lang();
      const translations = this.tService.translations();

      const content = translations?.[lang]?.['pages/mode'];

      if (content) {
        this.data.set(content);
      }
    });
  }

  async openLan(): Promise<void> {
    console.log('openLan');
    await this.router.navigate(['/lan']);
  }

  async logout() {

    this.authService.logout().subscribe({
      next: async () => {

        await this.frontendSessionService.clearLogin();

        await this.router.navigate(['/']);
      },

      error: async () => {
        
        await this.frontendSessionService.clearLogin();

        await this.router.navigate(['/']);
      }
    });
  }
}
