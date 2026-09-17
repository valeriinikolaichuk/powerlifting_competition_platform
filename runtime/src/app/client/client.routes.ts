import { Routes } from '@angular/router';

import { sessionGuard } from '../session/guards/session-guard-guard';

import { RoleComponent } from './role/role.component';

export const CLIENT_ROUTES: Routes = [
  {
    path: '',
    component: RoleComponent,
    canActivate: [sessionGuard],
  },
];