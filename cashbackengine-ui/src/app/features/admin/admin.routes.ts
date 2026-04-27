import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'retailers',
        loadComponent: () => import('./manage-retailers/manage-retailers.component').then(m => m.ManageRetailersComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./manage-users/manage-users.component').then(m => m.ManageUsersComponent)
      },
      {
        path: 'categories',
        loadComponent: () => import('./manage-categories/manage-categories.component').then(m => m.ManageCategoriesComponent)
      },
      {
        path: 'transactions',
        loadComponent: () => import('./manage-transactions/manage-transactions.component').then(m => m.ManageTransactionsComponent)
      }
    ]
  }
];
