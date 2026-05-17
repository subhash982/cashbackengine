import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { StoreNavigationService } from '../../core/services/store-navigation.service';
import { Retailer, Review, Favorite } from '../../core/models/transaction.model';

@Component({
  selector: 'app-stores',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  template: `
    <div class="page-wrap">
      <div class="content-wrap">

        <!-- ── Store Detail View ── -->
        <ng-container *ngIf="selectedRetailer(); else listView">
          <h2 class="h3">{{ selectedRetailer()!.title }}</h2>

          <div class="content-box">
            <div class="clearfix store-detail-container">

              <!-- Retailer image -->
              <div class="retailer-img">
                <img *ngIf="getImage(selectedRetailer()!.image)"
                     [src]="getImage(selectedRetailer()!.image)"
                     [alt]="selectedRetailer()!.title"
                     [title]="selectedRetailer()!.title"
                     (error)="onImgError($event)" />
                <span *ngIf="!getImage(selectedRetailer()!.image)" class="retailer-initial">
                  {{ selectedRetailer()!.title[0] }}
                </span>
              </div>

              <!-- Store detail -->
              <div class="store-detail">
                <h3 class="h3 secondary">
                  {{ selectedRetailer()!.title }}.
                  {{ selectedRetailer()!.cashback ? 'Earn up to ' + selectedRetailer()!.cashback + ' Cashback' : 'Earn Cashback' }}
                </h3>

                <div class="clearfix">
                  <strong *ngIf="selectedRetailer()!.cashback" class="offer-count">
                    {{ selectedRetailer()!.cashback }}
                  </strong>
                  <p *ngIf="selectedRetailer()!.description">{{ selectedRetailer()!.description }}</p>
                  <p *ngIf="!selectedRetailer()!.description" class="no-desc">
                    Shop at {{ selectedRetailer()!.title }} and earn cashback on every purchase.
                  </p>
                </div>

                <div class="clearfix">
                  <div class="left">
                    <a class="icon favorite margin-right10"
                       *ngIf="!isFavorite()"
                       (click)="addToFavorites()"
                       style="cursor:pointer;">Add to favorites</a>
                    <a class="icon favorite margin-right10"
                       *ngIf="isFavorite()"
                       style="cursor:pointer; opacity:0.5;">Added to favorites</a>
                    <a class="icon flag" href="#">Report</a>
                  </div>
                  <a class="button right secondary"
                     (click)="goToStoreDetail(selectedRetailer()!)"
                     style="cursor:pointer;">
                    Go to store and earn cashback
                  </a>
                </div>
              </div>

            </div>
          </div>

          <!-- ── Reviews Section ── -->
          <div class="content-box" style="min-height: inherit;">
            <div class="clearfix similar-stores">

              <h3 class="h3 secondary with-icon comments-icon">What People Says</h3>

              <!-- Review list -->
              <div *ngIf="loadingReviews()" class="loading-msg">Loading reviews...</div>

              <ul class="user-comments" *ngIf="!loadingReviews()">
                <li *ngFor="let rev of reviews()">
                  <div class="user-image">
                    <img src="assets/images/hifi/user-icon.png" class="imgs" [alt]="rev.userName">
                  </div>
                  <div class="comment">
                    <p>{{ rev.review }}</p>
                    <p *ngIf="rev.reviewTitle" style="font-style:italic; color:#666; font-size:13px;">{{ rev.reviewTitle }}</p>
                    <div class="user-info">
                      <span class="user-name">{{ rev.userName }}<strong> on {{ formatDate(rev.added) }}</strong></span>
                      <span class="user-rating">
                        <img [src]="ratingImage(rev.rating)" alt="{{ rev.rating }} stars">
                      </span>
                    </div>
                  </div>
                </li>
                <li *ngIf="reviews().length === 0" style="color:#888; font-size:13px;">
                  No reviews yet. Be the first to review!
                </li>
              </ul>

              <!-- Review form (hidden until Post Comment clicked) -->
              <div id="review-form" *ngIf="showReviewForm()">
                <form (ngSubmit)="submitReview()">
                  <div *ngIf="reviewSuccess()" class="success-message">{{ reviewSuccess() }}</div>
                  <div *ngIf="reviewError()" class="review-error">{{ reviewError() }}</div>
                  <div class="form-row clearfix">
                    <label class="label" for="your-review">Your Ratings</label>
                    <select name="rating" id="your-review" class="input-medium" [(ngModel)]="reviewRating">
                      <option value="">- select rating -</option>
                      <option value="5">★★★★★ - Excellent</option>
                      <option value="4">★★★★ - Very Good</option>
                      <option value="3">★★★ - Good</option>
                      <option value="2">★★ - Fair</option>
                      <option value="1">★ - Poor</option>
                    </select>
                  </div>
                  <div class="form-row clearfix">
                    <label class="label" for="review_title">Title of your review</label>
                    <input type="text" id="review_title" [(ngModel)]="reviewTitle" name="review_title" size="47" class="input-large">
                  </div>
                  <div class="form-row clearfix">
                    <label class="label" for="review">Your review</label>
                    <textarea id="review" name="review" rows="5" class="input-large" [(ngModel)]="reviewText"></textarea>
                  </div>
                  <div class="form-row without-label clearfix">
                    <input type="submit" class="button primary left margin-right10" value="Submit your review" [disabled]="submitting()">
                    <button type="button" class="button left" (click)="resetForm()">Reset</button>
                  </div>
                </form>
              </div>

              <!-- Post Comment toggle -->
              <p class="text-right no-margin">
                <a *ngIf="!showReviewForm() && !alreadyReviewed()" id="add-review" class="button secondary" (click)="openReviewForm()">Post Comment</a>
                <span *ngIf="alreadyReviewed()" class="already-reviewed">You have already submitted a review for this store.</span>
              </p>

            </div>
          </div>

          <!-- Back link -->
          <a class="back-link" (click)="goBack()">
            &larr; Back to all stores
          </a>
        </ng-container>

        <!-- ── Store List View ── -->
        <ng-template #listView>
          <h3 class="h3">Our Cashback Stores</h3>

          <div *ngIf="loading()" class="loading-msg">Loading stores...</div>

          <div class="clearfix all-stores" *ngIf="!loading()">
            <ul class="deals-listing clearfix">
              <li class="deals" *ngFor="let r of retailers()" (click)="viewStore(r)">

                <p class="store-img">
                  <img *ngIf="getImage(r.image)"
                       [src]="getImage(r.image)"
                       [alt]="r.title"
                       [title]="r.title"
                       (error)="onImgError($event)" />
                  <span *ngIf="!getImage(r.image)" class="store-initial">{{ r.title[0] }}</span>
                </p>

                <span class="more-offers">{{ r.cashback ? 'Upto ' + r.cashback + ' cashback' : 'Cashback available' }}</span>

                <div class="deals-button clearfix">
                  <a class="button primary right" (click)="$event.stopPropagation(); goToStore(r)" >Go to store</a>
                </div>

                <span class="listing-hover">
                  <span class="hover-content">
                    <span class="store-name">{{ r.title }}</span>
                    <span class="store-offer">{{ r.cashback ? 'Upto ' + r.cashback + ' cashback' : 'Cashback available' }}</span>
                  </span>
                </span>

              </li>
            </ul>

            <div *ngIf="retailers().length === 0" class="text-center content-box">
              <p class="no-item"><span>We did not find any stores.<br>Please try a different search or browse other categories.</span></p>
            </div>
          </div>
        </ng-template>

      </div>
    </div>
  `,
  styles: [`
    * { box-sizing: border-box; }

    .page-wrap { font-family: 'Open Sans', sans-serif; }

    .content-wrap { padding: 0 20px 40px; }

    .loading-msg {
      padding: 40px;
      text-align: center;
      color: #64748b;
      font-size: 15px;
    }

    /* Store list: make li clickable */
    .deals { cursor: pointer; }

    /* Fallback initials */
    .store-initial, .retailer-initial {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      font-size: 32px;
      font-weight: 700;
      color: #0292CA;
    }

    /* Detail view */
    .content-box {
      background: #fff;
      padding: 20px;
      margin-bottom: 16px;
      border: 1px solid #eaeaea;
    }

    .no-desc {
      color: #888;
      font-style: italic;
      font-size: 13px;
    }

    .back-link {
      display: inline-block;
      color: #0292CA;
      font-size: 13px;
      cursor: pointer;
      margin-top: 8px;
    }

    .back-link:hover { text-decoration: underline; }

    /* Review section */
    #add-review { cursor: pointer; }
    .review-error { color: #c0392b; font-size: 13px; margin: 8px 0; }
    .review-success { color: #27ae60; font-size: 13px; margin: 8px 0; }
    .already-reviewed { font-size: 13px; color: #64748b; font-style: italic; }
  `]
})
export class StoresComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private storeNav = inject(StoreNavigationService);

  retailers = signal<Retailer[]>([]);
  selectedRetailer = signal<Retailer | null>(null);
  loading = signal(true);

  // Favourite signal
  isFavorite = signal(false);

  // Review signals
  reviews = signal<Review[]>([]);
  loadingReviews = signal(false);
  showReviewForm = signal(false);
  submitting = signal(false);
  reviewError = signal('');
  reviewSuccess = signal('');

  // True if the logged-in user already has a review for this retailer
  alreadyReviewed = computed(() => {
    const username = this.auth.currentUser()?.username;
    if (!username) return false;
    return this.reviews().some(r => r.userName === username);
  });

  // Form fields
  reviewRating = '';
  reviewTitle = '';
  reviewText = '';

  ngOnInit() {
    this.api.getAllStores().subscribe({
      next: res => {
        this.retailers.set(res.data || []);
        this.loading.set(false);
        this.route.queryParams.subscribe(params => {
          const id = params['id'];
          if (id) {
            const found = this.retailers().find(r => r.retailerId === +id);
            if (found) {
              this.selectedRetailer.set(found);
            } else {
              this.api.getRetailer(+id).subscribe({
                next: r => this.selectedRetailer.set(r.data),
                error: () => this.selectedRetailer.set(null)
              });
            }
            this.loadReviews(+id);
            this.resetForm();
            this.checkFavorite(+id);
          } else {
            this.selectedRetailer.set(null);
            this.reviews.set([]);
            this.isFavorite.set(false);
          }
        });
      },
      error: err => { console.error('Failed to load stores', err); this.loading.set(false); }
    });
  }

  checkFavorite(retailerId: number) {
    if (!this.auth.isLoggedIn()) return;
    this.api.getMyFavorites().subscribe({
      next: res => {
        const favs = res.data || [];
        this.isFavorite.set(favs.some(f => f.retailerId === retailerId));
      },
      error: () => {}
    });
  }

  addToFavorites() {
    if (!this.auth.isLoggedIn()) { this.router.navigate(['/auth/login']); return; }
    const retailer = this.selectedRetailer();
    if (!retailer) return;
    this.api.addFavorite(retailer.retailerId).subscribe({
      next: () => {
        this.isFavorite.set(true);
        this.router.navigate(['/favourites'], { queryParams: { added: retailer.retailerId } });
      },
      error: (err) => {
        // Already a favourite — navigate anyway
        if (err.status === 409) {
          this.router.navigate(['/favourites']);
        }
      }
    });
  }

  loadReviews(retailerId: number) {
    this.loadingReviews.set(true);
    this.api.getRetailerReviews(retailerId).subscribe({
      next: res => { this.reviews.set(res.data || []); this.loadingReviews.set(false); },
      error: () => this.loadingReviews.set(false)
    });
  }

  openReviewForm() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.showReviewForm.set(true);
  }

  resetForm() {
    this.reviewRating = '';
    this.reviewTitle = '';
    this.reviewText = '';
    this.reviewError.set('');
    this.reviewSuccess.set('');
    this.showReviewForm.set(false);
    this.submitting.set(false);
  }

  submitReview() {
    if (!this.reviewRating) { this.reviewError.set('Please select a rating.'); return; }
    const retailer = this.selectedRetailer();
    if (!retailer) return;

    this.submitting.set(true);
    this.reviewError.set('');
    this.reviewSuccess.set('');

    this.api.submitReview(retailer.retailerId, {
      rating: +this.reviewRating,
      reviewTitle: this.reviewTitle,
      review: this.reviewText
    }).subscribe({
      next: () => {
        this.reviewSuccess.set('Thank you! Your review has been submitted and is pending approval.');
        this.submitting.set(false);
        this.reviewRating = '';
        this.reviewTitle = '';
        this.reviewText = '';
      },
      error: (err: HttpErrorResponse) => {
        const msg = err.error?.message || 'Failed to submit review. Please try again.';
        this.reviewError.set(msg);
        this.submitting.set(false);
      }
    });
  }

  ratingImage(rating: number): string {
    const r = Math.min(5, Math.max(0, rating || 0));
    return `assets/images/hifi/rating-${r}.png`;
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  }

  viewStore(r: Retailer) {
    this.router.navigate(['/stores'], { queryParams: { id: r.retailerId } });
  }

  goToStore(r: Retailer) {
    this.storeNav.goToStore(r.retailerId, r.url);
  }

  goToStoreDetail(r: Retailer) {
    this.storeNav.goToStore(r.retailerId, r.url);
  }

  goBack() {
    this.router.navigate(['/stores']);
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
