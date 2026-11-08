import React from "react";
import { gradeStages } from "../../data/mockData";
import { motion } from "framer-motion";
import { Check, ArrowLeft } from "lucide-react";
import { SpotlightCard } from "../common/SpotlightCard";

interface GradeSelectorProps {
  selectedGrade: string | null;
  onSelectGrade: (gradeId: string) => void;
  onViewAllCourses: () => void;
}

export const GradeSelector: React.FC<GradeSelectorProps> = ({
  selectedGrade,
  onSelectGrade,
}) => {
  return (
    <section id="grades" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-8 select-none font-ibm">
      
      {/* ========================================================
          Waleed-Mohsen Exact Header with Red Wavy Flourish
          ======================================================== */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2 flex flex-col items-center">
        
        <h2 className="text-3xl sm:text-4xl font-bold font-ibm text-gray-900 dark:text-white tracking-tight">
          | جميع السنوات الدراسية |
        </h2>

        {/* Authentic Red Hand-Drawn Wavy Underline */}
        <div className="py-1">
          <svg width="140" height="16" viewBox="0 0 140 16" fill="none" className="text-[#ed6140]">
            <path 
              d="M 6 8 Q 22 2, 38 8 T 70 8 T 102 8 T 134 8" 
              stroke="#ed6140" 
              strokeWidth="3" 
              strokeLinecap="round" 
              fill="none" 
            />
          </svg>
        </div>

        <p className="text-xs sm:text-sm text-gray-600 dark:text-white/60 font-medium font-ibm leading-relaxed pt-1">
          اختر سنتك الدراسية للوصول المباشر إلى الشروحات، بنوك الأسئلة، والمراجعات التأسيسية
        </p>
      </div>

      {/* ========================================================
          Artistic Cultural Grade Card Banners (3:2 Landscape - Waleed Style)
          ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...gradeStages.filter(s => s.id !== "grade-taasis")].reverse().map((stage, idx) => {
          const isSelected = selectedGrade === stage.id;

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectGrade(stage.id)}
              className="cursor-pointer"
            >
              <SpotlightCard
                spotlightColor="rgba(237, 97, 64, 0.16)"
                className={`group relative rounded-24 overflow-hidden aspect-[3/2] transition-all duration-300 shadow-md hover:shadow-2xl border ${
                  isSelected 
                    ? "ring-4 ring-[#ed6140] border-[#ed6140] scale-102 shadow-xl shadow-[#ed6140]/20" 
                    : "border-gray-200/80 dark:border-white/10 hover:border-[#ed6140]/60"
                }`}
              >
                {/* 1. Cultural Grade Banner Image (Landscape 1000x666) */}
                <img
                  src={stage.bannerImage || stage.badgeImage}
                  alt={stage.title}
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                  loading="lazy"
                />

                {/* 2. Top-Right Active Indicator Badge */}
                {isSelected && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#ed6140] text-white text-xs font-bold flex items-center gap-1 shadow-md z-20">
                    <Check className="w-3.5 h-3.5" />
                    <span>محدد</span>
                  </div>
                )}

                {/* 3. Bottom Pill with Course Count Indicator */}
                <div className="absolute bottom-3 left-3 z-20">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 dark:bg-black/75 backdrop-blur-xs text-[11px] font-bold text-gray-800 dark:text-white shadow-xs group-hover:bg-[#ed6140] group-hover:text-white transition-colors">
                    <span>{stage.subtitle}</span>
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* Subtle Hover Gradient Sheen */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              </SpotlightCard>
            </motion.div>
          );
        })}
      </div>

    </section>
  );
};
