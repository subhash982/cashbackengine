import { Component, signal } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';

const STEPS = [
  { step: 1, cls: 'join-us',       title: 'Sign Up',         desc: 'Create your free account and log in to HiFi Cashback to start earning on every purchase.' },
  { step: 2, cls: 'do-shopping',   title: 'Shop',            desc: 'Click through to your favourite stores from our 500+ partner retailers and shop as usual.' },
  { step: 3, cls: 'earn-cashback', title: 'Earn',            desc: 'Get cashback automatically credited. We receive commission from the retailer and share it with you.' },
  { step: 4, cls: 'bank-transfer', title: 'Transfer to Bank',desc: 'When you have Rs. 250 or more as Confirmed Cashback, request payment and we transfer it to your bank for free.' }
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgFor, NgClass],
  template: `
    <!-- ── How It Works ── -->
    <div class="right-section">
      <div class="h2" style="background:#F5A623; margin-bottom:0;">How it works</div>
      <div class="right-how-works" style="background:#fff; border:1px solid #ddd; border-top:none;">
        <ul class="how-works">
          <li *ngFor="let s of steps" [style.display]="s.step === active() ? 'block' : 'none'">
            <span class="character" [ngClass]="s.cls"></span>
            <h3>{{ s.title }}</h3>
            <p>{{ s.desc }}</p>
          </li>
        </ul>
        <!-- Step dots -->
        <div class="step-nav">
          <button
            *ngFor="let s of steps"
            class="step-dot"
            [class.active]="s.step === active()"
            (click)="active.set(s.step)">
            {{ s.step }}
          </button>
        </div>
      </div>
    </div>

    <!-- ── Offer Ending Soon ── -->
    <div class="right-section">
      <div class="h2" style="background:#F5A623; margin-bottom:0;">Offer Ending Soon</div>
      <div class="offer-ending-list" style="background:#fff; border:1px solid #ddd; border-top:none;">
        <div class="offer-item" *ngFor="let o of offeringSoon">
          <div class="offer-initial">{{ o.initial }}</div>
          <div class="offer-info">
            <p class="offer-name">{{ o.name }}</p>
            <span class="offer-cashback">Upto {{ o.cashback }} cashback</span>
            <span class="offer-expires">Expires: {{ o.expires }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Step dots nav */
    .step-nav {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 4px;
      padding: 8px 0 12px;
    }

    .step-dot {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      border: 2px solid #ddd;
      background: #fff;
      color: #999;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      transition: all .2s;
      line-height: 1;
    }

    .step-dot.active {
      background: #F5A623;
      border-color: #F5A623;
      color: #fff;
    }

    /* Override right-how-works height to be auto */
    .right-how-works .how-works { height: auto !important; }
    .right-how-works li { height: auto !important; }

    /* Offer ending soon */
    .offer-ending-list { padding: 8px 12px; }

    .offer-item {
      display: flex;
      gap: 10px;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
      align-items: center;
    }
    .offer-item:last-child { border-bottom: none; }

    .offer-initial {
      width: 38px;
      height: 38px;
      border-radius: 4px;
      background: #0292CA;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 700;
      flex-shrink: 0;
    }

    .offer-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .offer-name { margin: 0; font-size: 13px; font-weight: 600; color: #333; }
    .offer-cashback { font-size: 11px; color: #F5A623; font-weight: 600; }
    .offer-expires { font-size: 11px; color: #999; }
  `]
})
export class SidebarComponent {
  steps = STEPS;
  active = signal(1);

  offeringSoon = [
    { initial: 'F', name: 'Flipkart',  cashback: '14%', expires: 'Dec 31, 2024' },
    { initial: 'A', name: 'Amazon',    cashback: '10%', expires: 'Dec 25, 2024' },
    { initial: 'S', name: 'Snapdeal',  cashback: '8%',  expires: 'Dec 20, 2024' }
  ];
}
