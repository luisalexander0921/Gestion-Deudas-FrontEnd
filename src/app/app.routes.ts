import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'register',
    loadComponent: () => import('./components/auth/register').then(m => m.RegisterComponent)
  },
  {
    path: '',
    redirectTo: '/register',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/register'
  }
];
