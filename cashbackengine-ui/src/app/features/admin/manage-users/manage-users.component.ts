import { Component, inject, OnInit, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { AdminUser } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatSnackBarModule, MatTooltipModule, DatePipe, UpperCasePipe],
  template: `
    <h3 class="h3">Users</h3>
    <div class="content-box">
    <div class="page-header">
      <div>
        <span class="subtitle">{{ users().length }} registered users</span>
      </div>
    </div>

    <div class="table-card">
      <table mat-table [dataSource]="users()">

        <ng-container matColumnDef="userId">
          <th mat-header-cell *matHeaderCellDef>#</th>
          <td mat-cell *matCellDef="let u">{{ u.userId }}</td>
        </ng-container>

        <ng-container matColumnDef="user">
          <th mat-header-cell *matHeaderCellDef>User</th>
          <td mat-cell *matCellDef="let u">
            <div class="user-cell">
              <div class="avatar">{{ (u.fname || u.username)[0] | uppercase }}</div>
              <div>
                <div class="user-name">{{ u.fname }} {{ u.lname }}</div>
                <div class="user-sub">{{ u.username }}</div>
              </div>
            </div>
          </td>
        </ng-container>

        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef>Email</th>
          <td mat-cell *matCellDef="let u">{{ u.email }}</td>
        </ng-container>

        <ng-container matColumnDef="role">
          <th mat-header-cell *matHeaderCellDef>Role</th>
          <td mat-cell *matCellDef="let u">
            <span [class]="'role-chip ' + u.role.toLowerCase()">{{ u.role }}</span>
          </td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let u">
            <span [class]="'status-chip ' + u.status">{{ u.status }}</span>
          </td>
        </ng-container>

        <ng-container matColumnDef="created">
          <th mat-header-cell *matHeaderCellDef>Joined</th>
          <td mat-cell *matCellDef="let u">{{ u.created | date:'dd MMM yyyy' }}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let u">
            <button mat-stroked-button class="action-btn"
              [matTooltip]="u.role === 'ADMIN' ? 'Demote to User' : 'Promote to Admin'"
              (click)="toggleRole(u)">
              <mat-icon>{{ u.role === 'ADMIN' ? 'person_remove' : 'manage_accounts' }}</mat-icon>
              {{ u.role === 'ADMIN' ? 'Demote' : 'Make Admin' }}
            </button>
            <button mat-stroked-button
              [class]="'action-btn ' + (u.status === 'active' ? 'btn-warn' : 'btn-ok')"
              [matTooltip]="u.status === 'active' ? 'Block user' : 'Activate user'"
              (click)="toggleStatus(u)">
              <mat-icon>{{ u.status === 'active' ? 'block' : 'check_circle' }}</mat-icon>
              {{ u.status === 'active' ? 'Block' : 'Activate' }}
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="cols"></tr>
        <tr mat-row *matRowDef="let row; columns: cols;"></tr>
        <tr class="mat-row" *matNoDataRow>
          <td class="mat-cell empty-row" [attr.colspan]="cols.length">No users found.</td>
        </tr>
      </table>
    </div>
    </div>
  `,
  styles: [`
    .page-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:24px; }
    .page-header h1 { margin:0 0 4px; font-size:24px; font-weight:700; color:#1e293b; font-family:'Open Sans',sans-serif; }
    .subtitle { color:#64748b; font-size:13px; font-family:'Open Sans',sans-serif; }

    .table-card { background:#fff; border-radius:12px; box-shadow:0 1px 6px rgba(0,0,0,.08); overflow:hidden; }
    table { width:100%; }
    th.mat-header-cell { font-weight:700; color:#475569; font-size:12px; text-transform:uppercase; letter-spacing:.5px; background:#f8fafc; }
    td.mat-cell { color:#334155; font-size:14px; font-family:'Open Sans',sans-serif; padding:10px 16px; }

    .user-cell { display:flex; align-items:center; gap:12px; }
    .avatar { width:36px; height:36px; border-radius:50%; background:#17A8D4; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:14px; flex-shrink:0; }
    .user-name { font-weight:600; font-size:14px; color:#1e293b; }
    .user-sub { font-size:12px; color:#94a3b8; }

    .role-chip { padding:3px 10px; border-radius:20px; font-size:12px; font-weight:600; }
    .role-chip.admin { background:#ede9fe; color:#7c3aed; }
    .role-chip.user { background:#e0f2fe; color:#0284c7; }

    .status-chip { padding:3px 10px; border-radius:20px; font-size:12px; font-weight:600; }
    .status-chip.active { background:#dcfce7; color:#15803d; }
    .status-chip.blocked { background:#fee2e2; color:#b91c1c; }
    .status-chip.inactive { background:#f1f5f9; color:#64748b; }

    .action-btn { margin-right:8px; font-size:13px; height:32px; line-height:32px; }
    .action-btn mat-icon { font-size:16px; width:16px; height:16px; margin-right:4px; }
    .btn-warn { color:#ef4444 !important; border-color:#ef4444 !important; }
    .btn-ok { color:#16a34a !important; border-color:#16a34a !important; }
    .empty-row { text-align:center; padding:32px; color:#94a3b8; font-style:italic; }
  `]
})
export class ManageUsersComponent implements OnInit {
  private api = inject(ApiService);
  private snack = inject(MatSnackBar);

  cols = ['userId', 'user', 'email', 'role', 'status', 'created', 'actions'];
  users = signal<AdminUser[]>([]);

  ngOnInit(): void {
    this.api.getAdminUsers().subscribe({
      next: res => this.users.set(res.data ?? []),
      error: () => this.snack.open('Failed to load users', 'Close', { duration: 3000 })
    });
  }

  toggleRole(u: AdminUser): void {
    const newRole = u.role === 'ADMIN' ? 'USER' : 'ADMIN';
    if (!confirm(`Change ${u.username}'s role to ${newRole}?`)) return;
    this.api.updateUserRole(u.userId, newRole).subscribe({
      next: res => {
        this.users.update(list => list.map(x => x.userId === u.userId ? res.data : x));
        this.snack.open(`Role updated to ${newRole}`, 'Close', { duration: 3000 });
      },
      error: () => this.snack.open('Failed to update role', 'Close', { duration: 3000 })
    });
  }

  toggleStatus(u: AdminUser): void {
    const newStatus = u.status === 'active' ? 'blocked' : 'active';
    if (!confirm(`${newStatus === 'blocked' ? 'Block' : 'Activate'} ${u.username}?`)) return;
    this.api.updateUserStatus(u.userId, newStatus).subscribe({
      next: res => {
        this.users.update(list => list.map(x => x.userId === u.userId ? res.data : x));
        this.snack.open(`User ${newStatus}`, 'Close', { duration: 3000 });
      },
      error: () => this.snack.open('Failed to update status', 'Close', { duration: 3000 })
    });
  }
}
