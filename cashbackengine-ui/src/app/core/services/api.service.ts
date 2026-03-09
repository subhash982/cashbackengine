import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Merchant, Offer, PageResponse, Transaction, Wallet, Payout } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // Merchants
  getMerchants(page = 0, size = 20): Observable<ApiResponse<PageResponse<Merchant>>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<PageResponse<Merchant>>>(`${this.base}/merchants`, { params });
  }

  getMerchant(id: number): Observable<ApiResponse<Merchant>> {
    return this.http.get<ApiResponse<Merchant>>(`${this.base}/merchants/${id}`);
  }

  // Offers
  getOffers(page = 0, size = 20): Observable<ApiResponse<PageResponse<Offer>>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<PageResponse<Offer>>>(`${this.base}/offers`, { params });
  }

  getOffersByMerchant(merchantId: number): Observable<ApiResponse<Offer[]>> {
    return this.http.get<ApiResponse<Offer[]>>(`${this.base}/offers/merchant/${merchantId}`);
  }

  // Transactions
  getTransactions(page = 0, size = 20): Observable<ApiResponse<PageResponse<Transaction>>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<PageResponse<Transaction>>>(`${this.base}/transactions`, { params });
  }

  // Wallet
  getWallet(): Observable<ApiResponse<Wallet>> {
    return this.http.get<ApiResponse<Wallet>>(`${this.base}/wallet`);
  }

  // Payouts
  requestPayout(amount: number, payoutMethod: string, payoutDestination: string): Observable<ApiResponse<Payout>> {
    return this.http.post<ApiResponse<Payout>>(`${this.base}/payouts`, { amount, payoutMethod, payoutDestination });
  }

  getPayouts(page = 0, size = 20): Observable<ApiResponse<PageResponse<Payout>>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<PageResponse<Payout>>>(`${this.base}/payouts`, { params });
  }

  // Admin
  getAdminSummary(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.base}/admin/analytics/summary`);
  }

  createMerchant(merchant: Partial<Merchant>): Observable<ApiResponse<Merchant>> {
    return this.http.post<ApiResponse<Merchant>>(`${this.base}/admin/merchants`, merchant);
  }

  createOffer(offer: Partial<Offer> & { merchantId: number }): Observable<ApiResponse<Offer>> {
    return this.http.post<ApiResponse<Offer>>(`${this.base}/admin/offers`, offer);
  }
}
