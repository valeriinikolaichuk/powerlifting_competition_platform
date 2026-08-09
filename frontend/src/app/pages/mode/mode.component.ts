import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { FrontendSessionService } from '../../session/services/frontend-session.service';
import { TranslationService } from '../../i18n/services/translation.service';
import { TranslatePipe } from '../../i18n/pipes/translate.pipe';

@Component({
  selector: 'app-mode',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './mode.component.html',
})
export class ModeComponent {

  private readonly SESSION_ID = 1;

  constructor(
    private readonly authService: AuthService,
    private readonly frontendSessionService: FrontendSessionService,
    private readonly router: Router,
    public tService: TranslationService,
  ) {
    this.tService.load('pages/mode');
  }

  async openLan(): Promise<void> {
    console.log('openLan');
    await this.router.navigate(['/lan']);
  }

  async openOnline(): Promise<void> {

    const lang = this.tService.lang();

    await this.frontendSessionService.clearSession();

    const url = `${environment.apiUrl}/runtime?lang=${lang}&mode=online`;

    window.location.href = url;
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
