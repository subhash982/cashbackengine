import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="page-wrap">
      <mat-icon class="page-icon">help_outline</mat-icon>
      <h1>How It Works</h1>
      <p>Learn how to earn and redeem cashback in three simple steps.</p>
      <div class="steps">
        <div class="step">
          <mat-icon>login</mat-icon>
          <strong>1. Sign Up</strong>
          <span>Create your free account</span>
        </div>
        <div class="step">
          <mat-icon>storefront</mat-icon>
          <strong>2. Shop</strong>
          <span>Click through to your favourite stores</span>
        </div>
        <div class="step">
          <mat-icon>payments</mat-icon>
          <strong>3. Earn</strong>
          <span>Get cashback automatically credited</span>
        </div>
      </div>
      <span class="badge">More Details Coming Soon</span>
    </div>
  `,
  styles: [`
    .page-wrap { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:60vh; gap:24px; font-family:'Open Sans',sans-serif; color:#444; padding:40px 24px; }
    .page-icon { font-size:64px; width:64px; height:64px; color:#17A8D4; }
    h1 { margin:0; font-size:32px; font-weight:700; color:#222; }
    p { margin:0; font-size:16px; color:#666; }
    .steps { display:flex; gap:32px; flex-wrap:wrap; justify-content:center; }
    .step { display:flex; flex-direction:column; align-items:center; gap:8px; background:#f9f9f9; border-radius:12px; padding:24px 32px; min-width:160px; text-align:center; }
    .step mat-icon { font-size:36px; width:36px; height:36px; color:#17A8D4; }
    .step strong { font-size:15px; color:#222; }
    .step span { font-size:13px; color:#777; }
    .badge { background:#F5A623; color:#fff; padding:6px 18px; border-radius:20px; font-size:13px; font-weight:600; }
  `]
})
export class HowItWorksComponent {}
