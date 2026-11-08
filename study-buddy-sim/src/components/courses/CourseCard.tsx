import React from "react";
import { Clock, Play } from "lucide-react";
import { CourseItem, teacherProfile } from "../../data/mockData";

interface CourseCardProps {
  course: CourseItem;
  onOpenDetails: (course: CourseItem) => void;
  onEnrollNow: (course: CourseItem) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onOpenDetails,
  onEnrollNow,
}) => {
  return (
    <div className="group select-none flex flex-col text-right rounded-24 bg-white dark:bg-[#161926] hover:bg-orange-50/20 dark:hover:bg-[#1a1e2d] border border-gray-100 dark:border-white/10 hover:border-[#ed6140] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 font-almarai">
      
      {/* 1. Course Cover Thumbnail with Hover Play Button & Shimmer */}
      <div 
        onClick={() => onOpenDetails(course)}
        className="relative aspect-video w-full overflow-hidden cursor-pointer bg-gray-100 dark:bg-black/40"
      >
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Ambient Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Animated Play Button Icon on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <div className="w-12 h-12 rounded-full bg-white text-[#ed6140] flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-current translate-x-0.5" />
          </div>
        </div>
      </div>

      {/* 2. Course Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Title */}
        <h3 
          onClick={() => onOpenDetails(course)}
          className="font-black text-base sm:text-lg text-gray-900 dark:text-white group-hover:text-[#ed6140] cursor-pointer transition-colors line-clamp-1 leading-snug"
        >
          {course.title}
        </h3>

        {/* Teacher Row with Real Avatar and Verification Badge */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-[#ed6140] shadow-xs shrink-0">
            <img
              src={teacherProfile.avatar}
              alt={teacherProfile.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-gray-800 dark:text-white leading-tight">
              <span>{teacherProfile.name}</span>
              <span className="w-3.5 h-3.5 rounded-full bg-sky-500 text-white flex items-center justify-center text-[8px]" title="معلم موثق">
                ✓
              </span>
            </div>
            <div className="text-[11px] text-gray-500 dark:text-white/50 leading-tight font-semibold">
              أستاذ اللغة العربية
            </div>
          </div>
        </div>

        {/* Duration, Lectures Count & Price Row */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/5 text-xs font-bold">
          <div className="flex items-center gap-1.5 text-gray-600 dark:text-white/70">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span dir="ltr">{course.durationText}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-500 dark:text-white/60 text-[11px]">
              {course.lecturesCount} محاضرات
            </span>
            {course.isFree ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-500/15 border border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400">
                مجاناً
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-orange-100 dark:bg-orange-500/15 border border-orange-300 dark:border-orange-500/30 text-[#ed6140] font-mono">
                {course.price} ج.م
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons: عرض التفاصيل & الإشتراك في الكورس */}
        <div className="space-y-2 pt-1">
          <button
            onClick={() => onOpenDetails(course)}
            className="w-full py-2.5 rounded-12 text-xs font-bold text-gray-700 dark:text-white/80 hover:text-[#ed6140] border border-gray-200 dark:border-white/15 hover:border-[#ed6140] bg-gray-50 dark:bg-white/5 hover:bg-orange-50 dark:hover:bg-white/10 transition-all text-center cursor-pointer"
          >
            عرض التفاصيل والمنهج
          </button>

          <button
            onClick={() => onEnrollNow(course)}
            className="w-full py-2.5 rounded-12 text-xs font-black text-white bg-[#ed6140] hover:bg-[#d94f30] shadow-md shadow-[#ed6140]/25 transition-all text-center cursor-pointer active:scale-98"
          >
            {course.isFree ? "ابدأ المشاهدة الآن" : "الإشتراك في الكورس !"}
          </button>
        </div>

      </div>

    </div>
  );
};
