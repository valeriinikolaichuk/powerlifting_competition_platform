import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

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
    private readonly route: ActivatedRoute,
    public tService: TranslationService,
  ) {}

  ngOnInit(): void {

    const lang = this.route.snapshot.queryParamMap.get('lang');

    if (lang === 'en' || lang === 'uk' || lang === 'pl') {
      this.tService.setLang(lang);
    }

    this.tService.load('pages/mode');

    window.history.replaceState(
      {},
      '',
      window.location.pathname
    );
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
