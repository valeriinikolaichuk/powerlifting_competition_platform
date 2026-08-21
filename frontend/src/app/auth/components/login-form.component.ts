import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../services/auth.service';
import { RoleRouterServiceService } from '../services/role-router-service.service'; 
import { FrontendSessionService } from '../../session/services/frontend-session.service';

import { PopupService } from '../../popup/services/popup.service';
import { MessagePopupComponent } from '../../popup/components/message-popups/message-popup.component';
import { LoginErrorComponent } from '../../popup/components/message-popups/login-error.component/login-error.component';

import { TranslationService } from '../../i18n/services/translation.service';
import { TranslatePipe } from '../../i18n/pipes/translate.pipe';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
  ],
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent {

  private readonly fb = inject(FormBuilder);

  form = this.fb.group({
    login: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private readonly authService: AuthService,
    private readonly roleRouter: RoleRouterServiceService,
    private readonly frontendSessionService: FrontendSessionService,
    private readonly popupService: PopupService,
    public tService: TranslationService,
  ) {}

  ngOnInit() {
    this.tService.load('forms/login-form');
  }

  async onSubmit() {

    if (this.form.invalid) {return;}

    if (!(await this.frontendSessionService.lockLogin())) {return;}

    const dto = this.form.value;
    const rawLogin = dto.login || '';
    const isJudge = rawLogin.endsWith('JUDGE');

    const cleanDto = { 
      ...dto, 
      login: isJudge ? rawLogin.slice(0, -5) : rawLogin 
    };

    this.authService.login(cleanDto).subscribe({
      next: async(response) => {
        console.log(response);

        if (!response.success || !response.role) 
        {
          this.form.reset();

          this.popupService.open(MessagePopupComponent, {
            content: LoginErrorComponent,
          });

          await this.frontendSessionService.clearLogin();

          return;
        }

        if (isJudge) {
          await this.roleRouter.navigateToJudge();

          return;
        }

        await this.roleRouter.navigate(response.role);

      },
      error: async() => {
        
        await this.frontendSessionService.clearLogin();

        console.error('error by path: /api/login');
      },
    });
  };
}
