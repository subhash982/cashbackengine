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
      },
      {
        path: 'affnetworks',
        loadComponent: () => import('./manage-affnetworks/manage-affnetworks.component').then(m => m.ManageAffnetworksComponent)
      },
      {
        path: 'content',
        loadComponent: () => import('./manage-content/manage-content.component').then(m => m.ManageContentComponent)
      },
      {
        path: 'coupons',
        loadComponent: () => import('./manage-coupons/manage-coupons.component').then(m => m.ManageCouponsComponent)
      },
      {
        path: 'email-templates',
        loadComponent: () => import('./manage-email-templates/manage-email-templates.component').then(m => m.ManageEmailTemplatesComponent)
      },
      {
        path: 'reviews',
        loadComponent: () => import('./manage-reviews/manage-reviews.component').then(m => m.ManageReviewsComponent)
      }
    ]
  }
];
