import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Wallet, Payout } from '../../core/models/transaction.model';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatTableModule, CurrencyPipe, DatePipe],
  template: `
    <h3 class="h3">My Wallet</h3>
    <div class="content-box">

      <div class="card-grid" style="margin-bottom:24px">
        @if (wallet()) {
          <mat-card class="stat-card">
            <mat-card-content>
              <mat-icon color="warn">schedule</mat-icon>
              <div>
                <div class="stat-value">{{ wallet()!.pendingAmount | currency }}</div>
                <div class="stat-label">Pending</div>
              </div>
            </mat-card-content>
          </mat-card>
          <mat-card class="stat-card">
            <mat-card-content>
              <mat-icon color="primary">verified</mat-icon>
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
                <div class="stat-label">Available</div>
              </div>
            </mat-card-content>
          </mat-card>
        }
      </div>

      <!-- Withdrawal Form -->
      <mat-card style="max-width:480px;margin-bottom:24px">
        <mat-card-header><mat-card-title>Request Withdrawal</mat-card-title></mat-card-header>
        <mat-card-content>
          <form [formGroup]="payoutForm" (ngSubmit)="onWithdraw()">
            <mat-form-field appearance="outline" style="width:100%">
              <mat-label>Amount (min $10)</mat-label>
              <input matInput type="number" formControlName="amount" min="10">
            </mat-form-field>
            <mat-form-field appearance="outline" style="width:100%">
              <mat-label>Payout Method</mat-label>
              <mat-select formControlName="payoutMethod">
                <mat-option value="PAYPAL">PayPal</mat-option>
                <mat-option value="BANK_TRANSFER">Bank Transfer</mat-option>
                <mat-option value="GIFT_CARD">Gift Card</mat-option>
                <mat-option value="CRYPTO">Crypto</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" style="width:100%">
              <mat-label>Payout Destination</mat-label>
              <input matInput formControlName="payoutDestination" placeholder="e.g. your@paypal.com">
            </mat-form-field>
            @if (payoutError()) {
              <p class="error-msg">{{ payoutError() }}</p>
            }
            @if (payoutSuccess()) {
              <p style="color:#4caf50">Withdrawal request submitted successfully!</p>
            }
            <button mat-raised-button color="primary" type="submit" [disabled]="payoutForm.invalid">
              <mat-icon>send</mat-icon> Request Withdrawal
            </button>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Payout History -->
      <mat-card>
        <mat-card-header><mat-card-title>Payout History</mat-card-title></mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="payouts()" style="width:100%">
            <ng-container matColumnDef="amount">
              <th mat-header-cell *matHeaderCellDef>Amount</th>
              <td mat-cell *matCellDef="let p">{{ p.amount | currency }}</td>
            </ng-container>
            <ng-container matColumnDef="method">
              <th mat-header-cell *matHeaderCellDef>Method</th>
              <td mat-cell *matCellDef="let p">{{ p.payoutMethod }}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let p">{{ p.status }}</td>
            </ng-container>
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>Date</th>
              <td mat-cell *matCellDef="let p">{{ p.createdAt | date:'mediumDate' }}</td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="['amount','method','status','date']"></tr>
            <tr mat-row *matRowDef="let row; columns: ['amount','method','status','date'];"></tr>
          </table>
          @if (payouts().length === 0) {
            <p style="text-align:center;padding:24px;color:rgba(0,0,0,.5)">No payouts yet.</p>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class WalletComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);

  wallet = signal<Wallet | null>(null);
  payouts = signal<Payout[]>([]);
  payoutError = signal('');
  payoutSuccess = signal(false);

  payoutForm = this.fb.group({
    amount: [null as number | null, [Validators.required, Validators.min(10)]],
    payoutMethod: ['PAYPAL', Validators.required],
    payoutDestination: ['', Validators.required]
  });

  ngOnInit(): void {
    this.api.getWallet().subscribe(res => this.wallet.set(res.data));
    this.api.getPayouts().subscribe(res => this.payouts.set(res.data.content));
  }

  onWithdraw(): void {
    if (this.payoutForm.invalid) return;
    const { amount, payoutMethod, payoutDestination } = this.payoutForm.value;
    this.payoutError.set('');
    this.payoutSuccess.set(false);

    this.api.requestPayout(amount!, payoutMethod!, payoutDestination!).subscribe({
      next: () => {
        this.payoutSuccess.set(true);
        this.api.getWallet().subscribe(res => this.wallet.set(res.data));
        this.api.getPayouts().subscribe(res => this.payouts.set(res.data.content));
        this.payoutForm.reset({ payoutMethod: 'PAYPAL' });
      },
      error: (err) => this.payoutError.set(err.error?.message || 'Withdrawal failed')
    });
  }
}
