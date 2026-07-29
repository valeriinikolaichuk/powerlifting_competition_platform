import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ModeComponent } from './pages/mode/mode.component';
import { LanComponent } from './pages/lan/lan.component';
import { sessionGuard } from './session/guards/session-guard';

export const routes: Routes = [
    { 
        path: '', 
        component: HomeComponent,
    },
    {
        path: 'mode',
        component: ModeComponent,
        canActivate: [sessionGuard],
    },
    {
        path: 'lan',
        component: LanComponent,
        canActivate: [sessionGuard],
    },
];
