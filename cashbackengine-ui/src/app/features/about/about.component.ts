import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  template: `
    <div class="page-wrap">
      <div class="content-wrap">

        <h2 class="h3">About Us</h2>

        <div class="content-box">

          <p>
            <strong class="special-word">"Thoda Zyada"</strong> - the way most people wish for while making any purchase and this
            <strong class="special-word">"Thoda Zyada"</strong> brings much more happiness than even getting the merchandise you actually purchase.
          </p>

          <p class="margin-bottom30">And that is where <strong>www.hificashback.com</strong> comes to help you. <strong>www.hificashback.com</strong> offers extra cashback
            on the merchandise you purchase via our portal. This cashback is over and above any cashback you
            would get from the merchant.</p>

          <h3 class="h3 secondary">Who we are?</h3>
          <p>We are a team of passionate market researchers, dedicated IT folks, creative designers &amp; caring customer
            care executives. This assortment of experts from various backgrounds is committed to serving you in the best
            possible way and to bring new and innovative ideas &amp; concepts to you to make your shopping experience
            more rewarding.</p>

          <p class="margin-bottom30">We <strong>"HIFI CASHBACK"</strong> as a firm, believe in abiding our commitments, adhering to the highest standards of
            ethical conduct and acting as a trustworthy partner for our customers. <strong>HIFI CASHBACK's</strong> excellent
            reputation is reinforced by our pledge to operate with strong &amp; ethical governance, comprehensive efforts
            for customer satisfaction and a deep commitment to ethics and integrity.</p>

          <h3 class="h3 secondary">Our Promise</h3>
          <ul class="ul">
            <li>A smooth and hassle free shopping and cashback process</li>
            <li>A safe and secure shopping platform</li>
            <li>Maximum cashback made available</li>
            <li>Best deals &amp; coupons</li>
            <li>No hidden costs</li>
          </ul>

        </div>

      </div>
    </div>
  `,
  styles: [`
    .page-wrap { font-family: 'Open Sans', sans-serif; }
    .content-wrap { padding: 0 20px 40px; }

    :host ::ng-deep .content-box p {
      font-size: 13px;
      color: #555;
      line-height: 1.8;
      margin-bottom: 12px;
    }

    :host ::ng-deep .content-box ul.ul li {
      font-size: 13px;
      color: #555;
      line-height: 1.8;
    }
  `]
})
export class AboutComponent {}
