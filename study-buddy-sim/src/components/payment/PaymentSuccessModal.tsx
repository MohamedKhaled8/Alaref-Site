import React from "react";
import { 
  CheckCircle, 
  Sparkles, 
  Play, 
  Download, 
  X, 
  Calendar, 
  Receipt, 
  Smartphone, 
  CreditCard,
  Ticket
} from "lucide-react";
import { OrderInvoice, PaymentMethodType } from "../../types/payment";

export interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: OrderInvoice | null;
  onStartLearning: () => void;
}

export const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({
  isOpen,
  onClose,
  invoice,
  onStartLearning,
}) => {
  if (!isOpen || !invoice) return null;

  const paymentLabels: Record<PaymentMethodType, string> = {
    vodafone_cash: "فودافون كاش ومحافظ إلكترونية",
    fawry: "فوري باي",
    credit_card: "بطاقة دفع إلكتروني",
    voucher: "كارت شحن السنتر",
  };

  const paymentIcons: Record<PaymentMethodType, React.ReactNode> = {
    vodafone_cash: <Smartphone className="w-4 h-4 text-rose-500" />,
    fawry: <Receipt className="w-4 h-4 text-amber-500" />,
    credit_card: <CreditCard className="w-4 h-4 text-blue-500" />,
    voucher: <Ticket className="w-4 h-4 text-purple-500" />,
  };

  const handlePrintReceipt = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const formattedDate = new Date(invoice.createdAt).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200 select-none font-almarai">
      <div className="relative w-full max-w-lg rounded-24 bg-white dark:bg-[#14151e] border border-gray-200 dark:border-white/10 shadow-2xl p-5 sm:p-6 text-right space-y-5 my-auto">
        
        {/* Close Icon Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-500 dark:text-white/70 transition-all cursor-pointer"
          aria-label="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Celebration Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="w-9 h-9" />
            <Sparkles className="w-5 h-5 absolute -top-1 -right-1 text-amber-400 animate-bounce" />
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
            تم الاشتراك وتفعيل الكورس بنجاح!
          </h3>

          <p className="text-xs text-gray-500 dark:text-white/60 max-w-sm mx-auto">
            مرحباً بك يا <strong>{invoice.studentName}</strong> في منصة مستر عمرو عارف. تم فتح جميع المحاضرات ومذكرات الشرح والامتحانات فوراً.
          </p>
        </div>

        {/* Order Invoice Details Box */}
        <div className="rounded-18 bg-gray-50 dark:bg-[#1a1c26] border border-gray-200/80 dark:border-white/10 p-4 space-y-2.5 text-xs">
          
          <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-white/5">
            <span className="text-gray-500 dark:text-white/50">رقم الفاتورة:</span>
            <span className="font-mono font-bold text-gray-900 dark:text-white" dir="ltr">
              {invoice.orderId}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500 dark:text-white/50">الكورس المشترك به:</span>
            <span className="font-black text-gray-900 dark:text-white max-w-[200px] truncate">
              {invoice.courseTitle}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500 dark:text-white/50">المرحلة الدراسية:</span>
            <span className="font-bold text-gray-800 dark:text-white/90">
              {invoice.gradeName}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500 dark:text-white/50">وسيلة الدفع:</span>
            <span className="font-bold flex items-center gap-1.5 text-gray-800 dark:text-white/90">
              {paymentIcons[invoice.paymentMethod]}
              <span>{paymentLabels[invoice.paymentMethod]}</span>
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500 dark:text-white/50">الرقم المرجعي:</span>
            <span className="font-mono font-bold text-[#753b47] dark:text-[#fe6257]" dir="ltr">
              {invoice.transactionReference}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500 dark:text-white/50">تاريخ وساعة الاشتراك:</span>
            <span className="font-bold text-gray-700 dark:text-white/80">
              {formattedDate}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-white/5 font-black text-sm">
            <span className="text-gray-900 dark:text-white">المبلغ المدفوع:</span>
            <span className="font-mono text-[#753b47] dark:text-[#fe6257] text-base">
              {invoice.finalPrice} ج.م
            </span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={onStartLearning}
            className="w-full py-3.5 rounded-14 bg-gradient-to-r from-[#753b47] to-[#8d4756] hover:from-[#854351] hover:to-[#9c4f60] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#753b47]/25 transition-all cursor-pointer active:scale-98"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>ابدأ التعلم الآن ومتابعة المحاضرة</span>
          </button>

          <button
            type="button"
            onClick={handlePrintReceipt}
            className="w-full py-2.5 rounded-12 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-white/80 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>طباعة أو تحميل إيصال الدفع</span>
          </button>
        </div>

      </div>
    </div>
  );
};
