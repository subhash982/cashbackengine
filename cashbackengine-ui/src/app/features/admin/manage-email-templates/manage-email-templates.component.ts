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
import { EmailTemplate } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-manage-email-templates',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatSnackBarModule, MatTooltipModule, DatePipe
  ],
  template: `
    <h3 class="h3">Email Templates</h3>
    <div class="content-box">

      <div class="page-header">
        <span class="subtitle">{{ templates().length }} templates</span>
        <button mat-raised-button class="btn-primary" (click)="openForm()">
          <mat-icon>add</mat-icon> Add Template
        </button>
      </div>

      <!-- Form / Editor Panel -->
      @if (showForm()) {
        <div class="form-panel">
          <div class="form-panel-header">
            <h2>{{ editingId() ? 'Edit Template' : 'Add New Template' }}</h2>
            <button mat-icon-button (click)="closeForm()"><mat-icon>close</mat-icon></button>
          </div>
          <form [formGroup]="form" (ngSubmit)="onSave()" class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Template Name (key) *</mat-label>
              <input matInput formControlName="emailName" placeholder="e.g. signup">
              <mat-hint>Unique identifier used in code</mat-hint>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Language</mat-label>
              <mat-select formControlName="language">
                <mat-option value="english">English</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full">
              <mat-label>Subject *</mat-label>
              <input matInput formControlName="emailSubject">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full">
              <mat-label>Message (HTML)</mat-label>
              <textarea matInput formControlName="emailMessage" rows="16"
                placeholder="Enter HTML email body..."></textarea>
            </mat-form-field>

            <!-- Preview -->
            @if (form.value.emailMessage) {
              <div class="full preview-section">
                <div class="preview-label">
                  <mat-icon>preview</mat-icon> Preview
                </div>
                <div class="preview-frame" [innerHTML]="form.value.emailMessage"></div>
              </div>
            }

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
        <table mat-table [dataSource]="templates()">
          <ng-container matColumnDef="templateId">
            <th mat-header-cell *matHeaderCellDef>#</th>
            <td mat-cell *matCellDef="let t">{{ t.templateId }}</td>
          </ng-container>
          <ng-container matColumnDef="emailName">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let t"><code class="name-badge">{{ t.emailName }}</code></td>
          </ng-container>
          <ng-container matColumnDef="emailSubject">
            <th mat-header-cell *matHeaderCellDef>Subject</th>
            <td mat-cell *matCellDef="let t"><strong>{{ t.emailSubject }}</strong></td>
          </ng-container>
          <ng-container matColumnDef="language">
            <th mat-header-cell *matHeaderCellDef>Language</th>
            <td mat-cell *matCellDef="let t">
              <span class="lang-chip">{{ t.language || 'english' }}</span>
            </td>
          </ng-container>
          <ng-container matColumnDef="variables">
            <th mat-header-cell *matHeaderCellDef>Variables</th>
            <td mat-cell *matCellDef="let t">
              <div class="vars">
                @for (v of extractVars(t.emailMessage); track v) {
                  <span class="var-chip">{{ v }}</span>
                }
              </div>
            </td>
          </ng-container>
          <ng-container matColumnDef="modified">
            <th mat-header-cell *matHeaderCellDef>Modified</th>
            <td mat-cell *matCellDef="let t">{{ t.modified | date:'dd MMM yyyy' }}</td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let t">
              <button mat-icon-button matTooltip="Edit" (click)="onEdit(t)"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button matTooltip="Preview" (click)="onPreview(t)"><mat-icon>visibility</mat-icon></button>
              <button mat-icon-button matTooltip="Delete" class="btn-danger" (click)="onDelete(t)"><mat-icon>delete</mat-icon></button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols;"></tr>
          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell empty-row" [attr.colspan]="cols.length">No templates found.</td>
          </tr>
        </table>
      </div>

      <!-- Preview Modal -->
      @if (previewTemplate()) {
        <div class="preview-overlay" (click)="previewTemplate.set(null)">
          <div class="preview-modal" (click)="$event.stopPropagation()">
            <div class="preview-modal-header">
              <div>
                <div class="preview-modal-name">{{ previewTemplate()!.emailName }}</div>
                <div class="preview-modal-subject">{{ previewTemplate()!.emailSubject }}</div>
              </div>
              <button mat-icon-button (click)="previewTemplate.set(null)"><mat-icon>close</mat-icon></button>
            </div>
            <div class="preview-modal-body" [innerHTML]="previewTemplate()!.emailMessage"></div>
          </div>
        </div>
      }

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

    .preview-section { background:#f8fafc; border-radius:8px; padding:16px; border:1px solid #e2e8f0; }
    .preview-label { display:flex; align-items:center; gap:6px; font-size:12px; font-weight:700; color:#64748b; text-transform:uppercase; margin-bottom:12px; }
    .preview-label mat-icon { font-size:16px; width:16px; height:16px; }
    .preview-frame { background:#fff; border-radius:6px; padding:16px; border:1px solid #e2e8f0; max-height:300px; overflow-y:auto; }

    .table-card { background:#fff; border-radius:12px; box-shadow:0 1px 6px rgba(0,0,0,.08); overflow:hidden; }
    table { width:100%; }
    th.mat-header-cell { font-weight:700; color:#475569; font-size:12px; text-transform:uppercase; letter-spacing:.5px; background:#f8fafc; }
    td.mat-cell { color:#334155; font-size:14px; font-family:'Open Sans',sans-serif; vertical-align:middle; }

    .name-badge { background:#f1f5f9; padding:2px 10px; border-radius:4px; font-size:12px; color:#0369a1; font-weight:700; }
    .lang-chip { background:#e0f2fe; color:#0369a1; padding:2px 10px; border-radius:12px; font-size:11px; font-weight:600; text-transform:capitalize; }

    .vars { display:flex; flex-wrap:wrap; gap:4px; max-width:220px; }
    .var-chip { background:#fef3c7; color:#92400e; padding:1px 7px; border-radius:10px; font-size:10px; font-weight:700; font-family:monospace; }

    .empty-row { text-align:center; padding:32px; color:#94a3b8; font-style:italic; }

    /* Preview Modal */
    .preview-overlay { position:fixed; inset:0; background:rgba(0,0,0,.5); z-index:1000; display:flex; align-items:center; justify-content:center; padding:24px; }
    .preview-modal { background:#fff; border-radius:12px; width:100%; max-width:640px; max-height:85vh; display:flex; flex-direction:column; box-shadow:0 20px 60px rgba(0,0,0,.3); }
    .preview-modal-header { display:flex; justify-content:space-between; align-items:flex-start; padding:20px 20px 16px; border-bottom:1px solid #e2e8f0; }
    .preview-modal-name { font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:.5px; font-family:monospace; }
    .preview-modal-subject { font-size:16px; font-weight:700; color:#1e293b; margin-top:4px; font-family:'Open Sans',sans-serif; }
    .preview-modal-body { flex:1; overflow-y:auto; padding:20px; }
  `]
})
export class ManageEmailTemplatesComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);

  cols = ['templateId', 'emailName', 'emailSubject', 'language', 'variables', 'modified', 'actions'];
  templates = signal<EmailTemplate[]>([]);
  showForm = signal(false);
  editingId = signal<number | null>(null);
  saving = signal(false);
  previewTemplate = signal<EmailTemplate | null>(null);

  form = this.fb.group({
    emailName: ['', Validators.required],
    language: ['english'],
    emailSubject: ['', Validators.required],
    emailMessage: ['']
  });

  ngOnInit(): void { this.load(); }

  load(): void {
    this.api.getEmailTemplates().subscribe({
      next: res => this.templates.set(res.data ?? []),
      error: () => this.snack.open('Failed to load templates', 'Close', { duration: 3000 })
    });
  }

  openForm(): void {
    this.editingId.set(null);
    this.form.reset({ language: 'english' });
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  onEdit(t: EmailTemplate): void {
    this.editingId.set(t.templateId);
    this.form.patchValue({
      emailName: t.emailName,
      language: t.language ?? 'english',
      emailSubject: t.emailSubject,
      emailMessage: t.emailMessage ?? ''
    });
    this.showForm.set(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onPreview(t: EmailTemplate): void {
    this.previewTemplate.set(t);
  }

  onSave(): void {
    if (this.form.invalid) return;
    this.saving.set(true);
    const id = this.editingId();
    const payload = this.form.value as Partial<EmailTemplate>;

    const req = id ? this.api.updateEmailTemplate(id, payload) : this.api.createEmailTemplate(payload);
    req.subscribe({
      next: res => {
        if (id) {
          this.templates.update(list => list.map(t => t.templateId === id ? res.data : t));
          this.snack.open('Template updated', 'Close', { duration: 3000 });
        } else {
          this.templates.update(list => [...list, res.data]);
          this.snack.open('Template created', 'Close', { duration: 3000 });
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

  onDelete(t: EmailTemplate): void {
    if (!confirm(`Delete template "${t.emailName}"?`)) return;
    this.api.deleteEmailTemplate(t.templateId).subscribe({
      next: () => {
        this.templates.update(list => list.filter(x => x.templateId !== t.templateId));
        this.snack.open('Template deleted', 'Close', { duration: 3000 });
      },
      error: () => this.snack.open('Delete failed', 'Close', { duration: 3000 })
    });
  }

  extractVars(html: string | undefined): string[] {
    if (!html) return [];
    const matches = html.match(/\{[a-z_]+\}/g);
    return matches ? [...new Set(matches)] : [];
  }
}
