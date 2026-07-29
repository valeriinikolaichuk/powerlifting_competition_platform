import { Component, signal, effect, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { RoleRouterServiceService } from '../../services/role-router-service.service'; 
import { FrontendSessionService } from '../../../session/services/frontend-session.service';
import { TranslationService } from '../../../i18n/services/translation.service';
import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';

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
    public tService: TranslationService,
  ) {}

  ngOnInit() {
    this.tService.load('forms/login-form');
  }

  async onSubmit() {

    if (this.form.invalid) {return;}

    if (!(await this.frontendSessionService.lockLogin())) {return;}

    const dto = this.form.value;

    this.authService.login(dto).subscribe({
      next: async(response) => {
        console.log(response);

        if (!response.success || !response.role) 
        {
          this.form.reset();

          alert(response.message);

          await this.frontendSessionService.clearLogin();

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
