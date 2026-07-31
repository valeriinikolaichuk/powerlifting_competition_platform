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

  openOnline(): void {
    window.location.href = `${environment.apiUrl}/runtime`;
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
