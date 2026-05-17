import { Component, signal, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  template: `
    <!-- ── How It Works ── -->
    <aside class="left-nav">
      <section class="right-how-works">
        <h3 class="h2">How it works</h3>
        <ul class="how-works">

          <li [style.display]="active() === 1 ? 'block' : 'none'" (click)="goTo(2)">
            <span class="character join-us"></span>
            <div class="progressbar">
              <span class="step" [class.active]="active() === 1">1</span>
              <span class="step" [class.active]="active() === 2">2</span>
              <span class="step" [class.active]="active() === 3">3</span>
              <span class="step" [class.active]="active() === 4">4</span>
            </div>
            <h3>Join us for free</h3>
            <p><strong>Join/Login to Hificashback.com.</strong></p>
            <p>You can search for any product you want to buy, or search by retailer of your choice.</p>
          </li>

          <li [style.display]="active() === 2 ? 'block' : 'none'" (click)="goTo(3)">
            <span class="character do-shopping"></span>
            <div class="progressbar">
              <span class="step" [class.active]="active() === 1">1</span>
              <span class="step" [class.active]="active() === 2">2</span>
              <span class="step" [class.active]="active() === 3">3</span>
              <span class="step" [class.active]="active() === 4">4</span>
            </div>
            <h3>Click-through &amp; Shop</h3>
            <p><strong>Click-out of Hificashback</strong> to the retailer's website e.g. Flipkart, Amazon etc.</p>
            <p>Now shop like you normally do on the retailer's site.</p>
          </li>

          <li [style.display]="active() === 3 ? 'block' : 'none'" (click)="goTo(4)">
            <span class="character earn-cashback"></span>
            <div class="progressbar">
              <span class="step" [class.active]="active() === 1">1</span>
              <span class="step" [class.active]="active() === 2">2</span>
              <span class="step" [class.active]="active() === 3">3</span>
              <span class="step" [class.active]="active() === 4">4</span>
            </div>
            <h3>Earn cashback</h3>
            <p>After you shop, within 72 hours we add your Cashback to your account with In Progress status.</p>
            <p>Between 4-12 weeks, we approve your cash once we get confirmation from retailer.</p>
          </li>

          <li [style.display]="active() === 4 ? 'block' : 'none'" (click)="goTo(1)">
            <span class="character bank-transfer"></span>
            <div class="progressbar">
              <span class="step" [class.active]="active() === 1">1</span>
              <span class="step" [class.active]="active() === 2">2</span>
              <span class="step" [class.active]="active() === 3">3</span>
              <span class="step" [class.active]="active() === 4">4</span>
            </div>
            <h3>Transfer to Bank</h3>
            <p>When you have Rs. 250 or more as 'Confirmed' Cashback,
              you can request payment and we transfer the money to your bank account for free.
            </p>
          </li>

        </ul>
      </section>

      <section class="right-top-offers">
        <h3 class="h2">Offer Ending Soon</h3>
        Coming Soon
      </section>
    </aside>
  `,
  styles: [`
    :host { display: block; }
    .left-nav { position: static !important; width: 100% !important; }
    .right-how-works .how-works { height: auto !important; }
    .right-how-works li { height: auto !important; cursor: pointer; }
    .progressbar { display: flex !important; justify-content: space-between !important; align-items: center !important; }
    .progressbar .step { float: none !important; margin: 0 !important; flex-shrink: 0; }
  `]
})
export class SidebarComponent implements OnInit, OnDestroy {
  active = signal(1);
  private timer: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.active.update(v => v >= 4 ? 1 : v + 1);
    }, 3000);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  // On manual click: jump to step and reset the 3s countdown
  goTo(step: number) {
    this.active.set(step);
    this.stopTimer();
    this.startTimer();
  }
}
