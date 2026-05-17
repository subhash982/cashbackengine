import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class StoreNavigationService {
  private auth = inject(AuthService);
  private api = inject(ApiService);
  private router = inject(Router);

  /** True while the click is being logged — drives the overlay */
  navigating = signal(false);

  /**
   * Log the click then open the store URL.
   * - Redirects to /auth/login if not logged in.
   * - Shows "Navigating to retailer…" overlay while logging.
   * - Replaces {USERID} and {TIMESTMP} placeholders in the URL before opening.
   * - Opens URL regardless of API outcome so the user is never blocked.
   */
  goToStore(retailerId: number, url: string): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    const resolvedUrl = this.resolveUrl(url);

    this.navigating.set(true);

    this.api.logClick(retailerId).subscribe({
      next: () => this.openAndHide(resolvedUrl),
      error: () => this.openAndHide(resolvedUrl)   // still navigate even if logging fails
    });

    // Safety timeout — open anyway after 3s if API is slow
    setTimeout(() => {
      if (this.navigating()) this.openAndHide(resolvedUrl);
    }, 3000);
  }

  /**
   * Replace tracking placeholders in the affiliate URL:
   *   {USERID}   → logged-in user's ID
   *   {TIMESTMP} → current Unix timestamp (seconds)
   */
  private resolveUrl(url: string): string {
    const userId = this.auth.currentUser()?.userId ?? 0;
    const timestamp = Math.floor(Date.now() / 1000);
    return url
      .replace(/\{USERID\}/g, String(userId))
      .replace(/\{TIMESTMP\}/g, String(timestamp));
  }

  private openAndHide(url: string): void {
    if (!this.navigating()) return;  // already handled by timeout
    this.navigating.set(false);
    window.open(url, '_blank', 'noopener');
  }
}
