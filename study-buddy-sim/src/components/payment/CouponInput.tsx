import React, { useState } from "react";
import { Tag, Check, X, AlertCircle } from "lucide-react";
import { CouponCode, PriceTotals } from "../../types/payment";
import { useEnrollmentStore } from "../../stores/useEnrollmentStore";

export interface CouponInputProps {
  originalPrice: number;
  appliedCoupon: CouponCode | null;
  totals: PriceTotals;
}

export const CouponInput: React.FC<CouponInputProps> = ({
  originalPrice,
  appliedCoupon,
  totals,
}) => {
  const [couponCode, setCouponCode] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { applyCoupon, removeCoupon } = useEnrollmentStore();

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!couponCode.trim()) {
      setErrorMsg("يرجى إدخال كود الخصم");
      return;
    }

    const res = applyCoupon(couponCode, originalPrice);
    if (res.success) {
      setSuccessMsg(res.message);
      setErrorMsg(null);
      setCouponCode("");
    } else {
      setErrorMsg(res.message);
      setSuccessMsg(null);
    }
  };

  const handleRemove = () => {
    removeCoupon();
    setSuccessMsg(null);
    setErrorMsg(null);
  };

  return (
    <div className="rounded-16 bg-gray-50 dark:bg-[#14151e] border border-gray-200 dark:border-white/10 p-3.5 sm:p-4 text-right font-almarai space-y-2.5">
      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-white">
        <Tag className="w-3.5 h-3.5 text-[#753b47] dark:text-[#fe6257]" />
        <span>هل لديك كود خصم أو منحة تفوق؟</span>
      </div>

      {/* Applied Coupon Active State */}
      {appliedCoupon ? (
        <div className="flex items-center justify-between p-2.5 rounded-12 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] shrink-0">
              <Check className="w-3 h-3" />
            </span>
            <div>
              <div className="font-black font-mono">
                {appliedCoupon.code}
                <span className="mr-2 text-[11px] font-almarai font-normal">
                  ({appliedCoupon.discountType === "percentage" ? `${appliedCoupon.discountValue}%` : `${appliedCoupon.discountValue} ج.م`} خصم)
                </span>
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-300">
                وفرت {totals.discountAmount} ج.م • {appliedCoupon.description}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="px-2 py-1 rounded-8 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer"
            title="إلغاء تطبيق الكوبون"
          >
            <X className="w-3 h-3" />
            <span>إلغاء</span>
          </button>
        </div>
      ) : (
        /* Coupon Input Form */
        <form onSubmit={handleApply} className="flex gap-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => {
              setCouponCode(e.target.value.toUpperCase());
              if (errorMsg) setErrorMsg(null);
            }}
            placeholder="مثال: AREF2026 أو AWAL50"
            className="flex-1 px-3 py-2 rounded-12 bg-white dark:bg-[#1a1c26] border border-gray-200 dark:border-white/10 text-xs font-mono font-bold text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#753b47] dark:focus:border-[#fe6257] transition-all"
            dir="ltr"
          />

          <button
            type="submit"
            className="px-4 py-2 rounded-12 bg-[#753b47] hover:bg-[#854351] text-white text-xs font-black shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-98"
          >
            تطبيق الكوبون
          </button>
        </form>
      )}

      {/* Success / Error Notifications */}
      {errorMsg && (
        <div className="flex items-center gap-1.5 text-[11px] text-rose-600 dark:text-rose-400 font-bold">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && !appliedCoupon && (
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
          <Check className="w-3.5 h-3.5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
    </div>
  );
};
