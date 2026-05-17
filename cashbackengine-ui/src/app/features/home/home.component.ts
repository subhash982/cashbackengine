import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { StoreNavigationService } from '../../core/services/store-navigation.service';
import { Retailer } from '../../core/models/transaction.model';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const pass = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return pass === confirm ? null : { mismatch: true };
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ReactiveFormsModule, RouterLink, NgIf, NgFor,
    MatInputModule, MatFormFieldModule, MatCheckboxModule,
    MatButtonModule, MatIconModule
  ],
  template: `
    <div class="page-wrap">
      <div class="content-wrap">

      <!-- ── Top: How It Works + Register ── -->
      <div class="top-section">

        <!-- Left: banner image + retailers carousel -->
        <div class="left-col">
          <div class="hiw-panel">
            <img src="assets/images/offers/banner/home-how-it-works-banner.jpg"
                 alt="How it works" class="hiw-banner-img" />
          </div>

          <!-- Retailers Carousel -->
          <div class="slider-wrapper retailers" *ngIf="retailers().length > 0">

            <!-- Left arrow -->
            <span class="jssora02l slider-arrow-left" (click)="prev()"></span>

            <!-- Retailer boxes -->
            <div class="retailers-boxes">
              <a *ngFor="let r of visibleRetailers()" class="retailer-box"
                 (click)="storeNav.goToStore(r.retailerId, r.url)" style="cursor:pointer;" [title]="r.title">
                <span class="retailer-logo">
                  <img *ngIf="getRetailerImage(r.image)"
                       [src]="getRetailerImage(r.image)"
                       [alt]="r.title"
                       (error)="onImgError($event)" />
                  <span *ngIf="!getRetailerImage(r.image)" class="retailer-initial-char">{{ r.title[0] }}</span>
                </span>
                <p class="clearfix">
                  <img src="assets/images/hifi/rating-5.png" alt="5 star rating" class="retailer-rating">
                  <span class="retailers-visit" title="User visited">{{ r.visits }} visits</span>
                </p>
              </a>
            </div>

            <!-- Right arrow -->
            <span class="jssora02r slider-arrow-right" (click)="next()"></span>

          </div>
        </div>

        <!-- Right: Register form (or welcome panel) -->
        <div class="form-panel">
          <ng-container *ngIf="!isLoggedIn(); else welcomePanel">
            <div class="form-header">Hifi Cashback Registration</div>
            <div class="form-body">
              <form [formGroup]="form" (ngSubmit)="onSubmit()">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Full Name</mat-label>
                  <input matInput formControlName="fname" placeholder="Full Name" />
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Email</mat-label>
                  <input matInput formControlName="email" placeholder="Email" type="email" />
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Password</mat-label>
                  <input matInput formControlName="password" type="password" placeholder="Password" />
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Confirm Password</mat-label>
                  <input matInput formControlName="confirmPassword" type="password" placeholder="Confirm Password" />
                  <mat-error *ngIf="form.hasError('mismatch')">Passwords do not match</mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Phone</mat-label>
                  <input matInput formControlName="phone" placeholder="Phone" />
                </mat-form-field>

                <div class="checks">
                  <mat-checkbox formControlName="newsletter" color="primary">
                    I'd like to receive newsletter
                  </mat-checkbox>
                  <mat-checkbox formControlName="terms" color="primary">
                    I agree with the <a routerLink="/how-it-works" class="terms-link">Terms and Conditions</a>
                  </mat-checkbox>
                </div>

                <p class="err-msg" *ngIf="error()">{{ error() }}</p>

                <div class="form-actions">
                  <button mat-raised-button class="signup-btn" type="submit" [disabled]="loading()">
                    {{ loading() ? 'Signing Up...' : 'Sign Up' }}
                  </button>
                  <span class="login-link">Already user? <a routerLink="/auth/login">Log in here</a></span>
                </div>
              </form>
            </div>
          </ng-container>

          <ng-template #welcomePanel>
            <section class="home-top-right white-bg">
              <div class="how-earn-cashback">
                <h2 class="h2">How to Earn Cashback</h2>
                <div class="content-padding">
                  <ol class="clearfix">
                    <li class="join-free">Join Free</li>
                    <li class="shop">Shop</li>
                    <li class="earn-cashback">Earn Cashback</li>
                    <li class="bank-transfer">Bank Transfer</li>
                  </ol>
                  <p class="text-center">
                    <a class="button margin-right10" href="#">Refer a Friend</a>
                    <a class="button secondary" routerLink="/transactions">Balance &amp; History</a>
                  </p>
                </div>
              </div>
            </section>
          </ng-template>
        </div>
      </div>

      <!-- ── Orange Banner ── -->
      <div class="orange-banner">
        <div class="orange-banner-inner">
          Shop at your favourite Stores &amp; Earn Cashback
        </div>
      </div>

      <!-- ── No retailers fallback ── -->
      <div *ngIf="allRetailers().length === 0 && !loading()" class="text-center content-box">
        <p class="no-item"><span>We did not find any stores at the moment.<br>Please check back later.</span></p>
      </div>

      <!-- ── Retailers Listing ── -->
      <div class="retailers-listing-wrap" *ngIf="allRetailers().length > 0">
        <ul class="deals-listing clearfix">
          <li class="deals" *ngFor="let r of allRetailers()" (click)="viewStore(r)">

            <p class="store-img">
              <img *ngIf="getRetailerImage(r.image)"
                   [src]="getRetailerImage(r.image)"
                   [alt]="r.title"
                   [title]="r.title"
                   (error)="onImgError($event)" />
              <span *ngIf="!getRetailerImage(r.image)" class="store-initial">{{ r.title[0] }}</span>
            </p>

            <span class="more-offers">{{ r.cashback ? 'Upto ' + r.cashback + ' cashback' : 'Cashback available' }}</span>

            <div class="deals-button clearfix">
              <a class="button secondary" (click)="$event.stopPropagation(); goToStore(r)" target="_blank">Go to store</a>
            </div>

            <span class="listing-hover secondary">
              <span class="hover-content">
                <span class="store-name">{{ r.title }}</span>
                <span class="store-offer">{{ r.cashback ? 'Upto ' + r.cashback + ' cashback' : 'Cashback available' }}</span>
              </span>
            </span>

          </li>
        </ul>
      </div>

      </div><!-- /content-wrap -->
    </div>
  `,
  styles: [`
    * { box-sizing: border-box; }
    .page-wrap { font-family: 'Open Sans', sans-serif; }

    .content-wrap {
      padding: 0;
    }

    /* ── Top Section ── */
    .top-section {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 20px;
      padding: 20px 0 0;
      align-items: start;
    }

    .left-col {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    /* ── How It Works Panel ── */
    .hiw-panel {
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 4px 4px 0 0;
      overflow: hidden;
    }

    .hiw-banner-img {
      width: 100%;
      height: auto;
      display: block;
    }

    /* ── Form Panel ── */
    .form-panel {
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .form-header {
      background: #F5A623;
      color: #fff;
      font-size: 16px;
      font-weight: 700;
      padding: 12px 20px;
    }

    .form-body {
      padding: 16px 20px;
    }

    .full-width { width: 100%; }

    ::ng-deep .form-body .mat-mdc-form-field {
      margin-bottom: 4px;
    }

    .checks {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin: 8px 0 12px;
      font-size: 13px;
    }

    .terms-link { color: #17A8D4; text-decoration: none; }

    .err-msg { color: #e53935; font-size: 13px; margin: 4px 0; }

    .form-actions {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .signup-btn {
      background: #17A8D4 !important;
      color: #fff !important;
      font-weight: 700;
      min-width: 100px;
    }

    .login-link { font-size: 13px; color: #555; }
    .login-link a { color: #17A8D4; text-decoration: none; }

    /* How to earn cashback panel */
    .home-top-right {
      width: 100%;
      overflow: hidden;
    }

    /* ── Retailers Carousel ── */

    /* Override hifi.css — it sets visibility:hidden and fixed width:732px for jssor JS init */
    .slider-wrapper.retailers {
      visibility: visible !important;
      height: auto !important;
      width: 100% !important;
      background: #fff !important;
      border: 1px solid #ddd;
      border-top: none;
      overflow: visible !important;
      position: relative;
    }

    /* Boxes container — 35px padding each side leaves room for the 18px arrows at 15px offset */
    .retailers-boxes {
      padding: 10px 35px;
      text-align: center;
    }

    /* Expand retailer boxes to fill the full row (3 per row, 9px margin each side) */
    .retailer-box {
      width: calc(33.33% - 18px) !important;
    }

    /* Vertically centre the arrows */
    .slider-arrow-left,
    .slider-arrow-right {
      top: 50% !important;
      transform: translateY(-50%);
      cursor: pointer;
    }

    /* retailer-box hover — hifi.css provides the base styles */
    .retailer-box {
      text-decoration: none;
      color: inherit;
      transition: border-color .15s, box-shadow .15s;
    }

    .retailer-box:hover {
      border-color: #0292CA !important;
      box-shadow: 0 2px 8px rgba(2,146,202,.15);
      text-decoration: none;
    }

    /* Fallback initial when no image */
    .retailer-initial-char {
      font-size: 22px;
      font-weight: 700;
      color: #0292CA;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    /* ── Orange Banner ── */
    .orange-banner {
      background: #F5A623;
      color: #fff;
      font-size: 16px;
      font-weight: 600;
      margin-top: 20px;
    }

    .orange-banner-inner {
      padding: 14px 0;
    }

    /* Retailers listing section */
    .retailers-listing-wrap {
      background: #fff;
    }

    /* Store initial fallback */
    .store-initial {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      font-size: 28px;
      font-weight: 700;
      color: #0292CA;
    }

    @media (max-width: 900px) {
      .top-section { grid-template-columns: 1fr; }
    }
  `]
})
export class HomeComponent implements OnInit {
  private fb = inject(FormBuilder);
  auth = inject(AuthService);
  private api = inject(ApiService);
  private router = inject(Router);
  storeNav = inject(StoreNavigationService);

  isLoggedIn = this.auth.isLoggedIn;
  currentUser = this.auth.currentUser;
  userInitial = () => {
    const u = this.currentUser();
    return (u?.fname || u?.username || 'U')[0].toUpperCase();
  };

  retailers = signal<Retailer[]>([]);
  allRetailers = signal<Retailer[]>([]);
  carouselPage = signal(0);
  readonly pageSize = 6;

  visibleRetailers = computed(() => {
    const start = this.carouselPage() * this.pageSize;
    return this.retailers().slice(start, start + this.pageSize);
  });

  totalPages = computed(() => Math.ceil(this.retailers().length / this.pageSize));
  hasPrev = computed(() => this.carouselPage() > 0);
  hasNext = computed(() => (this.carouselPage() + 1) * this.pageSize < this.retailers().length);

  loading = signal(false);
  error = signal('');

  form = this.fb.group({
    fname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
    phone: [''],
    newsletter: [true],
    terms: [false, Validators.requiredTrue]
  }, { validators: passwordsMatch });

  ngOnInit() {
    this.api.getRetailers().subscribe({
      next: res => this.retailers.set(res.data || []),
      error: (err) => console.error('Failed to load retailers', err)
    });
    this.api.getAllStores().subscribe({
      next: res => this.allRetailers.set(res.data || []),
      error: (err) => console.error('Failed to load all retailers', err)
    });
  }

  prev() { this.carouselPage.update(p => p === 0 ? this.totalPages() - 1 : p - 1); }
  next() { this.carouselPage.update(p => p + 1 >= this.totalPages() ? 0 : p + 1); }

  getRetailerImage(image?: string): string {
    if (!image || image.trim() === '' || image === 'noimg.gif') return '';
    // Strip any leading path (e.g. /images/retailers/) — keep just the filename
    const filename = image.includes('/') ? image.split('/').pop()! : image;
    return `assets/images/retailers/${filename}`;
  }

  onImgError(event: Event) {
    (event.target as HTMLImageElement).style.display = 'none';
  }

  viewStore(r: Retailer) {
    this.router.navigate(['/stores'], { queryParams: { id: r.retailerId } });
  }

  goToStore(r: Retailer) {
    this.storeNav.goToStore(r.retailerId, r.url);
  }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.error.set('');
    const { fname, email, password, phone } = this.form.value;
    this.auth.register({
      username: email!,
      email: email!,
      password: password!,
      fname: fname || undefined,
      phone: phone || undefined
    }).subscribe({
      next: () => { this.loading.set(false); this.router.navigate(['/home']); },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Registration failed. Please try again.');
      }
    });
  }
}
