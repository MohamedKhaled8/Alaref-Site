/**
 * Al Aref Academy - Mock Coupon Codes & Center Vouchers
 * Milestone 4: Payment, Checkout & Immediate Access Entitlement (R4, F23-F27)
 */

import { CouponCode } from "../types/payment";

export const mockCoupons: CouponCode[] = [
  {
    code: "AREF2026",
    discountType: "percentage",
    discountValue: 20,
    description: "كود خصم بداية الفصل الدراسي (خصم 20%)",
    minOrderValue: 0,
    expiryDate: "2026-12-31T23:59:59Z",
  },
  {
    code: "AWAL50",
    discountType: "fixed",
    discountValue: 50,
    description: "خصم ترحيبي للطلاب المتفوقين (50 ج.م)",
    minOrderValue: 100,
    expiryDate: "2026-12-31T23:59:59Z",
  },
  {
    code: "FREEPASS",
    discountType: "percentage",
    discountValue: 100,
    description: "منحة الطالب المتفوق - اشتراك مجاني كامل (100%)",
    minOrderValue: 0,
    expiryDate: "2026-12-31T23:59:59Z",
  },
  {
    code: "AREF-2026-GOLD",
    discountType: "percentage",
    discountValue: 100,
    description: "كارت شحن السنتر الذهبي (اشتراك كامل معتمد)",
    minOrderValue: 0,
    expiryDate: "2026-12-31T23:59:59Z",
  },
  {
    code: "EXPIRED2020",
    discountType: "percentage",
    discountValue: 50,
    description: "كوبون تجريبي منتهي الصلاحية",
    minOrderValue: 0,
    expiryDate: "2020-01-01T00:00:00Z",
  },
  {
    code: "MIN1000",
    discountType: "fixed",
    discountValue: 200,
    description: "خصم خاص للطلبات الكبرى (حد أدنى 1000 ج.م)",
    minOrderValue: 1000,
    expiryDate: "2026-12-31T23:59:59Z",
  },
];

/**
 * Valid center voucher cards for voucher redemption
 */
export const VALID_CENTER_VOUCHERS: string[] = [
  "AREF-2026-GOLD",
  "AREF-2026-SILVER",
  "AREF-VIP-2026",
  "AREF-CENTER-8842",
];

/**
 * Find a coupon by code (case-insensitive, trimmed)
 */
export function findCouponByCode(code: string): CouponCode | undefined {
  const normalized = code.trim().toUpperCase();
  return mockCoupons.find((c) => c.code.toUpperCase() === normalized);
}

/**
 * Check if a voucher code is a valid center voucher
 */
export function isValidCenterVoucher(voucherCode: string): boolean {
  const normalized = voucherCode.trim().toUpperCase();
  return VALID_CENTER_VOUCHERS.some((v) => v.toUpperCase() === normalized);
}
