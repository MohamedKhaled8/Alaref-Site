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
              Left Side (RTL End): High-Quality Candid Teacher Portrait Presentation
              ======================================================== */}
          <div className="basis-full md:basis-1/2 flex justify-center items-center relative order-1 md:order-2 select-none w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="relative w-full max-w-[390px] sm:max-w-[460px] lg:max-w-[500px] xl:max-w-[530px] flex justify-center items-center"
            >
              {/* Soft Atmospheric Warm Golden/Amber Ambient Glow */}
              <div className="absolute -inset-4 sm:-inset-8 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(237,97,64,0.22)_0%,rgba(245,158,11,0.14)_45%,transparent_70%)] blur-3xl pointer-events-none z-0" />

              {/* Seamless Vignette Container: Smooth Side and Vertical Fade-Out */}
              <div className="relative w-full overflow-hidden z-10 [mask-image:linear-gradient(to_right,transparent_0%,black_4%,black_96%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_4%,black_96%,transparent_100%)]">
                {/* Dark Mode Candid Portrait (Image 10: Library setting with glowing Arabic calligraphy & WhatsApp) */}
                <img
                  src="/assets/amr_candid_portrait_dark.jpg"
                  alt="مستر عمرو عارف - أستاذ اللغة العربية"
                  className="w-full h-auto object-contain hover:scale-102 transition-transform duration-700 hidden dark:block [mask-image:linear-gradient(to_bottom,transparent_0%,black_2%,black_75%,transparent_98%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_2%,black_75%,transparent_98%)]"
                  loading="eager"
                />

                {/* Light Mode Candid Portrait (Image 11: Sunlit educational study setting) */}
                <img
                  src="/assets/amr_candid_portrait_light.jpg"
                  alt="مستر عمرو عارف - أستاذ اللغة العربية"
                  className="w-full h-auto object-contain hover:scale-102 transition-transform duration-700 block dark:hidden [mask-image:linear-gradient(to_bottom,transparent_0%,black_2%,black_75%,transparent_98%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_2%,black_75%,transparent_98%)]"
                  loading="eager"
                />

                {/* Interactive Clickable Hotspot covering the source artwork's WhatsApp icon */}
                <a
                  href="https://api.whatsapp.com/send/?phone=201097303002"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute left-[3%] bottom-[3%] w-12 h-12 sm:w-14 sm:h-14 rounded-full cursor-pointer z-20 hover:scale-110 active:scale-95 transition-transform"
                  title="تواصل واتساب مع مستر عمرو عارف (01097303002)"
                  aria-label="تواصل واتساب عبر الرقم 01097303002"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
