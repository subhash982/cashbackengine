import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';
import { Merchant, PageResponse } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-manage-merchants',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatTableModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule, MatSnackBarModule],
  template: `
    <div class="container">
      <div class="page-header"><h1>Manage Merchants</h1></div>

      <!-- Create Merchant Form -->
      <mat-card style="margin-bottom:24px">
        <mat-card-header><mat-card-title>Add New Merchant</mat-card-title></mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onCreate()" style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
            <mat-form-field appearance="outline">
              <mat-label>Name</mat-label>
              <input matInput formControlName="name">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Website URL</mat-label>
              <input matInput formControlName="websiteUrl">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Affiliate Network</mat-label>
              <input matInput formControlName="affiliateNetwork" placeholder="CJ Affiliate, Rakuten, etc.">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Commission Rate (%)</mat-label>
              <input matInput type="number" formControlName="defaultCommissionRate">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Category</mat-label>
              <input matInput formControlName="category">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>User Share (%)</mat-label>
              <input matInput type="number" formControlName="userSharePercentage">
            </mat-form-field>
            <div style="grid-column:1/-1">
              <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Add Merchant</button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Merchants Table -->
      <mat-card>
        <mat-card-header><mat-card-title>All Merchants</mat-card-title></mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="merchants()" style="width:100%">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let m">{{ m.name }}</td>
            </ng-container>
            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef>Category</th>
              <td mat-cell *matCellDef="let m">{{ m.category }}</td>
            </ng-container>
            <ng-container matColumnDef="network">
              <th mat-header-cell *matHeaderCellDef>Network</th>
              <td mat-cell *matCellDef="let m">{{ m.affiliateNetwork }}</td>
            </ng-container>
            <ng-container matColumnDef="cashback">
              <th mat-header-cell *matHeaderCellDef>User Share %</th>
              <td mat-cell *matCellDef="let m">{{ m.userSharePercentage }}%</td>
            </ng-container>
            <ng-container matColumnDef="active">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let m">{{ m.active ? 'Active' : 'Inactive' }}</td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="cols"></tr>
            <tr mat-row *matRowDef="let row; columns: cols;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class ManageMerchantsComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  cols = ['name', 'category', 'network', 'cashback', 'active'];
  merchants = signal<Merchant[]>([]);

  form = this.fb.group({
    name: ['', Validators.required],
    websiteUrl: ['', Validators.required],
    affiliateNetwork: ['', Validators.required],
    defaultCommissionRate: [null as number | null, [Validators.required, Validators.min(0)]],
    category: [''],
    userSharePercentage: [70, [Validators.required, Validators.min(1), Validators.max(100)]]
  });

  ngOnInit(): void {
    this.api.getMerchants(0, 100).subscribe({
      next: res => this.merchants.set(res.data.content),
      error: () => this.snackBar.open('Failed to load merchants', 'Close', { duration: 4000 })
    });
  }

  onCreate(): void {
    if (this.form.invalid) return;
    this.api.createMerchant(this.form.value as any).subscribe({
      next: res => {
        this.merchants.update(list => [res.data, ...list]);
        this.form.reset({ userSharePercentage: 70 });
        this.snackBar.open('Merchant created successfully', 'Close', { duration: 3000 });
      },
      error: (err) => {
        const msg = err.error?.message || 'Failed to create merchant';
        this.snackBar.open(msg, 'Close', { duration: 4000 });
      }
    });
  }
}
