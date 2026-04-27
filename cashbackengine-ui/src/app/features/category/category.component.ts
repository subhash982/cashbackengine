import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

const CATEGORY_ICONS: Record<string, string> = {
  'All Stores':    'storefront',
  'Fashion':       'checkroom',
  'Electronics':   'devices',
  'Travel':        'flight',
  'Food & Dining': 'restaurant',
};

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="page-wrap">
      <mat-icon class="page-icon">{{ icon }}</mat-icon>
      <h1>{{ categoryName }}</h1>
      <p>Explore top cashback offers in the <strong>{{ categoryName }}</strong> category.</p>
      <span class="badge">Coming Soon</span>
    </div>
  `,
  styles: [`
    .page-wrap { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:60vh; gap:16px; font-family:'Open Sans',sans-serif; color:#444; }
    .page-icon { font-size:64px; width:64px; height:64px; color:#17A8D4; }
    h1 { margin:0; font-size:32px; font-weight:700; color:#222; text-transform:capitalize; }
    p { margin:0; font-size:16px; color:#666; }
    .badge { background:#F5A623; color:#fff; padding:6px 18px; border-radius:20px; font-size:13px; font-weight:600; }
  `]
})
export class CategoryComponent implements OnInit {
  private route = inject(ActivatedRoute);

  categoryName = 'All Stores';
  icon = 'storefront';

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const name = params.get('name') ?? 'All Stores';
      this.categoryName = name;
      this.icon = CATEGORY_ICONS[name] ?? 'category';
    });
  }
}
