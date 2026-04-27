import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { AdminTransaction } from '../../../core/models/transaction.model';

const STATUS_FLOW: Record<string, string> = {
  pending: 'confirmed',
  confirmed: 'paid',
  paid: 'paid'
};

@Component({
  selector: 'app-manage-transactions',
  standalone: true,
  imports: [
    FormsModule, MatTableModule, MatButtonModule, MatIconModule,
    MatSelectModule, MatFormFieldModule, MatSnackBarModule, MatTooltipModule,
    DatePipe, CurrencyPipe
  ],
  template: `
    <div class="page-header">
      <div>
        <h1>Transactions</h1>
        <span class="subtitle">{{ filtered().length }} transactions</span>
      </div>
      <div class="filter-row">
        <button [class]="'filter-btn ' + (activeFilter() === 'all' ? 'active' : '')" (click)="setFilter('all')">All</button>
        <button [class]="'filter-btn pending ' + (activeFilter() === 'pending' ? 'active' : '')" (click)="setFilter('pending')">Pending</button>
        <button [class]="'filter-btn confirmed ' + (activeFilter() === 'confirmed' ? 'active' : '')" (click)="setFilter('confirmed')">Confirmed</button>
        <button [class]="'filter-btn paid ' + (activeFilter() === 'paid' ? 'active' : '')" (click)="setFilter('paid')">Paid</button>
      </div>
    </div>

    <div class="table-card">
      <table mat-table [dataSource]="filtered()">

        <ng-container matColumnDef="transactionId">
          <th mat-header-cell *matHeaderCellDef>#</th>
          <td mat-cell *matCellDef="let t">{{ t.transactionId }}</td>
        </ng-container>

        <ng-container matColumnDef="retailer">
          <th mat-header-cell *matHeaderCellDef>Retailer</th>
          <td mat-cell *matCellDef="let t">{{ t.retailer || '—' }}</td>
        </ng-container>

        <ng-container matColumnDef="userId">
          <th mat-header-cell *matHeaderCellDef>User ID</th>
          <td mat-cell *matCellDef="let t"><span class="user-id">User #{{ t.userId }}</span></td>
        </ng-container>

        <ng-container matColumnDef="transactionAmount">
          <th mat-header-cell *matHeaderCellDef>Sale Amt</th>
          <td mat-cell *matCellDef="let t">{{ t.transactionAmount | currency:'GBP' }}</td>
        </ng-container>

        <ng-container matColumnDef="amount">
          <th mat-header-cell *matHeaderCellDef>Cashback</th>
          <td mat-cell *matCellDef="let t"><strong class="cashback-amt">{{ t.amount | currency:'GBP' }}</strong></td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let t">
            <span [class]="'status-chip ' + t.status">{{ t.status }}</span>
          </td>
        </ng-container>

        <ng-container matColumnDef="created">
          <th mat-header-cell *matHeaderCellDef>Created</th>
          <td mat-cell *matCellDef="let t">{{ t.created | date:'dd MMM yyyy' }}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let t">
            @if (t.status !== 'paid') {
              <button mat-stroked-button class="advance-btn"
                [matTooltip]="'Advance to ' + nextStatus(t.status)"
                (click)="advanceStatus(t)">
                <mat-icon>arrow_forward</mat-icon>
                → {{ nextStatus(t.status) }}
              </button>
            }
            @if (t.status === 'pending') {
              <button mat-stroked-button class="decline-btn" matTooltip="Decline" (click)="declineTransaction(t)">
                <mat-icon>cancel</mat-icon> Decline
              </button>
            }
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="cols"></tr>
        <tr mat-row *matRowDef="let row; columns: cols;"></tr>
        <tr class="mat-row" *matNoDataRow>
          <td class="mat-cell empty-row" [attr.colspan]="cols.length">No transactions found.</td>
        </tr>
      </table>
    </div>
  `,
  styles: [`
    .page-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:24px; flex-wrap:wrap; gap:12px; }
    .page-header h1 { margin:0 0 4px; font-size:24px; font-weight:700; color:#1e293b; font-family:'Open Sans',sans-serif; }
    .subtitle { color:#64748b; font-size:13px; font-family:'Open Sans',sans-serif; }

    .filter-row { display:flex; gap:8px; }
    .filter-btn { padding:6px 16px; border-radius:20px; border:1.5px solid #e2e8f0; background:#fff; cursor:pointer; font-size:13px; font-weight:600; font-family:'Open Sans',sans-serif; color:#64748b; transition:all .15s; }
    .filter-btn:hover { border-color:#17A8D4; color:#17A8D4; }
    .filter-btn.active { background:#17A8D4; border-color:#17A8D4; color:#fff; }
    .filter-btn.pending.active { background:#f59e0b; border-color:#f59e0b; }
    .filter-btn.confirmed.active { background:#3b82f6; border-color:#3b82f6; }
    .filter-btn.paid.active { background:#16a34a; border-color:#16a34a; }

    .table-card { background:#fff; border-radius:12px; box-shadow:0 1px 6px rgba(0,0,0,.08); overflow:hidden; }
    table { width:100%; }
    th.mat-header-cell { font-weight:700; color:#475569; font-size:12px; text-transform:uppercase; letter-spacing:.5px; background:#f8fafc; }
    td.mat-cell { color:#334155; font-size:14px; font-family:'Open Sans',sans-serif; }

    .user-id { background:#f1f5f9; padding:2px 8px; border-radius:4px; font-size:12px; color:#475569; }
    .cashback-amt { color:#15803d; }

    .status-chip { padding:3px 10px; border-radius:20px; font-size:12px; font-weight:600; text-transform:capitalize; }
    .status-chip.pending { background:#fef9c3; color:#a16207; }
    .status-chip.confirmed { background:#dbeafe; color:#1d4ed8; }
    .status-chip.paid { background:#dcfce7; color:#15803d; }
    .status-chip.declined { background:#fee2e2; color:#b91c1c; }

    .advance-btn { font-size:12px; height:30px; line-height:30px; margin-right:6px; color:#1d4ed8 !important; border-color:#1d4ed8 !important; }
    .advance-btn mat-icon { font-size:14px; width:14px; height:14px; }
    .decline-btn { font-size:12px; height:30px; line-height:30px; color:#ef4444 !important; border-color:#ef4444 !important; }
    .decline-btn mat-icon { font-size:14px; width:14px; height:14px; }
    .empty-row { text-align:center; padding:32px; color:#94a3b8; font-style:italic; }
  `]
})
export class ManageTransactionsComponent implements OnInit {
  private api = inject(ApiService);
  private snack = inject(MatSnackBar);

  cols = ['transactionId', 'retailer', 'userId', 'transactionAmount', 'amount', 'status', 'created', 'actions'];
  transactions = signal<AdminTransaction[]>([]);
  activeFilter = signal<string>('all');

  filtered = computed(() => {
    const f = this.activeFilter();
    const all = this.transactions();
    return f === 'all' ? all : all.filter(t => t.status === f);
  });

  ngOnInit(): void {
    this.api.getAllAdminTransactions().subscribe({
      next: res => this.transactions.set(res.data ?? []),
      error: () => this.snack.open('Failed to load transactions', 'Close', { duration: 3000 })
    });
  }

  setFilter(f: string): void { this.activeFilter.set(f); }

  nextStatus(current: string): string { return STATUS_FLOW[current] ?? current; }

  advanceStatus(t: AdminTransaction): void {
    const next = this.nextStatus(t.status);
    if (next === t.status) return;
    this.api.updateTransactionStatus(t.transactionId, next).subscribe({
      next: res => {
        this.transactions.update(list => list.map(x => x.transactionId === t.transactionId ? res.data : x));
        this.snack.open(`Status updated to ${next}`, 'Close', { duration: 3000 });
      },
      error: () => this.snack.open('Update failed', 'Close', { duration: 3000 })
    });
  }

  declineTransaction(t: AdminTransaction): void {
    if (!confirm(`Decline transaction #${t.transactionId}?`)) return;
    this.api.updateTransactionStatus(t.transactionId, 'declined').subscribe({
      next: res => {
        this.transactions.update(list => list.map(x => x.transactionId === t.transactionId ? res.data : x));
        this.snack.open('Transaction declined', 'Close', { duration: 3000 });
      },
      error: () => this.snack.open('Update failed', 'Close', { duration: 3000 })
    });
  }
}
