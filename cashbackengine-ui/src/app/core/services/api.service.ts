import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse, Merchant, Offer, PageResponse, Transaction, Wallet, Payout,
  AdminStats, Retailer, AdminUser, Category, AdminTransaction
} from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // ── Merchants (legacy) ──────────────────────────────
  getMerchants(page = 0, size = 20): Observable<ApiResponse<PageResponse<Merchant>>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<PageResponse<Merchant>>>(`${this.base}/merchants`, { params });
  }

  getMerchant(id: number): Observable<ApiResponse<Merchant>> {
    return this.http.get<ApiResponse<Merchant>>(`${this.base}/merchants/${id}`);
  }

  // ── Offers ──────────────────────────────────────────
  getOffers(page = 0, size = 20): Observable<ApiResponse<PageResponse<Offer>>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<PageResponse<Offer>>>(`${this.base}/offers`, { params });
  }

  getOffersByMerchant(merchantId: number): Observable<ApiResponse<Offer[]>> {
    return this.http.get<ApiResponse<Offer[]>>(`${this.base}/offers/merchant/${merchantId}`);
  }

  // ── User Transactions ────────────────────────────────
  getTransactions(page = 0, size = 20): Observable<ApiResponse<PageResponse<Transaction>>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<PageResponse<Transaction>>>(`${this.base}/transactions`, { params });
  }

  // ── Wallet ───────────────────────────────────────────
  getWallet(): Observable<ApiResponse<Wallet>> {
    return this.http.get<ApiResponse<Wallet>>(`${this.base}/wallet`);
  }

  // ── Payouts ──────────────────────────────────────────
  requestPayout(amount: number, payoutMethod: string, payoutDestination: string): Observable<ApiResponse<Payout>> {
    return this.http.post<ApiResponse<Payout>>(`${this.base}/payouts`, { amount, payoutMethod, payoutDestination });
  }

  getPayouts(page = 0, size = 20): Observable<ApiResponse<PageResponse<Payout>>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<PageResponse<Payout>>>(`${this.base}/payouts`, { params });
  }

  // ── Admin: Stats ─────────────────────────────────────
  getAdminStats(): Observable<ApiResponse<AdminStats>> {
    return this.http.get<ApiResponse<AdminStats>>(`${this.base}/admin/stats`);
  }

  /** @deprecated Use getAdminStats() */
  getAdminSummary(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.base}/admin/stats`);
  }

  // ── Admin: Retailers ─────────────────────────────────
  getRetailers(): Observable<ApiResponse<Retailer[]>> {
    return this.http.get<ApiResponse<Retailer[]>>(`${this.base}/retailers`);
  }

  getRetailer(id: number): Observable<ApiResponse<Retailer>> {
    return this.http.get<ApiResponse<Retailer>>(`${this.base}/retailers/${id}`);
  }

  createRetailer(data: Partial<Retailer>): Observable<ApiResponse<Retailer>> {
    return this.http.post<ApiResponse<Retailer>>(`${this.base}/retailers`, data);
  }

  updateRetailer(id: number, data: Partial<Retailer>): Observable<ApiResponse<Retailer>> {
    return this.http.put<ApiResponse<Retailer>>(`${this.base}/retailers/${id}`, data);
  }

  deleteRetailer(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/retailers/${id}`);
  }

  // ── Admin: Users ─────────────────────────────────────
  getAdminUsers(): Observable<ApiResponse<AdminUser[]>> {
    return this.http.get<ApiResponse<AdminUser[]>>(`${this.base}/admin/users`);
  }

  updateUserRole(userId: number, role: string): Observable<ApiResponse<AdminUser>> {
    return this.http.put<ApiResponse<AdminUser>>(`${this.base}/admin/users/${userId}/role`, { role });
  }

  updateUserStatus(userId: number, status: string): Observable<ApiResponse<AdminUser>> {
    return this.http.put<ApiResponse<AdminUser>>(`${this.base}/admin/users/${userId}/status`, { status });
  }

  // ── Admin: Categories ────────────────────────────────
  getCategories(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(`${this.base}/categories`);
  }

  createCategory(data: Partial<Category>): Observable<ApiResponse<Category>> {
    return this.http.post<ApiResponse<Category>>(`${this.base}/categories`, data);
  }

  updateCategory(id: number, data: Partial<Category>): Observable<ApiResponse<Category>> {
    return this.http.put<ApiResponse<Category>>(`${this.base}/categories/${id}`, data);
  }

  deleteCategory(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/categories/${id}`);
  }

  // ── Admin: Transactions ──────────────────────────────
  getAllAdminTransactions(): Observable<ApiResponse<AdminTransaction[]>> {
    return this.http.get<ApiResponse<AdminTransaction[]>>(`${this.base}/transactions/all`);
  }

  updateTransactionStatus(id: number, status: string): Observable<ApiResponse<AdminTransaction>> {
    const params = new HttpParams().set('status', status);
    return this.http.put<ApiResponse<AdminTransaction>>(`${this.base}/transactions/${id}/status`, null, { params });
  }

  // ── Admin: Legacy merchant create ────────────────────
  createMerchant(merchant: Partial<Merchant>): Observable<ApiResponse<Merchant>> {
    return this.http.post<ApiResponse<Merchant>>(`${this.base}/admin/merchants`, merchant);
  }

  createOffer(offer: Partial<Offer> & { merchantId: number }): Observable<ApiResponse<Offer>> {
    return this.http.post<ApiResponse<Offer>>(`${this.base}/admin/offers`, offer);
  }
}
