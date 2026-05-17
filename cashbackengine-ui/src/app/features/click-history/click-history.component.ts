import { Component, OnInit, signal, inject } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { StoreNavigationService } from '../../core/services/store-navigation.service';
import { ClickHistoryEntry } from '../../core/models/transaction.model';

interface DayGroup {
  label: string;
  entries: ClickHistoryEntry[];
}

@Component({
  selector: 'app-click-history',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe],
  template: `
    <div class="page-wrap">
      <div class="content-wrap">

        <h3 class="h3">My Store Visit History</h3>

        <!-- Loading -->
        <div *ngIf="loading()" class="loading-msg">Loading your visit history...</div>

        <!-- Empty state -->
        <div *ngIf="!loading() && groups().length === 0" class="text-center content-box">
          <p class="no-item">
            <span>You haven't visited any stores yet.<br>
            Browse stores and click "Go to Store" to start tracking your visits.</span>
          </p>
        </div>

        <!-- History grouped by date -->
        <div *ngIf="!loading() && groups().length > 0" class="history-wrap">

          <!-- Summary pill -->
          <div class="summary-bar">
            <span class="summary-count">{{ total() }} store visit{{ total() === 1 ? '' : 's' }} recorded</span>
          </div>

          <div *ngFor="let g of groups()" class="day-group">

            <!-- Day header -->
            <div class="day-label">{{ g.label }}</div>

            <!-- Entry rows -->
            <div class="entry-row clearfix" *ngFor="let e of g.entries">

              <!-- Store logo -->
              <div class="entry-img">
                <img *ngIf="getImage(e.retailerImage)"
                     [src]="getImage(e.retailerImage)"
                     [alt]="e.retailerTitle"
                     (error)="onImgError($event)" />
                <span *ngIf="!getImage(e.retailerImage)" class="entry-initial">
                  {{ e.retailerTitle[0] }}
                </span>
              </div>

              <!-- Store info -->
              <div class="entry-info">
                <div class="entry-title">{{ e.retailerTitle }}</div>
                <div class="entry-cashback" *ngIf="e.retailerCashback">
                  Upto {{ e.retailerCashback }} cashback
                </div>
                <div class="entry-time">
                  Visited at {{ e.added | date:'h:mm a' }}
                </div>
              </div>

              <!-- Actions -->
              <div class="entry-actions">
                <a class="button secondary"
                   (click)="visitAgain(e)"
                   style="cursor:pointer;"
                   title="Visit this store again">
                  Visit Again
                </a>
                <a class="button"
                   (click)="viewStore(e)"
                   style="cursor:pointer; margin-left:8px;"
                   title="View store details">
                  Store Details
                </a>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    * { box-sizing: border-box; }
    .page-wrap { font-family: 'Open Sans', sans-serif; }
    .content-wrap { padding: 0 20px 40px; }

    .loading-msg {
      padding: 40px;
      text-align: center;
      color: #64748b;
      font-size: 15px;
    }

    /* Summary bar */
    .summary-bar {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-bottom: 12px;
    }

    .summary-count {
      background: #e0f2fe;
      color: #0369a1;
      font-size: 12px;
      font-weight: 600;
      padding: 4px 12px;
      border-radius: 20px;
    }

    /* Day group */
    .day-group {
      margin-bottom: 20px;
    }

    .day-label {
      font-family: 'Josefin Sans', sans-serif;
      font-size: 13px;
      font-weight: 700;
      color: #fff;
      background: #17A8D4;
      padding: 6px 14px;
      border-radius: 3px;
      margin-bottom: 0;
      letter-spacing: 0.4px;
    }

    /* Entry row */
    .entry-row {
      display: flex;
      align-items: center;
      gap: 16px;
      background: #fff;
      border: 1px solid #eaeaea;
      border-top: none;
      padding: 14px 16px;
      transition: background 0.15s;
    }

    .entry-row:hover {
      background: #f8fbff;
    }

    /* Store logo box */
    .entry-img {
      width: 72px;
      height: 52px;
      flex-shrink: 0;
      border: 1px solid #eee;
      border-radius: 4px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fafafa;
    }

    .entry-img img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .entry-initial {
      font-size: 22px;
      font-weight: 700;
      color: #0292CA;
    }

    /* Info block */
    .entry-info {
      flex: 1;
      min-width: 0;
    }

    .entry-title {
      font-size: 15px;
      font-weight: 600;
      color: #333;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .entry-cashback {
      font-size: 12px;
      color: #0292CA;
      font-weight: 600;
      margin-top: 2px;
    }

    .entry-time {
      font-size: 11px;
      color: #999;
      margin-top: 3px;
    }

    /* Action buttons */
    .entry-actions {
      flex-shrink: 0;
      display: flex;
      align-items: center;
    }

    @media (max-width: 600px) {
      .entry-row { flex-wrap: wrap; }
      .entry-actions { width: 100%; margin-top: 8px; }
    }
  `]
})
export class ClickHistoryComponent implements OnInit {
  private api    = inject(ApiService);
  private router = inject(Router);
  storeNav       = inject(StoreNavigationService);

  history  = signal<ClickHistoryEntry[]>([]);
  loading  = signal(true);

  total  = () => this.history().length;

  /** Entries grouped by calendar day, most-recent day first */
  groups = (): DayGroup[] => {
    const map = new Map<string, ClickHistoryEntry[]>();
    for (const e of this.history()) {
      const label = this.dayLabel(e.added);
      if (!map.has(label)) map.set(label, []);
      map.get(label)!.push(e);
    }
    return Array.from(map.entries()).map(([label, entries]) => ({ label, entries }));
  };

  ngOnInit() {
    this.api.getMyClickHistory().subscribe({
      next: res => { this.history.set(res.data || []); this.loading.set(false); },
      error: ()  => this.loading.set(false)
    });
  }

  visitAgain(e: ClickHistoryEntry) {
    this.storeNav.goToStore(e.retailerId, e.retailerUrl);
  }

  viewStore(e: ClickHistoryEntry) {
    this.router.navigate(['/stores'], { queryParams: { id: e.retailerId } });
  }

  getImage(image?: string): string {
    if (!image || image.trim() === '' || image === 'noimg.gif') return '';
    const filename = image.includes('/') ? image.split('/').pop()! : image;
    return `assets/images/retailers/${filename}`;
  }

  onImgError(event: Event) {
    (event.target as HTMLImageElement).style.display = 'none';
  }

  private dayLabel(dateStr: string): string {
    const d    = new Date(dateStr);
    const now  = new Date();
    const diff = Math.floor((now.setHours(0,0,0,0) - new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }
}
