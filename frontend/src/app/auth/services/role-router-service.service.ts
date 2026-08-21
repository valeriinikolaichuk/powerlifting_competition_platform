import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserRole } from '../enums/user-role';

@Injectable({
  providedIn: 'root',
})
export class RoleRouterServiceService {
  
  constructor(
      private readonly router: Router,
  ) {}

  async navigate(role: UserRole): Promise<void> {

    switch (role) {
      case UserRole.USER:
        await this.router.navigate(['/mode']);
        return;

      case UserRole.ADMIN:
        await this.router.navigate(['/admin']);
        return;

      case UserRole.PARTICIPANT:
        await this.router.navigate(['/registration']);
        return;
    }
  }

  async navigateToJudge(): Promise<void> {
    await this.router.navigate(['/judge']);
  }
}
