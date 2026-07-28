import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { FrontendSessionService } from '../../session/services/frontend-session.service';

@Component({
  selector: 'app-mode',
  standalone: true,
  imports: [],
  templateUrl: './mode.component.html',
})
export class ModeComponent {

  constructor(
    private readonly authService: AuthService,
    private readonly frontendSessionService: FrontendSessionService,
    private readonly router: Router,
  ) {}

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
