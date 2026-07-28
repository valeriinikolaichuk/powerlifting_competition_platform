import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ModeComponent } from './pages/mode/mode.component';

export const routes: Routes = [
    { 
        path: '', 
        component: HomeComponent 
    },
    {
        path: 'mode',
        component: ModeComponent
    }
];
