export type VendorStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "suspended"
  | "active";

export type CustomerStatus = "active" | "blocked" | "inactive";

export type ProductStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "draft"
  | "archived";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus =
  | "pending"
  | "completed"
  | "failed"
  | "refunded"
  | "partially_refunded";

export type CouponType = "percentage" | "fixed" | "free_shipping";

export type RoleName =
  | "Super Admin"
  | "Finance Admin"
  | "Support Admin"
  | "Content Admin";

export interface Vendor {
  id: string;
  name: string;
  storeName: string;
  email: string;
  phone: string;
  status: VendorStatus;
  registrationDate: string;
  sales: number;
  products: number;
  orders: number;
  commission: number;
  rating: number;
  logo?: string;
  description?: string;
  address?: string;
  category?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  joinDate: string;
  orders: number;
  totalSpent: number;
  lastOrder?: string;
  avatar?: string;
  address?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  vendorId: string;
  vendorName: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  submittedAt: string;
  image?: string;
  description?: string;
  sales: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  vendorId: string;
  vendorName: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  total: number;
  items: number;
  createdAt: string;
  shippingStatus?: string;
  trackingNumber?: string;
}

export interface Payment {
  id: string;
  transactionId: string;
  orderId: string;
  vendorId: string;
  vendorName: string;
  amount: number;
  commission: number;
  vendorPayout: number;
  status: PaymentStatus;
  method: string;
  createdAt: string;
}

export interface CommissionRule {
  id: string;
  name: string;
  category: string;
  percentage: number;
  minAmount?: number;
  maxAmount?: number;
  active: boolean;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  usageLimit: number;
  usedCount: number;
  status: "active" | "expired" | "disabled";
  startsAt: string;
  expiresAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  products: number;
  status: "active" | "inactive";
  order: number;
  attributes?: string[];
}

export interface CmsPage {
  id: string;
  title: string;
  slug: string;
  status: "published" | "draft";
  updatedAt: string;
  author: string;
}

export interface Banner {
  id: string;
  title: string;
  position: string;
  status: "active" | "inactive" | "scheduled";
  startsAt: string;
  endsAt: string;
  clicks: number;
  impressions: number;
}

export interface Role {
  id: string;
  name: RoleName | string;
  description: string;
  users: number;
  permissions: string[];
}

export interface Permission {
  id: string;
  module: string;
  actions: string[];
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface KpiMetric {
  label: string;
  value: number | string;
  change: number;
  trend: "up" | "down" | "neutral";
  format?: "currency" | "number" | "percent";
}

export interface ChartPoint {
  name: string;
  value: number;
  secondary?: number;
}
