import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, RouterLink, MatIconModule],
  template: `
    <div class="page-bg">
      <div class="app-wrap">

        <app-navbar />

        <main class="main-content">
          <router-outlet />
        </main>

        <!-- ── Footer ── -->
        <footer class="footer">
          <div class="footer-top">
            <div class="footer-col">
              <img src="assets/images/hifi/logo.jpg" alt="HiFi Cashback" class="footer-logo" />
              <p class="footer-tagline">Let us quote you happy :)</p>
              <div class="footer-social">
                <a href="#" class="social-btn fb"><mat-icon>facebook</mat-icon></a>
                <a href="#" class="social-btn tw"><mat-icon>share</mat-icon></a>
                <a href="#" class="social-btn gp"><mat-icon>language</mat-icon></a>
              </div>
            </div>

            <div class="footer-col">
              <h4>Quick Links</h4>
              <ul>
                <li><a routerLink="/home">Home</a></li>
                <li><a routerLink="/stores">Stores</a></li>
                <li><a routerLink="/coupons">Coupons</a></li>
                <li><a routerLink="/all-offers">All Offers</a></li>
              </ul>
            </div>

            <div class="footer-col">
              <h4>Account</h4>
              <ul>
                <li><a routerLink="/auth/login">Log In</a></li>
                <li><a routerLink="/auth/register">Sign Up</a></li>
                <li><a routerLink="/dashboard">My Dashboard</a></li>
                <li><a routerLink="/favourites">My Favourites</a></li>
              </ul>
            </div>

            <div class="footer-col">
              <h4>Help</h4>
              <ul>
                <li><a routerLink="/how-it-works">How It Works</a></li>
                <li><a routerLink="/supports">Contact Us</a></li>
                <li><a routerLink="/how-it-works">Terms &amp; Conditions</a></li>
                <li><a routerLink="/how-it-works">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div class="footer-bottom">
            <span>Copyright &copy; 2024 HiFi Cashback. All rights reserved.</span>
            <div class="footer-links">
              <a routerLink="/how-it-works">Terms &amp; Conditions</a>
              <span class="sep">·</span>
              <a routerLink="/how-it-works">Privacy Policy</a>
            </div>
          </div>
        </footer>

      </div><!-- /app-wrap -->
    </div><!-- /page-bg -->
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

    /* ── Footer ── */
    .footer {
      background: #1e293b;
      color: #cbd5e1;
      font-family: 'Open Sans', sans-serif;
    }

    .footer-top {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr 1fr;
      gap: 32px;
      padding: 36px 32px;
    }

    .footer-col h4 {
      color: #fff;
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 0 0 14px;
      padding-bottom: 8px;
      border-bottom: 2px solid #F5A623;
      display: inline-block;
    }

    .footer-col ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .footer-col ul li a {
      color: #94a3b8;
      text-decoration: none;
      font-size: 13px;
      transition: color .2s;
    }

    .footer-col ul li a:hover { color: #F5A623; }

    .footer-logo {
      height: 52px;
      width: auto;
      object-fit: contain;
      margin-bottom: 8px;
      display: block;
    }

    .footer-tagline {
      font-size: 12px;
      color: #64748b;
      font-style: italic;
      margin: 0 0 16px;
    }

    .footer-social {
      display: flex;
      gap: 8px;
    }

    .social-btn {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      transition: opacity .2s;
    }

    .social-btn:hover { opacity: .8; }
    .social-btn mat-icon { font-size: 18px; width: 18px; height: 18px; color: #fff; }
    .fb { background: #1877f2; }
    .tw { background: #1da1f2; }
    .gp { background: #ea4335; }

    .footer-bottom {
      background: #0f172a;
      padding: 12px 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      color: #64748b;
      flex-wrap: wrap;
      gap: 8px;
    }

    .footer-links {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .footer-links a {
      color: #64748b;
      text-decoration: none;
      font-size: 12px;
    }

    .footer-links a:hover { color: #F5A623; }
    .sep { color: #64748b; }
  `]
})
export class AppComponent {
  title = 'CashbackEngine';
}
