import { Routes } from '@angular/router';

import { entryGuard } from './session/guards/entry-guard';
import { sessionGuard } from './session/guards/session-guard-guard';

import { EntryComponent } from './entry/entry.component/entry.component';
import { AdminComponent } from './pages/admin/admin.component';
import { MainComponent } from './pages/main/main.component';

export const routes: Routes = [
    { 
        path: '', 
        component: EntryComponent,
        canActivate: [entryGuard],
    },
        {
    path: 'admin',
        component: AdminComponent,
        canActivate: [sessionGuard],
    },
    {
    path: 'main',
        component: MainComponent,
        canActivate: [sessionGuard],
    },
];
