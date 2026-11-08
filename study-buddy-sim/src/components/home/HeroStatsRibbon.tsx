import React from "react";
import { motion } from "framer-motion";

export const HeroStatsRibbon: React.FC = () => {
  return (
    <section className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-8 select-none font-ibm relative overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-center justify-between">
        
        {/* Right Block (Quote): Waleed-Mohsen Signature Teacher Philosophy */}
        <div className="basis-full lg:basis-1/2 text-right relative p-2 sm:p-6">
          
          <p className="text-[#ed6140] text-base sm:text-lg mb-3 font-medium font-ibm">
            – أستاذك عمرو عارف
          </p>

          <div className="relative z-10 space-y-2">
            <h2 className="text-3xl sm:text-4xl lg:text-4.5xl font-semibold font-ibm text-gray-900 dark:text-white leading-[1.3] tracking-tight">
              أنا مش بس بعلّمك عربي...
              <br />
              أنا بجهّزك تبقى جاهز لأي سؤال
              <br />
              في <span className="text-[#ed6140] font-bold">الامتحان والحياة</span>
            </h2>

            <p className="text-sm sm:text-base text-gray-600 dark:text-white/70 font-normal leading-relaxed max-w-lg pt-3">
              المنهج مش حفظ وتلقين.. المنهج فهم واستنتاج وتطبيق مباشر بالخرائط الذهنية اللي بتخلي الإعراب وقواعد النحو أسهل لعبة في الامتحان.
            </p>
          </div>

          {/* Authentic Outlined Arabic Calligraphy Watermark (Exact Waleed Mohsen textDecore.png) */}
          <img
            src="/assets/waleed_text_decore.png"
            alt="أستاذي في اللغة العربية"
            className="absolute -z-0 -bottom-6 right-0 sm:right-4 w-[280px] sm:w-[460px] max-w-none opacity-85 dark:opacity-40 pointer-events-none select-none"
          />

        </div>

        {/* Left Blocks: Waleed-Mohsen Exact Dual Bento Cards & Pills (Image 3) */}
        <div className="basis-full lg:basis-1/2 flex flex-col sm:flex-row gap-4 items-center justify-center w-full">
          
          {/* Column 1: Top Pill + Big Card 400K */}
          <div className="flex flex-col space-y-4 w-full sm:w-[300px] md:w-[340px]">
            
            {/* Top Pill: ما النجاح إلا لحظة */}
            <div className="bg-gradient-to-r from-orange-200/40 to-yellow-200/40 dark:from-orange-500/10 dark:to-yellow-500/10 rounded-3xl p-5 text-center flex items-center justify-center h-[80px] border border-orange-200/30 dark:border-white/5">
              <p className="text-xl sm:text-2xl font-ibm font-medium text-gray-800 dark:text-gray-200">
                ما النجاح <span className="text-[#ed6140] font-bold">إلا لحظة</span>
              </p>
            </div>

            {/* Big Yellow Card: +400K with Books icon */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-[#2a2615] dark:to-[#38311a] rounded-3xl p-7 text-right shadow-lg relative overflow-hidden h-[250px] flex flex-col justify-between border border-yellow-300/50 dark:border-amber-500/20"
            >
              <div className="space-y-1 relative z-10">
                <div className="flex items-center gap-3">
                  <span className="text-4xl sm:text-5xl font-bold font-ibm text-gray-900 dark:text-white">
                    400K+
                  </span>
                  <span className="text-3xl">📚</span>
                </div>
                <p className="text-gray-700 dark:text-amber-100 text-lg sm:text-xl font-ibm font-medium pt-2">
                  اختصروا الطريق واتأسسوا صح
                </p>
              </div>

              <div className="text-xs font-bold text-amber-900 dark:text-amber-400 relative z-10">
                تفوق مضمون بالخرائط الذهنية ✓
              </div>

              {/* Giant Faint Books SVG Watermark */}
              <div className="absolute -bottom-6 -left-6 opacity-10 pointer-events-none">
                <svg width="160" height="160" viewBox="0 0 24 24" fill="currentColor" className="text-amber-950 dark:text-white">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
              </div>
            </motion.div>

          </div>

          {/* Column 2: Big Card 360K + Bottom Pill */}
          <div className="flex flex-col space-y-4 w-full sm:w-[300px] md:w-[340px]">
            
            {/* Big Yellow Card: +360K with YouTube / Student icon */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-[#2a2615] dark:to-[#38311a] rounded-3xl p-7 text-right shadow-lg relative overflow-hidden h-[250px] flex flex-col justify-between border border-yellow-300/50 dark:border-amber-500/20"
            >
              <div className="space-y-1 relative z-10">
                <div className="flex items-center gap-3">
                  <span className="text-4xl sm:text-5xl font-bold font-ibm text-gray-900 dark:text-white">
                    360K+
                  </span>
                  <span className="text-3xl">▶️</span>
                </div>
                <p className="text-gray-700 dark:text-amber-100 text-lg sm:text-xl font-ibm font-medium pt-2">
                  طالب متفوق في الجمهورية
                </p>
              </div>

              <div className="text-xs font-bold text-amber-900 dark:text-amber-400 relative z-10">
                أوائل الشهادات على مدار السنوات ✓
              </div>

              {/* Giant Faint Play SVG Watermark */}
              <div className="absolute -bottom-6 -left-6 opacity-10 pointer-events-none">
                <svg width="160" height="160" viewBox="0 0 24 24" fill="currentColor" className="text-amber-950 dark:text-white">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </div>
            </motion.div>

            {/* Bottom Pill: تهزم فيها شهوة */}
            <div className="bg-gradient-to-r from-orange-200/40 to-yellow-200/40 dark:from-orange-500/10 dark:to-yellow-500/10 rounded-3xl p-5 text-center flex items-center justify-center h-[80px] border border-orange-200/30 dark:border-white/5">
              <p className="text-xl sm:text-2xl font-ibm font-medium text-gray-800 dark:text-gray-200">
                تهزم فيها <span className="text-[#ed6140] font-bold">أي صعوبة</span>
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
