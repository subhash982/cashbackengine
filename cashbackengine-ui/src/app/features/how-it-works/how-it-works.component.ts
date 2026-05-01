import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <h3 class="h3">How It Works</h3>
    <div class="content-box">
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
    </div>
  `,
  styles: [`
    .steps { display:flex; gap:24px; flex-wrap:wrap; }
    .step { display:flex; flex-direction:column; align-items:center; gap:8px; background:#f9f9f9; border-radius:8px; padding:24px 32px; min-width:160px; text-align:center; }
    .step mat-icon { font-size:36px; width:36px; height:36px; color:#0292CA; }
    .step strong { font-size:15px; color:#222; }
    .step span { font-size:13px; color:#777; }
  `]
})
export class HowItWorksComponent {}
