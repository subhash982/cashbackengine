import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SlicePipe } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { Category } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-manage-categories',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatSnackBarModule, MatTooltipModule, SlicePipe
  ],
  template: `
    <h3 class="h3">Categories</h3>
    <div class="content-box">

      <div class="page-header">
        <span class="subtitle">{{ categories().length }} categories</span>
        <button mat-raised-button class="btn-primary" (click)="openForm()">
          <mat-icon>add</mat-icon> Add Category
        </button>
      </div>

      <!-- Form Panel -->
      @if (showForm()) {
        <div class="form-panel">
          <div class="form-panel-header">
            <h2>{{ editingId() ? 'Edit Category' : 'Add New Category' }}</h2>
            <button mat-icon-button (click)="closeForm()"><mat-icon>close</mat-icon></button>
          </div>
          <form [formGroup]="form" (ngSubmit)="onSave()" class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Name *</mat-label>
              <input matInput formControlName="name">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>URL Slug</mat-label>
              <input matInput formControlName="categoryUrl" placeholder="e.g. fashion">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Status</mat-label>
              <mat-select formControlName="status">
                <mat-option value="active">Active</mat-option>
                <mat-option value="inactive">Inactive</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Sort Order</mat-label>
              <input matInput type="number" formControlName="sortOrder">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full">
              <mat-label>Alias (comma-separated keywords)</mat-label>
              <input matInput formControlName="alias" placeholder="e.g. fashion,clothing,apparel">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="2"></textarea>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full">
              <mat-label>Meta Description</mat-label>
              <input matInput formControlName="metaDescription">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full">
              <mat-label>Meta Keywords</mat-label>
              <input matInput formControlName="metaKeywords">
            </mat-form-field>
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
        <table mat-table [dataSource]="categories()">
          <ng-container matColumnDef="categoryId">
            <th mat-header-cell *matHeaderCellDef>#</th>
            <td mat-cell *matCellDef="let c">{{ c.categoryId }}</td>
          </ng-container>
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let c"><strong>{{ c.name }}</strong></td>
          </ng-container>
          <ng-container matColumnDef="categoryUrl">
            <th mat-header-cell *matHeaderCellDef>URL Slug</th>
            <td mat-cell *matCellDef="let c">
              <code class="slug">{{ c.categoryUrl || '—' }}</code>
            </td>
          </ng-container>
          <ng-container matColumnDef="alias">
            <th mat-header-cell *matHeaderCellDef>Alias</th>
            <td mat-cell *matCellDef="let c">
              @if (c.alias) {
                <span class="alias-text" [matTooltip]="c.alias">{{ c.alias | slice:0:40 }}{{ c.alias.length > 40 ? '…' : '' }}</span>
              } @else {
                <span class="empty">—</span>
              }
            </td>
          </ng-container>
          <ng-container matColumnDef="sortOrder">
            <th mat-header-cell *matHeaderCellDef>Order</th>
            <td mat-cell *matCellDef="let c">{{ c.sortOrder }}</td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let c">
              <span [class]="'status-chip ' + c.status">{{ c.status }}</span>
            </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let c">
              <button mat-icon-button matTooltip="Edit" (click)="onEdit(c)"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button matTooltip="Delete" class="btn-danger" (click)="onDelete(c)"><mat-icon>delete</mat-icon></button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols;"></tr>
          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell empty-row" [attr.colspan]="cols.length">No categories found.</td>
          </tr>
        </table>
      </div>

    </div>
  `,
  styles: [`
    .page-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; }
    .subtitle { color:#64748b; font-size:13px; font-family:'Open Sans',sans-serif; }
    .btn-primary { background:#17A8D4 !important; color:#fff !important; }
    .btn-danger { color:#ef4444 !important; }

    .form-panel { background:#fff; border-radius:12px; padding:24px; margin-bottom:24px; box-shadow:0 1px 6px rgba(0,0,0,.08); }
    .form-panel-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
    .form-panel-header h2 { margin:0; font-size:17px; font-weight:700; color:#1e293b; font-family:'Open Sans',sans-serif; }
    .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px 20px; }
    .full { grid-column:1/-1; }
    .form-actions { display:flex; gap:12px; justify-content:flex-end; margin-top:8px; }

    .table-card { background:#fff; border-radius:12px; box-shadow:0 1px 6px rgba(0,0,0,.08); overflow:hidden; }
    table { width:100%; }
    th.mat-header-cell { font-weight:700; color:#475569; font-size:12px; text-transform:uppercase; letter-spacing:.5px; background:#f8fafc; }
    td.mat-cell { color:#334155; font-size:14px; font-family:'Open Sans',sans-serif; }

    .slug { background:#f1f5f9; padding:2px 8px; border-radius:4px; font-size:12px; color:#475569; }
    .alias-text { font-size:12px; color:#64748b; cursor:default; }
    .empty { color:#cbd5e1; }

    .status-chip { padding:3px 10px; border-radius:20px; font-size:12px; font-weight:600; }
    .status-chip.active { background:#dcfce7; color:#15803d; }
    .status-chip.inactive { background:#fee2e2; color:#b91c1c; }

    .empty-row { text-align:center; padding:32px; color:#94a3b8; font-style:italic; }
  `]
})
export class ManageCategoriesComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);

  cols = ['categoryId', 'name', 'categoryUrl', 'alias', 'sortOrder', 'status', 'actions'];
  categories = signal<Category[]>([]);
  showForm = signal(false);
  editingId = signal<number | null>(null);
  saving = signal(false);

  form = this.fb.group({
    name: ['', Validators.required],
    categoryUrl: [''],
    description: [''],
    metaDescription: [''],
    metaKeywords: [''],
    alias: [''],
    sortOrder: [0],
    status: ['active']
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.api.getCategories().subscribe({
      next: res => this.categories.set(res.data ?? []),
      error: () => this.snack.open('Failed to load categories', 'Close', { duration: 3000 })
    });
  }

  openForm(): void {
    this.editingId.set(null);
    this.form.reset({ status: 'active', sortOrder: 0 });
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  onEdit(c: Category): void {
    this.editingId.set(c.categoryId);
    this.form.patchValue({
      name: c.name,
      categoryUrl: c.categoryUrl ?? '',
      description: c.description ?? '',
      metaDescription: c.metaDescription ?? '',
      metaKeywords: c.metaKeywords ?? '',
      alias: c.alias ?? '',
      sortOrder: c.sortOrder ?? 0,
      status: c.status
    });
    this.showForm.set(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSave(): void {
    if (this.form.invalid) return;
    this.saving.set(true);
    const id = this.editingId();
    const payload = this.form.value as Partial<Category>;

    const req = id ? this.api.updateCategory(id, payload) : this.api.createCategory(payload);
    req.subscribe({
      next: res => {
        if (id) {
          this.categories.update(list => list.map(c => c.categoryId === id ? res.data : c));
          this.snack.open('Category updated', 'Close', { duration: 3000 });
        } else {
          this.categories.update(list => [res.data, ...list]);
          this.snack.open('Category created', 'Close', { duration: 3000 });
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

  onDelete(c: Category): void {
    if (!confirm(`Delete category "${c.name}"?`)) return;
    this.api.deleteCategory(c.categoryId).subscribe({
      next: () => {
        this.categories.update(list => list.filter(x => x.categoryId !== c.categoryId));
        this.snack.open('Category deleted', 'Close', { duration: 3000 });
      },
      error: () => this.snack.open('Delete failed', 'Close', { duration: 3000 })
    });
  }
}
