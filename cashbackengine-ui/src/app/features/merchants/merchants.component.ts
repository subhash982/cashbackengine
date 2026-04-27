import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Merchant, PageResponse } from '../../core/models/transaction.model';

@Component({
  selector: 'app-merchants',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatChipsModule, MatIconModule, MatPaginatorModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>Merchant Offers</h1>
      </div>

      <div class="card-grid">
        @for (merchant of page()?.content ?? []; track merchant.id) {
          <mat-card>
            <mat-card-header>
              <mat-card-title>{{ merchant.name }}</mat-card-title>
              <mat-card-subtitle>{{ merchant.category }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>{{ merchant.description }}</p>
              <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">
                <mat-chip highlighted color="primary">
                  Up to {{ merchant.userSharePercentage }}% Cashback
                </mat-chip>
                <mat-chip>{{ merchant.affiliateNetwork }}</mat-chip>
              </div>
            </mat-card-content>
            <mat-card-actions>
              <a mat-raised-button color="primary"
                 [href]="getTrackingUrl(merchant)"
                 target="_blank">
                <mat-icon>shopping_cart</mat-icon> Shop Now
              </a>
            </mat-card-actions>
          </mat-card>
        }
      </div>

      @if (page()) {
        <mat-paginator
          [length]="page()!.totalElements"
          [pageSize]="page()!.size"
          [pageIndex]="page()!.number"
          (page)="onPage($event)"
          style="margin-top:24px">
        </mat-paginator>
      }
    </div>
  `
})
export class MerchantsComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  page = signal<PageResponse<Merchant> | null>(null);

  ngOnInit(): void {
    this.loadMerchants(0);
  }

  loadMerchants(page: number): void {
    this.api.getMerchants(page).subscribe(res => this.page.set(res.data));
  }

  onPage(event: PageEvent): void {
    this.loadMerchants(event.pageIndex);
  }

  getTrackingUrl(merchant: Merchant): string {
    const userId = this.auth.currentUser()?.userId;
    return `/api/v1/clicks/track?userId=${userId}&merchantId=${merchant.id}`;
  }
}
