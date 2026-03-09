import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, RouterLink, CurrencyPipe, DecimalPipe],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>Admin Dashboard</h1>
      </div>

      <div class="card-grid" style="margin-bottom:24px">
        @if (summary()) {
          <mat-card class="stat-card">
            <mat-card-content>
              <mat-icon color="primary">group</mat-icon>
              <div>
                <div class="stat-value">{{ summary()!['totalUsers'] | number }}</div>
                <div class="stat-label">Total Users</div>
              </div>
            </mat-card-content>
          </mat-card>
          <mat-card class="stat-card">
            <mat-card-content>
              <mat-icon color="accent">receipt_long</mat-icon>
              <div>
                <div class="stat-value">{{ summary()!['transactionsLast30Days'] | number }}</div>
                <div class="stat-label">Transactions (30d)</div>
              </div>
            </mat-card-content>
          </mat-card>
          <mat-card class="stat-card">
            <mat-card-content>
              <mat-icon style="color:#4caf50">trending_up</mat-icon>
              <div>
                <div class="stat-value">{{ summary()!['revenueLastLast30Days'] | currency }}</div>
                <div class="stat-label">Revenue (30d)</div>
              </div>
            </mat-card-content>
          </mat-card>
        }
      </div>

      <div style="display:flex;gap:12px">
        <a mat-raised-button color="primary" routerLink="/admin/merchants">
          <mat-icon>store</mat-icon> Manage Merchants
        </a>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  private api = inject(ApiService);
  summary = signal<Record<string, any> | null>(null);

  ngOnInit(): void {
    this.api.getAdminSummary().subscribe(res => this.summary.set(res.data));
  }
}
