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
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DatePipe, SlicePipe } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { Coupon } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-manage-coupons',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatSnackBarModule, MatTooltipModule, MatPaginatorModule, MatCheckboxModule,
    DatePipe, SlicePipe
  ],
  template: `
    <h3 class="h3">Coupons</h3>
    <div class="content-box">

      <!-- Header -->
      <div class="page-header">
        <div class="filters">
          <span class="subtitle">{{ totalElements() }} coupons</span>
          <div class="filter-chips">
            @for (s of statuses; track s) {
              <button [class]="'chip ' + (filterStatus() === s ? 'active' : '')"
                      (click)="setFilter(s)">{{ s }}</button>
            }
          </div>
        </div>
        <button mat-raised-button class="btn-primary" (click)="openForm()">
          <mat-icon>add</mat-icon> Add Coupon
        </button>
      </div>

      <!-- Form Panel -->
      @if (showForm()) {
        <div class="form-panel">
          <div class="form-panel-header">
            <h2>{{ editingId() ? 'Edit Coupon' : 'Add New Coupon' }}</h2>
            <button mat-icon-button (click)="closeForm()"><mat-icon>close</mat-icon></button>
          </div>
          <form [formGroup]="form" (ngSubmit)="onSave()" class="form-grid">
            <mat-form-field appearance="outline" class="full">
              <mat-label>Title *</mat-label>
              <input matInput formControlName="title">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Type</mat-label>
              <mat-select formControlName="couponType">
                <mat-option value="Coupon">Coupon</mat-option>
                <mat-option value="Promotion">Promotion</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Status</mat-label>
              <mat-select formControlName="status">
                <mat-option value="active">Active</mat-option>
                <mat-option value="inactive">Inactive</mat-option>
                <mat-option value="expired">Expired</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Coupon Code</mat-label>
              <input matInput formControlName="code" placeholder="e.g. SAVE20">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Offer (e.g. 20%)</mat-label>
              <input matInput formControlName="offer" placeholder="e.g. 50%">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Retailer ID</mat-label>
              <input matInput type="number" formControlName="retailerId">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Promo ID</mat-label>
              <input matInput formControlName="promoId">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Start Date</mat-label>
              <input matInput type="datetime-local" formControlName="startDate">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>End Date</mat-label>
              <input matInput type="datetime-local" formControlName="endDate">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full">
              <mat-label>Link (Tracking URL)</mat-label>
              <input matInput formControlName="link">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full">
              <mat-label>Description / T&amp;C</mat-label>
              <textarea matInput formControlName="description" rows="3"></textarea>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Offer Image</mat-label>
              <input matInput formControlName="offerImg" placeholder="e.g. img.jpg">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Banner Image</mat-label>
              <input matInput formControlName="bannerImg" placeholder="e.g. banner.jpg">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Offer Template</mat-label>
              <input matInput formControlName="offerTemplate">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Exclusive (0/1)</mat-label>
              <mat-select formControlName="exclusive">
                <mat-option [value]="0">No</mat-option>
                <mat-option [value]="1">Yes</mat-option>
              </mat-select>
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
        <table mat-table [dataSource]="coupons()">
          <ng-container matColumnDef="couponId">
            <th mat-header-cell *matHeaderCellDef>#</th>
            <td mat-cell *matCellDef="let c">{{ c.couponId }}</td>
          </ng-container>
          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef>Type</th>
            <td mat-cell *matCellDef="let c">
              <span [class]="'type-chip ' + (c.couponType === 'Coupon' ? 'coupon' : 'promo')">
                {{ c.couponType }}
              </span>
            </td>
          </ng-container>
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Title</th>
            <td mat-cell *matCellDef="let c">
              <div class="title-cell" [matTooltip]="c.title">
                <strong>{{ c.title | slice:0:50 }}{{ c.title.length > 50 ? '…' : '' }}</strong>
                @if (c.code) {
                  <code class="code-badge">{{ c.code }}</code>
                }
              </div>
            </td>
          </ng-container>
          <ng-container matColumnDef="offer">
            <th mat-header-cell *matHeaderCellDef>Offer</th>
            <td mat-cell *matCellDef="let c">
              @if (c.offer) {
                <span class="offer-badge">{{ c.offer }}</span>
              } @else {
                <span class="empty">—</span>
              }
            </td>
          </ng-container>
          <ng-container matColumnDef="retailerId">
            <th mat-header-cell *matHeaderCellDef>Retailer ID</th>
            <td mat-cell *matCellDef="let c">{{ c.retailerId || '—' }}</td>
          </ng-container>
          <ng-container matColumnDef="endDate">
            <th mat-header-cell *matHeaderCellDef>Expires</th>
            <td mat-cell *matCellDef="let c">
              @if (c.endDate) {
                <span [class]="isExpired(c.endDate) ? 'expired-date' : ''">
                  {{ c.endDate | date:'dd MMM yy' }}
                </span>
              } @else {
                <span class="empty">—</span>
              }
            </td>
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
            <td class="mat-cell empty-row" [attr.colspan]="cols.length">No coupons found.</td>
          </tr>
        </table>

        <mat-paginator
          [length]="totalElements()"
          [pageSize]="pageSize"
          [pageSizeOptions]="[25, 50, 100]"
          (page)="onPage($event)"
          showFirstLastButtons>
        </mat-paginator>
      </div>

    </div>
  `,
  styles: [`
    .page-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; flex-wrap:wrap; gap:12px; }
    .filters { display:flex; align-items:center; gap:16px; flex-wrap:wrap; }
    .subtitle { color:#64748b; font-size:13px; font-family:'Open Sans',sans-serif; }
    .filter-chips { display:flex; gap:6px; }
    .chip { padding:4px 14px; border-radius:20px; border:1px solid #e2e8f0; background:#fff; font-size:12px; font-weight:600; cursor:pointer; font-family:'Open Sans',sans-serif; text-transform:capitalize; transition:all .15s; }
    .chip.active { background:#17A8D4; color:#fff; border-color:#17A8D4; }
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

    .title-cell { display:flex; flex-direction:column; gap:3px; }
    .code-badge { background:#f1f5f9; padding:1px 7px; border-radius:4px; font-size:11px; color:#0369a1; font-weight:700; width:fit-content; }
    .offer-badge { background:#fef3c7; color:#92400e; padding:2px 10px; border-radius:12px; font-size:12px; font-weight:700; }

    .type-chip { padding:2px 10px; border-radius:12px; font-size:11px; font-weight:700; }
    .type-chip.coupon { background:#e0f2fe; color:#0369a1; }
    .type-chip.promo { background:#fce7f3; color:#9d174d; }

    .status-chip { padding:3px 10px; border-radius:20px; font-size:12px; font-weight:600; }
    .status-chip.active { background:#dcfce7; color:#15803d; }
    .status-chip.inactive { background:#f1f5f9; color:#64748b; }
    .status-chip.expired { background:#fee2e2; color:#b91c1c; }

    .expired-date { color:#ef4444; font-weight:600; }
    .empty { color:#cbd5e1; }
    .empty-row { text-align:center; padding:32px; color:#94a3b8; font-style:italic; }
  `]
})
export class ManageCouponsComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);

  cols = ['couponId', 'type', 'title', 'offer', 'retailerId', 'endDate', 'status', 'actions'];
  statuses = ['all', 'active', 'inactive', 'expired'];

  coupons = signal<Coupon[]>([]);
  totalElements = signal(0);
  filterStatus = signal('all');
  showForm = signal(false);
  editingId = signal<number | null>(null);
  saving = signal(false);
  pageSize = 50;
  currentPage = 0;

  form = this.fb.group({
    title: ['', Validators.required],
    couponType: ['Coupon'],
    status: ['active'],
    code: [''],
    offer: [''],
    retailerId: [null as number | null],
    promoId: [''],
    startDate: [''],
    endDate: [''],
    link: [''],
    description: [''],
    offerImg: [''],
    bannerImg: [''],
    offerTemplate: [''],
    exclusive: [0]
  });

  ngOnInit(): void { this.load(); }

  load(): void {
    this.api.getCoupons(this.currentPage, this.pageSize, this.filterStatus()).subscribe({
      next: res => {
        this.coupons.set(res.data?.content ?? []);
        this.totalElements.set(res.data?.totalElements ?? 0);
      },
      error: () => this.snack.open('Failed to load coupons', 'Close', { duration: 3000 })
    });
  }

  setFilter(s: string): void {
    this.filterStatus.set(s);
    this.currentPage = 0;
    this.load();
  }

  onPage(e: PageEvent): void {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.load();
  }

  openForm(): void {
    this.editingId.set(null);
    this.form.reset({ couponType: 'Coupon', status: 'active', exclusive: 0 });
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  onEdit(c: Coupon): void {
    this.editingId.set(c.couponId);
    this.form.patchValue({
      title: c.title,
      couponType: c.couponType,
      status: c.status,
      code: c.code ?? '',
      offer: c.offer ?? '',
      retailerId: c.retailerId ?? null,
      promoId: c.promoId ?? '',
      startDate: c.startDate ? c.startDate.substring(0, 16) : '',
      endDate: c.endDate ? c.endDate.substring(0, 16) : '',
      link: c.link ?? '',
      description: c.description ?? '',
      offerImg: c.offerImg ?? '',
      bannerImg: c.bannerImg ?? '',
      offerTemplate: c.offerTemplate ?? '',
      exclusive: c.exclusive ?? 0
    });
    this.showForm.set(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSave(): void {
    if (this.form.invalid) return;
    this.saving.set(true);
    const id = this.editingId();
    const raw = this.form.value;
    const payload: Record<string, unknown> = {
      ...raw,
      retailerId: raw.retailerId ?? undefined,
      startDate: raw.startDate ? raw.startDate + ':00' : undefined,
      endDate: raw.endDate ? raw.endDate + ':00' : undefined,
    };

    const req = id ? this.api.updateCoupon(id, payload as Partial<Coupon>) : this.api.createCoupon(payload as Partial<Coupon>);
    req.subscribe({
      next: res => {
        if (id) {
          this.coupons.update(list => list.map(c => c.couponId === id ? res.data : c));
          this.snack.open('Coupon updated', 'Close', { duration: 3000 });
        } else {
          this.load();
          this.snack.open('Coupon created', 'Close', { duration: 3000 });
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

  onDelete(c: Coupon): void {
    if (!confirm(`Delete coupon "${c.title}"?`)) return;
    this.api.deleteCoupon(c.couponId).subscribe({
      next: () => {
        this.coupons.update(list => list.filter(x => x.couponId !== c.couponId));
        this.totalElements.update(n => n - 1);
        this.snack.open('Coupon deleted', 'Close', { duration: 3000 });
      },
      error: () => this.snack.open('Delete failed', 'Close', { duration: 3000 })
    });
  }

  isExpired(dateStr: string): boolean {
    return new Date(dateStr) < new Date();
  }
}
