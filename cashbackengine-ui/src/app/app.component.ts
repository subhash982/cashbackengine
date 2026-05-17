import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { StoreNavigationService } from './core/services/store-navigation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, RouterLink, NgIf],
  template: `
    <div class="page-bg">
      <div class="app-wrap">

        <app-navbar />

        <main class="main-content">
          <router-outlet />
        </main>

        <app-footer />

      </div>
    </div>

    <!-- Global "Navigating to retailer" overlay -->
    <div class="nav-overlay" *ngIf="storeNav.navigating()">
      <div class="nav-overlay-box">
        <div class="nav-spinner"></div>
        <p>Navigating to retailer, please wait…</p>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .page-bg {
      background: #f2f2f2;
      min-height: 100vh;
    }

    .app-wrap {
      max-width: 1200px;
      margin: 0 auto;
      background: #fff;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      box-shadow: 0 0 20px rgba(0,0,0,.08);
    }

    .main-content {
      flex: 1;
      background: #f2f2f2;
      padding: 0;
    }

    /* ── Navigating overlay ── */
    .nav-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.55);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .nav-overlay-box {
      background: #fff;
      border-radius: 8px;
      padding: 32px 40px;
      text-align: center;
      box-shadow: 0 8px 32px rgba(0,0,0,.25);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      min-width: 260px;
    }

    .nav-overlay-box p {
      font-family: 'Open Sans', sans-serif;
      font-size: 15px;
      color: #333;
      margin: 0;
    }

    .nav-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e0e0e0;
      border-top-color: #0292CA;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class AppComponent {
  storeNav = inject(StoreNavigationService);
  title = 'CashbackEngine';
}
