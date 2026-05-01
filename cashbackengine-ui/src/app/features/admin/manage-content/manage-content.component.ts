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
import { DatePipe, SlicePipe } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { Content } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-manage-content',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatSnackBarModule, MatTooltipModule, DatePipe, SlicePipe
  ],
  template: `
    <h3 class="h3">Content Management</h3>
    <div class="content-box">

      <div class="page-header">
        <span class="subtitle">{{ contents().length }} pages</span>
        <button mat-raised-button class="btn-primary" (click)="openForm()">
          <mat-icon>add</mat-icon> Add Page
        </button>
      </div>

      <!-- Form Panel -->
      @if (showForm()) {
        <div class="form-panel">
          <div class="form-panel-header">
            <h2>{{ editingId() ? 'Edit Content Page' : 'Add New Content Page' }}</h2>
            <button mat-icon-button (click)="closeForm()"><mat-icon>close</mat-icon></button>
          </div>
          <form [formGroup]="form" (ngSubmit)="onSave()" class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Page Name (slug) *</mat-label>
              <input matInput formControlName="name" placeholder="e.g. aboutus">
              <mat-hint>Used as identifier — no spaces</mat-hint>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Title</mat-label>
              <input matInput formControlName="title" placeholder="e.g. About Us">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Language</mat-label>
              <mat-select formControlName="language">
                <mat-option value="english">English</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Status</mat-label>
              <mat-select formControlName="status">
                <mat-option value="active">Active</mat-option>
                <mat-option value="inactive">Inactive</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Link Title</mat-label>
              <input matInput formControlName="linkTitle">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Page URL</mat-label>
              <input matInput formControlName="pageUrl" placeholder="e.g. /about">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full">
              <mat-label>Description (HTML)</mat-label>
              <textarea matInput formControlName="description" rows="8"
                placeholder="Enter HTML content..."></textarea>
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
        <table mat-table [dataSource]="contents()">
          <ng-container matColumnDef="contentId">
            <th mat-header-cell *matHeaderCellDef>#</th>
            <td mat-cell *matCellDef="let c">{{ c.contentId }}</td>
          </ng-container>
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Page Name</th>
            <td mat-cell *matCellDef="let c"><code class="slug">{{ c.name }}</code></td>
          </ng-container>
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Title</th>
            <td mat-cell *matCellDef="let c"><strong>{{ c.title || '—' }}</strong></td>
          </ng-container>
          <ng-container matColumnDef="language">
            <th mat-header-cell *matHeaderCellDef>Language</th>
            <td mat-cell *matCellDef="let c">
              <span class="lang-chip">{{ c.language || 'english' }}</span>
            </td>
          </ng-container>
          <ng-container matColumnDef="preview">
            <th mat-header-cell *matHeaderCellDef>Content Preview</th>
            <td mat-cell *matCellDef="let c">
              <span class="preview-text" [matTooltip]="stripHtml(c.description)">
                {{ stripHtml(c.description) | slice:0:60 }}{{ stripHtml(c.description).length > 60 ? '…' : '' }}
              </span>
            </td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let c">
              <span [class]="'status-chip ' + c.status">{{ c.status }}</span>
            </td>
          </ng-container>
          <ng-container matColumnDef="modified">
            <th mat-header-cell *matHeaderCellDef>Modified</th>
            <td mat-cell *matCellDef="let c">{{ c.modified | date:'dd MMM yyyy' }}</td>
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
            <td class="mat-cell empty-row" [attr.colspan]="cols.length">No content pages found.</td>
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

    .slug { background:#f1f5f9; padding:2px 8px; border-radius:4px; font-size:12px; color:#475569; font-family:monospace; }
    .lang-chip { background:#e0f2fe; color:#0369a1; padding:2px 10px; border-radius:12px; font-size:11px; font-weight:600; text-transform:capitalize; }
    .preview-text { font-size:12px; color:#64748b; cursor:default; }

    .status-chip { padding:3px 10px; border-radius:20px; font-size:12px; font-weight:600; }
    .status-chip.active { background:#dcfce7; color:#15803d; }
    .status-chip.inactive { background:#fee2e2; color:#b91c1c; }

    .empty-row { text-align:center; padding:32px; color:#94a3b8; font-style:italic; }
  `]
})
export class ManageContentComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);

  cols = ['contentId', 'name', 'title', 'language', 'preview', 'status', 'modified', 'actions'];
  contents = signal<Content[]>([]);
  showForm = signal(false);
  editingId = signal<number | null>(null);
  saving = signal(false);

  form = this.fb.group({
    name: ['', Validators.required],
    title: [''],
    language: ['english'],
    linkTitle: [''],
    description: [''],
    pageUrl: [''],
    metaDescription: [''],
    metaKeywords: [''],
    status: ['active']
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.api.getContents().subscribe({
      next: res => this.contents.set(res.data ?? []),
      error: () => this.snack.open('Failed to load content', 'Close', { duration: 3000 })
    });
  }

  openForm(): void {
    this.editingId.set(null);
    this.form.reset({ language: 'english', status: 'active' });
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  onEdit(c: Content): void {
    this.editingId.set(c.contentId);
    this.form.patchValue({
      name: c.name,
      title: c.title ?? '',
      language: c.language ?? 'english',
      linkTitle: c.linkTitle ?? '',
      description: c.description ?? '',
      pageUrl: c.pageUrl ?? '',
      metaDescription: c.metaDescription ?? '',
      metaKeywords: c.metaKeywords ?? '',
      status: c.status
    });
    this.showForm.set(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSave(): void {
    if (this.form.invalid) return;
    this.saving.set(true);
    const id = this.editingId();
    const payload = this.form.value as Partial<Content>;

    const req = id ? this.api.updateContent(id, payload) : this.api.createContent(payload);
    req.subscribe({
      next: res => {
        if (id) {
          this.contents.update(list => list.map(c => c.contentId === id ? res.data : c));
          this.snack.open('Content updated', 'Close', { duration: 3000 });
        } else {
          this.contents.update(list => [res.data, ...list]);
          this.snack.open('Content created', 'Close', { duration: 3000 });
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

  onDelete(c: Content): void {
    if (!confirm(`Delete page "${c.name}"? This cannot be undone.`)) return;
    this.api.deleteContent(c.contentId).subscribe({
      next: () => {
        this.contents.update(list => list.filter(x => x.contentId !== c.contentId));
        this.snack.open('Content deleted', 'Close', { duration: 3000 });
      },
      error: () => this.snack.open('Delete failed', 'Close', { duration: 3000 })
    });
  }

  stripHtml(html: string | undefined): string {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }
}
