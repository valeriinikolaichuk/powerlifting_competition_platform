import { Routes } from '@angular/router';

import { sessionGuard } from '../../session/guards/session-guard-guard';

import { AdminComponent } from './admin/admin.component';
import { MainComponent } from './main/main.component';
import { RegistrationComponent } from './registration/registration.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [sessionGuard],
  },
  {
    path: 'main',
    component: MainComponent,
    canActivate: [sessionGuard],
  },
  {
    path: 'registration',
    component: RegistrationComponent,
    canActivate: [sessionGuard],
  },
];