import React from "react";
import { 
  X, 
  Receipt, 
  Calendar, 
  BookOpen, 
  CheckCircle, 
  Smartphone, 
  CreditCard, 
  Ticket, 
  ExternalLink,
  ShoppingBag
} from "lucide-react";
import { useEnrollmentStore } from "../../stores/useEnrollmentStore";
import { OrderInvoice, PaymentMethodType } from "../../types/payment";
import { CourseItem } from "../../data/mockData";

export interface PurchaseHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCourse?: (courseId: string) => void;
}

export const PurchaseHistoryModal: React.FC<PurchaseHistoryModalProps> = ({
  isOpen,
  onClose,
  onOpenCourse,
}) => {
  const { purchaseHistory } = useEnrollmentStore();

  if (!isOpen) return null;

  const paymentMethodLabels: Record<PaymentMethodType, string> = {
    vodafone_cash: "فودافون كاش",
    fawry: "فوري باي",
    credit_card: "بطاقة دفع إلكتروني",
    voucher: "كارت شحن السنتر",
  };

  const paymentMethodIcons: Record<PaymentMethodType, React.ReactNode> = {
    vodafone_cash: <Smartphone className="w-3.5 h-3.5 text-rose-500" />,
    fawry: <Receipt className="w-3.5 h-3.5 text-amber-500" />,
    credit_card: <CreditCard className="w-3.5 h-3.5 text-blue-500" />,
    voucher: <Ticket className="w-3.5 h-3.5 text-purple-500" />,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200 select-none font-almarai">
      <div className="relative w-full max-w-2xl max-h-[88vh] flex flex-col rounded-24 bg-white dark:bg-[#14151e] border border-gray-200 dark:border-white/10 shadow-2xl p-5 sm:p-6 text-right my-auto overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-12 bg-[#753b47]/10 dark:bg-[#753b47]/30 text-[#753b47] dark:text-[#fe6257] flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-gray-900 dark:text-white">
                سجل المدفوعات والفواتير
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-white/50">
                قائمة العمليات والكورسات المشترك بها وإيصالات السداد الرسمية
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-500 dark:text-white/70 transition-all cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
          {purchaseHistory.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-white/5 text-gray-400 mx-auto flex items-center justify-center">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <div className="font-bold text-sm text-gray-700 dark:text-white/80">
                لا توجد فواتير أو عمليات دفع مسجلة حتى الآن
              </div>
              <div className="text-xs text-gray-400 dark:text-white/40 max-w-xs mx-auto">
                عند الاشتراك في كورسات مستر عمرو عارف، ستظهر جميع إيصالات الدفع هنا مع إمكانية طباعتها في أي وقت.
              </div>
            </div>
          ) : (
            purchaseHistory.map((invoice) => {
              const dateStr = new Date(invoice.createdAt).toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              return (
                <div
                  key={invoice.orderId}
                  className="p-4 rounded-18 bg-gray-50 dark:bg-[#1a1c26] border border-gray-200 dark:border-white/10 hover:border-[#753b47]/40 dark:hover:border-[#fe6257]/40 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-sm text-gray-900 dark:text-white">
                          {invoice.courseTitle}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#753b47]/10 dark:bg-[#753b47]/30 text-[#753b47] dark:text-[#fe6257] text-[10px] font-bold">
                          {invoice.gradeName}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-white/50 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{dateStr}</span>
                        </span>
                        <span>•</span>
                        <span className="font-mono text-[10px]" dir="ltr">
                          {invoice.orderId}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-bold">
                          {paymentMethodIcons[invoice.paymentMethod]}
                          <span>{paymentMethodLabels[invoice.paymentMethod]}</span>
                        </span>
                      </div>
                    </div>

                    {/* Price and Status */}
                    <div className="text-left shrink-0">
                      <div className="font-mono font-black text-sm sm:text-base text-[#753b47] dark:text-[#fe6257]">
                        {invoice.finalPrice} ج.م
                      </div>
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                        <CheckCircle className="w-2.5 h-2.5" />
                        <span>مكتمل ومفعل</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer actions inside card */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200/60 dark:border-white/5 text-[11px]">
                    <span className="text-gray-400 dark:text-white/40 font-mono" dir="ltr">
                      Ref: {invoice.transactionReference}
                    </span>

                    {onOpenCourse && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenCourse(invoice.courseId);
                        }}
                        className="text-[#753b47] dark:text-[#fe6257] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>فتح الكورس</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-gray-200 dark:border-white/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-12 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-white font-bold text-xs transition-all cursor-pointer"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
