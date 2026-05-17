import { Component, signal } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';

interface FaqItem {
  type: 'heading' | 'qa';
  heading?: string;
  question?: string;
  answer?: string;
  answerHtml?: string;
}

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [NgFor, NgIf, NgClass],
  template: `
    <div class="page-wrap">
      <div class="content-wrap">

        <h2 class="h3">FAQs</h2>

        <div class="content-box">
          <ul class="faq-content">
            <ng-container *ngFor="let item of faqs; let i = index">

              <!-- Section heading -->
              <li *ngIf="item.type === 'heading'" class="h3 secondary">
                {{ item.heading }}
              </li>

              <!-- Q&A item -->
              <li *ngIf="item.type === 'qa'"
                  [class.active]="isOpen(i)"
                  (click)="toggle(i)">
                <span class="question">{{ item.question }}</span>
                <div class="answer" [innerHTML]="item.answerHtml || item.answer"></div>
              </li>

            </ng-container>
          </ul>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .page-wrap { font-family: 'Open Sans', sans-serif; }
    .content-wrap { padding: 0 20px 40px; }
  `]
})
export class FaqsComponent {
  openItems = signal<Set<number>>(new Set());

  toggle(index: number) {
    this.openItems.update(set => {
      const next = new Set(set);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  }

  isOpen(index: number): boolean {
    return this.openItems().has(index);
  }

  faqs: FaqItem[] = [
    { type: 'heading', heading: 'Cashback Explained' },
    {
      type: 'qa',
      question: 'What is Cashback?',
      answer: 'Cashback is a form of incentive offered to buyers of certain products whereby they receive a cash refund after making their purchase.'
    },
    {
      type: 'qa',
      question: 'How HifiCashback.com manages to pay Cash back?',
      answer: 'www.hificashback.com gets the commission against the purchase you make via our website. We offer this commission back to you to make your shopping more rewarding. For more details please refer the <strong>\'How it works\'</strong> section at our website www.hificashback.com.'
    },
    {
      type: 'qa',
      question: 'Is there any limit on the earnings user can get from www.hificashback.com?',
      answer: 'No, there is no limit on the earnings user can get. The more you shop, more you earn.'
    },
    {
      type: 'qa',
      question: 'When user visits merchant\'s website via www.hificashback.com, is there any change in prices of merchandise at merchant\'s website?',
      answer: 'No, there is no price change.'
    },
    {
      type: 'qa',
      question: 'Is there any fee/charge to register or to get cashback?',
      answer: 'No, www.hificashback.com offers this service free of cost. We do not charge any fee from our customers/visitors.'
    },
    {
      type: 'qa',
      question: 'If I return the merchandise after purchase, will I get cashback?',
      answer: 'No, Cashback is available only on the items you keep with you and do not return.'
    },
    {
      type: 'qa',
      question: 'Do we get cashback in case of purchase from any merchant?',
      answer: 'Most of the merchants participate in cashback program. However we may have some merchants listed at our website who do not participate in this program.'
    },
    {
      type: 'qa',
      question: 'What is \'In Progress\' & \'Confirmed\' cashback?',
      answer: 'When you make a purchase, initially your cashback for the respective purchase goes to \'In Progress\' state, which further goes to \'Confirmed\' or \'Declined\' state as per the policy set by merchant or us.'
    },

    { type: 'heading', heading: 'Referral' },
    {
      type: 'qa',
      question: 'Is there any limit on the referral amount I can earn?',
      answer: 'No, there is no limit on referral amount. However, you will get referral amount only for that friend referred by you, who makes at least one \'Cashback Eligible Purchase\' via www.hificashback.com.'
    },
    {
      type: 'qa',
      question: 'When will I get the referral amount?',
      answer: 'You can get referral amount only when the friend you referred makes a \'Cashback Eligible Purchase\'. Also while transferring cashback amount to your bank A/C, referral amount should be accompanied with at least INR 250 of \'Confirmed\' cashback amount.'
    },

    { type: 'heading', heading: 'Payment' },
    {
      type: 'qa',
      question: 'Do you deduct any tax on the earning generated this way?',
      answer: 'No, we do not. You are solely responsible for any tax liability. HIFI CASHBACK is not responsible for any tax obligation for the cashback earned.'
    },
    {
      type: 'qa',
      question: 'How can I get the cashback in my bank A/C?',
      answer: 'To get the cashback in your A/C, you must place a request of withdrawal after logging in to your account.'
    },
    {
      type: 'qa',
      question: 'Is there any limit on the amount to be withdrawn?',
      answer: 'There is no upper cap on the amount to be withdrawn but the minimum amount should be equal to or more than INR 250.'
    },
    {
      type: 'qa',
      question: 'I do not hold any bank account on my name. Can I get the cashback in the bank account of my friend?',
      answer: 'No, cashback can be transferred to the bank account of the respective HIFI CASHBACK account holder only.'
    },
    {
      type: 'qa',
      question: 'How much time do you take in crediting the cashback in user\'s bank account?',
      answer: 'Depending upon the payment mode selected by user it may take one week to two weeks.'
    },

    { type: 'heading', heading: 'Miscellaneous' },
    {
      type: 'qa',
      question: 'How can I contact your customer care team?',
      answer: 'Please write to us after clicking \'Support\' at www.hificashback.com.'
    },
    {
      type: 'qa',
      question: 'What can I do to make the purchase eligible for cashback?',
      answerHtml: `<p>In order to make your purchase 'Cashback Eligible Purchase' we recommend you to follow the below guidelines:</p>
        <ul class="ul">
          <li>Enable the cookies in your browser.</li>
          <li>Close all browser windows or any other connection/session you hold with the merchant you want to make the purchase from. Also do not open such windows/connection until you are done with your purchase.</li>
          <li>Login to www.hificashback.com with your user credentials.</li>
          <li>Go to merchant's website via our website. While doing so don't tamper the URL.</li>
          <li>Complete your purchase in the same shopping session. Do not take too much time to make the purchase.</li>
          <li>In order to make another purchase come to our website again and then go to the merchant's website again; this will establish a new shopping session for you.</li>
          <li>Do not use any coupon not provided by Us.</li>
        </ul>`
    }
  ];
}
