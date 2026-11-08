import React, { useState } from "react";
import { ChevronRight, ChevronLeft, Play, ArrowLeft } from "lucide-react";
import { coursesList, CourseItem } from "../../data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import { SpotlightCard } from "../common/SpotlightCard";

interface FeaturedCoursesProps {
  selectedGrade: string | null;
  onSelectGrade: (gradeId: string | null) => void;
  onOpenDetails: (course: CourseItem) => void;
  onEnrollNow: (course: CourseItem) => void;
}

export const FeaturedCourses: React.FC<FeaturedCoursesProps> = ({
  selectedGrade,
  onOpenDetails,
  onEnrollNow,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter courses by selectedGrade when active, otherwise take top courses
  const filteredCourses = selectedGrade 
    ? coursesList.filter((c) => c.gradeId === selectedGrade)
    : coursesList;
  const featuredList = filteredCourses.slice(0, 4);
  const currentCourse = featuredList[currentIndex] || featuredList[0];

  React.useEffect(() => {
    setCurrentIndex(0);
  }, [selectedGrade]);

  const handleNext = () => {
    if (featuredList.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % featuredList.length);
  };

  const handlePrev = () => {
    if (featuredList.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + featuredList.length) % featuredList.length);
  };

  return (
    <section id="courses" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-8 select-none font-ibm">
      
      {/* ========================================================
          Waleed-Mohsen Exact Suggested Courses Banner (Image 4)
          ======================================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-[#fae4d7] dark:bg-[#1a1518] border border-orange-200/80 dark:border-white/10 p-6 sm:p-10 lg:p-14 shadow-xl">
        
        {/* Authentic Islamic / Arabic Calligraphy Pattern Overlay (Exact Waleed Mohsen bg-star.png) */}
        <div 
          className="absolute inset-0 w-full h-full z-0 opacity-70 dark:opacity-30 pointer-events-none bg-repeat mix-blend-multiply dark:mix-blend-screen"
          style={{ 
            backgroundImage: "url('/assets/waleed_calligraphy_bg.png')",
            backgroundSize: "420px"
          }}
        />

        {/* Ambient Warm Blur Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-yellow-300/30 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#ed6140]/30 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Inner Content Grid: Right Text & Left Course Carousel (Image 4) */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Right Side (RTL Start): Title, Arrow, Description */}
          <div className="lg:col-span-6 text-right space-y-4">
            
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-9 bg-[#ed6140] rounded-full inline-block" />
              <h2 className="text-3xl sm:text-4.5xl font-bold font-ibm text-gray-900 dark:text-white tracking-tight">
                الكورسات المُقترحة
              </h2>
              {/* Waleed Mohsen Curly Arrow Indicator from Image 4 */}
              <img 
                src="/assets/waleed_arrow.svg" 
                alt="arrow" 
                className="w-10 sm:w-12 h-10 sm:h-12 -scale-x-100 opacity-90 inline-block" 
              />
            </div>

            <p className="text-base sm:text-lg text-gray-700 dark:text-white/80 font-medium leading-relaxed max-w-lg">
              استاذك عمرو عارف! رشحلك أفضل الكورسات الي هتخليك تفرق عن باقي زمايلك.. اجهز يا طالبي لرحلة نجاحك على منصة أستاذي! هنبسطك في رحلتك ونضمن لك التفوق والدرجة النهائية.
            </p>

            <div className="pt-2">
              <button
                onClick={() => onOpenDetails(currentCourse)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-12 bg-white/80 hover:bg-white dark:bg-[#161926] text-[#ed6140] font-bold text-sm shadow-xs transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <span>تصفح جميع الكورسات</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Left Side (RTL End): Exact Embedded Course Slider (Image 4) */}
          <div className="lg:col-span-6 flex justify-center items-center">
            <div className="relative w-full max-w-[360px] sm:max-w-[400px]">
              
              {/* Navigation Arrow Previous (Right side in RTL) */}
              <button
                onClick={handlePrev}
                className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white dark:bg-[#1a1c24] border border-gray-200 dark:border-white/20 text-gray-800 dark:text-white flex items-center justify-center shadow-xl hover:bg-[#ed6140] hover:text-white transition-all cursor-pointer"
                aria-label="السابق"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Navigation Arrow Next (Left side in RTL) */}
              <button
                onClick={handleNext}
                className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white dark:bg-[#1a1c24] border border-gray-200 dark:border-white/20 text-gray-800 dark:text-white flex items-center justify-center shadow-xl hover:bg-[#ed6140] hover:text-white transition-all cursor-pointer"
                aria-label="التالي"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Orange Gradient Card Wrapper (Exact Frame from Image 4) */}
              <div className="p-3.5 sm:p-4 rounded-3xl bg-gradient-to-tr from-orange-400 via-[#ed6140] to-yellow-500 shadow-2xl">
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentCourse.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                  >
                    <SpotlightCard
                      spotlightColor="rgba(250, 204, 21, 0.18)"
                      className="rounded-24 bg-white dark:bg-[#161926] p-4 sm:p-5 text-right space-y-4 shadow-md font-ibm"
                    >
                    
                      {/* Course Image Thumbnail with Price & Batch Badge */}
                      <div 
                        onClick={() => onOpenDetails(currentCourse)}
                        className="relative aspect-video rounded-16 overflow-hidden cursor-pointer bg-gray-100 dark:bg-black/40 group"
                      >
                        <img
                          src={currentCourse.thumbnail}
                          alt={currentCourse.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        {/* Price Badge on Top Right */}
                        <div className="absolute top-2.5 right-2.5 px-3 py-1 rounded-full bg-[#ed6140] text-white text-xs font-black shadow-md font-mono">
                          {currentCourse.price} ج.م
                        </div>

                        {/* Grade Badge on Top Left */}
                        <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold">
                          {currentCourse.gradeName}
                        </div>

                        {/* Play hover button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                          <div className="w-12 h-12 rounded-full bg-white text-[#ed6140] flex items-center justify-center shadow-xl">
                            <Play className="w-5 h-5 fill-current translate-x-0.5" />
                          </div>
                        </div>
                      </div>

                      {/* Course Title */}
                      <div>
                        <h3 
                          onClick={() => onOpenDetails(currentCourse)}
                          className="font-bold text-base sm:text-lg text-gray-900 dark:text-white hover:text-[#ed6140] cursor-pointer transition-colors line-clamp-1"
                        >
                          {currentCourse.title}
                        </h3>
                        
                        {/* Features bullets */}
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-white/60 pt-1">
                          <span>• {currentCourse.lecturesCount} محاضرات</span>
                          <span>• {currentCourse.durationText}</span>
                          <span>• شرح وتأسيس شامل</span>
                        </div>
                      </div>

                      {/* Dual Action Buttons (Exact Match from Image 4) */}
                      <div className="space-y-2 pt-1 font-almarai">
                        <button
                          onClick={() => onOpenDetails(currentCourse)}
                          className="w-full py-2.5 rounded-12 text-xs font-bold text-gray-700 dark:text-white/80 hover:text-[#ed6140] border border-gray-200 dark:border-white/20 hover:border-[#ed6140] bg-gray-50 dark:bg-white/5 transition-all text-center cursor-pointer"
                        >
                          الدخول للكورس
                        </button>

                        <button
                          onClick={() => onEnrollNow(currentCourse)}
                          className="w-full py-2.5 rounded-12 text-xs font-bold text-white bg-[#ed6140] hover:bg-[#d94f30] shadow-md shadow-[#ed6140]/25 transition-all text-center cursor-pointer active:scale-98"
                        >
                          الإشتراك في الكورس !
                        </button>
                      </div>

                    </SpotlightCard>
                  </motion.div>
                </AnimatePresence>

              </div>

              {/* 4 Pagination Dots (Matching Image 4) */}
              <div className="flex items-center justify-center gap-2 pt-3">
                {featuredList.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`rounded-full transition-all cursor-pointer ${
                      currentIndex === idx 
                        ? "w-6 h-2 bg-white shadow-xs" 
                        : "w-2 h-2 bg-white/50 hover:bg-white/80"
                    }`}
                    aria-label={`شريحة ${idx + 1}`}
                  />
                ))}
              </div>

            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
