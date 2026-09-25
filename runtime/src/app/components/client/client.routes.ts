import { Routes } from '@angular/router';

import { sessionGuard } from '../../session/guards/session-guard-guard';

import { RoleComponent } from './role/role.component';
import { WeighingInComponent } from './weighing-in.component/weighing-in.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { LiftingOrderComponent } from './lifting-order/lifting-order.component';
import { DiscsSequenceComponent } from './discs-sequence/discs-sequence.component';
import { InformationComponent } from './information/information.component';
import { TimerComponent } from './timer/timer.component';

export const CLIENT_ROUTES: Routes = [
  {
    path: '',
    component: RoleComponent,
    canActivate: [sessionGuard],
  },
  {
    path: 'weighing_in',
    component: WeighingInComponent,
    canActivate: [sessionGuard],
  },
  {
    path: 'scoreboard',
    component: ScoreboardComponent,
    canActivate: [sessionGuard],
  },
  {
    path: 'lifting_order',
    component: LiftingOrderComponent,
    canActivate: [sessionGuard],
  },
  {
    path: 'discs_sequence',
    component: DiscsSequenceComponent,
    canActivate: [sessionGuard],
  },
  {
    path: 'information',
    component: InformationComponent,
    canActivate: [sessionGuard],
  },
  {
    path: 'timer',
    component: TimerComponent,
    canActivate: [sessionGuard],
  },
];