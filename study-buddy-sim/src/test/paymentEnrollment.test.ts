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
import { useAssignmentStore, DISALLOWED_EXTENSIONS } from "../stores/useAssignmentStore";
import { mockCoupons, findCouponByCode, isValidCenterVoucher } from "../data/mockCoupons";
import { CourseItem } from "../data/mockData";
import { User } from "../types/auth";
import { OrderInvoice } from "../types/payment";
import { OrderSummaryCard } from "../components/payment/OrderSummaryCard";
import { CouponInput } from "../components/payment/CouponInput";
import { PaymentMethodTabs } from "../components/payment/PaymentMethodTabs";
import { PaymentSuccessModal } from "../components/payment/PaymentSuccessModal";
import { PurchaseHistoryModal } from "../components/payment/PurchaseHistoryModal";
import { SummaryDownloadButton } from "../components/summaries/SummaryDownloadButton";

// Helper to mount React components into fresh DOM container
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

// Sample test course
const mockTestCourse: CourseItem = {
  id: "course-prep-3-curriculum",
  slug: "prep-3-arabic",
  title: "كورس اللغة العربية الشامل - الصف الثالث الإعدادي",
  gradeId: "prep-3",
  gradeName: "الصف الثالث الإعدادي",
  archetype: "curriculum",
  archetypeLabel: "المنهج الكامل",
  description: "شرح كامل لجميع فروع اللغة العربية مع مستر عمرو عارف",
  longDescription: "تفاصيل كورس المنهج الكامل لشهادة الإعدادية",
  price: 350,
  originalPrice: 450,
  isFree: false,
  studentCount: 1420,
  lecturesCount: 24,
  durationHours: 36,
  durationText: "36 ساعة تدريبية",
  rating: 4.95,
  reviewsCount: 310,
  isFeatured: true,
  thumbnail: "/assets/banner.png",
  units: [],
  quizCount: 8,
  examRules: {
    questionsCount: 10,
    durationMinutes: 15,
    passScore: 6,
    maxAttempts: 2,
  },
};

const mockFreeCourse: CourseItem = {
  ...mockTestCourse,
  id: "course-free-foundations",
  title: "كورس التأسيس الشامل المجاني",
  price: 0,
  isFree: true,
};

const mockTestUser: User = {
  id: "student-101",
  fullName: "أحمد محمود سالم",
  studentPhone: "01012345678",
  parentPhone: "01098765432",
  gradeId: "prep-3",
  gradeName: "الصف الثالث الإعدادي",
  role: "student",
  deviceId: "device-uuid-test-99",
  enrolledCourseIds: [],
  createdAt: "2026-11-01T10:00:00Z",
};

describe("Milestone 4: Payment, Checkout & Immediate Access Entitlement (R4, F23-F27)", () => {
  beforeEach(() => {
    localStorage.clear();
    useEnrollmentStore.getState().resetEnrollments();
    useAuthStore.setState({
      user: { ...mockTestUser, enrolledCourseIds: [] },
      isAuthenticated: true,
      token: "test-token",
    });
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // =========================================================================
  // 1. Coupon Validation & Discount Engine (F23)
  // =========================================================================
  describe("1. Coupon Engine & Discount Calculation (F23)", () => {
    it("applies AREF2026 as a 20% discount on original price", () => {
      const store = useEnrollmentStore.getState();
      const res = store.applyCoupon("AREF2026", 350);

      expect(res.success).toBe(true);
      expect(res.discountAmount).toBe(70); // 20% of 350 = 70
      expect(res.coupon?.code).toBe("AREF2026");

      const totals = useEnrollmentStore.getState().calculateTotals(350);
      expect(totals.originalPrice).toBe(350);
      expect(totals.discountAmount).toBe(70);
      expect(totals.finalPrice).toBe(280);
    });

    it("applies AWAL50 as a fixed 50 LE discount when order meets minimum value", () => {
      const store = useEnrollmentStore.getState();
      const res = store.applyCoupon("AWAL50", 200);

      expect(res.success).toBe(true);
      expect(res.discountAmount).toBe(50);

      const totals = useEnrollmentStore.getState().calculateTotals(200);
      expect(totals.originalPrice).toBe(200);
      expect(totals.discountAmount).toBe(50);
      expect(totals.finalPrice).toBe(150);
    });

    it("rejects AWAL50 when course price is below minOrderValue (100 LE)", () => {
      const store = useEnrollmentStore.getState();
      const res = store.applyCoupon("AWAL50", 80);

      expect(res.success).toBe(false);
      expect(res.discountAmount).toBe(0);
      expect(res.message).toContain("100 ج.م");
      expect(useEnrollmentStore.getState().appliedCoupon).toBeNull();
    });

    it("applies FREEPASS as 100% full scholarship discount (final price = 0 LE)", () => {
      const store = useEnrollmentStore.getState();
      const res = store.applyCoupon("FREEPASS", 350);

      expect(res.success).toBe(true);
      expect(res.discountAmount).toBe(350);

      const totals = useEnrollmentStore.getState().calculateTotals(350);
      expect(totals.finalPrice).toBe(0);
      expect(totals.discountAmount).toBe(350);
    });

    it("applies AREF-2026-GOLD center voucher coupon code", () => {
      const store = useEnrollmentStore.getState();
      const res = store.applyCoupon("AREF-2026-GOLD", 350);

      expect(res.success).toBe(true);
      expect(res.discountAmount).toBe(350);
      expect(res.coupon?.description).toContain("السنتر الذهبي");

      const totals = useEnrollmentStore.getState().calculateTotals(350);
      expect(totals.finalPrice).toBe(0);
    });

    it("normalizes coupon codes (trims whitespace and ignores case)", () => {
      const store = useEnrollmentStore.getState();
      const res = store.applyCoupon("  aref2026  ", 300);

      expect(res.success).toBe(true);
      expect(res.coupon?.code).toBe("AREF2026");
      expect(res.discountAmount).toBe(60);
    });

    it("rejects unknown or invalid coupon codes", () => {
      const store = useEnrollmentStore.getState();
      const res = store.applyCoupon("FAKECODE99", 350);

      expect(res.success).toBe(false);
      expect(res.discountAmount).toBe(0);
      expect(res.message).toContain("غير صحيح");
    });

    it("rejects expired coupon codes", () => {
      const store = useEnrollmentStore.getState();
      const res = store.applyCoupon("EXPIRED2020", 350);

      expect(res.success).toBe(false);
      expect(res.discountAmount).toBe(0);
      expect(res.message).toContain("انتهت صلاحية");
    });

    it("rejects empty coupon submission", () => {
      const store = useEnrollmentStore.getState();
      const res = store.applyCoupon("", 350);

      expect(res.success).toBe(false);
      expect(res.message).toContain("إدخال كود");
    });

    it("removes applied coupon cleanly with removeCoupon()", () => {
      const store = useEnrollmentStore.getState();
      store.applyCoupon("AREF2026", 350);
      expect(useEnrollmentStore.getState().appliedCoupon).not.toBeNull();

      store.removeCoupon();
      expect(useEnrollmentStore.getState().appliedCoupon).toBeNull();
      const totals = store.calculateTotals(350);
      expect(totals.discountAmount).toBe(0);
      expect(totals.finalPrice).toBe(350);
    });

    it("caps discount amount at original price if fixed discount exceeds price", () => {
      const store = useEnrollmentStore.getState();
      // Apply AWAL50 (50 LE) on a hypothetical 40 LE price
      useEnrollmentStore.setState({
        appliedCoupon: {
          code: "TESTFIXED100",
          discountType: "fixed",
          discountValue: 100,
          description: "Test",
          expiryDate: "2026-12-31T23:59:59Z",
        },
      });

      const totals = store.calculateTotals(40);
      expect(totals.discountAmount).toBe(40);
      expect(totals.finalPrice).toBe(0);
    });
  });

  // =========================================================================
  // 2. Checkout Processing across Egyptian Payment Gateways (F24)
  // =========================================================================
  describe("2. Egyptian Gateways & Checkout Processing (F24)", () => {
    it("successfully processes Vodafone Cash / E-Wallets checkout", async () => {
      const invoice = await useEnrollmentStore.getState().processCheckout(
        mockTestCourse,
        mockTestUser,
        {
          courseId: mockTestCourse.id,
          paymentMethod: "vodafone_cash",
          phoneNumber: "01097303002",
          transactionRef: "VF-99482103",
        }
      );

      expect(invoice.orderId).toMatch(/^ORD-/);
      expect(invoice.studentId).toBe(mockTestUser.id);
      expect(invoice.courseId).toBe(mockTestCourse.id);
      expect(invoice.paymentMethod).toBe("vodafone_cash");
      expect(invoice.transactionReference).toBe("VF-99482103");
      expect(invoice.originalPrice).toBe(350);
      expect(invoice.finalPrice).toBe(350);
      expect(invoice.status).toBe("completed");
    });

    it("rejects Vodafone Cash checkout with invalid mobile number", async () => {
      await expect(
        useEnrollmentStore.getState().processCheckout(mockTestCourse, mockTestUser, {
          courseId: mockTestCourse.id,
          paymentMethod: "vodafone_cash",
          phoneNumber: "01999999999", // Invalid Egyptian prefix
        })
      ).rejects.toThrow("رقم محفظة إلكترونية صحيح");
    });

    it("successfully processes Fawry Pay checkout and generates transaction ref", async () => {
      const invoice = await useEnrollmentStore.getState().processCheckout(
        mockTestCourse,
        mockTestUser,
        {
          courseId: mockTestCourse.id,
          paymentMethod: "fawry",
        }
      );

      expect(invoice.paymentMethod).toBe("fawry");
      expect(invoice.transactionReference).toMatch(/^FAWRY-\d{4}-\d{4}$/);
      expect(invoice.status).toBe("completed");
    });

    it("successfully processes Credit Card payment", async () => {
      const invoice = await useEnrollmentStore.getState().processCheckout(
        mockTestCourse,
        mockTestUser,
        {
          courseId: mockTestCourse.id,
          paymentMethod: "credit_card",
          cardNumber: "4000 1234 5678 9010",
          cardHolder: "AHMED MAHMOUD",
          expiryDate: "12/28",
          cvv: "123",
        }
      );

      expect(invoice.paymentMethod).toBe("credit_card");
      expect(invoice.transactionReference).toMatch(/^CC-AUTH-/);
      expect(invoice.status).toBe("completed");
    });

    it("rejects Credit Card payment with invalid card number length", async () => {
      await expect(
        useEnrollmentStore.getState().processCheckout(mockTestCourse, mockTestUser, {
          courseId: mockTestCourse.id,
          paymentMethod: "credit_card",
          cardNumber: "1234", // Too short
        })
      ).rejects.toThrow("رقم البطاقة الائتمانية غير صحيح");
    });

    it("rejects Credit Card payment with invalid expiry format", async () => {
      await expect(
        useEnrollmentStore.getState().processCheckout(mockTestCourse, mockTestUser, {
          courseId: mockTestCourse.id,
          paymentMethod: "credit_card",
          cardNumber: "4000123456789010",
          expiryDate: "15/99", // Invalid month 15
        })
      ).rejects.toThrow("تاريخ انتهاء البطاقة غير صحيح");
    });

    it("successfully redeems Academy Center Voucher code", async () => {
      const invoice = await useEnrollmentStore.getState().processCheckout(
        mockTestCourse,
        mockTestUser,
        {
          courseId: mockTestCourse.id,
          paymentMethod: "voucher",
          voucherCode: "AREF-2026-GOLD",
        }
      );

      expect(invoice.paymentMethod).toBe("voucher");
      expect(invoice.transactionReference).toBe("VOUCHER-AREF-2026-GOLD");
      expect(invoice.status).toBe("completed");
    });

    it("rejects Academy Center Voucher with bogus code", async () => {
      await expect(
        useEnrollmentStore.getState().processCheckout(mockTestCourse, mockTestUser, {
          courseId: mockTestCourse.id,
          paymentMethod: "voucher",
          voucherCode: "INVALID-CARD-000",
        })
      ).rejects.toThrow("كود كارت السنتر غير صحيح");
    });

    it("enables instant free course enrollment with enrollFreeCourse()", () => {
      const invoice = useEnrollmentStore.getState().enrollFreeCourse(
        mockFreeCourse.id,
        mockTestUser,
        mockFreeCourse
      );

      expect(invoice.courseId).toBe(mockFreeCourse.id);
      expect(invoice.finalPrice).toBe(0);
      expect(invoice.status).toBe("completed");
      expect(useEnrollmentStore.getState().isCourseEnrolled(mockFreeCourse.id)).toBe(true);
    });
  });

  // =========================================================================
  // 3. Immediate Access Entitlement & Multi-Store Sync (F25)
  // =========================================================================
  describe("3. Immediate Access Entitlement & State Synchronization (F25)", () => {
    it("course is unenrolled initially and immediately becomes enrolled upon checkout", async () => {
      const store = useEnrollmentStore.getState();
      expect(store.isCourseEnrolled(mockTestCourse.id)).toBe(false);

      await store.processCheckout(mockTestCourse, mockTestUser, {
        courseId: mockTestCourse.id,
        paymentMethod: "fawry",
      });

      expect(useEnrollmentStore.getState().isCourseEnrolled(mockTestCourse.id)).toBe(true);
      expect(useEnrollmentStore.getState().enrolledCourseIds).toContain(mockTestCourse.id);
    });

    it("synchronizes enrolled courses immediately with useAuthStore", async () => {
      await useEnrollmentStore.getState().processCheckout(mockTestCourse, mockTestUser, {
        courseId: mockTestCourse.id,
        paymentMethod: "vodafone_cash",
        phoneNumber: "01012345678",
      });

      // Verification in useAuthStore
      const authUser = useAuthStore.getState().user;
      expect(authUser?.enrolledCourseIds).toContain(mockTestCourse.id);
      expect(useAuthStore.getState().isEnrolled(mockTestCourse.id)).toBe(true);
    });

    it("prevents double checkout if user is already enrolled", async () => {
      // First checkout
      await useEnrollmentStore.getState().processCheckout(mockTestCourse, mockTestUser, {
        courseId: mockTestCourse.id,
        paymentMethod: "fawry",
      });

      // Second checkout must be blocked
      await expect(
        useEnrollmentStore.getState().processCheckout(mockTestCourse, mockTestUser, {
          courseId: mockTestCourse.id,
          paymentMethod: "fawry",
        })
      ).rejects.toThrow("مشترك بالفعل");
    });

    it("clears applied coupon from store state after successful checkout", async () => {
      useEnrollmentStore.getState().applyCoupon("AREF2026", 350);
      expect(useEnrollmentStore.getState().appliedCoupon).not.toBeNull();

      await useEnrollmentStore.getState().processCheckout(mockTestCourse, mockTestUser, {
        courseId: mockTestCourse.id,
        paymentMethod: "fawry",
      });

      expect(useEnrollmentStore.getState().appliedCoupon).toBeNull();
    });
  });

  // =========================================================================
  // 4. Persistence & LocalStorage Synchronization (F26)
  // =========================================================================
  describe("4. LocalStorage Persistence (F26)", () => {
    it("persists enrolled courses and purchase invoices into localStorage", async () => {
      await useEnrollmentStore.getState().processCheckout(mockTestCourse, mockTestUser, {
        courseId: mockTestCourse.id,
        paymentMethod: "fawry",
      });

      const storedEnrolledRaw = localStorage.getItem(LOCAL_STORAGE_ENROLLMENTS_KEY);
      expect(storedEnrolledRaw).not.toBeNull();
      const storedEnrolled = JSON.parse(storedEnrolledRaw!);
      expect(storedEnrolled).toContain(mockTestCourse.id);

      const storedHistoryRaw = localStorage.getItem(LOCAL_STORAGE_PURCHASE_HISTORY_KEY);
      expect(storedHistoryRaw).not.toBeNull();
      const storedHistory = JSON.parse(storedHistoryRaw!);
      expect(storedHistory.length).toBe(1);
      expect(storedHistory[0].courseId).toBe(mockTestCourse.id);
    });

    it("resetEnrollments() purges state and localStorage entries", async () => {
      await useEnrollmentStore.getState().processCheckout(mockTestCourse, mockTestUser, {
        courseId: mockTestCourse.id,
        paymentMethod: "fawry",
      });

      expect(useEnrollmentStore.getState().enrolledCourseIds.length).toBe(1);

      useEnrollmentStore.getState().resetEnrollments();

      expect(useEnrollmentStore.getState().enrolledCourseIds.length).toBe(0);
      expect(useEnrollmentStore.getState().purchaseHistory.length).toBe(0);
      expect(localStorage.getItem(LOCAL_STORAGE_ENROLLMENTS_KEY)).toBeNull();
      expect(localStorage.getItem(LOCAL_STORAGE_PURCHASE_HISTORY_KEY)).toBeNull();
    });
  });

  // =========================================================================
  // 5. Purchase History Retrieval & Invoices (F27)
  // =========================================================================
  describe("5. Purchase History & Invoice Audit (F27)", () => {
    it("retrieves invoice by orderId with getOrder()", async () => {
      const invoice = await useEnrollmentStore.getState().processCheckout(
        mockTestCourse,
        mockTestUser,
        {
          courseId: mockTestCourse.id,
          paymentMethod: "fawry",
        }
      );

      const retrieved = useEnrollmentStore.getState().getOrder(invoice.orderId);
      expect(retrieved).toBeDefined();
      expect(retrieved?.orderId).toBe(invoice.orderId);
      expect(retrieved?.courseTitle).toBe(mockTestCourse.title);
      expect(retrieved?.finalPrice).toBe(350);
    });

    it("returns undefined when getOrder() is called with non-existent ID", () => {
      const retrieved = useEnrollmentStore.getState().getOrder("NON_EXISTENT_ID");
      expect(retrieved).toBeUndefined();
    });
  });

  // =========================================================================
  // 6. Component Rendering & UI Integration Verification
  // =========================================================================
  describe("6. UI Component Rendering & Security Hardening", () => {
    it("OrderSummaryCard renders course info, breakdown, and final price", () => {
      const { container, unmount } = mountToDom(
        React.createElement(OrderSummaryCard, {
          course: mockTestCourse,
          appliedCoupon: null,
          totals: { originalPrice: 350, discountAmount: 0, finalPrice: 350 },
        })
      );

      expect(container.textContent).toContain(mockTestCourse.title);
      expect(container.textContent).toContain("350");
      expect(container.textContent).toContain("ج.م");
      unmount();
    });

    it("OrderSummaryCard displays coupon discount line when coupon is active", () => {
      const coupon = mockCoupons[0]; // AREF2026 (20%)
      const { container, unmount } = mountToDom(
        React.createElement(OrderSummaryCard, {
          course: mockTestCourse,
          appliedCoupon: coupon,
          totals: { originalPrice: 350, discountAmount: 70, finalPrice: 280 },
        })
      );

      expect(container.textContent).toContain("AREF2026");
      expect(container.textContent).toContain("70");
      expect(container.textContent).toContain("280");
      unmount();
    });

    it("CouponInput allows inputting code and triggers store applyCoupon", () => {
      const { container, unmount } = mountToDom(
        React.createElement(CouponInput, {
          originalPrice: 350,
          appliedCoupon: null,
          totals: { originalPrice: 350, discountAmount: 0, finalPrice: 350 },
        })
      );

      const input = container.querySelector("input");
      const form = container.querySelector("form");
      expect(input).not.toBeNull();
      expect(form).not.toBeNull();

      act(() => {
        if (input) {
          const nativeSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            "value"
          )?.set;
          nativeSetter?.call(input, "AREF2026");
          input.dispatchEvent(new Event("input", { bubbles: true }));
          input.dispatchEvent(new Event("change", { bubbles: true }));
        }
      });

      act(() => {
        form?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      });

      expect(useEnrollmentStore.getState().appliedCoupon?.code).toBe("AREF2026");
      unmount();
    });

    it("PaymentMethodTabs allows switching between Egyptian payment gateways", () => {
      let selectedMethod = "vodafone_cash";
      const { container, unmount } = mountToDom(
        React.createElement(PaymentMethodTabs, {
          selectedMethod: selectedMethod as any,
          onSelectMethod: (m: any) => {
            selectedMethod = m;
          },
          payload: {},
          onChangePayload: () => {},
          finalPrice: 350,
        })
      );

      expect(container.textContent).toContain("فودافون كاش");
      expect(container.textContent).toContain("فوري باي");
      expect(container.textContent).toContain("بطاقة بنكية");
      expect(container.textContent).toContain("كارت السنتر");
      expect(container.textContent).toContain("01097303002"); // Teacher official wallet number
      unmount();
    });

    it("PaymentSuccessModal renders celebration screen with orderId and learning CTA", () => {
      const dummyInvoice: OrderInvoice = {
        orderId: "ORD-TEST-9988",
        studentId: mockTestUser.id,
        studentName: mockTestUser.fullName,
        studentPhone: mockTestUser.studentPhone,
        courseId: mockTestCourse.id,
        courseTitle: mockTestCourse.title,
        gradeName: mockTestCourse.gradeName,
        originalPrice: 350,
        discountAmount: 70,
        finalPrice: 280,
        paymentMethod: "fawry",
        transactionReference: "FAWRY-7842-9103",
        createdAt: new Date().toISOString(),
        status: "completed",
      };

      let started = false;
      const { container, unmount } = mountToDom(
        React.createElement(PaymentSuccessModal, {
          isOpen: true,
          onClose: () => {},
          invoice: dummyInvoice,
          onStartLearning: () => {
            started = true;
          },
        })
      );

      expect(container.textContent).toContain("تم الاشتراك وتفعيل الكورس بنجاح");
      expect(container.textContent).toContain("ORD-TEST-9988");
      expect(container.textContent).toContain("FAWRY-7842-9103");
      expect(container.textContent).toContain("ابدأ التعلم الآن");

      const ctaBtn = container.querySelector("button.bg-gradient-to-r");
      act(() => {
        ctaBtn?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      });
      expect(started).toBe(true);
      unmount();
    });

    it("PurchaseHistoryModal renders list of past purchases", () => {
      const dummyInvoice: OrderInvoice = {
        orderId: "ORD-HIST-1234",
        studentId: mockTestUser.id,
        studentName: mockTestUser.fullName,
        studentPhone: mockTestUser.studentPhone,
        courseId: mockTestCourse.id,
        courseTitle: mockTestCourse.title,
        gradeName: mockTestCourse.gradeName,
        originalPrice: 350,
        discountAmount: 0,
        finalPrice: 350,
        paymentMethod: "vodafone_cash",
        transactionReference: "VF-12345678",
        createdAt: new Date().toISOString(),
        status: "completed",
      };

      useEnrollmentStore.setState({
        purchaseHistory: [dummyInvoice],
      });

      const { container, unmount } = mountToDom(
        React.createElement(PurchaseHistoryModal, {
          isOpen: true,
          onClose: () => {},
        })
      );

      expect(container.textContent).toContain("سجل المدفوعات والفواتير");
      expect(container.textContent).toContain(mockTestCourse.title);
      expect(container.textContent).toContain("ORD-HIST-1234");
      expect(container.textContent).toContain("350 ج.م");
      unmount();
    });

    it("SummaryDownloadButton hardening: checks useEnrollmentStore access", () => {
      // User is enrolled via useEnrollmentStore
      useEnrollmentStore.setState({
        enrolledCourseIds: [mockTestCourse.id],
      });

      const { container, unmount } = mountToDom(
        React.createElement(SummaryDownloadButton, {
          summaryTitle: "مذكرة نحو",
          pdfUrl: "/test.pdf",
          courseId: mockTestCourse.id,
        })
      );

      // Button should be active (not locked)
      expect(container.textContent).toContain("تحميل المذكرة");
      expect(container.textContent).not.toContain("(مغلق)");
      unmount();
    });

    it("useAssignmentStore hardening: disallows executable files (.exe, .sh, .bat, .cmd, .js, .html)", () => {
      const store = useAssignmentStore.getState();

      for (const ext of DISALLOWED_EXTENSIONS) {
        const res = store.validateFile({
          name: `malicious_file${ext}`,
          size: 1024,
        });

        expect(res.valid).toBe(false);
        expect(res.error).toContain("غير مسموح برفع ملفات تنفيذية");
      }

      // Valid PDF should still pass
      const validRes = store.validateFile({
        name: "student_homework.pdf",
        size: 1024,
      });
      expect(validRes.valid).toBe(true);
    });
  });
});
