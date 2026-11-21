import { create } from "zustand";
import { 
  PaymentMethodType, 
  CouponCode, 
  OrderInvoice, 
  CheckoutPayload, 
  CouponValidationResult, 
  PriceTotals 
} from "../types/payment";
import { CourseItem } from "../data/mockData";
import { User } from "../types/auth";
import { findCouponByCode, isValidCenterVoucher } from "../data/mockCoupons";
import { useAuthStore } from "./useAuthStore";

export const LOCAL_STORAGE_ENROLLMENTS_KEY = "alaref_enrollments";
export const LOCAL_STORAGE_PURCHASE_HISTORY_KEY = "alaref_purchase_history";

export interface EnrollmentStoreState {
  enrolledCourseIds: string[];
  appliedCoupon: CouponCode | null;
  purchaseHistory: OrderInvoice[];
  isProcessing: boolean;
  checkoutError: string | null;

  // Actions
  applyCoupon: (code: string, originalPrice: number) => CouponValidationResult;
  removeCoupon: () => void;
  calculateTotals: (originalPrice: number) => PriceTotals;
  processCheckout: (
    course: CourseItem,
    user: User,
    payload: CheckoutPayload
  ) => Promise<OrderInvoice>;
  isCourseEnrolled: (courseId: string) => boolean;
  enrollFreeCourse: (courseId: string, user: User, course?: CourseItem) => OrderInvoice;
  getOrder: (orderId: string) => OrderInvoice | undefined;
  clearError: () => void;
  resetEnrollments: () => void;
}

// Safely retrieve stored enrolled course IDs
const loadInitialEnrollments = (): string[] => {
  if (typeof window === "undefined" || !window.localStorage) {
    return [];
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ENROLLMENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to load initial enrollments:", err);
    return [];
  }
};

// Safely retrieve stored purchase history
const loadInitialPurchases = (): OrderInvoice[] => {
  if (typeof window === "undefined" || !window.localStorage) {
    return [];
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PURCHASE_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to load initial purchase history:", err);
    return [];
  }
};

const saveEnrollmentsToStorage = (enrolledIds: string[]) => {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    localStorage.setItem(LOCAL_STORAGE_ENROLLMENTS_KEY, JSON.stringify(enrolledIds));
  } catch (err) {
    console.error("Failed to save enrollments:", err);
  }
};

const savePurchasesToStorage = (history: OrderInvoice[]) => {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    localStorage.setItem(LOCAL_STORAGE_PURCHASE_HISTORY_KEY, JSON.stringify(history));
  } catch (err) {
    console.error("Failed to save purchase history:", err);
  }
};

export const useEnrollmentStore = create<EnrollmentStoreState>((set, get) => ({
  enrolledCourseIds: loadInitialEnrollments(),
  appliedCoupon: null,
  purchaseHistory: loadInitialPurchases(),
  isProcessing: false,
  checkoutError: null,

  applyCoupon: (code: string, originalPrice: number): CouponValidationResult => {
    const normalized = (code || "").trim().toUpperCase();
    if (!normalized) {
      return {
        success: false,
        message: "يرجى إدخال كود الخصم أولاً",
        discountAmount: 0,
      };
    }

    const coupon = findCouponByCode(normalized);
    if (!coupon) {
      return {
        success: false,
        message: "كود الخصم غير صحيح أو غير متاح حالياً",
        discountAmount: 0,
      };
    }

    // Check expiration
    if (new Date(coupon.expiryDate).getTime() < Date.now()) {
      return {
        success: false,
        message: "عفواً، لقد انتهت صلاحية هذا الكود",
        discountAmount: 0,
      };
    }

    // Check minimum order value if defined
    if (coupon.minOrderValue && originalPrice < coupon.minOrderValue) {
      return {
        success: false,
        message: `يتطلب هذا الكود قيمة طلب لا تقل عن ${coupon.minOrderValue} ج.م`,
        discountAmount: 0,
      };
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = Math.round((originalPrice * coupon.discountValue) / 100);
    } else {
      discountAmount = coupon.discountValue;
    }
    discountAmount = Math.min(originalPrice, Math.max(0, discountAmount));

    set({ appliedCoupon: coupon, checkoutError: null });

    return {
      success: true,
      message: `تم تطبيق الخصم بنجاح: ${coupon.description}`,
      discountAmount,
      coupon,
    };
  },

  removeCoupon: () => {
    set({ appliedCoupon: null, checkoutError: null });
  },

  calculateTotals: (originalPrice: number): PriceTotals => {
    const { appliedCoupon } = get();
    const safePrice = Math.max(0, originalPrice);

    if (!appliedCoupon) {
      return {
        originalPrice: safePrice,
        discountAmount: 0,
        finalPrice: safePrice,
      };
    }

    let discountAmount = 0;
    if (appliedCoupon.discountType === "percentage") {
      discountAmount = Math.round((safePrice * appliedCoupon.discountValue) / 100);
    } else {
      discountAmount = appliedCoupon.discountValue;
    }

    discountAmount = Math.min(safePrice, Math.max(0, discountAmount));
    const finalPrice = Math.max(0, safePrice - discountAmount);

    return {
      originalPrice: safePrice,
      discountAmount,
      finalPrice,
    };
  },

  isCourseEnrolled: (courseId: string): boolean => {
    if (!courseId) return false;

    // 1. Check local enrollment store
    const inStore = get().enrolledCourseIds.includes(courseId);
    if (inStore) return true;

    // 2. Cross-reference with useAuthStore
    try {
      const authUser = useAuthStore.getState().user;
      if (authUser && Array.isArray(authUser.enrolledCourseIds)) {
        if (authUser.enrolledCourseIds.includes(courseId)) {
          return true;
        }
      }
    } catch {
      // Ignore cross-store errors in isolated mock contexts
    }

    return false;
  },

  processCheckout: async (
    course: CourseItem,
    user: User,
    payload: CheckoutPayload
  ): Promise<OrderInvoice> => {
    set({ isProcessing: true, checkoutError: null });

    try {
      if (!user) {
        throw new Error("يرجى تسجيل الدخول أولاً لإتمام عملية الاشتراك");
      }

      if (!course) {
        throw new Error("بيانات الكورس غير متوفرة");
      }

      if (get().isCourseEnrolled(course.id)) {
        throw new Error("أنت مشترك بالفعل في هذا الكورس ومفعل على حسابك");
      }

      const { originalPrice, discountAmount, finalPrice } = get().calculateTotals(course.price);

      let txRef = payload.transactionRef?.trim();

      // Validate payment methods
      switch (payload.paymentMethod) {
        case "vodafone_cash": {
          const phone = (payload.phoneNumber || "").trim();
          const egPhoneRegex = /^01[0125][0-9]{8}$/;
          if (!egPhoneRegex.test(phone)) {
            throw new Error(
              "يرجى إدخال رقم محفظة إلكترونية صحيح (11 رقم يبدأ بـ 010 أو 011 أو 012 أو 015)"
            );
          }
          if (!txRef) {
            txRef = `VF-${Date.now().toString().slice(-8)}`;
          }
          break;
        }

        case "fawry": {
          if (!txRef) {
            const randPartA = Math.floor(1000 + Math.random() * 9000);
            const randPartB = Math.floor(1000 + Math.random() * 9000);
            txRef = `FAWRY-${randPartA}-${randPartB}`;
          }
          break;
        }

        case "credit_card": {
          const rawCardNumber = (payload.cardNumber || "").replace(/\s+/g, "");
          if (rawCardNumber.length < 15 || rawCardNumber.length > 19) {
            throw new Error("رقم البطاقة الائتمانية غير صحيح (يجب أن يتكون من 16 رقماً)");
          }

          if (payload.expiryDate && !/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(payload.expiryDate.trim())) {
            throw new Error("تاريخ انتهاء البطاقة غير صحيح (الصيغة المطلوبة: MM/YY)");
          }

          if (payload.cvv && !/^[0-9]{3,4}$/.test(payload.cvv.trim())) {
            throw new Error("رمز الأمان CVV غير صحيح (3 أو 4 أرقام)");
          }

          if (!txRef) {
            txRef = `CC-AUTH-${Date.now().toString().slice(-6)}`;
          }
          break;
        }

        case "voucher": {
          const voucherCode = (payload.voucherCode || "").trim().toUpperCase();
          if (!voucherCode) {
            throw new Error("يرجى إدخال كود كارت شحن السنتر");
          }

          const isKnownVoucher = isValidCenterVoucher(voucherCode);
          const isCouponVoucher = findCouponByCode(voucherCode)?.code === voucherCode;
          const isVoucherPattern = /^AREF-[A-Z0-9]{4,10}/.test(voucherCode);

          if (!isKnownVoucher && !isCouponVoucher && !isVoucherPattern) {
            throw new Error("كود كارت السنتر غير صحيح أو غير مفعل. تأكد من إدخال الكود المطبوع على الكارت");
          }

          txRef = `VOUCHER-${voucherCode}`;
          break;
        }

        default:
          throw new Error("طريقة الدفع المحددة غير مدعومة");
      }

      // Generate invoice
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const newInvoice: OrderInvoice = {
        orderId,
        studentId: user.id,
        studentName: user.fullName || "طالب الأكاديمية",
        studentPhone: payload.phoneNumber || user.studentPhone || "01097303002",
        courseId: course.id,
        courseTitle: course.title,
        gradeName: course.gradeName || "المرحلة التعليمية",
        originalPrice,
        discountAmount,
        finalPrice,
        paymentMethod: payload.paymentMethod,
        transactionReference: txRef,
        createdAt: new Date().toISOString(),
        status: "completed",
      };

      // Immediate access entitlement:
      // 1. Update enrolledCourseIds in state
      const currentEnrolled = get().enrolledCourseIds;
      const updatedEnrolled = currentEnrolled.includes(course.id)
        ? currentEnrolled
        : [...currentEnrolled, course.id];

      // 2. Update purchaseHistory
      const updatedHistory = [newInvoice, ...get().purchaseHistory];

      // 3. Persist to storage
      saveEnrollmentsToStorage(updatedEnrolled);
      savePurchasesToStorage(updatedHistory);

      // 4. Update Zustand state
      set({
        enrolledCourseIds: updatedEnrolled,
        purchaseHistory: updatedHistory,
        appliedCoupon: null, // Clear coupon after use
        isProcessing: false,
        checkoutError: null,
      });

      // 5. Sync with useAuthStore
      try {
        useAuthStore.getState().enrollCourse(course.id);
      } catch (err) {
        console.warn("Failed to sync enrollment with useAuthStore:", err);
      }

      return newInvoice;
    } catch (err) {
      const message = err instanceof Error ? err.message : "حدث خطأ أثناء معالجة عملية الدفع";
      set({ isProcessing: false, checkoutError: message });
      throw err;
    }
  },

  enrollFreeCourse: (courseId: string, user: User, course?: CourseItem): OrderInvoice => {
    if (!user) {
      throw new Error("يرجى تسجيل الدخول أولاً لتفعيل الكورس المجاني");
    }

    const orderId = `FREE-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const invoice: OrderInvoice = {
      orderId,
      studentId: user.id,
      studentName: user.fullName || "طالب الأكاديمية",
      studentPhone: user.studentPhone || "01097303002",
      courseId,
      courseTitle: course?.title || `كورس مجاني (${courseId})`,
      gradeName: course?.gradeName || user.gradeName || "المرحلة التعليمية",
      originalPrice: 0,
      discountAmount: 0,
      finalPrice: 0,
      paymentMethod: "voucher",
      transactionReference: `FREE-GRANT-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      status: "completed",
    };

    const currentEnrolled = get().enrolledCourseIds;
    const updatedEnrolled = currentEnrolled.includes(courseId)
      ? currentEnrolled
      : [...currentEnrolled, courseId];

    const updatedHistory = [invoice, ...get().purchaseHistory];

    saveEnrollmentsToStorage(updatedEnrolled);
    savePurchasesToStorage(updatedHistory);

    set({
      enrolledCourseIds: updatedEnrolled,
      purchaseHistory: updatedHistory,
      checkoutError: null,
    });

    try {
      useAuthStore.getState().enrollCourse(courseId);
    } catch (err) {
      console.warn("Failed to sync free course enrollment with useAuthStore:", err);
    }

    return invoice;
  },

  getOrder: (orderId: string): OrderInvoice | undefined => {
    return get().purchaseHistory.find((order) => order.orderId === orderId);
  },

  clearError: () => {
    set({ checkoutError: null });
  },

  resetEnrollments: () => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem(LOCAL_STORAGE_ENROLLMENTS_KEY);
      localStorage.removeItem(LOCAL_STORAGE_PURCHASE_HISTORY_KEY);
    }
    set({
      enrolledCourseIds: [],
      purchaseHistory: [],
      appliedCoupon: null,
      isProcessing: false,
      checkoutError: null,
    });
  },
}));
