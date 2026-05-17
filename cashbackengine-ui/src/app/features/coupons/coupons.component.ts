import { Component, OnInit, signal, inject, HostListener } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { StoreNavigationService } from '../../core/services/store-navigation.service';
import { CouponWithRetailer } from '../../core/models/transaction.model';

@Component({
  selector: 'app-coupons',
  standalone: true,
  imports: [NgIf, NgFor],
  template: `
    <h3 class="h3 with-icon cupon-icon">
      <ng-container *ngIf="retailerName(); else allTitle">
        {{ retailerName() }} — Coupons &amp; Promo Codes
      </ng-container>
      <ng-template #allTitle>Coupons &amp; Promo Codes</ng-template>
    </h3>

    <div *ngIf="retailerName()" class="retailer-filter-bar">
      <span>Showing coupons for <strong>{{ retailerName() }}</strong></span>
      <a class="clear-filter" (click)="clearFilter()">View all coupons &rarr;</a>
    </div>

    <!-- Loading -->
    <div *ngIf="loading()" class="loading-msg">Loading coupons...</div>

    <div class="search-listing" *ngIf="!loading()">

      <div *ngFor="let c of coupons()" class="clearfix store-detail-container cupons">

        <!-- Retailer image -->
        <div class="retailer-img">
          <img *ngIf="getImage(c.retailerImage)"
               [src]="getImage(c.retailerImage)"
               [alt]="c.retailerTitle || ''"
               [title]="c.retailerTitle || ''"
               (error)="onImgError($event)" />
          <span *ngIf="!getImage(c.retailerImage)" class="retailer-initial">
            {{ (c.retailerTitle || '?')[0] }}
          </span>
        </div>

        <!-- Store details -->
        <div class="store-detail">
          <h3 class="h3 secondary">{{ c.retailerTitle || 'Unknown Store' }}</h3>

          <div class="clearfix">
            <!-- Coupon code -->
            <div *ngIf="c.code" class="cupon-code">
              <span></span>{{ c.code }}
            </div>

            <!-- Title / description -->
            <p>{{ c.title }}</p>
            <p *ngIf="c.description" class="coupon-desc">{{ c.description }}</p>

            <!-- Expiry -->
            <p *ngIf="c.endDate" class="cupon-expired">
              Expiring on: {{ formatDate(c.endDate) }}&nbsp;
              <span [class]="isExpired(c.endDate) ? 'expired' : 'active-expiry'">
                {{ isExpired(c.endDate) ? 'expired' : timeLeft(c.endDate) }}
              </span>
            </p>
          </div>

          <div class="clearfix">
            <div class="left">
              <a class="margin-right10 icon favorite"
                 (click)="addToFavorites(c)"
                 style="cursor:pointer;"
                 title="Add to my favorite">
                Add Stores to Your Favorites
              </a>
              <a class="icon add"
                 (click)="viewRetailerCoupons(c)"
                 style="cursor:pointer;">
                See all coupons
              </a>
            </div>
            <a class="button secondary right"
               (click)="useCoupon(c)"
               style="cursor:pointer;">
              Use Coupon Code
            </a>
          </div>

          <!-- T&C link below the actions row -->
          <div *ngIf="c.retailerConditions" class="tc-row">
            <a class="icon info tc-link" (click)="openTc(c)">
              Terms &amp; Conditions Applied
            </a>
          </div>
        </div>

      </div>

      <div *ngIf="coupons().length === 0" class="text-center content-box">
        <p class="no-item"><span>We did not find any active coupons at the moment.<br>Please check back later for new deals.</span></p>
      </div>
    </div>

    <!-- T&C Modal -->
    <div class="tc-overlay" *ngIf="tcCoupon()" (click)="closeTc()">
      <div class="tc-modal" (click)="$event.stopPropagation()">
        <div class="tc-header">
          <span class="tc-title">Terms &amp; Conditions — {{ tcCoupon()?.retailerTitle }}</span>
          <button class="tc-close" (click)="closeTc()">&#x2715;</button>
        </div>
        <div class="tc-body" [innerHTML]="tcCoupon()?.retailerConditions"></div>
      </div>
    </div>
  `,
  styles: [`
    * { box-sizing: border-box; }

    .loading-msg {
      padding: 40px;
      text-align: center;
      color: #64748b;
      font-size: 15px;
      font-family: 'Open Sans', sans-serif;
    }

    .retailer-initial {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      font-size: 32px;
      font-weight: 700;
      color: #0292CA;
      font-family: 'Open Sans', sans-serif;
    }

    .coupon-desc {
      font-size: 12px;
      color: #888;
      margin: 4px 0 0;
      font-family: 'Open Sans', sans-serif;
    }

    .active-expiry {
      color: #2e7d32;
      font-weight: 600;
    }

    .expired {
      color: #c62828;
    }

    .tc-row {
      border-top: 1px solid #f0f0f0;
      padding: 8px 0 0;
      margin-top: 8px;
    }

    .tc-link {
      cursor: pointer;
      color: #0292CA;
      text-decoration: none;
      font-size: 12px;
    }

    .tc-link:hover {
      text-decoration: underline;
    }

    /* Modal overlay */
    .tc-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.55);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .tc-modal {
      background: #fff;
      border-radius: 4px;
      width: 560px;
      max-width: 90vw;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 8px 32px rgba(0,0,0,.25);
    }

    .tc-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #0292CA;
      color: #fff;
      padding: 12px 16px;
      border-radius: 4px 4px 0 0;
      gap: 12px;
    }

    .tc-title {
      font-family: 'Josefin Sans', sans-serif;
      font-size: 16px;
      font-weight: 600;
    }

    .tc-close {
      background: none;
      border: none;
      color: #fff;
      font-size: 18px;
      cursor: pointer;
      line-height: 1;
      padding: 0 4px;
      flex-shrink: 0;
    }

    .tc-close:hover {
      opacity: 0.75;
    }

    .tc-body {
      padding: 20px;
      overflow-y: auto;
      font-family: 'Open Sans', sans-serif;
      font-size: 13px;
      color: #555;
      line-height: 1.7;
    }

    .retailer-filter-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      border-radius: 4px;
      padding: 10px 16px;
      margin-bottom: 16px;
      font-family: 'Open Sans', sans-serif;
      font-size: 13px;
      color: #0369a1;
    }

    .clear-filter {
      color: #0292CA;
      cursor: pointer;
      font-size: 13px;
      text-decoration: none;
      white-space: nowrap;
      margin-left: 12px;
    }

    .clear-filter:hover { text-decoration: underline; }
  `]
})
export class CouponsComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private storeNav = inject(StoreNavigationService);

  coupons = signal<CouponWithRetailer[]>([]);
  loading = signal(true);
  tcCoupon = signal<CouponWithRetailer | null>(null);
  retailerName = signal<string>('');
  retailerId = signal<number | null>(null);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const rid = params['retailer'] ? +params['retailer'] : null;
      this.retailerId.set(rid);
      this.loading.set(true);
      if (rid) {
        this.api.getActiveCouponsByRetailer(rid).subscribe({
          next: res => {
            const data = res.data || [];
            this.coupons.set(data);
            this.retailerName.set(data[0]?.retailerTitle || '');
            this.loading.set(false);
          },
          error: err => { console.error('Failed to load coupons', err); this.loading.set(false); }
        });
      } else {
        this.retailerName.set('');
        this.api.getActiveCoupons().subscribe({
          next: res => { this.coupons.set(res.data || []); this.loading.set(false); },
          error: err => { console.error('Failed to load coupons', err); this.loading.set(false); }
        });
      }
    });
  }

  clearFilter() {
    this.router.navigate(['/coupons']);
  }

  viewRetailerCoupons(c: CouponWithRetailer) {
    if (!c.retailerId) return;
    // If already filtered to this retailer, do nothing; otherwise apply filter
    if (this.retailerId() === c.retailerId) return;
    this.router.navigate(['/coupons'], { queryParams: { retailer: c.retailerId } });
  }

  useCoupon(c: CouponWithRetailer) {
    const url = c.link || c.retailerUrl;
    if (!url) return;
    const retailerId = c.retailerId;
    if (retailerId) {
      this.storeNav.goToStore(retailerId, url);
    } else {
      window.open(url, '_blank', 'noopener');
    }
  }

  addToFavorites(c: CouponWithRetailer) {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }
    if (!c.retailerId) return;
    this.api.addFavorite(c.retailerId).subscribe({
      next: () => {
        this.router.navigate(['/favourites'], { queryParams: { added: c.retailerId } });
      },
      error: (err) => {
        // Already a favourite — navigate anyway
        if (err.status === 409) {
          this.router.navigate(['/favourites']);
        }
      }
    });
  }

  getImage(image?: string): string {
    if (!image || image.trim() === '' || image === 'noimg.gif') return '';
    const filename = image.includes('/') ? image.split('/').pop()! : image;
    return `assets/images/retailers/${filename}`;
  }

  onImgError(event: Event) {
    (event.target as HTMLImageElement).style.display = 'none';
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  isExpired(dateStr: string): boolean {
    return new Date(dateStr) < new Date();
  }

  openTc(c: CouponWithRetailer) { this.tcCoupon.set(c); }
  closeTc() { this.tcCoupon.set(null); }

  @HostListener('document:keydown.escape')
  onEscape() { this.closeTc(); }

  timeLeft(dateStr: string): string {
    const diff = new Date(dateStr).getTime() - Date.now();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days <= 0) return 'expires today';
    if (days === 1) return '1 day left';
    return `${days} days left`;
  }
}
