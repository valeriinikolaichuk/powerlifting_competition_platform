import { Routes } from '@angular/router';

import { entryGuard } from './session/guards/entry-guard';

export const routes: Routes = [
    {
        path: 'admin',
        loadChildren: () =>
            import('./components/admin/admin.routes')
            .then(m => m.ADMIN_ROUTES),
        canActivate: [entryGuard],
    },
    {
        path: 'client',
        loadChildren: () =>
            import('./components/client/client.routes')
            .then(m => m.CLIENT_ROUTES),
        canActivate: [entryGuard],
    },
];
