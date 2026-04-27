import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-all-offers',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="page-wrap">
      <mat-icon class="page-icon">sell</mat-icon>
      <h1>All Offers</h1>
      <p>Explore all available cashback offers across every category.</p>
      <span class="badge">Coming Soon</span>
    </div>
  `,
  styles: [`
    .page-wrap { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:60vh; gap:16px; font-family:'Open Sans',sans-serif; color:#444; }
    .page-icon { font-size:64px; width:64px; height:64px; color:#17A8D4; }
    h1 { margin:0; font-size:32px; font-weight:700; color:#222; }
    p { margin:0; font-size:16px; color:#666; }
    .badge { background:#F5A623; color:#fff; padding:6px 18px; border-radius:20px; font-size:13px; font-weight:600; }
  `]
})
export class AllOffersComponent {}
