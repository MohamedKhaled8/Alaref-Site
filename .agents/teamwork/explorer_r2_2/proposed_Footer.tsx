import React from "react";
import { Phone, MessageCircle, Award, Sparkles, CheckCircle2 } from "lucide-react";

interface FooterProps {
  onNavigate: (section: string) => void;
  onSelectGrade: (gradeId: string) => void;
  onOpenWhatsApp: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onSelectGrade,
  onOpenWhatsApp,
}) => {
  return (
    <footer className="w-full bg-[#111625] text-white pt-6 pb-5 sm:pt-7 sm:pb-6 border-t border-white/10 relative overflow-hidden select-none font-ibm">
      
      {/* 1. Single Subtle Non-Repeating Islamic Calligraphy Watermark Accent */}
      <div 
        className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div 
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0 w-[550px] h-[360px] sm:w-[680px] sm:h-[420px] bg-no-repeat bg-contain bg-center opacity-[0.045] mix-blend-screen"
          style={{ 
            backgroundImage: "url('/assets/waleed_calligraphy_bg.png')",
          }}
        />
      </div>

      {/* Ambient Lighting Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#ed6140]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 space-y-3.5 sm:space-y-4.5">
        
        {/* ========================================================
            Top Header Ribbon: Arabic Motto & Quick Action Contact
            ======================================================== */}
        <div className="flex flex-col md:flex-row items-center justify-between pb-3 sm:pb-4 border-b border-white/10 gap-2.5 sm:gap-4 md:gap-5 text-center md:text-right">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 text-amber-300 text-xs sm:text-sm font-bold font-aref tracking-wide">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              <span>«لُغَةُ الضَّادِ حِصْنُ الهُوِيَّةِ وَبَوَّابَةُ التَّفَوُّقِ الدِّرَاسِيِّ»</span>
            </div>
            <h3 className="text-base sm:text-xl font-bold text-white font-ibm">
              منصة مستر عمرو عارف — أستاذ اللغة العربية المعتمد
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-2 sm:gap-3 w-full sm:w-auto shrink-0">
            <a
              href="tel:01097303002"
              className="px-2.5 py-1.5 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl font-bold bg-white/10 hover:bg-white/15 text-white border border-white/15 text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all hover:scale-105 active:scale-95"
              dir="ltr"
            >
              <span>01097303002</span>
              <Phone className="w-4 h-4 text-[#ed6140]" />
            </a>

            <button
              onClick={onOpenWhatsApp}
              className="px-2.5 py-1.5 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl font-bold bg-[#ed6140] hover:bg-[#d94f30] text-white text-xs sm:text-sm shadow-md shadow-[#ed6140]/30 flex items-center justify-center gap-1.5 sm:gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>واتساب 24/7</span>
            </button>
          </div>
        </div>

        {/* ========================================================
            Main 4-Column Layout (High Contrast, Ultra Legible)
            ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3.5 sm:gap-4 lg:gap-6 text-right">
          
          {/* Column 1 (Col 1-5): Teacher Brand, Glowing White Logo & Persona */}
          <div className="lg:col-span-5 space-y-2.5 sm:space-y-4">
            
            {/* High-Contrast Dark-Mode Calligraphy Logo (Glowing Ivory White Letters + Gold Tashkeel) */}
            <div className="flex justify-start">
              <img
                src="/assets/amr_aref_horizontal_logo_dark.png"
                alt="أستاذي عمرو عارف"
                className="h-10 sm:h-14 w-auto object-contain drop-shadow-[0_2px_14px_rgba(255,255,255,0.2)]"
              />
            </div>

            {/* Teacher Avatar & Bio */}
            <div className="flex items-center gap-3 pt-0.5">
              <div className="relative group shrink-0">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#ed6140] to-amber-400 opacity-70 blur-xs" />
                <img
                  src="/assets/amr_avatar.png"
                  alt="مستر عمرو عارف"
                  className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-white/80 shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-[#ed6140] text-white flex items-center justify-center text-[9px] sm:text-[10px] font-black border border-white shadow-xs">
                  ★
                </span>
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-base sm:text-lg text-white flex items-center gap-1.5 font-ibm">
                  <span>مستر عمرو عارف</span>
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                </h4>
                <p className="text-xs sm:text-sm text-white/80 font-medium">أستاذ اللغة العربية للمرحلتين الإعدادية والابتدائية</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-white/80 leading-normal sm:leading-relaxed max-w-md">
              شرح مبسط وتأسيس حقيقي لقواعد النحو، الصرف، البلاغة، والقراءة بأحدث أساليب الخرائط الذهنية لضمان الفهم الحقيقي والدرجة النهائية.
            </p>

            {/* Trust Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg sm:rounded-xl bg-amber-400/10 border border-amber-400/25 text-[11px] sm:text-xs text-amber-300 font-bold">
              <Award className="w-4 h-4 text-amber-400" />
              <span>نخبة معلمي لغة الضاد • نسب نجاح 99.4% سنويًا</span>
            </div>

          </div>

          {/* Combined Columns 2 & 3: 2-Column Grid on Mobile/Tablet, Contents on Desktop */}
          <div className="col-span-1 md:col-span-2 lg:contents grid grid-cols-2 gap-3 sm:gap-4">
            
            {/* Column 2 (Col 6-7 on Desktop): المراحل الدراسية */}
            <div className="lg:col-span-2 space-y-2 sm:space-y-3">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-4 bg-[#ed6140] rounded-full inline-block" />
                <h4 className="font-bold text-sm sm:text-base text-white tracking-wide font-ibm">
                  المراحل الدراسية
                </h4>
              </div>
              
              <ul className="space-y-1 sm:space-y-1.5 text-sm lg:text-base text-white/85">
                <li>
                  <button 
                    onClick={() => onSelectGrade("grade-3-prep")}
                    className="py-0.5 sm:py-1 w-full hover:text-[#ed6140] hover:-translate-x-1 transition-all flex items-center gap-2 text-right cursor-pointer"
                  >
                    <span className="text-amber-400 text-xs sm:text-sm font-bold">‹</span>
                    <span>الصف الثالث الإعدادي</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onSelectGrade("grade-2-prep")}
                    className="py-0.5 sm:py-1 w-full hover:text-[#ed6140] hover:-translate-x-1 transition-all flex items-center gap-2 text-right cursor-pointer"
                  >
                    <span className="text-amber-400 text-xs sm:text-sm font-bold">‹</span>
                    <span>الصف الثاني الإعدادي</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onSelectGrade("grade-1-prep")}
                    className="py-0.5 sm:py-1 w-full hover:text-[#ed6140] hover:-translate-x-1 transition-all flex items-center gap-2 text-right cursor-pointer"
                  >
                    <span className="text-amber-400 text-xs sm:text-sm font-bold">‹</span>
                    <span>الصف الأول الإعدادي</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onSelectGrade("grade-6-prim")}
                    className="py-0.5 sm:py-1 w-full hover:text-[#ed6140] hover:-translate-x-1 transition-all flex items-center gap-2 text-right cursor-pointer"
                  >
                    <span className="text-amber-400 text-xs sm:text-sm font-bold">‹</span>
                    <span>الصف السادس الابتدائي</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onSelectGrade("grade-taasis")}
                    className="py-0.5 sm:py-1 w-full hover:text-[#ed6140] hover:-translate-x-1 transition-all flex items-center gap-2 text-right cursor-pointer"
                  >
                    <span className="text-amber-400 text-xs sm:text-sm font-bold">‹</span>
                    <span>كورس التأسيس الشامل</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3 (Col 8-9 on Desktop): روابط المنصة */}
            <div className="lg:col-span-2 space-y-2 sm:space-y-3">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-4 bg-amber-400 rounded-full inline-block" />
                <h4 className="font-bold text-sm sm:text-base text-white tracking-wide font-ibm">
                  روابط المنصة
                </h4>
              </div>

              <ul className="space-y-1 sm:space-y-1.5 text-sm lg:text-base text-white/85">
                <li>
                  <button 
                    onClick={() => onNavigate("home")}
                    className="py-0.5 sm:py-1 w-full hover:text-amber-400 hover:-translate-x-1 transition-all flex items-center gap-2 text-right cursor-pointer"
                  >
                    <span className="text-[#ed6140] text-xs sm:text-sm font-bold">‹</span>
                    <span>الرئيسية</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate("courses")}
                    className="py-0.5 sm:py-1 w-full hover:text-amber-400 hover:-translate-x-1 transition-all flex items-center gap-2 text-right cursor-pointer"
                  >
                    <span className="text-[#ed6140] text-xs sm:text-sm font-bold">‹</span>
                    <span>الكورسات المُقترحة</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate("leaderboard")}
                    className="py-0.5 sm:py-1 w-full hover:text-amber-400 hover:-translate-x-1 transition-all flex items-center gap-2 text-right cursor-pointer"
                  >
                    <span className="text-[#ed6140] text-xs sm:text-sm font-bold">‹</span>
                    <span>لوحة صدارة الشرف 🏆</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={onOpenWhatsApp}
                    className="py-0.5 sm:py-1 w-full hover:text-amber-400 hover:-translate-x-1 transition-all flex items-center gap-2 text-right cursor-pointer"
                  >
                    <span className="text-[#ed6140] text-xs sm:text-sm font-bold">‹</span>
                    <span>طلب أكواد الاشتراك</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={onOpenWhatsApp}
                    className="py-0.5 sm:py-1 w-full hover:text-amber-400 hover:-translate-x-1 transition-all flex items-center gap-2 text-right cursor-pointer"
                  >
                    <span className="text-[#ed6140] text-xs sm:text-sm font-bold">‹</span>
                    <span>خدمة أولياء الأمور</span>
                  </button>
                </li>
              </ul>
            </div>

          </div>

          {/* Column 4 (Col 10-12 on Desktop): الدعم المباشر والخط الساخن */}
          <div className="lg:col-span-3 space-y-2 sm:space-y-3">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-4 bg-[#ed6140] rounded-full inline-block" />
              <h4 className="font-bold text-sm sm:text-base text-white tracking-wide font-ibm">
                الدعم والاتصال المباشر
              </h4>
            </div>

            {/* Direct Hotline Card */}
            <a
              href="tel:01097303002"
              className="p-2.5 sm:p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#ed6140]/50 transition-all flex items-center justify-between group cursor-pointer"
              dir="rtl"
            >
              <div className="space-y-0.5">
                <div className="text-[11px] sm:text-xs text-white/60 font-semibold">الخط الساخن المباشر</div>
                <div className="text-base sm:text-lg font-black text-white font-mono tracking-wider group-hover:text-[#ed6140] transition-colors" dir="ltr">
                  01097303002
                </div>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#ed6140]/20 text-[#ed6140] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Phone className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
            </a>

            {/* Official WhatsApp Card */}
            <button
              onClick={onOpenWhatsApp}
              className="w-full p-2.5 sm:p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#25D366]/50 transition-all flex items-center justify-between group cursor-pointer text-right"
            >
              <div className="space-y-0.5">
                <div className="text-[11px] sm:text-xs text-white/60 font-semibold">محادثة واتساب سريعة</div>
                <div className="text-xs sm:text-sm font-bold text-white group-hover:text-[#25D366] transition-colors">
                  متاحون للرد 24/7
                </div>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#25D366]/20 text-[#25D366] flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
            </button>

            {/* Social Channels Row */}
            <div className="pt-0.5">
              <div className="text-[11px] sm:text-xs text-white/60 font-semibold pb-1.5">تابعنا على المنصات:</div>
              <div className="flex items-center gap-2.5">
                {/* WhatsApp (WCAG 2.5.5 compliant: 44px x 44px) */}
                <a
                  href="https://api.whatsapp.com/send/?phone=201097303002"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl bg-white/5 hover:bg-[#25D366] text-white/80 hover:text-white border border-white/10 flex items-center justify-center transition-all hover:scale-110 shadow-xs cursor-pointer"
                  aria-label="واتساب"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24M8.53 7.33c-.16 0-.35.06-.53.25-.19.19-.71.7-.71 1.7s.73 1.98.83 2.12c.1.14 1.41 2.19 3.47 3.06 1.72.73 2.07.58 2.44.55.38-.04 1.21-.49 1.38-.97.18-.48.18-.89.13-.97-.06-.09-.2-.14-.42-.25-.21-.1-.7-.35-1.45-.72-.74-.38-.97-.38-1.16.2-.19.57-.49.97-.6.97-.1.1-.38.16-.76.02-.38-.14-1.61-.59-3.07-1.89-1.13-1.01-1.9-2.26-2.12-2.64-.22-.38-.02-.59.08-.77.1-.18.21-.38.31-.57.11-.19.15-.33.22-.55.08-.22.04-.41-.02-.57-.06-.16-.53-1.28-.73-1.76-.2-.46-.4-.4-.55-.41"/>
                  </svg>
                </a>

                {/* YouTube (WCAG 2.5.5 compliant: 44px x 44px) */}
                <a
                  href="https://youtube.com/@amraref"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl bg-white/5 hover:bg-[#FF0000] text-white/80 hover:text-white border border-white/10 flex items-center justify-center transition-all hover:scale-110 shadow-xs cursor-pointer"
                  aria-label="يوتيوب"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>

                {/* TikTok (WCAG 2.5.5 compliant: 44px x 44px) */}
                <a
                  href="https://tiktok.com/@amraref"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl bg-white/5 hover:bg-black text-white/80 hover:text-white border border-white/10 flex items-center justify-center transition-all hover:scale-110 shadow-xs cursor-pointer"
                  aria-label="تيك توك"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* ========================================================
            Bottom Copyright and Developer Credit
            ======================================================== */}
        <div className="pt-3.5 sm:pt-4 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-3 text-[11px] sm:text-xs md:text-sm text-white/70 font-medium">
          
          {/* Developer Credit on Left in RTL */}
          <div className="order-2 md:order-1 flex items-center gap-1.5">
            <span>برمجة وتطوير فائق الدقة:</span>
            <a
              href="https://api.whatsapp.com/send/?phone=201010948682"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-300 hover:text-white font-bold underline transition-colors"
            >
              Mada - مدى
            </a>
            <span className="text-white/40" dir="ltr">(+20 1010948682)</span>
          </div>

          {/* Copyright on Right in RTL */}
          <div className="order-1 md:order-2 text-center md:text-right">
            <span>جميع الحقوق محفوظة © {new Date().getFullYear()} • منصة مستر عمرو عارف التعليمية (لغة الضاد)</span>
          </div>

        </div>

      </div>

    </footer>
  );
};
