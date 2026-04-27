import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Wallet, Transaction } from '../../core/models/transaction.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, RouterLink, CurrencyPipe, DatePipe],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>Welcome back, {{ auth.currentUser()?.fname || auth.currentUser()?.username }}!</h1>
      </div>

      <!-- Wallet Stats -->
      <div class="card-grid" style="margin-bottom:24px">
        @if (wallet()) {
          <mat-card class="stat-card">
            <mat-card-content>
              <mat-icon color="warn">hourglass_empty</mat-icon>
              <div>
                <div class="stat-value">{{ wallet()!.pendingAmount | currency }}</div>
                <div class="stat-label">Pending Cashback</div>
              </div>
            </mat-card-content>
          </mat-card>
          <mat-card class="stat-card">
            <mat-card-content>
              <mat-icon color="primary">check_circle</mat-icon>
              <div>
                <div class="stat-value">{{ wallet()!.confirmedAmount | currency }}</div>
                <div class="stat-label">Confirmed</div>
              </div>
            </mat-card-content>
          </mat-card>
          <mat-card class="stat-card">
            <mat-card-content>
              <mat-icon style="color:#4caf50">account_balance_wallet</mat-icon>
              <div>
                <div class="stat-value">{{ wallet()!.withdrawableAmount | currency }}</div>
                <div class="stat-label">Available to Withdraw</div>
              </div>
            </mat-card-content>
          </mat-card>
          <mat-card class="stat-card">
            <mat-card-content>
              <mat-icon color="accent">payments</mat-icon>
              <div>
                <div class="stat-value">{{ wallet()!.totalPaidAmount | currency }}</div>
                <div class="stat-label">Total Earned</div>
              </div>
            </mat-card-content>
          </mat-card>
        }
      </div>

      <!-- Quick Actions -->
      <div style="display:flex;gap:12px;margin-bottom:24px">
        <a mat-raised-button color="primary" routerLink="/merchants">
          <mat-icon>store</mat-icon> Browse Merchants
        </a>
        <a mat-raised-button routerLink="/wallet">
          <mat-icon>account_balance_wallet</mat-icon> My Wallet
        </a>
        <a mat-raised-button routerLink="/transactions">
          <mat-icon>receipt_long</mat-icon> Transactions
        </a>
      </div>

      <!-- Recent Transactions -->
      <mat-card>
        <mat-card-header>
          <mat-card-title>Recent Transactions</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          @if (recentTx().length === 0) {
            <p style="color:rgba(0,0,0,.5);text-align:center;padding:24px">
              No transactions yet. Start shopping to earn cashback!
            </p>
          }
          @for (tx of recentTx(); track tx.id) {
            <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid #eee">
              <div>
                <strong>{{ tx.merchantName }}</strong>
                <div style="font-size:12px;color:rgba(0,0,0,.5)">{{ tx.createdAt | date:'medium' }}</div>
              </div>
              <div style="text-align:right">
                <div style="color:#4caf50;font-weight:600">+{{ tx.cashbackAmount | currency }}</div>
                <span class="status-chip" [class]="getStatusClass(tx.status)">{{ tx.status }}</span>
              </div>
            </div>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .status-chip { font-size: 11px; padding: 2px 8px; border-radius: 12px; background: #e3f2fd; color: #1565c0; }
  `]
})
export class DashboardComponent implements OnInit {
  auth = inject(AuthService);
  private api = inject(ApiService);

  wallet = signal<Wallet | null>(null);
  recentTx = signal<Transaction[]>([]);

  ngOnInit(): void {
    this.api.getWallet().subscribe(res => this.wallet.set(res.data));
    this.api.getTransactions(0, 5).subscribe(res => this.recentTx.set(res.data.content));
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      PAID: 'success-chip', CONFIRMED: 'success-chip',
      PENDING: 'warning-chip', TRACKED: 'warning-chip',
      CANCELLED: 'danger-chip', REJECTED: 'danger-chip'
    };
    return map[status] || '';
  }
}
