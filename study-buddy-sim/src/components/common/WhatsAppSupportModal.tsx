import React from "react";
import { X, MessageSquare, Phone, ExternalLink } from "lucide-react";
import { teacherProfile } from "../../data/mockData";

interface WhatsAppSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: string;
}

export const WhatsAppSupportModal: React.FC<WhatsAppSupportModalProps> = ({
  isOpen,
  onClose,
  reason = "استفسار بخصوص كورسات اللغة العربية",
}) => {
  if (!isOpen) return null;

  const whatsappUrl = `https://wa.me/${teacherProfile.whatsappSupport}?text=${encodeURIComponent(
    `السلام عليكم مستر محمد العميد، أود الاستفسار بخصوص: ${reason}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-md rounded-24 bg-[#14151c] border border-white/10 shadow-2xl p-6 sm:p-8 text-right space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-16 bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white">
                فريق دعم مستر محمد العميد
              </h3>
              <p className="text-xs text-white/50">خدمة الطلاب وأولياء الأمور</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-12 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <p className="text-sm text-white/80 leading-relaxed">
            مرحباً بك في منصة محمد العميد التعليمية! إذا كان لديك أي استفسار بخصوص حجز الكورسات، استلام المذكرات، أو تفعيل حسابك، فريق الدعم الفني جاهز لمساعدتك في أسرع وقت.
          </p>

          <div className="p-3.5 rounded-16 bg-white/5 border border-white/10 text-xs text-white/60 space-y-1">
            <div className="font-bold text-white">الخط الساخن المباشر:</div>
            <div className="font-mono text-sm text-[var(--accent)] font-bold tracking-wider" dir="ltr">
              {teacherProfile.phoneSupport}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5 pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-12 font-black text-sm text-white bg-[#25D366] hover:bg-[#20ba5a] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20"
          >
            <MessageSquare className="w-4 h-4" />
            <span>فتح محادثة واتساب الآن</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-12 border border-white/10 text-xs font-bold hover:bg-white/5 text-white/70 transition-colors"
          >
            الرجوع إلى المنصة
          </button>
        </div>

      </div>
    </div>
  );
};
