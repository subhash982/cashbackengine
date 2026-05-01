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
import { DatePipe } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { AffNetwork } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-manage-affnetworks',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatSnackBarModule, MatTooltipModule, DatePipe
  ],
  template: `
    <h3 class="h3">Affiliate Networks</h3>
    <div class="content-box">

      <div class="page-header">
        <span class="subtitle">{{ networks().length }} networks</span>
        <button mat-raised-button class="btn-primary" (click)="openForm()">
          <mat-icon>add</mat-icon> Add Network
        </button>
      </div>

      <!-- Add / Edit Form Panel -->
      @if (showForm()) {
        <div class="form-panel">
          <div class="form-panel-header">
            <h2>{{ editingId() ? 'Edit Network' : 'Add New Network' }}</h2>
            <button mat-icon-button (click)="closeForm()"><mat-icon>close</mat-icon></button>
          </div>
          <form [formGroup]="form" (ngSubmit)="onSave()" class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Network Name *</mat-label>
              <input matInput formControlName="networkName">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Website *</mat-label>
              <input matInput formControlName="website" placeholder="https://...">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Image Filename</mat-label>
              <input matInput formControlName="image" placeholder="e.g. network.png">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Status</mat-label>
              <mat-select formControlName="status">
                <mat-option value="active">Active</mat-option>
                <mat-option value="inactive">Inactive</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full">
              <mat-label>Confirmed Status Values</mat-label>
              <input matInput formControlName="confirmeds" placeholder="e.g. confirmed">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full">
              <mat-label>Pending Status Values</mat-label>
              <input matInput formControlName="pendings" placeholder="e.g. pend|approved">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full">
              <mat-label>Declined Status Values</mat-label>
              <input matInput formControlName="declineds" placeholder="e.g. dec|declined">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full">
              <mat-label>CSV Format</mat-label>
              <textarea matInput formControlName="csvFormat" rows="3" placeholder='"{COL1}","{COL2}",...'></textarea>
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
        <table mat-table [dataSource]="networks()">
          <ng-container matColumnDef="networkId">
            <th mat-header-cell *matHeaderCellDef>#</th>
            <td mat-cell *matCellDef="let n">{{ n.networkId }}</td>
          </ng-container>
          <ng-container matColumnDef="networkName">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let n">
              <div class="network-name">
                @if (n.image) {
                  <img [src]="'assets/images/hifi/' + n.image" [alt]="n.networkName" class="logo"
                       (error)="onImgError($event)">
                } @else {
                  <div class="logo-placeholder"><mat-icon>hub</mat-icon></div>
                }
                <strong>{{ n.networkName }}</strong>
              </div>
            </td>
          </ng-container>
          <ng-container matColumnDef="website">
            <th mat-header-cell *matHeaderCellDef>Website</th>
            <td mat-cell *matCellDef="let n">
              <a [href]="n.website.startsWith('http') ? n.website : 'https://' + n.website"
                 target="_blank" class="url-link">{{ n.website }}</a>
            </td>
          </ng-container>
          <ng-container matColumnDef="statuses">
            <th mat-header-cell *matHeaderCellDef>Status Mapping</th>
            <td mat-cell *matCellDef="let n">
              <div class="status-mapping">
                <span class="tag confirmed">✓ {{ n.confirmeds || '—' }}</span>
                <span class="tag pending">⏳ {{ n.pendings || '—' }}</span>
                <span class="tag declined">✗ {{ n.declineds || '—' }}</span>
              </div>
            </td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let n">
              <span [class]="'status-chip ' + n.status">{{ n.status }}</span>
            </td>
          </ng-container>
          <ng-container matColumnDef="added">
            <th mat-header-cell *matHeaderCellDef>Added</th>
            <td mat-cell *matCellDef="let n">{{ n.added | date:'dd MMM yyyy' }}</td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let n">
              <button mat-icon-button matTooltip="Edit" (click)="onEdit(n)"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button matTooltip="Delete" class="btn-danger" (click)="onDelete(n)"><mat-icon>delete</mat-icon></button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols;"></tr>
          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell empty-row" [attr.colspan]="cols.length">No networks found.</td>
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

    .network-name { display:flex; align-items:center; gap:10px; }
    .logo { width:32px; height:32px; object-fit:contain; border-radius:6px; border:1px solid #e2e8f0; }
    .logo-placeholder { width:32px; height:32px; background:#f1f5f9; border-radius:6px; display:flex; align-items:center; justify-content:center; }
    .logo-placeholder mat-icon { font-size:18px; width:18px; height:18px; color:#94a3b8; }

    .url-link { color:#17A8D4; text-decoration:none; font-size:13px; }

    .status-mapping { display:flex; flex-wrap:wrap; gap:4px; }
    .tag { font-size:11px; padding:2px 8px; border-radius:12px; font-weight:600; }
    .tag.confirmed { background:#dcfce7; color:#15803d; }
    .tag.pending { background:#fef9c3; color:#a16207; }
    .tag.declined { background:#fee2e2; color:#b91c1c; }

    .status-chip { padding:3px 10px; border-radius:20px; font-size:12px; font-weight:600; }
    .status-chip.active { background:#dcfce7; color:#15803d; }
    .status-chip.inactive { background:#fee2e2; color:#b91c1c; }

    .empty-row { text-align:center; padding:32px; color:#94a3b8; font-style:italic; }
  `]
})
export class ManageAffnetworksComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);

  cols = ['networkId', 'networkName', 'website', 'statuses', 'status', 'added', 'actions'];
  networks = signal<AffNetwork[]>([]);
  showForm = signal(false);
  editingId = signal<number | null>(null);
  saving = signal(false);

  form = this.fb.group({
    networkName: ['', Validators.required],
    website: ['', Validators.required],
    image: [''],
    csvFormat: [''],
    confirmeds: [''],
    pendings: [''],
    declineds: [''],
    status: ['active']
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.api.getAffNetworks().subscribe({
      next: res => this.networks.set(res.data ?? []),
      error: () => this.snack.open('Failed to load networks', 'Close', { duration: 3000 })
    });
  }

  openForm(): void {
    this.editingId.set(null);
    this.form.reset({ status: 'active' });
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  onEdit(n: AffNetwork): void {
    this.editingId.set(n.networkId);
    this.form.patchValue({
      networkName: n.networkName,
      website: n.website,
      image: n.image ?? '',
      csvFormat: n.csvFormat ?? '',
      confirmeds: n.confirmeds ?? '',
      pendings: n.pendings ?? '',
      declineds: n.declineds ?? '',
      status: n.status
    });
    this.showForm.set(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSave(): void {
    if (this.form.invalid) return;
    this.saving.set(true);
    const payload = this.form.value as Partial<AffNetwork>;
    const id = this.editingId();

    const req = id
      ? this.api.updateAffNetwork(id, payload)
      : this.api.createAffNetwork(payload);

    req.subscribe({
      next: res => {
        if (id) {
          this.networks.update(list => list.map(n => n.networkId === id ? res.data : n));
          this.snack.open('Network updated', 'Close', { duration: 3000 });
        } else {
          this.networks.update(list => [res.data, ...list]);
          this.snack.open('Network created', 'Close', { duration: 3000 });
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

  onDelete(n: AffNetwork): void {
    if (!confirm(`Delete "${n.networkName}"? This cannot be undone.`)) return;
    this.api.deleteAffNetwork(n.networkId).subscribe({
      next: () => {
        this.networks.update(list => list.filter(x => x.networkId !== n.networkId));
        this.snack.open('Network deleted', 'Close', { duration: 3000 });
      },
      error: () => this.snack.open('Delete failed', 'Close', { duration: 3000 })
    });
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }
}
