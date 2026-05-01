import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DecimalPipe } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { AdminStats } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatCardModule, MatButtonModule, DecimalPipe],
  template: `
    <h3 class="h3">Dashboard</h3>
    <div class="content-box">

    <!-- Stats row -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="icon-wrap blue"><mat-icon>group</mat-icon></div>
        <div class="stat-info">
          <span class="stat-value">{{ stats()?.totalUsers | number }}</span>
          <span class="stat-label">Total Users</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="icon-wrap orange"><mat-icon>storefront</mat-icon></div>
        <div class="stat-info">
          <span class="stat-value">{{ stats()?.totalRetailers | number }}</span>
          <span class="stat-label">Retailers</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="icon-wrap green"><mat-icon>receipt_long</mat-icon></div>
        <div class="stat-info">
          <span class="stat-value">{{ stats()?.totalTransactions | number }}</span>
          <span class="stat-label">Total Transactions</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="icon-wrap yellow"><mat-icon>hourglass_empty</mat-icon></div>
        <div class="stat-info">
          <span class="stat-value">{{ stats()?.pendingTransactions | number }}</span>
          <span class="stat-label">Pending Transactions</span>
        </div>
      </div>
    </div>

    <!-- Quick links -->
    <h2 class="section-title">Manage</h2>
    <div class="quick-grid">
      <a routerLink="/admin/retailers" class="quick-card">
        <mat-icon>storefront</mat-icon>
        <strong>Retailers</strong>
        <span>Add, edit, delete retailers</span>
      </a>
      <a routerLink="/admin/users" class="quick-card">
        <mat-icon>group</mat-icon>
        <strong>Users</strong>
        <span>Manage roles & status</span>
      </a>
      <a routerLink="/admin/categories" class="quick-card">
        <mat-icon>category</mat-icon>
        <strong>Categories</strong>
        <span>Organise retailer categories</span>
      </a>
      <a routerLink="/admin/transactions" class="quick-card">
        <mat-icon>receipt_long</mat-icon>
        <strong>Transactions</strong>
        <span>Review & update status</span>
      </a>
    </div>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 28px; }
    .page-header h1 { margin: 0 0 4px; font-size: 26px; font-weight: 700; color: #1e293b; font-family: 'Open Sans', sans-serif; }
    .subtitle { color: #64748b; font-size: 14px; font-family: 'Open Sans', sans-serif; }

    /* Stats */
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 36px; }
    .stat-card { background: #fff; border-radius: 12px; padding: 22px 24px; display: flex; align-items: center; gap: 18px; box-shadow: 0 1px 4px rgba(0,0,0,.07); }
    .icon-wrap { width: 58px; height: 58px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .icon-wrap mat-icon { font-size: 28px; width: 28px; height: 28px; }
    .icon-wrap.blue { background: #e0f2fe; } .icon-wrap.blue mat-icon { color: #0284c7; }
    .icon-wrap.orange { background: #fff7ed; } .icon-wrap.orange mat-icon { color: #ea580c; }
    .icon-wrap.green { background: #dcfce7; } .icon-wrap.green mat-icon { color: #16a34a; }
    .icon-wrap.yellow { background: #fef9c3; } .icon-wrap.yellow mat-icon { color: #ca8a04; }
    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-size: 28px; font-weight: 700; color: #1e293b; line-height: 1; font-family: 'Open Sans', sans-serif; }
    .stat-label { font-size: 13px; color: #64748b; margin-top: 4px; font-family: 'Open Sans', sans-serif; }

    /* Quick links */
    .section-title { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0 0 16px; font-family: 'Open Sans', sans-serif; text-transform: uppercase; letter-spacing: .5px; }
    .quick-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .quick-card { background: #fff; border-radius: 12px; padding: 22px; display: flex; flex-direction: column; gap: 6px; text-decoration: none; box-shadow: 0 1px 4px rgba(0,0,0,.07); border: 2px solid transparent; transition: all .18s; }
    .quick-card:hover { border-color: #17A8D4; transform: translateY(-2px); }
    .quick-card mat-icon { font-size: 28px; width: 28px; height: 28px; color: #17A8D4; }
    .quick-card strong { font-size: 15px; color: #1e293b; font-family: 'Open Sans', sans-serif; }
    .quick-card span { font-size: 12px; color: #94a3b8; font-family: 'Open Sans', sans-serif; }

    @media (max-width: 900px) {
      .stats-grid, .quick-grid { grid-template-columns: repeat(2, 1fr); }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private api = inject(ApiService);
  stats = signal<AdminStats | null>(null);

  ngOnInit(): void {
    this.api.getAdminStats().subscribe({ next: res => this.stats.set(res.data) });
  }
}
