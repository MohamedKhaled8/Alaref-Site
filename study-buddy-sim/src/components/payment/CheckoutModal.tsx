import React, { useState } from "react";
import { 
  X, 
  Lock, 
  ShieldCheck, 
  Loader2, 
  AlertCircle, 
  ChevronLeft 
} from "lucide-react";
import { CourseItem } from "../../data/mockData";
import { User } from "../../types/auth";
import { 
  PaymentMethodType, 
  CheckoutPayload, 
  OrderInvoice 
} from "../../types/payment";
import { useEnrollmentStore } from "../../stores/useEnrollmentStore";
import { OrderSummaryCard } from "./OrderSummaryCard";
import { CouponInput } from "./CouponInput";
import { PaymentMethodTabs } from "./PaymentMethodTabs";

export interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: CourseItem | null;
  user: User | null;
  onSuccess: (invoice: OrderInvoice) => void;
  onRequireAuth?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  course,
  user,
  onSuccess,
  onRequireAuth,
}) => {
  const {
    appliedCoupon,
    calculateTotals,
    processCheckout,
    isProcessing,
    checkoutError,
    clearError,
  } = useEnrollmentStore();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("vodafone_cash");
  const [payload, setPayload] = useState<Partial<CheckoutPayload>>({
    phoneNumber: user?.studentPhone || "",
    cardHolder: user?.fullName || "",
  });
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isOpen || !course) return null;

  const totals = calculateTotals(course.price);

  const handleUpdatePayload = (updates: Partial<CheckoutPayload>) => {
    setPayload((prev) => ({ ...prev, ...updates }));
    if (localError) setLocalError(null);
    clearError();
  };

  const handleConfirmCheckout = async () => {
    setLocalError(null);
    clearError();

    if (!user) {
      if (onRequireAuth) {
        onClose();
        onRequireAuth();
      } else {
        setLocalError("يرجى تسجيل الدخول أولاً لإتمام عملية الاشتراك.");
      }
      return;
    }

    try {
      const checkoutData: CheckoutPayload = {
        courseId: course.id,
        paymentMethod,
        phoneNumber: payload.phoneNumber || user.studentPhone,
        transactionRef: payload.transactionRef,
        cardNumber: payload.cardNumber,
        cardHolder: payload.cardHolder,
        expiryDate: payload.expiryDate,
        cvv: payload.cvv,
        voucherCode: payload.voucherCode,
      };

      const invoice = await processCheckout(course, user, checkoutData);
      onSuccess(invoice);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "تعذر إتمام عملية الدفع. يرجى المحاولة مرة أخرى.";
      setLocalError(msg);
    }
  };

  const displayError = localError || checkoutError;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200 select-none font-almarai">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-24 bg-white dark:bg-[#11131c] border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden text-right my-auto">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5">
          <div className="flex items-center gap-2 text-xs font-black text-gray-900 dark:text-white">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>بوابة الدفع الآمن • منصة مستر عمرو عارف التعليمية</span>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-full bg-gray-200/60 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-600 dark:text-white/70 transition-all cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* 1. Course Order Summary Card */}
          <OrderSummaryCard
            course={course}
            appliedCoupon={appliedCoupon}
            totals={totals}
          />

          {/* 2. Coupon Input Section */}
          <CouponInput
            originalPrice={course.price}
            appliedCoupon={appliedCoupon}
            totals={totals}
          />

          {/* 3. Payment Method Tabs & Inputs */}
          <PaymentMethodTabs
            selectedMethod={paymentMethod}
            onSelectMethod={setPaymentMethod}
            payload={payload}
            onChangePayload={handleUpdatePayload}
            finalPrice={totals.finalPrice}
          />

          {/* Error Alert Display */}
          {displayError && (
            <div className="p-3.5 rounded-14 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{displayError}</span>
            </div>
          )}

        </div>

        {/* Footer Bar with Confirm Button */}
        <div className="p-4 sm:p-5 border-t border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-[#14151e] flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-white/60">
            <Lock className="w-4 h-4 text-emerald-500" />
            <span>معاملة مشفرة وآمنة • ضمان التفعيل المباشر</span>
          </div>

          <button
            type="button"
            onClick={handleConfirmCheckout}
            disabled={isProcessing}
            className="w-full sm:w-auto px-6 py-3 rounded-14 bg-gradient-to-r from-[#753b47] to-[#8d4756] hover:from-[#854351] hover:to-[#9c4f60] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#753b47]/25 transition-all cursor-pointer active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري معالجة الاشتراك...</span>
              </>
            ) : (
              <>
                <span>تأكيد الدفع والاشتراك الفوري ({totals.finalPrice} ج.م)</span>
                <ChevronLeft className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
