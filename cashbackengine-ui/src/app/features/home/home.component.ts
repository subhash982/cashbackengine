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
          <div class="retailers-section" *ngIf="retailers().length > 0">
            <button class="arrow-btn" (click)="prev()" [disabled]="!hasPrev()">
              <mat-icon>chevron_left</mat-icon>
            </button>

            <div class="retailers-grid">
              <a *ngFor="let r of visibleRetailers()" class="retailer-card" [href]="r.url" target="_blank">
                <div class="retailer-logo">
                  <img *ngIf="r.image" [src]="r.image" [alt]="r.title" />
                  <span *ngIf="!r.image" class="retailer-initial">{{ r.title[0] }}</span>
                </div>
                <div class="retailer-info">
                  <p class="retailer-name">{{ r.title }}</p>
                  <div class="stars">
                    <mat-icon *ngFor="let s of [1,2,3,4]">star</mat-icon>
                    <mat-icon class="half-star">star_half</mat-icon>
                  </div>
                  <span class="visits"><mat-icon>visibility</mat-icon> {{ r.visits }} visits</span>
                </div>
              </a>
            </div>

            <button class="arrow-btn" (click)="next()" [disabled]="!hasNext()">
              <mat-icon>chevron_right</mat-icon>
            </button>
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
            <div class="form-header">Welcome Back!</div>
            <div class="form-body welcome-body">
              <div class="welcome-avatar">{{ userInitial() }}</div>
              <p class="welcome-name">Hi, {{ currentUser()?.fname || currentUser()?.username }}</p>
              <p class="welcome-sub">Ready to earn cashback?</p>
              <a mat-raised-button class="signup-btn" routerLink="/stores">Browse Stores</a>
              <a mat-stroked-button routerLink="/dashboard" class="dash-link">My Dashboard</a>
            </div>
          </ng-template>
        </div>
      </div>

      <!-- ── Orange Banner ── -->
      <div class="orange-banner">
        <div class="orange-banner-inner">
          Shop at your favourite Stores &amp; Earn Cashback
        </div>
      </div>

      <!-- ── Coming Soon Hero ── -->
      <div class="hero">
        <mat-icon class="hero-icon">account_balance_wallet</mat-icon>
        <h1>Welcome to <span class="brand">CashbackEngine</span></h1>
        <p>Earn cashback on every purchase from hundreds of top retailers.</p>
        <span class="coming-soon">🚀 Full experience coming soon</span>
        <div class="hero-actions">
          <a mat-raised-button class="btn-primary" routerLink="/stores">Browse Stores</a>
          <a mat-stroked-button routerLink="/how-it-works">How It Works</a>
        </div>
      </div>

      <!-- ── Feature Cards ── -->
      <div class="features">
        <div class="feature-card">
          <mat-icon>storefront</mat-icon>
          <strong>500+ Stores</strong>
          <span>Shop from top brands and earn cashback automatically.</span>
        </div>
        <div class="feature-card">
          <mat-icon>local_offer</mat-icon>
          <strong>Exclusive Coupons</strong>
          <span>Access members-only coupon codes updated daily.</span>
        </div>
        <div class="feature-card">
          <mat-icon>payments</mat-icon>
          <strong>Easy Payouts</strong>
          <span>Withdraw your cashback straight to your bank or PayPal.</span>
        </div>
      </div>

      </div><!-- /content-wrap -->
    </div>
  `,
  styles: [`
    * { box-sizing: border-box; }
    .page-wrap { font-family: 'Open Sans', sans-serif; }

    .content-wrap {
      padding: 0 20px;
    }

    /* ── Top Section ── */
    .top-section {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 20px;
      padding: 20px 0;
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
      overflow: hidden;
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

    /* Welcome panel */
    .welcome-body {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 32px 20px;
    }

    .welcome-avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: #17A8D4;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 700;
    }

    .welcome-name { margin: 0; font-size: 18px; font-weight: 600; color: #1e293b; }
    .welcome-sub { margin: 0; font-size: 13px; color: #64748b; }

    .dash-link {
      color: #17A8D4 !important;
      border-color: #17A8D4 !important;
      width: 100%;
    }

    /* ── Retailers Section ── */
    .retailers-section {
      background: #fff;
      border: 1px solid #ddd;
      border-top: none;
      border-radius: 0 0 4px 4px;
      padding: 12px 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .arrow-btn {
      background: none;
      border: 1px solid #ddd;
      border-radius: 4px;
      width: 36px;
      height: 36px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: #555;
    }

    .arrow-btn:disabled { opacity: .3; cursor: default; }

    .retailers-grid {
      flex: 1;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }

    .retailer-card {
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 10px 8px;
      text-align: center;
      text-decoration: none;
      color: inherit;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      transition: box-shadow .2s;
    }

    .retailer-card:hover { box-shadow: 0 2px 8px rgba(0,0,0,.12); }

    .retailer-logo {
      width: 80px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .retailer-logo img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

    .retailer-initial {
      font-size: 24px;
      font-weight: 700;
      color: #17A8D4;
    }

    .retailer-name {
      margin: 0;
      font-size: 11px;
      font-weight: 600;
      color: #333;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100px;
    }

    .stars mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
      color: #F5A623;
    }

    .half-star { color: #F5A623 !important; }

    .visits {
      font-size: 11px;
      color: #17A8D4;
      display: flex;
      align-items: center;
      gap: 2px;
    }

    .visits mat-icon {
      font-size: 12px;
      width: 12px;
      height: 12px;
    }

    /* ── Orange Banner ── */
    .orange-banner {
      background: #F5A623;
      color: #fff;
      font-size: 16px;
      font-weight: 600;
    }

    .orange-banner-inner {
      padding: 14px 0;
    }

    /* ── Coming Soon Hero ── */
    .hero {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 56px 24px 40px;
      background: linear-gradient(135deg, #17A8D4 0%, #0e7fa3 100%);
      color: #fff;
      gap: 14px;
    }

    .hero-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      background: rgba(255,255,255,.15);
      border-radius: 50%;
      padding: 16px;
      color: #fff;
    }

    .hero h1 { margin: 0; font-size: 34px; font-weight: 700; }
    .brand { color: #F5A623; }
    .hero p { margin: 0; font-size: 16px; opacity: .9; max-width: 460px; }

    .coming-soon {
      background: rgba(255,255,255,.2);
      padding: 6px 20px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
    }

    .hero-actions { display: flex; gap: 12px; margin-top: 8px; }

    .btn-primary { background: #F5A623 !important; color: #fff !important; }

    a[mat-stroked-button] {
      color: #fff !important;
      border-color: rgba(255,255,255,.6) !important;
    }

    /* ── Feature Cards ── */
    .features {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      padding: 40px 0;
    }

    .feature-card {
      background: #fff;
      border-radius: 8px;
      padding: 28px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,.07);
    }

    .feature-card mat-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      color: #17A8D4;
    }

    .feature-card strong { font-size: 16px; color: #1e293b; }
    .feature-card span { font-size: 13px; color: #64748b; line-height: 1.6; }

    @media (max-width: 900px) {
      .top-section { grid-template-columns: 1fr; }
      .features { grid-template-columns: 1fr; padding: 24px; }
    }
  `]
})
export class HomeComponent implements OnInit {
  private fb = inject(FormBuilder);
  auth = inject(AuthService);
  private api = inject(ApiService);
  private router = inject(Router);

  isLoggedIn = this.auth.isLoggedIn;
  currentUser = this.auth.currentUser;
  userInitial = () => {
    const u = this.currentUser();
    return (u?.fname || u?.username || 'U')[0].toUpperCase();
  };

  retailers = signal<Retailer[]>([]);
  carouselPage = signal(0);
  readonly pageSize = 6;

  visibleRetailers = computed(() => {
    const start = this.carouselPage() * this.pageSize;
    return this.retailers().slice(start, start + this.pageSize);
  });

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
      error: () => {}
    });
  }

  prev() { if (this.hasPrev()) this.carouselPage.update(p => p - 1); }
  next() { if (this.hasNext()) this.carouselPage.update(p => p + 1); }

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
