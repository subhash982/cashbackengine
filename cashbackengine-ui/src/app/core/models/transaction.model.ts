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
  status: string;
  sortOrder: number;
  parentId?: number;
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
