import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [],
  template: `
    <div class="page-wrap">
      <div class="content-wrap">

        <h3 class="h3">How It Works</h3>

        <div class="content-box" style="min-height: 555px;">

          <h3 class="h3 secondary with-icon stores-icon margin-bottom30">
            Earn cashback on your online shopping with our site, here is how:
          </h3>

          <ul class="how-it-works-steps">
            <li class="one">
              <h3>Login &amp; Browse our Retailer &amp; Product Offers</h3>
              <p>Join/Login to our site. You can search for any product you want to buy, or search by retailer of your choice</p>
            </li>
            <li class="two">
              <h3>Click-through &amp; Shop</h3>
              <p>Click-out to the retailer's website e.g. Flipkart, Snapdeal, Amazon etc. Now shop like you normally do on the retailer's site</p>
            </li>
            <li class="three">
              <h3>Cashback gets added</h3>
              <p>After you shop, within 72 hours we add your Cashback to your account &amp; send you an email. This remains in 'Pending' status till the retailer pays us</p>
            </li>
            <li class="four">
              <h3>Cashback gets Confirmed</h3>
              <p>As soon as we get the commission from retailers we change the status of your Cashback to 'Confirmed'. This usually takes between
                4-12 weeks (Retailers wait for the 30 days cancellation period to pass and pay us in the following month. We pay you as soon as we get paid!)
              </p>
            </li>
            <li class="five">
              <h3>Transfer Cashback to Bank Account</h3>
              <p>When you have Rs. 250 or more as 'Confirmed' Cashback, you can request payment and we transfer the money to your bank account for free</p>
            </li>
          </ul>

          <div class="how-earn-cashback get-started">
            <div class="content-padding">
              <ol class="clearfix no-margin">
                <li class="find-store cursor-pointer" (click)="findStore()">Find the store</li>
                <li class="shop cursor-pointer" (click)="goToStore()">Go to Store</li>
                <li class="earn-cashback cursor-pointer" (click)="earnCashback()">Earn Cashback</li>
              </ol>
            </div>
          </div>

        </div>

      </div>
    </div>
  `,
  styles: [`
    .page-wrap { font-family: 'Open Sans', sans-serif; }
    .content-wrap { padding: 0 20px 40px; }
    .cursor-pointer { cursor: pointer; }
    /* Give the steps list a small top margin so step 1's number box isn't flush with content-box top */
    :host ::ng-deep .how-it-works-steps { margin-top: 10px !important; }
  `]
})
export class HowItWorksComponent {
  private router = inject(Router);
  private auth = inject(AuthService);

  findStore() {
    // Scroll to top so the navbar search is visible, then focus + highlight it
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      const input = document.querySelector<HTMLInputElement>('.search-wrap input');
      if (input) {
        input.focus();
        input.select();
        // Flash a highlight on the search bar
        const wrap = input.closest<HTMLElement>('.search-wrap');
        if (wrap) {
          wrap.classList.add('search-highlight');
          setTimeout(() => wrap.classList.remove('search-highlight'), 2000);
        }
      }
    }, 400);
  }

  goToStore() {
    this.router.navigate(['/stores']);
  }

  earnCashback() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
    }
    // If already logged in, user is already on this page — do nothing
  }
}
