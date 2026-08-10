import { Routes } from '@angular/router';
import { EntryComponent } from './entry/entry.component/entry.component';
import { entryGuard } from './session/guards/entry-guard';

export const routes: Routes = [
    { 
        path: '', 
        component: EntryComponent,
        canActivate: [entryGuard],
    },
];
