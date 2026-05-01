import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule],
  template: `
    <div class="admin-wrap">
      <aside class="sidebar">
        <div class="sidebar-brand">
          <mat-icon>admin_panel_settings</mat-icon>
          <span>Admin Panel</span>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" class="nav-item">
            <mat-icon>dashboard</mat-icon><span>Dashboard</span>
          </a>
          <a routerLink="/admin/retailers" routerLinkActive="active" class="nav-item">
            <mat-icon>storefront</mat-icon><span>Retailers</span>
          </a>
          <a routerLink="/admin/users" routerLinkActive="active" class="nav-item">
            <mat-icon>group</mat-icon><span>Users</span>
          </a>
          <a routerLink="/admin/categories" routerLinkActive="active" class="nav-item">
            <mat-icon>category</mat-icon><span>Categories</span>
          </a>
          <a routerLink="/admin/transactions" routerLinkActive="active" class="nav-item">
            <mat-icon>receipt_long</mat-icon><span>Transactions</span>
          </a>
          <a routerLink="/admin/affnetworks" routerLinkActive="active" class="nav-item">
            <mat-icon>hub</mat-icon><span>Aff Networks</span>
          </a>
          <a routerLink="/admin/content" routerLinkActive="active" class="nav-item">
            <mat-icon>article</mat-icon><span>Content</span>
          </a>
          <a routerLink="/admin/coupons" routerLinkActive="active" class="nav-item">
            <mat-icon>local_offer</mat-icon><span>Coupons</span>
          </a>
          <a routerLink="/admin/email-templates" routerLinkActive="active" class="nav-item">
            <mat-icon>email</mat-icon><span>Email Templates</span>
          </a>
        </nav>

        <a routerLink="/dashboard" class="back-link">
          <mat-icon>arrow_back</mat-icon><span>Back to Site</span>
        </a>
      </aside>

      <main class="admin-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .admin-wrap {
      display: flex;
      min-height: 100vh;
      background: #f1f5f9;
    }

    /* ── Sidebar ── */
    .sidebar {
      width: 230px;
      min-width: 230px;
      background: #1e293b;
      display: flex;
      flex-direction: column;
      position: sticky;
      top: 0;
      height: 100vh;
      overflow-y: auto;
    }

    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 22px 20px;
      border-bottom: 1px solid rgba(255,255,255,.08);
      color: #fff;
      font-size: 15px;
      font-weight: 700;
      font-family: 'Open Sans', sans-serif;
      letter-spacing: .5px;
    }

    .sidebar-brand mat-icon {
      color: #F5A623;
      font-size: 26px;
      width: 26px;
      height: 26px;
    }

    .sidebar-nav {
      flex: 1;
      padding: 16px 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 11px 20px;
      color: #94a3b8;
      text-decoration: none;
      font-family: 'Open Sans', sans-serif;
      font-size: 14px;
      font-weight: 500;
      border-left: 3px solid transparent;
      transition: all 0.18s;
    }

    .nav-item mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .nav-item:hover {
      background: rgba(255,255,255,.06);
      color: #e2e8f0;
    }

    .nav-item.active {
      background: rgba(23,168,212,.15);
      color: #17A8D4;
      border-left-color: #17A8D4;
    }

    .back-link {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 20px;
      color: #64748b;
      text-decoration: none;
      font-family: 'Open Sans', sans-serif;
      font-size: 13px;
      border-top: 1px solid rgba(255,255,255,.06);
      transition: color 0.18s;
    }

    .back-link mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .back-link:hover {
      color: #94a3b8;
    }

    /* ── Main content ── */
    .admin-content {
      flex: 1;
      padding: 28px;
      overflow-y: auto;
      min-width: 0;
    }
  `]
})
export class AdminLayoutComponent {}
