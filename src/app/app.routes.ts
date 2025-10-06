import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards';

export const routes: Routes = [
  {
    path: 'register',
    loadComponent: () => import('./components/auth/register').then(m => m.RegisterComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login').then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: '',
    loadComponent: () => import('./components/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'creditors',
        loadComponent: () => import('./components/creditors').then(m => m.CreditorListComponent)
      },
      {
        path: 'creditors/new',
        loadComponent: () => import('./components/creditors').then(m => m.CreditorFormComponent)
      },
      {
        path: 'creditors/edit/:id',
        loadComponent: () => import('./components/creditors').then(m => m.CreditorFormComponent)
      },
      {
        path: 'debts',
        loadComponent: () => import('./components/debts').then(m => m.DebtListComponent)
      },
      {
        path: 'debts/new',
        loadComponent: () => import('./components/debts').then(m => m.DebtFormComponent)
      },
      {
        path: 'debts/edit/:id',
        loadComponent: () => import('./components/debts').then(m => m.DebtFormComponent)
      },
      {
        path: 'debts/detail/:id',
        loadComponent: () => import('./components/debts').then(m => m.DebtDetailComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
