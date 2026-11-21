/**
 * Al Aref Academy - Payment & Enrollment Types
 * Milestone 4: Payment, Checkout & Immediate Access Entitlement (R4, F23-F27)
 *
 * Conforms to platform domain model: Egyptian payment gateways,
 * coupon discount engine, immediate access entitlement, and invoice tracking.
 */

export type PaymentMethodType =
  | "vodafone_cash"
  | "fawry"
  | "credit_card"
  | "voucher";

export interface CouponCode {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number; // e.g. 20 for 20%, 50 for 50 LE
  description: string;
  minOrderValue?: number;
  expiryDate: string; // ISO date string (e.g. "2026-12-31")
}

export interface OrderInvoice {
  orderId: string;
  studentId: string;
  studentName: string;
  studentPhone: string;
  courseId: string;
  courseTitle: string;
  gradeName: string;
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
  paymentMethod: PaymentMethodType;
  transactionReference: string;
  createdAt: string;
  status: "completed" | "pending_verification";
}

export interface CheckoutPayload {
  courseId: string;
  paymentMethod: PaymentMethodType;
  phoneNumber?: string;
  transactionRef?: string;
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
  voucherCode?: string;
}

export interface CouponValidationResult {
  success: boolean;
  message: string;
  discountAmount: number;
  coupon?: CouponCode;
}

export interface PriceTotals {
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
}
