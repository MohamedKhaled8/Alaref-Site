import React from "react";
import { BookOpen, CheckCircle, Tag } from "lucide-react";
import { CourseItem, teacherProfile } from "../../data/mockData";
import { CouponCode, PriceTotals } from "../../types/payment";

export interface OrderSummaryCardProps {
  course: CourseItem;
  appliedCoupon: CouponCode | null;
  totals: PriceTotals;
}

export const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  course,
  appliedCoupon,
  totals,
}) => {
  return (
    <div className="rounded-20 bg-gray-50 dark:bg-[#14151e] border border-gray-200 dark:border-white/10 p-4 sm:p-5 text-right font-almarai space-y-4">
      {/* Course Header Info */}
      <div className="flex gap-3 sm:gap-4 items-start">
        <div className="relative w-20 sm:w-24 aspect-video rounded-12 overflow-hidden bg-black/40 border border-white/10 shrink-0">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#753b47]/10 dark:bg-[#753b47]/30 text-[#753b47] dark:text-[#fe6257]">
            <BookOpen className="w-3 h-3" />
            <span>{course.gradeName || "اللغة العربية"}</span>
          </div>

          <h4 className="font-black text-sm sm:text-base text-gray-900 dark:text-white line-clamp-2 leading-tight">
            {course.title}
          </h4>

          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-white/60">
            <span>{teacherProfile.name}</span>
            <span className="w-3.5 h-3.5 rounded-full bg-sky-500 text-white flex items-center justify-center text-[8px]" title="معلم موثق">
              ✓
            </span>
            <span className="text-[11px] text-gray-400 dark:text-white/40">• {course.lecturesCount} محاضرات</span>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="pt-3 border-t border-gray-200/80 dark:border-white/10 space-y-2 text-xs">
        {/* Original Price */}
        <div className="flex justify-between items-center text-gray-600 dark:text-white/70">
          <span>سعر الكورس الأصلي:</span>
          <span className="font-mono font-bold text-gray-900 dark:text-white">
            {totals.originalPrice} ج.م
          </span>
        </div>

        {/* Discount Amount */}
        {appliedCoupon && totals.discountAmount > 0 && (
          <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-bold">
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              <span>خصم الكوبون ({appliedCoupon.code}):</span>
            </span>
            <span className="font-mono">
              - {totals.discountAmount} ج.م
            </span>
          </div>
        )}

        {/* Total Final Price */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-white/10 text-sm sm:text-base font-black">
          <span className="text-gray-900 dark:text-white">الإجمالي النهائي المطلوب:</span>
          <div className="flex items-baseline gap-1 text-[#753b47] dark:text-[#fe6257] font-mono font-black text-lg sm:text-xl">
            <span>{totals.finalPrice}</span>
            <span className="text-xs font-bold font-almarai">ج.م</span>
          </div>
        </div>
      </div>

      {/* Instant Activation Guarantee Badge */}
      <div className="flex items-center gap-2 p-2.5 rounded-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold">
        <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
        <span>تفعيل فوري ومباشر للكورس ومذكرات الشرح والامتحانات فور إتمام الدفع.</span>
      </div>
    </div>
  );
};
