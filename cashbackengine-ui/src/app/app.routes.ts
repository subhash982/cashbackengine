import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // Home — no sidebar layout
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },


  // Admin — has its own layout
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes)
  },

  // All other pages — wrapped in PageLayoutComponent (left content + right sidebar)
  {
    path: '',
    loadComponent: () => import('./shared/layouts/page-layout.component').then(m => m.PageLayoutComponent),
    children: [
      {
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'merchants',
        canActivate: [authGuard],
        loadComponent: () => import('./features/merchants/merchants.component').then(m => m.MerchantsComponent)
      },
      {
        path: 'transactions',
        canActivate: [authGuard],
        loadComponent: () => import('./features/transactions/transactions.component').then(m => m.TransactionsComponent)
      },
      {
        path: 'wallet',
        canActivate: [authGuard],
        loadComponent: () => import('./features/wallet/wallet.component').then(m => m.WalletComponent)
      },
      {
        path: 'category',
        loadComponent: () => import('./features/category/category.component').then(m => m.CategoryComponent)
      },
      {
        path: 'stores',
        loadComponent: () => import('./features/stores/stores.component').then(m => m.StoresComponent)
      },
      {
        path: 'coupons',
        loadComponent: () => import('./features/coupons/coupons.component').then(m => m.CouponsComponent)
      },
      {
        path: 'all-offers',
        loadComponent: () => import('./features/all-offers/all-offers.component').then(m => m.AllOffersComponent)
      },
      {
        path: 'favourites',
        canActivate: [authGuard],
        loadComponent: () => import('./features/favourites/favourites.component').then(m => m.FavouritesComponent)
      },
      {
        path: 'how-it-works',
        loadComponent: () => import('./features/how-it-works/how-it-works.component').then(m => m.HowItWorksComponent)
      },
      {
        path: 'supports',
        loadComponent: () => import('./features/supports/supports.component').then(m => m.SupportsComponent)
      },
      {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
      }
    ]
  },

  { path: '**', redirectTo: '/home' }
];
