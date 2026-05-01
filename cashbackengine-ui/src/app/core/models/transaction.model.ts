export interface Transaction {
  id: number;
  transactionId: string;
  merchantId: number;
  merchantName: string;
  orderValue: number;
  commission: number;
  cashbackAmount: number;
  currency: string;
  status: TransactionStatus;
  fraudSuspected: boolean;
  createdAt: string;
  confirmedAt?: string;
  paidAt?: string;
}

export type TransactionStatus = 'TRACKED' | 'PENDING' | 'CONFIRMED' | 'PAYABLE' | 'PAID' | 'CANCELLED' | 'REJECTED';

export interface Wallet {
  userId: number;
  pendingAmount: number;
  confirmedAmount: number;
  withdrawableAmount: number;
  totalPaidAmount: number;
  currency: string;
  updatedAt: string;
}

export interface Merchant {
  id: number;
  name: string;
  description?: string;
  websiteUrl: string;
  logoUrl?: string;
  category?: string;
  affiliateNetwork: string;
  defaultCommissionRate: number;
  userSharePercentage: number;
  active: boolean;
}

export interface Offer {
  id: number;
  merchantId: number;
  merchantName: string;
  title: string;
  offerType: string;
  cashbackPercentage: number;
  active: boolean;
}

export interface Payout {
  id: number;
  amount: number;
  currency: string;
  payoutMethod: string;
  status: string;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// ── Admin models ──────────────────────────────────────

export interface AdminStats {
  totalUsers: number;
  totalRetailers: number;
  totalTransactions: number;
  pendingTransactions: number;
}

export interface Retailer {
  retailerId: number;
  title: string;
  url: string;
  image?: string;
  cashback?: string;
  oldCashback?: string;
  description?: string;
  conditions?: string;
  featured: boolean;
  dealOfWeek: boolean;
  visits: number;
  status: string;
  added?: string;
  networkId?: number;
  programId?: string;
}

export interface AdminUser {
  userId: number;
  username: string;
  email: string;
  fname?: string;
  lname?: string;
  role: string;
  status: string;
  created: string;
}

export interface Category {
  categoryId: number;
  name: string;
  description?: string;
  categoryUrl?: string;
  metaDescription?: string;
  metaKeywords?: string;
  status: string;
  sortOrder: number;
  parentId?: number;
  alias?: string;
}

export interface EmailTemplate {
  templateId: number;
  emailName: string;
  language?: string;
  emailSubject: string;
  emailMessage?: string;
  modified?: string;
}

export interface Coupon {
  couponId: number;
  retailerId?: number;
  promoId?: string;
  couponType: string;
  title: string;
  code?: string;
  link?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  exclusive?: number;
  special?: number;
  visits?: number;
  offer?: string;
  offerImg?: string;
  bannerImg?: string;
  offerTemplate?: string;
  status: string;
  added?: string;
}

export interface CouponPage {
  content: Coupon[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface Content {
  contentId: number;
  name: string;
  language?: string;
  linkTitle?: string;
  title?: string;
  description?: string;
  pageLocation?: string;
  pageUrl?: string;
  metaDescription?: string;
  metaKeywords?: string;
  status: string;
  modified?: string;
}

export interface AffNetwork {
  networkId: number;
  networkName: string;
  website: string;
  image?: string;
  csvFormat?: string;
  confirmeds?: string;
  pendings?: string;
  declineds?: string;
  status: string;
  added?: string;
  lastCsvUpload?: string;
}

export interface AdminTransaction {
  transactionId: number;
  referenceId?: string;
  retailer?: string;
  userId: number;
  transactionAmount?: number;
  transactionCommission?: number;
  amount?: number;
  status: string;
  reason?: string;
  created: string;
  updated: string;
}
