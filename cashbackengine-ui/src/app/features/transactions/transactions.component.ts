import { Component, inject, OnInit, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Transaction, PageResponse } from '../../core/models/transaction.model';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatCardModule, MatChipsModule, CurrencyPipe, DatePipe],
  template: `
    <div class="container">
      <div class="page-header"><h1>Transaction History</h1></div>

      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="transactions()" style="width:100%">
            <ng-container matColumnDef="merchant">
              <th mat-header-cell *matHeaderCellDef>Merchant</th>
              <td mat-cell *matCellDef="let tx">{{ tx.merchantName }}</td>
            </ng-container>
            <ng-container matColumnDef="orderValue">
              <th mat-header-cell *matHeaderCellDef>Order Value</th>
              <td mat-cell *matCellDef="let tx">{{ tx.orderValue | currency }}</td>
            </ng-container>
            <ng-container matColumnDef="cashback">
              <th mat-header-cell *matHeaderCellDef>Cashback</th>
              <td mat-cell *matCellDef="let tx" style="color:#4caf50;font-weight:600">+{{ tx.cashbackAmount | currency }}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let tx">
                <mat-chip [class]="getStatusClass(tx.status)">{{ tx.status }}</mat-chip>
              </td>
            </ng-container>
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>Date</th>
              <td mat-cell *matCellDef="let tx">{{ tx.createdAt | date:'mediumDate' }}</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>

          @if (transactions().length === 0) {
            <p style="text-align:center;padding:32px;color:rgba(0,0,0,.5)">No transactions found.</p>
          }
        </mat-card-content>
      </mat-card>

      @if (page()) {
        <mat-paginator
          [length]="page()!.totalElements"
          [pageSize]="page()!.size"
          [pageIndex]="page()!.number"
          (page)="onPage($event)">
        </mat-paginator>
      }
    </div>
  `
})
export class TransactionsComponent implements OnInit {
  private api = inject(ApiService);

  displayedColumns = ['merchant', 'orderValue', 'cashback', 'status', 'date'];
  transactions = signal<Transaction[]>([]);
  page = signal<PageResponse<Transaction> | null>(null);

  ngOnInit(): void {
    this.loadTransactions(0);
  }

  loadTransactions(pageNum: number): void {
    this.api.getTransactions(pageNum).subscribe(res => {
      this.page.set(res.data);
      this.transactions.set(res.data.content);
    });
  }

  onPage(event: PageEvent): void {
    this.loadTransactions(event.pageIndex);
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
