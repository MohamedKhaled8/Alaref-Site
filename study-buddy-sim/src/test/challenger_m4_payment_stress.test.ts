// @ts-expect-error enable React act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import React, { act } from "react";
import ReactDOM from "react-dom/client";
import { 
  useEnrollmentStore, 
  LOCAL_STORAGE_ENROLLMENTS_KEY, 
  LOCAL_STORAGE_PURCHASE_HISTORY_KEY 
} from "../stores/useEnrollmentStore";
import { useAuthStore } from "../stores/useAuthStore";
import { mockCoupons, findCouponByCode, isValidCenterVoucher } from "../data/mockCoupons";
import { CourseItem } from "../data/mockData";
import { User } from "../types/auth";
import { CheckoutPayload, OrderInvoice, PaymentMethodType } from "../types/payment";
import { CouponInput } from "../components/payment/CouponInput";
import { OrderSummaryCard } from "../components/payment/OrderSummaryCard";
import { PaymentMethodTabs } from "../components/payment/PaymentMethodTabs";

// Helper to mount React components into fresh DOM container for UI testing
function mountToDom(element: React.ReactElement): {
  container: HTMLElement;
  unmount: () => void;
} {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = ReactDOM.createRoot(container);
  act(() => {
    root.render(element);
  });
  return {
    container,
    unmount: () => {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
}

// Standard test fixtures
const testCourse: CourseItem = {
  id: "course-prep-3-challenger",
  slug: "prep-3-challenger",
  title: "كورس اللغة العربية التحدي - الصف الثالث الإعدادي",
  gradeId: "prep-3",
  gradeName: "الصف الثالث الإعدادي",
  archetype: "curriculum",
  archetypeLabel: "المنهج الكامل",
  description: "اختبار الضغط الأمني على محرك الدفع والكوبونات",
  longDescription: "تفاصيل كورس التحدي الأمني",
  price: 300,
  originalPrice: 400,
  isFree: false,
  studentCount: 1500,
  lecturesCount: 20,
  durationHours: 30,
  durationText: "30 ساعة تدريبية",
  rating: 4.98,
  reviewsCount: 350,
  isFeatured: true,
  thumbnail: "/assets/banner.png",
  units: [],
  quizCount: 5,
  examRules: {
    questionsCount: 10,
    durationMinutes: 15,
    passScore: 6,
    maxAttempts: 2,
  },
};

const cheapCourse: CourseItem = {
  ...testCourse,
  id: "course-cheap-30le",
  title: "كورس مراجعة سريعة (30 ج.م)",
  price: 30,
  originalPrice: 50,
};

const freeCourse: CourseItem = {
  ...testCourse,
  id: "course-free-foundations-challenger",
  title: "كورس التأسيس الشامل المجاني",
  price: 0,
  originalPrice: 0,
  isFree: true,
};

const testStudent: User = {
  id: "student-challenger-007",
  fullName: "طارق سليم الدسوقي",
  studentPhone: "01011223344",
  parentPhone: "01099887766",
  gradeId: "prep-3",
  gradeName: "الصف الثالث الإعدادي",
  role: "student",
  deviceId: "device-challenger-uuid-007",
  enrolledCourseIds: [],
  createdAt: "2026-11-01T12:00:00Z",
};

describe("Milestone 4 Challenger: Empirical Payment & Coupon Engine Adversarial Stress Suite", () => {
  beforeEach(() => {
    localStorage.clear();
    useEnrollmentStore.getState().resetEnrollments();
    useAuthStore.setState({
      user: { ...testStudent, enrolledCourseIds: [] },
      isAuthenticated: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
    useEnrollmentStore.getState().resetEnrollments();
  });

  // =========================================================================
  // 1. Negative Price Handling & Discount Overflow (Boundary & Arithmetic)
  // =========================================================================
  describe("1. Negative Price Handling & Discount Overflow Protection", () => {
    it("clamps final price strictly to 0 LE when discount exceeds course price (Fixed Discount)", () => {
      // Course is 30 LE, apply AWAL50 (50 LE discount) directly
      useEnrollmentStore.setState({
        appliedCoupon: {
          code: "AWAL50",
          discountType: "fixed",
          discountValue: 50,
          description: "خصم 50 ج.م",
          expiryDate: "2026-12-31T23:59:59Z",
        },
      });

      const totals = useEnrollmentStore.getState().calculateTotals(30);

      // Discount cannot exceed original price
      expect(totals.originalPrice).toBe(30);
      expect(totals.discountAmount).toBe(30);
      expect(totals.finalPrice).toBe(0);
      expect(totals.finalPrice).toBeGreaterThanOrEqual(0);
    });

    it("clamps final price strictly to 0 LE when course price is 0 LE", () => {
      // Free course (0 LE) with 20% coupon
      useEnrollmentStore.getState().applyCoupon("AREF2026", 0);
      const totals = useEnrollmentStore.getState().calculateTotals(0);

      expect(totals.originalPrice).toBe(0);
      expect(totals.discountAmount).toBe(0);
      expect(totals.finalPrice).toBe(0);
    });

    it("handles negative original price input safely without NaN or negative output", () => {
      const store = useEnrollmentStore.getState();
      const totalsNegative = store.calculateTotals(-500);

      expect(totalsNegative.originalPrice).toBe(0);
      expect(totalsNegative.discountAmount).toBe(0);
      expect(totalsNegative.finalPrice).toBe(0);
      expect(Number.isNaN(totalsNegative.finalPrice)).toBe(false);
    });

    it("clamps discount amount when coupon has excessive percentage (>100%)", () => {
      // Simulate malicious or corrupted coupon object with 250% discount
      useEnrollmentStore.setState({
        appliedCoupon: {
          code: "HACK250",
          discountType: "percentage",
          discountValue: 250,
          description: "كوبون غير مصرح به 250%",
          expiryDate: "2026-12-31T23:59:59Z",
        },
      });

      const totals = useEnrollmentStore.getState().calculateTotals(200);

      expect(totals.originalPrice).toBe(200);
      // Even with 250%, discount amount must be capped at course price 200
      expect(totals.discountAmount).toBe(200);
      expect(totals.finalPrice).toBe(0);
    });

    it("clamps discount amount when coupon has negative discountValue", () => {
      // Simulate malicious or corrupted coupon object with negative discountValue
      useEnrollmentStore.setState({
        appliedCoupon: {
          code: "NEGATIVE50",
          discountType: "fixed",
          discountValue: -50,
          description: "كوبون سالب",
          expiryDate: "2026-12-31T23:59:59Z",
        },
      });

      const totals = useEnrollmentStore.getState().calculateTotals(200);

      expect(totals.originalPrice).toBe(200);
      expect(totals.discountAmount).toBe(0);
      expect(totals.finalPrice).toBe(200);
    });

    it("processCheckout creates invoice with 0 LE final price when 100% discount applied", async () => {
      const store = useEnrollmentStore.getState();
      store.applyCoupon("FREEPASS", testCourse.price);

      const invoice = await store.processCheckout(testCourse, testStudent, {
        courseId: testCourse.id,
        paymentMethod: "fawry",
      });

      expect(invoice.originalPrice).toBe(300);
      expect(invoice.discountAmount).toBe(300);
      expect(invoice.finalPrice).toBe(0);
      expect(invoice.status).toBe("completed");
      expect(store.isCourseEnrolled(testCourse.id)).toBe(true);
    });
  });

  // =========================================================================
  // 2. Coupon Case-Insensitivity & Whitespace Trimming
  // =========================================================================
  describe("2. Coupon Case-Insensitivity, Whitespace Trimming & Fuzzing", () => {
    it("accepts lowercase coupon code 'aref2026'", () => {
      const res = useEnrollmentStore.getState().applyCoupon("aref2026", 300);
      expect(res.success).toBe(true);
      expect(res.coupon?.code).toBe("AREF2026");
      expect(res.discountAmount).toBe(60); // 20% of 300
    });

    it("accepts mixed-case coupon code 'ArEf2026'", () => {
      const res = useEnrollmentStore.getState().applyCoupon("ArEf2026", 300);
      expect(res.success).toBe(true);
      expect(res.coupon?.code).toBe("AREF2026");
    });

    it("trims leading, trailing and tab whitespace around coupon code", () => {
      const res = useEnrollmentStore.getState().applyCoupon("  \tAREF2026 \n ", 300);
      expect(res.success).toBe(true);
      expect(res.coupon?.code).toBe("AREF2026");
      expect(res.discountAmount).toBe(60);
    });

    it("rejects empty string and whitespace-only strings gracefully", () => {
      const store = useEnrollmentStore.getState();

      const resEmpty = store.applyCoupon("", 300);
      expect(resEmpty.success).toBe(false);
      expect(resEmpty.discountAmount).toBe(0);
      expect(resEmpty.message).toContain("يرجى إدخال كود الخصم");

      const resWhitespace = store.applyCoupon("    ", 300);
      expect(resWhitespace.success).toBe(false);
      expect(resWhitespace.discountAmount).toBe(0);
      expect(resWhitespace.message).toContain("يرجى إدخال كود الخصم");

      // Store state remains clean
      expect(store.appliedCoupon).toBeNull();
    });

    it("fuzzing: rejects SQL injection strings without crash", () => {
      const store = useEnrollmentStore.getState();
      const payloads = [
        "' OR '1'='1",
        "'; DROP TABLE coupons; --",
        "AREF2026'--",
        "admin'/*",
        "\" or 1=1--",
      ];

      for (const payload of payloads) {
        const res = store.applyCoupon(payload, 300);
        expect(res.success).toBe(false);
        expect(res.discountAmount).toBe(0);
      }
      expect(store.appliedCoupon).toBeNull();
    });

    it("fuzzing: rejects XSS payloads and script tags without executing or corrupting state", () => {
      const store = useEnrollmentStore.getState();
      const xssPayloads = [
        "<script>alert(1)</script>",
        "<img src=x onerror=alert(1)>",
        "javascript:alert('xss')",
        "<svg onload=alert(1)>",
      ];

      for (const xss of xssPayloads) {
        const res = store.applyCoupon(xss, 300);
        expect(res.success).toBe(false);
        expect(res.discountAmount).toBe(0);
      }
      expect(store.appliedCoupon).toBeNull();
    });
  });

  // =========================================================================
  // 3. Expired Coupon Rejection & Temporal Boundary Probing
  // =========================================================================
  describe("3. Expired Coupon Rejection & Temporal Probing", () => {
    it("rejects statically expired coupon 'EXPIRED2020'", () => {
      const res = useEnrollmentStore.getState().applyCoupon("EXPIRED2020", 300);
      expect(res.success).toBe(false);
      expect(res.discountAmount).toBe(0);
      expect(res.message).toContain("انتهت صلاحية");
      expect(useEnrollmentStore.getState().appliedCoupon).toBeNull();
    });

    it("rejects valid coupon when temporal clock advances past expiration (vi.setSystemTime)", () => {
      // Simulate year 2027 where AREF2026 (expires 2026-12-31T23:59:59Z) has expired
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2027-01-01T00:00:01Z"));

      const res = useEnrollmentStore.getState().applyCoupon("AREF2026", 300);
      expect(res.success).toBe(false);
      expect(res.discountAmount).toBe(0);
      expect(res.message).toContain("انتهت صلاحية");
      expect(useEnrollmentStore.getState().appliedCoupon).toBeNull();
    });

    it("enforces minimum order value requirements (AWAL50 requires >= 100 LE)", () => {
      // Course price 80 LE (less than minOrderValue 100)
      const resBelow = useEnrollmentStore.getState().applyCoupon("AWAL50", 80);
      expect(resBelow.success).toBe(false);
      expect(resBelow.message).toContain("يتطلب هذا الكود قيمة طلب لا تقل عن 100");
      expect(useEnrollmentStore.getState().appliedCoupon).toBeNull();

      // Course price 100 LE (meets minOrderValue 100)
      const resEqual = useEnrollmentStore.getState().applyCoupon("AWAL50", 100);
      expect(resEqual.success).toBe(true);
      expect(resEqual.discountAmount).toBe(50);
      expect(useEnrollmentStore.getState().appliedCoupon?.code).toBe("AWAL50");
    });

    it("enforces high minimum order value coupon MIN1000 (requires >= 1000 LE)", () => {
      const store = useEnrollmentStore.getState();
      const resFail = store.applyCoupon("MIN1000", 300);
      expect(resFail.success).toBe(false);
      expect(resFail.message).toContain("1000");

      const resPass = store.applyCoupon("MIN1000", 1200);
      expect(resPass.success).toBe(true);
      expect(resPass.discountAmount).toBe(200);
    });
  });

  // =========================================================================
  // 4. Double-Coupon Application & State Pollution Prevention
  // =========================================================================
  describe("4. Double-Coupon Application & State Pollution Prevention", () => {
    it("replaces existing coupon when second coupon is applied (NO coupon stacking)", () => {
      // 1. Apply first coupon AREF2026 (20% of 300 = 60 LE)
      const res1 = useEnrollmentStore.getState().applyCoupon("AREF2026", 300);
      expect(res1.success).toBe(true);
      expect(useEnrollmentStore.getState().calculateTotals(300).discountAmount).toBe(60);
      expect(useEnrollmentStore.getState().calculateTotals(300).finalPrice).toBe(240);

      // 2. Apply second coupon AWAL50 (50 LE fixed)
      const res2 = useEnrollmentStore.getState().applyCoupon("AWAL50", 300);
      expect(res2.success).toBe(true);

      // Totals must reflect ONLY AWAL50 (50 LE), NOT stacked (60 + 50 = 110 LE)
      const totals = useEnrollmentStore.getState().calculateTotals(300);
      expect(useEnrollmentStore.getState().appliedCoupon?.code).toBe("AWAL50");
      expect(totals.discountAmount).toBe(50);
      expect(totals.finalPrice).toBe(250);
    });

    it("preserves active coupon when subsequent coupon application fails", () => {
      // 1. Apply valid coupon
      useEnrollmentStore.getState().applyCoupon("AREF2026", 300);
      expect(useEnrollmentStore.getState().appliedCoupon?.code).toBe("AREF2026");

      // 2. Attempt applying invalid coupon
      const resInvalid = useEnrollmentStore.getState().applyCoupon("TOTALLY_BOGUS_CODE", 300);
      expect(resInvalid.success).toBe(false);

      // Active coupon remains AREF2026, not nullified or corrupted
      expect(useEnrollmentStore.getState().appliedCoupon?.code).toBe("AREF2026");
      expect(useEnrollmentStore.getState().calculateTotals(300).discountAmount).toBe(60);
    });

    it("clears coupon state upon checkout so next course purchase is not discounted", async () => {
      // Apply coupon for course 1
      useEnrollmentStore.getState().applyCoupon("AREF2026", 300);
      expect(useEnrollmentStore.getState().appliedCoupon).not.toBeNull();

      // Complete checkout for course 1
      await useEnrollmentStore.getState().processCheckout(testCourse, testStudent, {
        courseId: testCourse.id,
        paymentMethod: "fawry",
      });

      // After checkout, appliedCoupon is cleared
      expect(useEnrollmentStore.getState().appliedCoupon).toBeNull();

      // Second course calculation has NO discount
      const nextTotals = useEnrollmentStore.getState().calculateTotals(400);
      expect(nextTotals.discountAmount).toBe(0);
      expect(nextTotals.finalPrice).toBe(400);
    });

    it("removeCoupon() removes coupon and resets discounts to 0", () => {
      useEnrollmentStore.getState().applyCoupon("AREF2026", 300);
      expect(useEnrollmentStore.getState().appliedCoupon).not.toBeNull();

      useEnrollmentStore.getState().removeCoupon();
      expect(useEnrollmentStore.getState().appliedCoupon).toBeNull();
      expect(useEnrollmentStore.getState().calculateTotals(300).discountAmount).toBe(0);
      expect(useEnrollmentStore.getState().calculateTotals(300).finalPrice).toBe(300);
    });
  });

  // =========================================================================
  // 5. Center Voucher Redemption & Tampering Resistance
  // =========================================================================
  describe("5. Center Voucher Redemption & Tampering Resistance", () => {
    it("accepts recognized center vouchers (AREF-2026-GOLD, AREF-2026-SILVER, AREF-VIP-2026, AREF-CENTER-8842)", async () => {
      const store = useEnrollmentStore.getState();
      const validVouchers = [
        "AREF-2026-GOLD",
        "AREF-2026-SILVER",
        "AREF-VIP-2026",
        "AREF-CENTER-8842",
      ];

      for (let i = 0; i < validVouchers.length; i++) {
        const voucher = validVouchers[i];
        const dummyCourse: CourseItem = {
          ...testCourse,
          id: `voucher-test-course-${i}`,
          title: `كورس سنتر ${i}`,
        };

        const invoice = await store.processCheckout(dummyCourse, testStudent, {
          courseId: dummyCourse.id,
          paymentMethod: "voucher",
          voucherCode: voucher,
        });

        expect(invoice.paymentMethod).toBe("voucher");
        expect(invoice.transactionReference).toBe(`VOUCHER-${voucher}`);
        expect(store.isCourseEnrolled(dummyCourse.id)).toBe(true);
      }
    });

    it("accepts lowercase and trimmed center voucher codes", async () => {
      const store = useEnrollmentStore.getState();
      const invoice = await store.processCheckout(testCourse, testStudent, {
        courseId: testCourse.id,
        paymentMethod: "voucher",
        voucherCode: "  aref-2026-gold  ",
      });

      expect(invoice.transactionReference).toBe("VOUCHER-AREF-2026-GOLD");
      expect(store.isCourseEnrolled(testCourse.id)).toBe(true);
    });

    it("rejects empty, missing, or whitespace voucher code", async () => {
      const store = useEnrollmentStore.getState();

      await expect(
        store.processCheckout(testCourse, testStudent, {
          courseId: testCourse.id,
          paymentMethod: "voucher",
          voucherCode: "",
        })
      ).rejects.toThrow("يرجى إدخال كود كارت شحن السنتر");

      await expect(
        store.processCheckout(testCourse, testStudent, {
          courseId: testCourse.id,
          paymentMethod: "voucher",
          voucherCode: "   ",
        })
      ).rejects.toThrow("يرجى إدخال كود كارت شحن السنتر");
    });

    it("rejects unauthorized, random, or tampered voucher codes", async () => {
      const store = useEnrollmentStore.getState();
      const tamperedCodes = [
        "INVALID-VOUCHER",
        "CENTER-12345",
        "FREE-ALL-COURSES",
        "123456789",
        "AREF",
      ];

      for (const bogus of tamperedCodes) {
        await expect(
          store.processCheckout(testCourse, testStudent, {
            courseId: testCourse.id,
            paymentMethod: "voucher",
            voucherCode: bogus,
          })
        ).rejects.toThrow("كود كارت السنتر غير صحيح");
      }
    });

    it("valid voucher AREF-2026-GOLD applied as coupon grants 100% full scholarship", async () => {
      const store = useEnrollmentStore.getState();
      const couponRes = store.applyCoupon("AREF-2026-GOLD", testCourse.price);

      expect(couponRes.success).toBe(true);
      expect(couponRes.discountAmount).toBe(testCourse.price);

      const totals = store.calculateTotals(testCourse.price);
      expect(totals.finalPrice).toBe(0);

      const invoice = await store.processCheckout(testCourse, testStudent, {
        courseId: testCourse.id,
        paymentMethod: "voucher",
        voucherCode: "AREF-2026-GOLD",
      });

      expect(invoice.originalPrice).toBe(300);
      expect(invoice.discountAmount).toBe(300);
      expect(invoice.finalPrice).toBe(0);
      expect(invoice.status).toBe("completed");
      expect(store.isCourseEnrolled(testCourse.id)).toBe(true);
    });
  });

  // =========================================================================
  // 6. Free Course Checkout Without Payment Method (course.isFree === true)
  // =========================================================================
  describe("6. Free Course Checkout Flow (course.isFree === true)", () => {
    it("enrollFreeCourse immediately grants access without requiring payment details", async () => {
      expect(useEnrollmentStore.getState().isCourseEnrolled(freeCourse.id)).toBe(false);

      const invoice = useEnrollmentStore.getState().enrollFreeCourse(freeCourse.id, testStudent, freeCourse);

      expect(invoice.orderId).toContain("FREE-");
      expect(invoice.originalPrice).toBe(0);
      expect(invoice.discountAmount).toBe(0);
      expect(invoice.finalPrice).toBe(0);
      expect(invoice.status).toBe("completed");
      expect(invoice.courseId).toBe(freeCourse.id);

      // Verify immediate entitlement in enrollment store
      expect(useEnrollmentStore.getState().isCourseEnrolled(freeCourse.id)).toBe(true);
      expect(useEnrollmentStore.getState().enrolledCourseIds).toContain(freeCourse.id);

      // Allow async useAuthStore.enrollCourse promise microtask to resolve
      await new Promise((r) => setTimeout(r, 20));
      expect(useAuthStore.getState().isEnrolled(freeCourse.id)).toBe(true);
    });

    it("enrollFreeCourse rejects unauthenticated request (user is null)", () => {
      expect(() => {
        useEnrollmentStore.getState().enrollFreeCourse(freeCourse.id, null as any, freeCourse);
      }).toThrow("يرجى تسجيل الدخول أولاً");
    });

    it("enrollFreeCourse is idempotent: repeated calls do not duplicate enrolledCourseIds", () => {
      useEnrollmentStore.getState().enrollFreeCourse(freeCourse.id, testStudent, freeCourse);
      useEnrollmentStore.getState().enrollFreeCourse(freeCourse.id, testStudent, freeCourse);

      const occurrences = useEnrollmentStore.getState().enrolledCourseIds.filter((id) => id === freeCourse.id).length;
      expect(occurrences).toBe(1);
    });

    it("persists free course enrollment in localStorage under alaref_enrollments", () => {
      useEnrollmentStore.getState().enrollFreeCourse(freeCourse.id, testStudent, freeCourse);

      const raw = localStorage.getItem(LOCAL_STORAGE_ENROLLMENTS_KEY);
      expect(raw).not.toBeNull();
      const ids = JSON.parse(raw!);
      expect(ids).toContain(freeCourse.id);
    });
  });

  // =========================================================================
  // 7. Concurrent Checkout Requests & Race Condition Defense
  // =========================================================================
  describe("7. Concurrent Checkout Requests & State Consistency", () => {
    it("handles concurrent checkout requests on the same course without duplicate enrollments", async () => {
      const payload: CheckoutPayload = {
        courseId: testCourse.id,
        paymentMethod: "fawry",
      };

      // Launch 3 concurrent checkout requests simultaneously
      const results = await Promise.allSettled([
        useEnrollmentStore.getState().processCheckout(testCourse, testStudent, payload),
        useEnrollmentStore.getState().processCheckout(testCourse, testStudent, payload),
        useEnrollmentStore.getState().processCheckout(testCourse, testStudent, payload),
      ]);

      // At least one must succeed
      const fulfilled = results.filter((r) => r.status === "fulfilled");
      expect(fulfilled.length).toBeGreaterThanOrEqual(1);

      // Enrolled course IDs must contain course ID exactly once (NO duplicates)
      const occurrences = useEnrollmentStore.getState().enrolledCourseIds.filter((id) => id === testCourse.id).length;
      expect(occurrences).toBe(1);
      expect(useEnrollmentStore.getState().isCourseEnrolled(testCourse.id)).toBe(true);
    });

    it("rejects subsequent checkout attempt once course is already enrolled", async () => {
      // First checkout succeeds
      await useEnrollmentStore.getState().processCheckout(testCourse, testStudent, {
        courseId: testCourse.id,
        paymentMethod: "fawry",
      });

      // Second checkout must be strictly rejected
      await expect(
        useEnrollmentStore.getState().processCheckout(testCourse, testStudent, {
          courseId: testCourse.id,
          paymentMethod: "vodafone_cash",
          phoneNumber: "01012345678",
        })
      ).rejects.toThrow("مشترك بالفعل");
    });
  });

  // =========================================================================
  // 8. Payment Gateway Validation Boundaries
  // =========================================================================
  describe("8. Payment Gateway Validation Boundaries", () => {
    it("Vodafone Cash: accepts valid Egyptian electronic wallet numbers (010, 011, 012, 015)", async () => {
      const validNumbers = [
        "01012345678",
        "01123456789",
        "01234567890",
        "01545678901",
      ];

      for (let i = 0; i < validNumbers.length; i++) {
        const dummyCourse: CourseItem = {
          ...testCourse,
          id: `vf-course-${i}`,
          title: `كورس فودافون ${i}`,
        };

        const invoice = await useEnrollmentStore.getState().processCheckout(
          dummyCourse,
          testStudent,
          {
            courseId: dummyCourse.id,
            paymentMethod: "vodafone_cash",
            phoneNumber: validNumbers[i],
          }
        );

        expect(invoice.paymentMethod).toBe("vodafone_cash");
        expect(invoice.studentPhone).toBe(validNumbers[i]);
      }
    });

    it("Vodafone Cash: rejects invalid phone numbers (wrong prefix, wrong length, non-digits)", async () => {
      const store = useEnrollmentStore.getState();
      const invalidPhones = [
        "01312345678", // Invalid prefix 013
        "0101234567",  // 10 digits (too short)
        "010123456789", // 12 digits (too long)
        "0201012345678", // Country code prefix
        "0101234ABCD", // Alphanumeric
        "",
      ];

      for (const phone of invalidPhones) {
        await expect(
          store.processCheckout(testCourse, testStudent, {
            courseId: testCourse.id,
            paymentMethod: "vodafone_cash",
            phoneNumber: phone,
          })
        ).rejects.toThrow("رقم محفظة إلكترونية صحيح");
      }
    });

    it("Credit Card: validates card length, expiry MM/YY format, and CVV", async () => {
      const store = useEnrollmentStore.getState();

      // Short card number
      await expect(
        store.processCheckout(testCourse, testStudent, {
          courseId: testCourse.id,
          paymentMethod: "credit_card",
          cardNumber: "1234 5678 9012", // 12 digits
          expiryDate: "12/28",
          cvv: "123",
        })
      ).rejects.toThrow("رقم البطاقة الائتمانية غير صحيح");

      // Invalid expiry format (e.g. month 13)
      await expect(
        store.processCheckout(testCourse, testStudent, {
          courseId: testCourse.id,
          paymentMethod: "credit_card",
          cardNumber: "4111 1111 1111 1111",
          expiryDate: "13/28",
          cvv: "123",
        })
      ).rejects.toThrow("تاريخ انتهاء البطاقة غير صحيح");

      // Invalid CVV (e.g. 2 digits)
      await expect(
        store.processCheckout(testCourse, testStudent, {
          courseId: testCourse.id,
          paymentMethod: "credit_card",
          cardNumber: "4111 1111 1111 1111",
          expiryDate: "12/28",
          cvv: "12",
        })
      ).rejects.toThrow("رمز الأمان CVV غير صحيح");
    });
  });

  // =========================================================================
  // 9. LocalStorage Corruption Resilience
  // =========================================================================
  describe("9. LocalStorage Corruption Resilience", () => {
    it("handles corrupted JSON in localStorage gracefully without throwing", () => {
      // Set malformed JSON strings in localStorage
      localStorage.setItem(LOCAL_STORAGE_ENROLLMENTS_KEY, "{corrupted: invalid json");
      localStorage.setItem(LOCAL_STORAGE_PURCHASE_HISTORY_KEY, "[incomplete array");

      // Invoking store methods should not throw syntax errors
      expect(() => {
        useEnrollmentStore.getState().isCourseEnrolled("any-course");
      }).not.toThrow();

      expect(() => {
        useEnrollmentStore.getState().resetEnrollments();
      }).not.toThrow();

      expect(useEnrollmentStore.getState().enrolledCourseIds).toEqual([]);
      expect(useEnrollmentStore.getState().purchaseHistory).toEqual([]);
    });
  });

  // =========================================================================
  // 10. UI Components & Input Form Adversarial Stress
  // =========================================================================
  describe("10. UI Components & Input Form Adversarial Stress", () => {
    it("CouponInput: shows validation error when empty form is submitted", () => {
      const { container, unmount } = mountToDom(
        React.createElement(CouponInput, {
          originalPrice: 300,
          appliedCoupon: null,
          totals: { originalPrice: 300, discountAmount: 0, finalPrice: 300 },
        })
      );

      const form = container.querySelector("form");
      act(() => {
        form?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      });

      expect(container.textContent).toContain("يرجى إدخال كود الخصم");
      unmount();
    });

    it("CouponInput: displays active coupon badge and allows cancellation via removeCoupon", () => {
      const mockApplied = mockCoupons[0]; // AREF2026
      useEnrollmentStore.setState({ appliedCoupon: mockApplied });

      const { container, unmount } = mountToDom(
        React.createElement(CouponInput, {
          originalPrice: 300,
          appliedCoupon: mockApplied,
          totals: { originalPrice: 300, discountAmount: 60, finalPrice: 240 },
        })
      );

      expect(container.textContent).toContain("AREF2026");
      expect(container.textContent).toContain("20% خصم");
      expect(container.textContent).toContain("وفرت 60 ج.م");

      // Click remove button
      const removeBtn = container.querySelector("button[title='إلغاء تطبيق الكوبون']");
      expect(removeBtn).not.toBeNull();

      act(() => {
        removeBtn?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      });

      expect(useEnrollmentStore.getState().appliedCoupon).toBeNull();
      unmount();
    });

    it("PaymentMethodTabs: credit card inputs format grouping and expiry MM/YY", () => {
      let updatedPayload: Partial<CheckoutPayload> = {};
      const { container, unmount } = mountToDom(
        React.createElement(PaymentMethodTabs, {
          selectedMethod: "credit_card",
          onSelectMethod: () => {},
          payload: {},
          onChangePayload: (updates) => {
            updatedPayload = { ...updatedPayload, ...updates };
          },
          finalPrice: 300,
        })
      );

      const inputs = container.querySelectorAll("input");
      expect(inputs.length).toBeGreaterThanOrEqual(3);

      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      )?.set;

      // Card number input is first
      const cardInput = inputs[0] as HTMLInputElement;
      act(() => {
        nativeSetter?.call(cardInput, "1234567812345678");
        cardInput.dispatchEvent(new Event("input", { bubbles: true }));
        cardInput.dispatchEvent(new Event("change", { bubbles: true }));
      });
      expect(updatedPayload.cardNumber).toBe("1234 5678 1234 5678");

      // Card holder name input is second
      const holderInput = inputs[1] as HTMLInputElement;
      act(() => {
        nativeSetter?.call(holderInput, "طارق الدسوقي");
        holderInput.dispatchEvent(new Event("input", { bubbles: true }));
        holderInput.dispatchEvent(new Event("change", { bubbles: true }));
      });
      expect(updatedPayload.cardHolder).toBe("طارق الدسوقي");

      // Expiry input is third
      const expiryInput = inputs[2] as HTMLInputElement;
      act(() => {
        nativeSetter?.call(expiryInput, "1228");
        expiryInput.dispatchEvent(new Event("input", { bubbles: true }));
        expiryInput.dispatchEvent(new Event("change", { bubbles: true }));
      });
      expect(updatedPayload.expiryDate).toBe("12/28");

      unmount();
    });

    it("OrderSummaryCard: renders discount row with minus sign when coupon is active", () => {
      const { container, unmount } = mountToDom(
        React.createElement(OrderSummaryCard, {
          course: testCourse,
          appliedCoupon: mockCoupons[0],
          totals: { originalPrice: 300, discountAmount: 60, finalPrice: 240 },
        })
      );

      expect(container.textContent).toContain("سعر الكورس الأصلي");
      expect(container.textContent).toContain("300");
      expect(container.textContent).toContain("- 60");
      expect(container.textContent).toContain("240");
      expect(container.textContent).toContain("ج.م");
      expect(container.textContent).toContain("AREF2026");
      unmount();
    });
  });
});
