import React from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export const PromoBanner: React.FC = () => {
  return (
    <section className="py-6 sm:py-10 container-elameed select-none">
      <div className="relative rounded-24 sm:rounded-32 overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group bg-[#0c101c]">
        {/* Subtle moving light shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none z-10" />

        {/* The Graphic Banner */}
        <img
          src="/assets/amr_promo_banner.png"
          alt="مستر عمرو عارف - أستاذ اللغة العربية للإبتدائية والإعدادية"
          className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.01]"
          loading="lazy"
        />

        {/* Integrated Bottom Strip */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#111625] border-t border-white/10">
          <div className="flex items-center gap-3 text-right">
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm sm:text-base font-black text-white">
                خطة التأسيس والتفوق في اللغة العربية مع مستر عمرو عارف
              </p>
              <p className="text-xs text-white/60">
                المرحلتين الابتدائية والإعدادية • شرح تفصيلي • اختبارات ومتابعة دورية
              </p>
            </div>
          </div>

          <a
            href="#courses"
            className="w-full sm:w-auto px-6 py-3 rounded-12 text-xs sm:text-sm font-black text-white bg-gradient-to-r from-[#753b47] to-[#8d4756] hover:from-[#854351] hover:to-[#9f5062] shadow-lg flex items-center justify-center gap-2 shrink-0 transition-transform active:scale-95 cursor-pointer"
          >
            <span>اشترك في دورتك الآن</span>
            <ArrowLeft className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
