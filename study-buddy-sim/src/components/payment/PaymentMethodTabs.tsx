import React, { useState } from "react";
import { 
  Smartphone, 
  CreditCard, 
  Receipt, 
  Ticket, 
  Copy, 
  Check, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { PaymentMethodType, CheckoutPayload } from "../../types/payment";

export interface PaymentMethodTabsProps {
  selectedMethod: PaymentMethodType;
  onSelectMethod: (method: PaymentMethodType) => void;
  payload: Partial<CheckoutPayload>;
  onChangePayload: (updates: Partial<CheckoutPayload>) => void;
  finalPrice: number;
}

export const PaymentMethodTabs: React.FC<PaymentMethodTabsProps> = ({
  selectedMethod,
  onSelectMethod,
  payload,
  onChangePayload,
  finalPrice,
}) => {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedFawry, setCopiedFawry] = useState(false);

  // Generated static Fawry code for display consistency during checkout
  const [fawryCode] = useState(() => {
    const p1 = Math.floor(1000 + Math.random() * 9000);
    const p2 = Math.floor(1000 + Math.random() * 9000);
    return `FAWRY-${p1}-${p2}`;
  });

  const handleCopy = (text: string, isFawry = false) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (isFawry) {
        setCopiedFawry(true);
        setTimeout(() => setCopiedFawry(false), 2000);
      } else {
        setCopiedPhone(true);
        setTimeout(() => setCopiedPhone(false), 2000);
      }
    }
  };

  // Helper to format credit card numbers (grouped by 4)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.replace(/(\d{4})/g, "$1 ").trim();
    onChangePayload({ cardNumber: formatted });
  };

  // Helper for expiry MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    onChangePayload({ expiryDate: val });
  };

  return (
    <div className="space-y-4 font-almarai text-right">
      <div className="text-xs font-bold text-gray-800 dark:text-white">
        اختر وسيلة الدفع المناسبة لك:
      </div>

      {/* 4 Payment Method Tab Headers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* 1. Vodafone Cash */}
        <button
          type="button"
          onClick={() => onSelectMethod("vodafone_cash")}
          className={`p-3 rounded-16 border text-right flex flex-col items-start gap-1.5 transition-all cursor-pointer ${
            selectedMethod === "vodafone_cash"
              ? "bg-[#753b47]/10 dark:bg-[#753b47]/25 border-[#753b47] dark:border-[#fe6257] text-[#753b47] dark:text-[#fe6257] shadow-sm"
              : "bg-white dark:bg-[#14151e] border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/70 hover:border-gray-300"
          }`}
        >
          <div className="w-7 h-7 rounded-10 bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <div className="font-black text-xs">فودافون كاش</div>
            <div className="text-[10px] text-gray-400 dark:text-white/40">إنستاباي ومحافظ</div>
          </div>
        </button>

        {/* 2. Fawry Pay */}
        <button
          type="button"
          onClick={() => {
            onSelectMethod("fawry");
            onChangePayload({ transactionRef: fawryCode });
          }}
          className={`p-3 rounded-16 border text-right flex flex-col items-start gap-1.5 transition-all cursor-pointer ${
            selectedMethod === "fawry"
              ? "bg-[#753b47]/10 dark:bg-[#753b47]/25 border-[#753b47] dark:border-[#fe6257] text-[#753b47] dark:text-[#fe6257] shadow-sm"
              : "bg-white dark:bg-[#14151e] border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/70 hover:border-gray-300"
          }`}
        >
          <div className="w-7 h-7 rounded-10 bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Receipt className="w-4 h-4" />
          </div>
          <div>
            <div className="font-black text-xs">فوري باي</div>
            <div className="text-[10px] text-gray-400 dark:text-white/40">كود دفع 788</div>
          </div>
        </button>

        {/* 3. Credit Card */}
        <button
          type="button"
          onClick={() => onSelectMethod("credit_card")}
          className={`p-3 rounded-16 border text-right flex flex-col items-start gap-1.5 transition-all cursor-pointer ${
            selectedMethod === "credit_card"
              ? "bg-[#753b47]/10 dark:bg-[#753b47]/25 border-[#753b47] dark:border-[#fe6257] text-[#753b47] dark:text-[#fe6257] shadow-sm"
              : "bg-white dark:bg-[#14151e] border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/70 hover:border-gray-300"
          }`}
        >
          <div className="w-7 h-7 rounded-10 bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <div className="font-black text-xs">بطاقة بنكية</div>
            <div className="text-[10px] text-gray-400 dark:text-white/40">فيزا وماستركارد وميزة</div>
          </div>
        </button>

        {/* 4. Academy Voucher */}
        <button
          type="button"
          onClick={() => onSelectMethod("voucher")}
          className={`p-3 rounded-16 border text-right flex flex-col items-start gap-1.5 transition-all cursor-pointer ${
            selectedMethod === "voucher"
              ? "bg-[#753b47]/10 dark:bg-[#753b47]/25 border-[#753b47] dark:border-[#fe6257] text-[#753b47] dark:text-[#fe6257] shadow-sm"
              : "bg-white dark:bg-[#14151e] border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/70 hover:border-gray-300"
          }`}
        >
          <div className="w-7 h-7 rounded-10 bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Ticket className="w-4 h-4" />
          </div>
          <div>
            <div className="font-black text-xs">كارت السنتر</div>
            <div className="text-[10px] text-gray-400 dark:text-white/40">كود شحن ورقي</div>
          </div>
        </button>
      </div>

      {/* Method Specific Form Area */}
      <div className="p-4 rounded-20 bg-gray-50 dark:bg-[#14151e] border border-gray-200 dark:border-white/10 space-y-4">
        
        {/* TAB 1: Vodafone Cash & Wallets */}
        {selectedMethod === "vodafone_cash" && (
          <div className="space-y-3">
            {/* Wallet Number Banner */}
            <div className="p-3.5 rounded-14 bg-[#753b47]/10 dark:bg-[#753b47]/20 border border-[#753b47]/20 flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-bold text-gray-600 dark:text-white/70">
                  رقم محفظة مستر عمرو عارف المعتمدة:
                </div>
                <div className="text-base sm:text-lg font-black font-mono text-[#753b47] dark:text-[#fe6257] tracking-wider" dir="ltr">
                  01097303002
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCopy("01097303002")}
                className="px-3 py-1.5 rounded-10 bg-[#753b47] hover:bg-[#854351] text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-98"
              >
                {copiedPhone ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPhone ? "تم النسخ" : "نسخ الرقم"}</span>
              </button>
            </div>

            <div className="text-[11px] text-gray-500 dark:text-white/60 leading-relaxed">
              قم بتحويل مبلغ <strong className="text-gray-900 dark:text-white font-mono font-bold">{finalPrice} ج.م</strong> إلى رقم المحفظة أعلاه (فودافون كاش أو إنستاباي أو أي محفظة بنكية)، ثم سجل بيانات التحويل أدناه:
            </div>

            {/* Inputs: Sender Phone & Reference ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700 dark:text-white/80">
                  رقم الهاتف المحول منه <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={payload.phoneNumber || ""}
                  onChange={(e) => onChangePayload({ phoneNumber: e.target.value })}
                  placeholder="010XXXXXXXX"
                  maxLength={11}
                  className="w-full px-3 py-2 rounded-12 bg-white dark:bg-[#1a1c26] border border-gray-200 dark:border-white/10 text-xs font-mono font-bold text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#753b47] dark:focus:border-[#fe6257]"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700 dark:text-white/80">
                  الرقم المرجعي للعملية (اختياري)
                </label>
                <input
                  type="text"
                  value={payload.transactionRef || ""}
                  onChange={(e) => onChangePayload({ transactionRef: e.target.value })}
                  placeholder="مثال: 94827103"
                  className="w-full px-3 py-2 rounded-12 bg-white dark:bg-[#1a1c26] border border-gray-200 dark:border-white/10 text-xs font-mono font-bold text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#753b47] dark:focus:border-[#fe6257]"
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Fawry Pay */}
        {selectedMethod === "fawry" && (
          <div className="space-y-3">
            <div className="p-4 rounded-14 bg-amber-500/10 border border-amber-500/25 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-black text-amber-700 dark:text-amber-300">
                  كود الدفع المرجعي عبر فوري:
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(fawryCode, true)}
                  className="px-2.5 py-1 rounded-8 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                >
                  {copiedFawry ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedFawry ? "تم النسخ" : "نسخ"}</span>
                </button>
              </div>

              <div className="font-mono font-black text-xl text-amber-800 dark:text-amber-200 tracking-wider" dir="ltr">
                {fawryCode}
              </div>

              <div className="text-[11px] text-amber-900/80 dark:text-amber-200/80 leading-relaxed pt-1 border-t border-amber-500/20">
                توجه إلى أي ماكينة فوري واطلب سداد <strong>كود الخدمة (788)</strong> باسم منصة مستر عمرو عارف، وادفع باستخدام الكود المرجعي أعلاه. الكود صالح لمدة 48 ساعة.
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-12 bg-white dark:bg-[#1a1c26] border border-gray-200 dark:border-white/10 text-[11px] text-gray-600 dark:text-white/70">
              <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>في وضع التجربة: اضغط "تأكيد الدفع" لتفعيل الكورس فوراً بمحاكاة سداد فوري.</span>
            </div>
          </div>
        )}

        {/* TAB 3: Credit Card */}
        {selectedMethod === "credit_card" && (
          <div className="space-y-3">
            {/* Card Number */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 dark:text-white/80">
                رقم البطاقة (16 رقم) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={payload.cardNumber || ""}
                onChange={handleCardNumberChange}
                placeholder="4000 1234 5678 9010"
                maxLength={19}
                className="w-full px-3 py-2 rounded-12 bg-white dark:bg-[#1a1c26] border border-gray-200 dark:border-white/10 text-xs font-mono font-bold text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#753b47] dark:focus:border-[#fe6257]"
                dir="ltr"
              />
            </div>

            {/* Card Holder Name */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 dark:text-white/80">
                اسم حامل البطاقة (كما هو مدون عليها)
              </label>
              <input
                type="text"
                value={payload.cardHolder || ""}
                onChange={(e) => onChangePayload({ cardHolder: e.target.value })}
                placeholder="MOHAMED AHMED"
                className="w-full px-3 py-2 rounded-12 bg-white dark:bg-[#1a1c26] border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#753b47] dark:focus:border-[#fe6257]"
              />
            </div>

            {/* Expiry & CVV */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700 dark:text-white/80">
                  تاريخ الانتهاء (MM/YY) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={payload.expiryDate || ""}
                  onChange={handleExpiryChange}
                  placeholder="12/28"
                  maxLength={5}
                  className="w-full px-3 py-2 rounded-12 bg-white dark:bg-[#1a1c26] border border-gray-200 dark:border-white/10 text-xs font-mono font-bold text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#753b47] dark:focus:border-[#fe6257] text-center"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700 dark:text-white/80">
                  رمز الأمان (CVV) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  value={payload.cvv || ""}
                  onChange={(e) => onChangePayload({ cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                  placeholder="123"
                  maxLength={4}
                  className="w-full px-3 py-2 rounded-12 bg-white dark:bg-[#1a1c26] border border-gray-200 dark:border-white/10 text-xs font-mono font-bold text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#753b47] dark:focus:border-[#fe6257] text-center"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Security Badges */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-white/10 text-[10px] text-gray-500 dark:text-white/50">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>تشفير آمن 256-bit SSL وحماية 3D-Secure</span>
              </span>
              <span className="font-bold">فيزا • ماستركارد • ميزة</span>
            </div>
          </div>
        )}

        {/* TAB 4: Academy Voucher */}
        {selectedMethod === "voucher" && (
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 dark:text-white/80">
                كود كارت السنتر المكون من 12 رمزاً <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={payload.voucherCode || ""}
                onChange={(e) => onChangePayload({ voucherCode: e.target.value.toUpperCase() })}
                placeholder="مثال: AREF-2026-GOLD"
                className="w-full px-3 py-2.5 rounded-12 bg-white dark:bg-[#1a1c26] border border-gray-200 dark:border-white/10 text-xs font-mono font-black text-[#753b47] dark:text-[#fe6257] placeholder:text-gray-400 focus:outline-none focus:border-[#753b47] dark:focus:border-[#fe6257] tracking-wider"
                dir="ltr"
              />
            </div>

            <div className="p-3 rounded-12 bg-purple-500/10 border border-purple-500/20 text-[11px] text-purple-700 dark:text-purple-300 leading-relaxed">
              يمكنك الحصول على كروت شحن السنتر الورقية مباشرة من مقر سنتر مستر عمرو عارف أو المساعدين المعتمدين لتفعيل الكورس فوراً دون أي رسوم إضافية.
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
