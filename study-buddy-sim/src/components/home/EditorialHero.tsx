import React from "react";
import { motion } from "framer-motion";
import { AmrArefCalligraphyLogo } from "../common/AmrArefCalligraphyLogo";

interface HeroProps {
  onExploreGrades: () => void;
  onExploreCourses: () => void;
  onOpenAuth: (mode: "login" | "register") => void;
}

export const EditorialHero: React.FC<HeroProps> = ({
  onExploreGrades,
  onExploreCourses,
  onOpenAuth,
}) => {
  return (
    <section 
      id="hero"
      className="relative overflow-hidden pt-28 pb-12 sm:pt-36 sm:pb-20 select-none bg-[#faf9f6] dark:bg-[#0c0e17] transition-colors duration-300 font-ibm two-columns-hero-section"
    >
      
      {/* Subtle Warm Background Glows */}
      <div className="absolute top-10 right-10 w-[500px] h-[500px] rounded-full bg-[#ed6140]/10 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] rounded-full bg-[#facc15]/10 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 lg:gap-14">
          
          {/* ========================================================
              Right Side (RTL Start): Exact Waleed Mohsen Hero Layout (Image 1)
              ======================================================== */}
          <div className="basis-full md:basis-1/2 text-right flex flex-col items-center md:items-start space-y-6 order-2 md:order-1">
            
            {/* 1. Large Authentic Calligraphy Logo (Exact match from Image 1) */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full flex justify-center md:justify-start"
            >
              <AmrArefCalligraphyLogo size="lg" />
            </motion.div>

            {/* 2. Headline in IBM Plex Sans Arabic (Exact match from Image 1) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-2 w-full text-center md:text-right"
            >
              <h1 className="text-3.5xl sm:text-5xl lg:text-5.5xl font-bold font-ibm text-gray-800 dark:text-gray-100 leading-[1.28] tracking-tight">
                هنا تبدأ حكايتك <span className="text-[#ed6140]">مع اللغة...</span>
                <br />
                فهمًا، <span className="text-amber-400 font-bold">تفوقًا،</span> ونجاحًا
              </h1>
            </motion.div>

            {/* 3. Primary Action Buttons (Exact Match from Image 1) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center md:justify-start gap-4 pt-2 w-full"
            >
              {/* Button 1: Solid Tomato Red with Hands Up icon */}
              <button
                onClick={() => onOpenAuth("register")}
                className="px-8 py-3.5 rounded-md font-bold font-ibm text-white bg-[#ed6140] hover:bg-[#d94f30] text-sm sm:text-base shadow-md shadow-[#ed6140]/25 flex items-center justify-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer min-w-[150px] sm:min-w-[170px]"
              >
                <span>انضم لينا !</span>
                <span className="text-lg">🙌</span>
              </button>

              {/* Button 2: Soft Peach with Books icon */}
              <button
                onClick={onExploreCourses}
                className="px-8 py-3.5 rounded-md font-bold font-ibm text-[#8C282F] dark:text-[#ffb3a7] bg-[#fce4d8] hover:bg-[#fad5c3] dark:bg-[#341d1d] text-sm sm:text-base transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-xs hover:scale-105 active:scale-95 min-w-[150px] sm:min-w-[170px]"
              >
                <span>أشتري كتابك</span>
                <span className="text-lg">📚</span>
              </button>
            </motion.div>

          </div>

          {/* ========================================================
              Left Side (RTL End): Master Teacher Cutout Artwork
              ======================================================== */}
          <div className="basis-full md:basis-1/2 flex justify-center items-center relative order-1 md:order-2 select-none w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="relative w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[500px] flex justify-center items-center"
            >
              {/* Ambient Backlight Glow */}
              <div className="absolute -inset-10 bg-[radial-gradient(ellipse_at_center,rgba(117,59,71,0.45)_0%,rgba(254,98,87,0.15)_40%,transparent_70%)] blur-[60px] pointer-events-none -z-10" />

              {/* Authentic Master Hero Artwork Asset (Mr. Amr Aref on Peach Starburst) */}
              <div className="relative w-full flex justify-center items-center">
                <img
                  src="/assets/amr_hero_portrait_master.png"
                  alt="مستر عمرو عارف - أستاذ اللغة العربية"
                  className="w-full h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:scale-102 transition-transform duration-500"
                  loading="eager"
                />

                {/* 12-Point Serrated Seal Badge (ض • أستاذي) */}
                <div className="absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none">
                  <div className="relative flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-20 h-20 sm:w-24 sm:h-24 text-[#e15733] fill-current drop-shadow-xl">
                      <path d="M50 0 L61 14 L78 8 L81 26 L97 29 L91 46 L100 61 L86 71 L88 89 L71 88 L64 100 L50 91 L36 100 L29 88 L12 89 L14 71 L0 61 L9 46 L3 29 L19 26 L22 8 L39 14 Z" />
                    </svg>
                    <div className="absolute text-center leading-tight">
                      <div className="text-white font-black text-xs sm:text-sm font-ibm drop-shadow-md">ض</div>
                      <div className="text-white font-extrabold text-[10px] sm:text-xs font-ibm tracking-wide">أستاذي</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating WhatsApp Support Icon on Bottom Left (matching Waleed Telegram) */}
              <a
                href="https://api.whatsapp.com/send/?phone=201097303002"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute -left-2 bottom-6 sm:bottom-10 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all"
                title="تواصل واتساب مع مستر عمرو عارف"
                aria-label="تواصل واتساب"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24M8.53 7.33c-.16 0-.35.06-.53.25-.19.19-.71.7-.71 1.7s.73 1.98.83 2.12c.1.14 1.41 2.19 3.47 3.06 1.72.73 2.07.58 2.44.55.38-.04 1.21-.49 1.38-.97.18-.48.18-.89.13-.97-.06-.09-.2-.14-.42-.25-.21-.1-.7-.35-1.45-.72-.74-.38-.97-.38-1.16.2-.19.57-.49.97-.6.97-.1.1-.38.16-.76.02-.38-.14-1.61-.59-3.07-1.89-1.13-1.01-1.9-2.26-2.12-2.64-.22-.38-.02-.59.08-.77.1-.18.21-.38.31-.57.11-.19.15-.33.22-.55.08-.22.04-.41-.02-.57-.06-.16-.53-1.28-.73-1.76-.2-.46-.4-.4-.55-.41"/>
                </svg>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
