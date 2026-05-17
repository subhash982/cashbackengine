import { Component, OnInit, signal, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Category, Retailer } from '../../core/models/transaction.model';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  template: `
    <footer>

      <!-- Toggle arrow -->
      <a (click)="toggleFooter()"
         [class]="'footer-arrow' + (open() ? ' open' : '')"
         title="Click here to open footer"
         style="cursor:pointer;">
      </a>

      <!-- Footer content -->
      <div [class]="'clearfix footer-content' + (open() ? ' open' : '')">

        <!-- Newsletter -->
        <div class="newsletter">
          Hundreds of Discount Coupons, Offers and Cashback from HiFi Cashback.
          <input type="text" [(ngModel)]="email" placeholder="Enter your Email...">
          <button class="button primary" type="button" (click)="subscribe()" title="Subscribe">Subscribe</button>
        </div>

        <div class="clearfix">

          <!-- Helpful Links -->
          <div class="helpful">
            <h3 class="h3">Helpful Links</h3>
            <ul class="helpful-links">
              <li><a (click)="go('/home')" style="cursor:pointer;">Home</a></li>
              <li><a (click)="go('/how-it-works')" style="cursor:pointer;">How Online Cashback Works</a></li>
              <li><a (click)="go('/supports')" style="cursor:pointer;">Contact Us</a></li>
              <li><a (click)="go('/about')" style="cursor:pointer;">About Us</a></li>
              <li><a (click)="go('/faqs')" style="cursor:pointer;">FAQs</a></li>
              <li><a (click)="go('/terms')" style="cursor:pointer;">Terms &amp; Conditions</a></li>
              <li><a (click)="go('/privacy')" style="cursor:pointer;">Privacy Policy</a></li>
            </ul>
          </div>

          <!-- Popular Categories + Popular Stores -->
          <div class="popular-categories">

            <h3 class="h3">Popular Categories</h3>
            <ul class="category-list clearfix">
              <li *ngIf="loadingCats()">
                <span style="color:#888; font-size:12px;">Loading...</span>
              </li>
              <li *ngFor="let c of categories()">
                <a (click)="goToCategory(c)" style="cursor:pointer;">{{ c.name }}</a>
              </li>
            </ul>

            <h3 class="h3 margin-top30">Popular Stores</h3>
            <ul class="category-list clearfix">
              <li *ngIf="loadingStores()">
                <span style="color:#888; font-size:12px;">Loading...</span>
              </li>
              <li *ngFor="let r of stores()">
                <a (click)="goToStore(r)" style="cursor:pointer;">{{ r.title }}</a>
              </li>
            </ul>

          </div>

          <!-- Stay Connected -->
          <div class="stay-connected">
            <div class="social-icons">
              <h3 class="h3">Stay Connected on</h3>
              <p class="social-icons clearfix">
                <a href="https://www.facebook.com/" target="_blank" class="facebook" title="Facebook">Facebook</a>
                <a href="https://twitter.com/" target="_blank" class="twitter" title="Twitter">Twitter</a>
                <a href="https://www.instagram.com/" target="_blank" class="instagram" title="Instagram">Instagram</a>
              </p>
            </div>
            <div class="refer-friend">
              <h3 class="h3 margin-top30">Spread HiFi Cashback</h3>
              <a (click)="go('/auth/register')" style="cursor:pointer;">Refer a Friend</a>
            </div>
          </div>

        </div>

        <!-- Bottom bar -->
        <div class="terms-condition">
          Copyright &copy; {{ year }} HiFiCashback.com. All rights reserved.&nbsp;
          <a (click)="go('/terms')" style="cursor:pointer;">Terms &amp; Conditions</a> &middot;
          <a (click)="go('/privacy')" style="cursor:pointer;">Privacy Policy</a>
        </div>

      </div>
    </footer>
  `,
  styles: []
})
export class FooterComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);

  open = signal(true);
  email = '';
  year = new Date().getFullYear();

  categories = signal<Category[]>([]);
  stores = signal<Retailer[]>([]);
  loadingCats = signal(true);
  loadingStores = signal(true);

  ngOnInit() {
    // Top 15 active categories sorted by sortOrder
    this.api.getCategories().subscribe({
      next: res => {
        const cats = (res.data || [])
          .filter(c => c.status === 'active')
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.name.localeCompare(b.name))
          .slice(0, 15);
        this.categories.set(cats);
        this.loadingCats.set(false);
      },
      error: () => this.loadingCats.set(false)
    });

    // Top 15 stores by visits (endpoint returns top 30 ordered by visits desc)
    this.api.getRetailers().subscribe({
      next: res => {
        this.stores.set((res.data || []).slice(0, 15));
        this.loadingStores.set(false);
      },
      error: () => this.loadingStores.set(false)
    });
  }

  toggleFooter() {
    this.open.update(v => !v);
  }

  go(path: string) {
    this.router.navigate([path]);
  }

  goToCategory(c: Category) {
    this.router.navigate(['/category'], { queryParams: { cat: c.categoryId } });
  }

  goToStore(r: Retailer) {
    this.router.navigate(['/stores'], { queryParams: { id: r.retailerId } });
  }

  subscribe() {
    if (this.email.trim()) {
      // Placeholder — wire to backend when newsletter endpoint is ready
      alert('Thank you for subscribing!');
      this.email = '';
    }
  }
}
