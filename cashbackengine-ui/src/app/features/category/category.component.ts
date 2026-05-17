import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { StoreNavigationService } from '../../core/services/store-navigation.service';
import { Category, Retailer } from '../../core/models/transaction.model';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [NgIf, NgFor],
  template: `
    <!-- Retailers for selected category -->
    <ng-container *ngIf="selectedCategoryId()">
      <h3 class="h3">{{ selectedCategory()?.name }}</h3>

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
              <a class="button primary right" (click)="$event.stopPropagation(); goToStore(r)">Go to store</a>
            </div>

            <span class="listing-hover">
              <span class="hover-content">
                <span class="store-name">{{ r.title }}</span>
                <span class="store-offer">{{ r.cashback ? 'Upto ' + r.cashback + ' cashback' : 'Cashback available' }}</span>
              </span>
            </span>

          </li>
        </ul>

        <div *ngIf="!loading() && retailers().length === 0" class="text-center content-box">
          <p class="no-item"><span>We did not find any stores in this category.<br>Please see some other categories below.</span></p>
        </div>
      </div>
    </ng-container>
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

    .deals { cursor: pointer; }

  `]
})
export class CategoryComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(ApiService);
  private storeNav = inject(StoreNavigationService);

  categories = signal<Category[]>([]);
  retailers = signal<Retailer[]>([]);
  loading = signal(false);
  selectedCategoryId = signal<number | null>(null);

  selectedCategory = computed(() =>
    this.categories().find(c => c.categoryId === this.selectedCategoryId()) ?? null
  );

  ngOnInit() {
    this.api.getCategories().subscribe({
      next: res => {
        const cats = (res.data || []).filter(c => c.status === 'active');
        this.categories.set(cats);
      },
      error: () => {}
    });

    this.route.queryParams.subscribe(params => {
      const catId = params['cat'] ? +params['cat'] : null;
      this.selectedCategoryId.set(catId);
      if (catId) {
        this.loadRetailers(catId);
      }
    });
  }

  loadRetailers(categoryId: number) {
    this.loading.set(true);
    this.retailers.set([]);
    this.api.getCategoryRetailers(categoryId).subscribe({
      next: res => { this.retailers.set(res.data || []); this.loading.set(false); },
      error: err => { console.error('Failed to load retailers', err); this.loading.set(false); }
    });
  }

  viewStore(r: Retailer) {
    this.router.navigate(['/stores'], { queryParams: { id: r.retailerId } });
  }

  goToStore(r: Retailer) {
    this.storeNav.goToStore(r.retailerId, r.url);
  }

  toCssClass(name: string): string {
    return name.replace(/[\s,&;]/g, '');
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
