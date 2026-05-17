import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse, Merchant, Offer, PageResponse, Transaction, Wallet, Payout,
  AdminStats, Retailer, AdminUser, Category, AdminTransaction, AffNetwork, Content, Coupon, CouponPage, CouponWithRetailer, EmailTemplate,
  Review, ReviewRequest, Favorite, ClickHistoryEntry
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

  getAllStores(): Observable<ApiResponse<Retailer[]>> {
    return this.http.get<ApiResponse<Retailer[]>>(`${this.base}/retailers/all`);
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

  getCategoryRetailers(categoryId: number): Observable<ApiResponse<Retailer[]>> {
    return this.http.get<ApiResponse<Retailer[]>>(`${this.base}/categories/${categoryId}/retailers`);
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

  // ── Admin: Email Templates ───────────────────────────
  getEmailTemplates(): Observable<ApiResponse<EmailTemplate[]>> {
    return this.http.get<ApiResponse<EmailTemplate[]>>(`${this.base}/email-templates`);
  }

  createEmailTemplate(data: Partial<EmailTemplate>): Observable<ApiResponse<EmailTemplate>> {
    return this.http.post<ApiResponse<EmailTemplate>>(`${this.base}/email-templates`, data);
  }

  updateEmailTemplate(id: number, data: Partial<EmailTemplate>): Observable<ApiResponse<EmailTemplate>> {
    return this.http.put<ApiResponse<EmailTemplate>>(`${this.base}/email-templates/${id}`, data);
  }

  deleteEmailTemplate(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/email-templates/${id}`);
  }

  // ── Admin: Coupons ──────────────────────────────────
  getActiveCoupons(): Observable<ApiResponse<CouponWithRetailer[]>> {
    return this.http.get<ApiResponse<CouponWithRetailer[]>>(`${this.base}/coupons/active`);
  }

  getActiveCouponsByRetailer(retailerId: number): Observable<ApiResponse<CouponWithRetailer[]>> {
    return this.http.get<ApiResponse<CouponWithRetailer[]>>(`${this.base}/coupons/active?retailerId=${retailerId}`);
  }

  getCoupons(page = 0, size = 50, status = 'all'): Observable<ApiResponse<CouponPage>> {
    const params = new HttpParams().set('page', page).set('size', size).set('status', status);
    return this.http.get<ApiResponse<CouponPage>>(`${this.base}/coupons`, { params });
  }

  createCoupon(data: Partial<Coupon>): Observable<ApiResponse<Coupon>> {
    return this.http.post<ApiResponse<Coupon>>(`${this.base}/coupons`, data);
  }

  updateCoupon(id: number, data: Partial<Coupon>): Observable<ApiResponse<Coupon>> {
    return this.http.put<ApiResponse<Coupon>>(`${this.base}/coupons/${id}`, data);
  }

  deleteCoupon(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/coupons/${id}`);
  }

  // ── Admin: Content ──────────────────────────────────
  getContents(): Observable<ApiResponse<Content[]>> {
    return this.http.get<ApiResponse<Content[]>>(`${this.base}/content`);
  }

  createContent(data: Partial<Content>): Observable<ApiResponse<Content>> {
    return this.http.post<ApiResponse<Content>>(`${this.base}/content`, data);
  }

  updateContent(id: number, data: Partial<Content>): Observable<ApiResponse<Content>> {
    return this.http.put<ApiResponse<Content>>(`${this.base}/content/${id}`, data);
  }

  deleteContent(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/content/${id}`);
  }

  // ── Admin: AffNetworks ──────────────────────────────
  getAffNetworks(): Observable<ApiResponse<AffNetwork[]>> {
    return this.http.get<ApiResponse<AffNetwork[]>>(`${this.base}/affnetworks`);
  }

  createAffNetwork(data: Partial<AffNetwork>): Observable<ApiResponse<AffNetwork>> {
    return this.http.post<ApiResponse<AffNetwork>>(`${this.base}/affnetworks`, data);
  }

  updateAffNetwork(id: number, data: Partial<AffNetwork>): Observable<ApiResponse<AffNetwork>> {
    return this.http.put<ApiResponse<AffNetwork>>(`${this.base}/affnetworks/${id}`, data);
  }

  deleteAffNetwork(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/affnetworks/${id}`);
  }

  // ── Admin: Legacy merchant create ────────────────────
  createMerchant(merchant: Partial<Merchant>): Observable<ApiResponse<Merchant>> {
    return this.http.post<ApiResponse<Merchant>>(`${this.base}/admin/merchants`, merchant);
  }

  createOffer(offer: Partial<Offer> & { merchantId: number }): Observable<ApiResponse<Offer>> {
    return this.http.post<ApiResponse<Offer>>(`${this.base}/admin/offers`, offer);
  }

  // ── Reviews ──────────────────────────────────────────
  getRetailerReviews(retailerId: number): Observable<ApiResponse<Review[]>> {
    return this.http.get<ApiResponse<Review[]>>(`${this.base}/reviews/retailer/${retailerId}`);
  }

  submitReview(retailerId: number, req: ReviewRequest): Observable<ApiResponse<Review>> {
    return this.http.post<ApiResponse<Review>>(`${this.base}/reviews/retailer/${retailerId}`, req);
  }

  // ── Click History ────────────────────────────────────────
  logClick(retailerId: number): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.base}/clicks/${retailerId}`, {});
  }

  getMyClickHistory(): Observable<ApiResponse<ClickHistoryEntry[]>> {
    return this.http.get<ApiResponse<ClickHistoryEntry[]>>(`${this.base}/clicks`);
  }

  // ── Favorites ─────────────────────────────────────────
  getMyFavorites(): Observable<ApiResponse<Favorite[]>> {
    return this.http.get<ApiResponse<Favorite[]>>(`${this.base}/favorites`);
  }

  addFavorite(retailerId: number): Observable<ApiResponse<Favorite>> {
    return this.http.post<ApiResponse<Favorite>>(`${this.base}/favorites/${retailerId}`, {});
  }

  removeFavorite(retailerId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/favorites/${retailerId}`);
  }

  // ── Admin: Reviews ────────────────────────────────────
  adminGetAllReviews(): Observable<ApiResponse<Review[]>> {
    return this.http.get<ApiResponse<Review[]>>(`${this.base}/admin/reviews`);
  }

  adminUpdateReviewStatus(reviewId: number, status: string): Observable<ApiResponse<Review>> {
    return this.http.put<ApiResponse<Review>>(`${this.base}/admin/reviews/${reviewId}/status`, { status });
  }

  adminDeleteReview(reviewId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/admin/reviews/${reviewId}`);
  }
}
