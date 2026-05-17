import { Component, inject, OnInit, signal, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { Category } from '../../core/models/transaction.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule, NgFor, NgIf, MatIconModule, MatMenuModule],
  template: `
    <!-- Top header bar -->
    <div class="header-top">
      <div class="header-inner">

        <!-- Logo -->
        <a routerLink="/" class="logo-wrap">
          <img src="assets/images/hifi/logo.jpg" alt="HiFi Cashback" class="logo-img" />
        </a>

        <!-- Search bar -->
        <div class="search-wrap">
          <input
            type="text"
            placeholder="Search for stores..."
            [(ngModel)]="searchQuery"
            (keyup.enter)="onSearch()"
          />
          <button class="search-btn" (click)="onSearch()">
            <mat-icon>search</mat-icon>
          </button>
        </div>

        <!-- User / Auth area -->
        @if (auth.isLoggedIn()) {
          <div class="user-trigger" [matMenuTriggerFor]="userMenu">
            <mat-icon class="user-icon">account_circle</mat-icon>
            <span class="user-greeting">Hi, {{ firstName }}</span>
            <mat-icon class="dropdown-arrow">arrow_drop_down</mat-icon>
          </div>
          <mat-menu #userMenu="matMenu">
            <span mat-menu-item disabled>{{ auth.currentUser()?.email }}</span>
            <a mat-menu-item routerLink="/dashboard">
              <mat-icon>dashboard</mat-icon> Dashboard
            </a>
            <a mat-menu-item routerLink="/transactions">
              <mat-icon>receipt_long</mat-icon> Transactions
            </a>
            <a mat-menu-item routerLink="/wallet">
              <mat-icon>account_balance_wallet</mat-icon> Wallet
            </a>
            <a mat-menu-item routerLink="/click-history">
              <mat-icon>history</mat-icon> Store Visit History
            </a>
            <button mat-menu-item (click)="auth.logout()">
              <mat-icon>logout</mat-icon> Logout
            </button>
          </mat-menu>
        } @else {
          <div class="auth-links">
            <a routerLink="/auth/login" class="auth-link">Login</a>
            <a routerLink="/auth/register" class="auth-link signup">Sign Up</a>
          </div>
        }

      </div>
    </div>

    <!-- Navigation bar -->
    <nav class="header-nav">
      <div class="nav-inner">
        <a routerLink="/home" routerLinkActive="nav-active">Home</a>

        <!-- Shop by Category custom dropdown -->
        <div class="nav-cat-trigger" (click)="toggleCatPanel($event)">
          Shop by category <mat-icon class="nav-arrow">arrow_drop_down</mat-icon>
        </div>
        <div class="shop-by-category" *ngIf="catPanelOpen()">
          <ul class="dropdown-links">
            <li *ngFor="let c of categories()">
              <a [class]="toCssClass(c.name)" (click)="goToCategory(c)">{{ c.name }}</a>
            </li>
          </ul>
        </div>

        <a routerLink="/stores" routerLinkActive="nav-active">Stores</a>
        <a routerLink="/coupons" routerLinkActive="nav-active">Coupons</a>
        <a routerLink="/all-offers" routerLinkActive="nav-active">All Offers</a>

        @if (auth.isLoggedIn()) {
          <a routerLink="/favourites" routerLinkActive="nav-active">My Favourites</a>
        }

        <a routerLink="/how-it-works" routerLinkActive="nav-active">How it works</a>
        <a routerLink="/supports" routerLinkActive="nav-active">Support</a>

        @if (auth.isLoggedIn() && auth.isAdmin()) {
          <a routerLink="/admin" routerLinkActive="nav-active">Admin</a>
        }
      </div>
    </nav>
  `,
  styles: [`
    :host {
      display: block;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 8px rgba(0,0,0,.18);
    }

    /* ── Top bar ── */
    .header-top {
      background: #fff;
      padding: 14px 0;
      border-bottom: 1px solid #e8e8e8;
    }

    .header-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      align-items: center;
      gap: 24px;
    }

    /* Logo */
    .logo-wrap {
      display: flex;
      align-items: center;
      text-decoration: none;
      flex-shrink: 0;
    }

    .logo-img {
      height: 64px;
      width: auto;
      object-fit: contain;
    }

    /* Search */
    .search-wrap {
      flex: 1;
      display: flex;
      border: 2.5px solid #F5A623;
      border-radius: 4px;
      overflow: hidden;
      max-width: 560px;
    }

    .search-wrap input {
      flex: 1;
      border: none;
      outline: none;
      padding: 10px 16px;
      font-family: 'Open Sans', sans-serif;
      font-size: 13px;
      color: #555;
      background: #fff;
    }

    .search-btn {
      background: #F5A623;
      border: none;
      padding: 0 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }

    .search-btn:hover {
      background: #e09515;
    }

    .search-btn mat-icon {
      color: #fff;
    }

    /* User trigger */
    .user-trigger {
      display: flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      flex-shrink: 0;
      padding: 6px 10px;
      border-radius: 6px;
      transition: background 0.2s;
    }

    .user-trigger:hover {
      background: #f5f5f5;
    }

    .user-icon {
      font-size: 34px;
      width: 34px;
      height: 34px;
      color: #1976d2;
    }

    .user-greeting {
      font-family: 'Open Sans', sans-serif;
      font-size: 14px;
      font-weight: 600;
      color: #1976d2;
      white-space: nowrap;
    }

    .dropdown-arrow {
      color: #1976d2;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    /* Auth links */
    .auth-links {
      display: flex;
      gap: 12px;
      flex-shrink: 0;
    }

    .auth-link {
      color: #1976d2;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      padding: 8px 14px;
      border-radius: 4px;
      transition: background 0.2s;
    }

    .auth-link:hover {
      background: #e3f2fd;
    }

    .auth-link.signup {
      background: #F5A623;
      color: #fff;
    }

    .auth-link.signup:hover {
      background: #e09515;
    }

    /* ── Nav bar ── */
    .header-nav {
      background: #17A8D4;
      position: relative;
    }

    .nav-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      align-items: center;
      gap: 0;
    }

    .header-nav a {
      font-family: 'Josefin Sans', sans-serif;
      color: #fff;
      text-decoration: none;
      padding: 12px 22px;
      font-size: 18px;
      font-weight: 400;
      letter-spacing: 0.2px;
      white-space: nowrap;
      transition: background 0.2s;
      display: block;
    }

    .header-nav a:hover {
      background: rgba(255,255,255,.15);
    }

    .header-nav a.nav-active {
      background: rgba(255,255,255,.22);
      border-bottom: 3px solid #F5A623;
    }

    .nav-cat-trigger {
      font-family: 'Josefin Sans', sans-serif;
      color: #fff;
      font-size: 18px;
      font-weight: 400;
      letter-spacing: 0.2px;
      padding: 12px 22px;
      display: flex;
      align-items: center;
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.2s;
    }

    .nav-cat-trigger:hover {
      background: rgba(255,255,255,.15);
    }

    .nav-arrow {
      font-size: 18px;
      width: 18px;
      height: 18px;
      margin-left: 2px;
    }

    /* ── Category dropdown panel (layout only — icon sprites in styles.scss) ── */
    .shop-by-category {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      z-index: 200;
      background: rgba(104, 104, 104, 0.98);
    }
  `]
})
export class NavbarComponent implements OnInit {
  auth = inject(AuthService);
  private api = inject(ApiService);
  private router = inject(Router);

  categories = signal<Category[]>([]);
  catPanelOpen = signal(false);
  searchQuery = '';

  ngOnInit() {
    this.api.getCategories().subscribe({
      next: res => {
        const cats = (res.data || [])
          .filter(c => c.status === 'active')
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.name.localeCompare(b.name));
        this.categories.set(cats);
      },
      error: () => {}
    });
  }

  toggleCatPanel(event: Event) {
    event.stopPropagation();
    this.catPanelOpen.update(v => !v);
  }

  @HostListener('document:click')
  closeCatPanel() {
    this.catPanelOpen.set(false);
  }

  goToCategory(c: Category) {
    this.catPanelOpen.set(false);
    this.router.navigate(['/category'], { queryParams: { cat: c.categoryId } });
  }

  toCssClass(name: string): string {
    return name.replace(/[\s,&;]/g, '');
  }

  get firstName(): string {
    const user = this.auth.currentUser();
    return user?.fname || user?.username || user?.email?.split('@')[0] || 'User';
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/merchants'], { queryParams: { q: this.searchQuery.trim() } });
    }
  }
}
