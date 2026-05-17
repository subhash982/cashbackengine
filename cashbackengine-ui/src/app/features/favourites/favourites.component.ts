import { Component, OnInit, signal, inject } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { StoreNavigationService } from '../../core/services/store-navigation.service';
import { Favorite } from '../../core/models/transaction.model';

@Component({
  selector: 'app-favourites',
  standalone: true,
  imports: [NgIf, NgFor],
  template: `
    <div class="page-wrap">
      <div class="content-wrap">

        <h3 class="h3">My Favourite Stores</h3>

        <div class="content-box" style="min-height: inherit;">

          <!-- Success message (only when navigating from Add to Favorites) -->
          <div *ngIf="showSuccess()" class="success-message">
            Store has been added to your favorites!
          </div>

          <!-- Loading -->
          <div *ngIf="loading()" class="loading-msg">Loading your favourites...</div>

          <!-- Empty state -->
          <div *ngIf="!loading() && favourites().length === 0" class="text-center content-box">
            <p class="no-item"><span>You have not added any stores to your favorites yet.<br>Browse stores and click "Add to favorites".</span></p>
          </div>

          <!-- Favourites list -->
          <div class="search-listing" *ngIf="!loading() && favourites().length > 0">

            <div *ngFor="let f of favourites()" class="clearfix store-detail-container">

              <!-- Store image -->
              <div class="retailer-img">
                <a (click)="viewStore(f)" style="cursor:pointer;">
                  <img *ngIf="getImage(f.retailerImage)"
                       [src]="getImage(f.retailerImage)"
                       [alt]="f.retailerTitle"
                       (error)="onImgError($event)">
                  <span *ngIf="!getImage(f.retailerImage)" class="store-initial">
                    {{ f.retailerTitle[0] }}
                  </span>
                </a>
              </div>

              <!-- Store details -->
              <div class="store-detail">
                <h3 class="h3 secondary">{{ f.retailerTitle }}</h3>
                <div class="clearfix">
                  <strong *ngIf="f.retailerCashback" class="offer-count">
                    <span class="rupee">₹</span>{{ f.retailerCashback }}
                  </strong>
                  <p *ngIf="f.retailerDescription">{{ f.retailerDescription }}</p>
                  <p *ngIf="!f.retailerDescription" style="color:#888; font-style:italic; font-size:13px;">
                    Earn cashback on every purchase.
                  </p>
                </div>
                <div class="clearfix">
                  <div class="left">
                    <a class="icon remove margin-right10"
                       (click)="removeFavourite(f)"
                       style="cursor:pointer;"
                       title="Remove from favorites">Remove</a>
                    <a class="icon cupon-small"
                       (click)="viewCoupons(f)"
                       style="cursor:pointer;"
                       title="View store coupons">{{ f.couponCount }} {{ f.couponCount === 1 ? 'Coupon' : 'Coupons' }}</a>
                  </div>
                  <a class="button right secondary"
                     (click)="goToStore(f)"
                     style="cursor:pointer;">
                    Go to store and earn cashback
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .page-wrap { font-family: 'Open Sans', sans-serif; }
    .content-wrap { padding: 0 20px 40px; }
    .loading-msg { padding: 40px; text-align: center; color: #64748b; font-size: 15px; }

    .store-initial {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      font-size: 32px;
      font-weight: 700;
      color: #0292CA;
    }
  `]
})
export class FavouritesComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private storeNav = inject(StoreNavigationService);

  favourites = signal<Favorite[]>([]);
  loading = signal(true);
  showSuccess = signal(false);

  ngOnInit() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    // Show success banner only when redirected from "Add to favorites"
    this.route.queryParams.subscribe(params => {
      this.showSuccess.set(!!params['added']);
    });

    this.load();
  }

  load() {
    this.loading.set(true);
    this.api.getMyFavorites().subscribe({
      next: res => { this.favourites.set(res.data || []); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  removeFavourite(f: Favorite) {
    this.api.removeFavorite(f.retailerId).subscribe({
      next: () => {
        this.favourites.update(list => list.filter(x => x.favoriteId !== f.favoriteId));
        this.showSuccess.set(false);
      },
      error: () => {}
    });
  }

  goToStore(f: Favorite) {
    if (f.retailerUrl) {
      this.storeNav.goToStore(f.retailerId, f.retailerUrl);
    }
  }

  viewStore(f: Favorite) {
    this.router.navigate(['/stores'], { queryParams: { id: f.retailerId } });
  }

  viewCoupons(f: Favorite) {
    this.router.navigate(['/coupons'], { queryParams: { retailer: f.retailerId } });
  }

  getImage(image?: string): string {
    if (!image || image.trim() === '' || image === 'noimg.gif') return '';
    const filename = image.includes('/') ? image.split('/').pop()! : image;
    return `assets/images/retailers/${filename}`;
  }

  onImgError(event: Event) {
    (event.target as HTMLImageElement).style.display = 'none';
  }
}
