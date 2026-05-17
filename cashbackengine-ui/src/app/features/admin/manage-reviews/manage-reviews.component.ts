import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { Review } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-manage-reviews',
  standalone: true,
  imports: [
    NgFor, NgIf, DatePipe, FormsModule,
    MatTableModule, MatButtonModule, MatIconModule,
    MatSelectModule, MatSnackBarModule, MatTooltipModule, MatChipsModule
  ],
  template: `
    <h3 class="h3">Manage Reviews</h3>

    <div class="content-box">

      <!-- Filter bar -->
      <div class="filter-bar">
        <div class="filter-group">
          <label>Filter by status:</label>
          <select [(ngModel)]="filterStatus" class="filter-select">
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <span class="subtitle">{{ filtered().length }} review(s)</span>
      </div>

      <!-- Loading -->
      <div *ngIf="loading()" class="loading-msg">Loading reviews...</div>

      <!-- Empty state -->
      <div *ngIf="!loading() && filtered().length === 0" class="empty-state">
        <mat-icon>rate_review</mat-icon>
        <p>No reviews found.</p>
      </div>

      <!-- Reviews table -->
      <table *ngIf="!loading() && filtered().length > 0" mat-table [dataSource]="filtered()" class="reviews-table">

        <!-- Retailer -->
        <ng-container matColumnDef="retailer">
          <th mat-header-cell *matHeaderCellDef>Store</th>
          <td mat-cell *matCellDef="let r">{{ r.retailerTitle || '—' }}</td>
        </ng-container>

        <!-- User -->
        <ng-container matColumnDef="user">
          <th mat-header-cell *matHeaderCellDef>User</th>
          <td mat-cell *matCellDef="let r">{{ r.userName }}</td>
        </ng-container>

        <!-- Rating -->
        <ng-container matColumnDef="rating">
          <th mat-header-cell *matHeaderCellDef>Rating</th>
          <td mat-cell *matCellDef="let r">
            <span class="stars">{{ starsFor(r.rating) }}</span>
          </td>
        </ng-container>

        <!-- Title -->
        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef>Title</th>
          <td mat-cell *matCellDef="let r">{{ r.reviewTitle || '—' }}</td>
        </ng-container>

        <!-- Review -->
        <ng-container matColumnDef="review">
          <th mat-header-cell *matHeaderCellDef>Review</th>
          <td mat-cell *matCellDef="let r" class="review-cell">{{ r.review || '—' }}</td>
        </ng-container>

        <!-- Date -->
        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef>Date</th>
          <td mat-cell *matCellDef="let r">{{ r.added | date:'dd MMM yyyy' }}</td>
        </ng-container>

        <!-- Status -->
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let r">
            <span class="status-badge status-{{ r.status }}">{{ r.status }}</span>
          </td>
        </ng-container>

        <!-- Actions -->
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let r">
            <div class="action-row">
              <button mat-raised-button class="btn-approve"
                      *ngIf="r.status !== 'active'"
                      [disabled]="updating()"
                      (click)="updateStatus(r, 'active')"
                      matTooltip="Approve review">
                <mat-icon>check_circle</mat-icon> Approve
              </button>
              <button mat-raised-button class="btn-reject"
                      *ngIf="r.status !== 'rejected'"
                      [disabled]="updating()"
                      (click)="updateStatus(r, 'rejected')"
                      matTooltip="Reject review">
                <mat-icon>cancel</mat-icon> Reject
              </button>
              <button mat-icon-button class="btn-delete"
                      [disabled]="updating()"
                      (click)="deleteReview(r)"
                      matTooltip="Delete review">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="columns"></tr>
        <tr mat-row *matRowDef="let row; columns: columns;"
            [class.row-pending]="row.status === 'pending'"
            [class.row-active]="row.status === 'active'"
            [class.row-rejected]="row.status === 'rejected'">
        </tr>
      </table>

    </div>
  `,
  styles: [`
    .content-box { background: #fff; padding: 20px; border-radius: 8px; }

    .filter-bar {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 20px;
    }
    .filter-group { display: flex; align-items: center; gap: 8px; font-size: 14px; }
    .filter-select {
      padding: 6px 10px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 14px;
      outline: none;
    }
    .subtitle { color: #64748b; font-size: 13px; margin-left: auto; }

    .loading-msg { text-align: center; padding: 40px; color: #64748b; }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #94a3b8;
    }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; }

    .reviews-table { width: 100%; border-collapse: collapse; }

    th.mat-header-cell {
      background: #f8fafc;
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
      color: #475569;
      padding: 12px 16px;
    }
    td.mat-cell { padding: 12px 16px; font-size: 13px; vertical-align: top; border-bottom: 1px solid #f1f5f9; }

    .review-cell { max-width: 260px; }

    .stars { color: #f59e0b; font-size: 15px; letter-spacing: 1px; }

    /* Status badge */
    .status-badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .status-pending  { background: #fef3c7; color: #92400e; }
    .status-active   { background: #d1fae5; color: #065f46; }
    .status-rejected { background: #fee2e2; color: #991b1b; }

    /* Row highlights */
    .row-pending  { background: #fffbeb; }
    .row-rejected { background: #fef2f2; }

    /* Action buttons */
    .action-row { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }

    .btn-approve { background: #10b981 !important; color: #fff !important; font-size: 12px !important; }
    .btn-reject  { background: #ef4444 !important; color: #fff !important; font-size: 12px !important; }
    .btn-delete  { color: #94a3b8 !important; }
    .btn-delete:hover { color: #ef4444 !important; }
  `]
})
export class ManageReviewsComponent implements OnInit {
  private api = inject(ApiService);
  private snack = inject(MatSnackBar);

  reviews = signal<Review[]>([]);
  loading = signal(true);
  updating = signal(false);
  filterStatus = 'all';

  columns = ['retailer', 'user', 'rating', 'title', 'review', 'date', 'status', 'actions'];

  filtered = computed(() => {
    const status = this.filterStatus;
    if (status === 'all') return this.reviews();
    return this.reviews().filter(r => r.status === status);
  });

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.api.adminGetAllReviews().subscribe({
      next: res => { this.reviews.set(res.data || []); this.loading.set(false); },
      error: () => { this.snack.open('Failed to load reviews', 'Close', { duration: 3000 }); this.loading.set(false); }
    });
  }

  updateStatus(review: Review, status: string) {
    this.updating.set(true);
    this.api.adminUpdateReviewStatus(review.reviewId, status).subscribe({
      next: res => {
        this.reviews.update(list => list.map(r => r.reviewId === review.reviewId ? { ...r, status: res.data.status } : r));
        this.snack.open(`Review ${status === 'active' ? 'approved' : 'rejected'}`, 'Close', { duration: 3000 });
        this.updating.set(false);
      },
      error: () => { this.snack.open('Update failed', 'Close', { duration: 3000 }); this.updating.set(false); }
    });
  }

  deleteReview(review: Review) {
    if (!confirm('Delete this review permanently?')) return;
    this.updating.set(true);
    this.api.adminDeleteReview(review.reviewId).subscribe({
      next: () => {
        this.reviews.update(list => list.filter(r => r.reviewId !== review.reviewId));
        this.snack.open('Review deleted', 'Close', { duration: 3000 });
        this.updating.set(false);
      },
      error: () => { this.snack.open('Delete failed', 'Close', { duration: 3000 }); this.updating.set(false); }
    });
  }

  starsFor(rating: number): string {
    return '★'.repeat(Math.max(0, Math.min(5, rating || 0))) + '☆'.repeat(5 - Math.max(0, Math.min(5, rating || 0)));
  }
}
