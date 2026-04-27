import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SlicePipe } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { Retailer } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-manage-retailers',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule,
    MatSnackBarModule, MatTooltipModule, SlicePipe
  ],
  template: `
    <div class="page-header">
      <div>
        <h1>Retailers</h1>
        <span class="subtitle">{{ retailers().length }} retailers</span>
      </div>
      <button mat-raised-button class="btn-primary" (click)="openForm()">
        <mat-icon>add</mat-icon> Add Retailer
      </button>
    </div>

    <!-- Add / Edit Form Panel -->
    @if (showForm()) {
      <div class="form-panel">
        <div class="form-panel-header">
          <h2>{{ editingId() ? 'Edit Retailer' : 'Add New Retailer' }}</h2>
          <button mat-icon-button (click)="closeForm()"><mat-icon>close</mat-icon></button>
        </div>
        <form [formGroup]="form" (ngSubmit)="onSave()" class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>Title *</mat-label>
            <input matInput formControlName="title">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Website URL *</mat-label>
            <input matInput formControlName="url" placeholder="https://...">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Cashback Rate</mat-label>
            <input matInput formControlName="cashback" placeholder="e.g. Up to 5%">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Image URL</mat-label>
            <input matInput formControlName="image">
          </mat-form-field>
          <mat-form-field appearance="outline" class="full">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" rows="3"></textarea>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Status</mat-label>
            <mat-select formControlName="status">
              <mat-option value="active">Active</mat-option>
              <mat-option value="inactive">Inactive</mat-option>
            </mat-select>
          </mat-form-field>
          <div class="checkboxes">
            <mat-checkbox formControlName="featured">Featured</mat-checkbox>
            <mat-checkbox formControlName="dealOfWeek">Deal of the Week</mat-checkbox>
          </div>
          <div class="form-actions full">
            <button mat-stroked-button type="button" (click)="closeForm()">Cancel</button>
            <button mat-raised-button class="btn-primary" type="submit" [disabled]="form.invalid || saving()">
              {{ saving() ? 'Saving...' : (editingId() ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </div>
    }

    <!-- Table -->
    <div class="table-card">
      <table mat-table [dataSource]="retailers()">
        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef>Title</th>
          <td mat-cell *matCellDef="let r">
            <div class="retailer-name">
              @if (r.image) { <img [src]="r.image" [alt]="r.title" class="logo"> }
              @else { <div class="logo-placeholder"><mat-icon>storefront</mat-icon></div> }
              {{ r.title }}
            </div>
          </td>
        </ng-container>
        <ng-container matColumnDef="url">
          <th mat-header-cell *matHeaderCellDef>URL</th>
          <td mat-cell *matCellDef="let r">
            <a [href]="r.url" target="_blank" class="url-link">{{ r.url | slice:0:35 }}{{ r.url?.length > 35 ? '…' : '' }}</a>
          </td>
        </ng-container>
        <ng-container matColumnDef="cashback">
          <th mat-header-cell *matHeaderCellDef>Cashback</th>
          <td mat-cell *matCellDef="let r"><span class="cashback-chip">{{ r.cashback || '—' }}</span></td>
        </ng-container>
        <ng-container matColumnDef="featured">
          <th mat-header-cell *matHeaderCellDef>Featured</th>
          <td mat-cell *matCellDef="let r">
            <mat-icon [class]="r.featured ? 'icon-yes' : 'icon-no'">{{ r.featured ? 'star' : 'star_border' }}</mat-icon>
          </td>
        </ng-container>
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let r">
            <span [class]="'status-chip ' + r.status">{{ r.status }}</span>
          </td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let r">
            <button mat-icon-button matTooltip="Edit" (click)="onEdit(r)"><mat-icon>edit</mat-icon></button>
            <button mat-icon-button matTooltip="Delete" class="btn-danger" (click)="onDelete(r)"><mat-icon>delete</mat-icon></button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="cols"></tr>
        <tr mat-row *matRowDef="let row; columns: cols;"></tr>
        <tr class="mat-row" *matNoDataRow>
          <td class="mat-cell empty-row" [attr.colspan]="cols.length">No retailers found.</td>
        </tr>
      </table>
    </div>
  `,
  styles: [`
    .page-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:24px; }
    .page-header h1 { margin:0 0 4px; font-size:24px; font-weight:700; color:#1e293b; font-family:'Open Sans',sans-serif; }
    .subtitle { color:#64748b; font-size:13px; font-family:'Open Sans',sans-serif; }
    .btn-primary { background:#17A8D4 !important; color:#fff !important; }
    .btn-danger { color:#ef4444 !important; }

    /* Form Panel */
    .form-panel { background:#fff; border-radius:12px; padding:24px; margin-bottom:24px; box-shadow:0 1px 6px rgba(0,0,0,.08); }
    .form-panel-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
    .form-panel-header h2 { margin:0; font-size:17px; font-weight:700; color:#1e293b; font-family:'Open Sans',sans-serif; }
    .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px 20px; }
    .full { grid-column:1/-1; }
    .checkboxes { display:flex; gap:24px; align-items:center; }
    .form-actions { display:flex; gap:12px; justify-content:flex-end; margin-top:8px; }

    /* Table */
    .table-card { background:#fff; border-radius:12px; box-shadow:0 1px 6px rgba(0,0,0,.08); overflow:hidden; }
    table { width:100%; }
    th.mat-header-cell { font-weight:700; color:#475569; font-size:12px; text-transform:uppercase; letter-spacing:.5px; background:#f8fafc; }
    td.mat-cell { color:#334155; font-size:14px; font-family:'Open Sans',sans-serif; }
    .retailer-name { display:flex; align-items:center; gap:10px; }
    .logo { width:32px; height:32px; object-fit:contain; border-radius:6px; border:1px solid #e2e8f0; }
    .logo-placeholder { width:32px; height:32px; background:#f1f5f9; border-radius:6px; display:flex; align-items:center; justify-content:center; }
    .logo-placeholder mat-icon { font-size:18px; width:18px; height:18px; color:#94a3b8; }
    .url-link { color:#17A8D4; text-decoration:none; font-size:13px; }
    .cashback-chip { background:#f0fdf4; color:#15803d; padding:3px 10px; border-radius:20px; font-size:12px; font-weight:600; }
    .icon-yes { color:#F5A623; }
    .icon-no { color:#cbd5e1; }
    .status-chip { padding:3px 10px; border-radius:20px; font-size:12px; font-weight:600; }
    .status-chip.active { background:#dcfce7; color:#15803d; }
    .status-chip.inactive { background:#fee2e2; color:#b91c1c; }
    .empty-row { text-align:center; padding:32px; color:#94a3b8; font-style:italic; }
  `]
})
export class ManageRetailersComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);

  cols = ['title', 'url', 'cashback', 'featured', 'status', 'actions'];
  retailers = signal<Retailer[]>([]);
  showForm = signal(false);
  editingId = signal<number | null>(null);
  saving = signal(false);

  form = this.fb.group({
    title: ['', Validators.required],
    url: ['', Validators.required],
    cashback: [''],
    image: [''],
    description: [''],
    status: ['active'],
    featured: [false],
    dealOfWeek: [false]
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.api.getRetailers().subscribe({
      next: res => this.retailers.set(res.data ?? []),
      error: () => this.snack.open('Failed to load retailers', 'Close', { duration: 3000 })
    });
  }

  openForm(): void {
    this.editingId.set(null);
    this.form.reset({ status: 'active', featured: false, dealOfWeek: false });
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  onEdit(r: Retailer): void {
    this.editingId.set(r.retailerId);
    this.form.patchValue({
      title: r.title,
      url: r.url,
      cashback: r.cashback ?? '',
      image: r.image ?? '',
      description: r.description ?? '',
      status: r.status,
      featured: r.featured,
      dealOfWeek: r.dealOfWeek
    });
    this.showForm.set(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSave(): void {
    if (this.form.invalid) return;
    this.saving.set(true);
    const payload = this.form.value as Partial<Retailer>;
    const id = this.editingId();

    const req = id
      ? this.api.updateRetailer(id, payload)
      : this.api.createRetailer(payload);

    req.subscribe({
      next: res => {
        if (id) {
          this.retailers.update(list => list.map(r => r.retailerId === id ? res.data : r));
          this.snack.open('Retailer updated', 'Close', { duration: 3000 });
        } else {
          this.retailers.update(list => [res.data, ...list]);
          this.snack.open('Retailer created', 'Close', { duration: 3000 });
        }
        this.closeForm();
        this.saving.set(false);
      },
      error: err => {
        this.snack.open(err.error?.message || 'Save failed', 'Close', { duration: 4000 });
        this.saving.set(false);
      }
    });
  }

  onDelete(r: Retailer): void {
    if (!confirm(`Delete "${r.title}"? This cannot be undone.`)) return;
    this.api.deleteRetailer(r.retailerId).subscribe({
      next: () => {
        this.retailers.update(list => list.filter(x => x.retailerId !== r.retailerId));
        this.snack.open('Retailer deleted', 'Close', { duration: 3000 });
      },
      error: () => this.snack.open('Delete failed', 'Close', { duration: 3000 })
    });
  }
}
