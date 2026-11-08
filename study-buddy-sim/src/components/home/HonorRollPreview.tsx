import React, { useState } from "react";
import { 
  Trophy, 
  ChevronLeft, 
  Medal,
  Award,
  GraduationCap,
  BookOpen
} from "lucide-react";
import { honorStudentsList } from "../../data/mockData";

interface HonorRollPreviewProps {
  onViewFullLeaderboard?: () => void;
}

export const HonorRollPreview: React.FC<HonorRollPreviewProps> = ({
  onViewFullLeaderboard,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Filter stages matching Mr. Amr Aref stages
  const stagePills = [
    { id: "all", title: "جميع المراحل", icon: Trophy },
    { id: "prep3", categoryId: 647, title: "الصف الثالث الاعدادي", icon: GraduationCap },
    { id: "prep2", categoryId: 646, title: "الصف الثاني الاعدادي", icon: BookOpen },
    { id: "prep1", categoryId: 645, title: "الصف الاول الاعدادي", icon: Award },
    { id: "prim6", categoryId: 644, title: "الصف السادس الابتدائي", icon: Medal },
  ];

  // Filter students based on active filter
  const filteredStudents = honorStudentsList.filter((s) => {
    if (activeFilter === "all") return true;
    const stage = stagePills.find((p) => p.id === activeFilter);
    if (!stage || !stage.categoryId) return true;
    return s.stageCategoryId === stage.categoryId || s.grade.includes(stage.title);
  });

  // Top 3 Podium Students
  const top1 = filteredStudents[0] || honorStudentsList[0];
  const top2 = filteredStudents[1] || honorStudentsList[1];
  const top3 = filteredStudents[2] || honorStudentsList[2];

  // Remaining students for ranked table
  const remainingStudents = filteredStudents.length > 3 
    ? filteredStudents.slice(3) 
    : honorStudentsList.slice(3);

  return (
    <section id="leaderboard" className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-8 select-none font-almarai">
      
      {/* 1. Top Section Header */}
      <div className="text-center mb-12 sm:mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black bg-orange-100 dark:bg-white/10 text-[#ed6140] border border-orange-200 dark:border-white/10">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>لوحة الشرف والتكريم</span>
        </div>
        
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
          لوحة الصدارة للطلاب المتفوقين
        </h2>
        
        <p className="text-sm sm:text-base text-gray-600 dark:text-white/60 max-w-2xl mx-auto leading-relaxed font-semibold">
          تعرف على فرسان لغة الضاد الأكثر نشاطاً وتفوقاً على منصة مستر عمرو عارف.
        </p>
      </div>

      {/* 2. Stage Filter Wrapper */}
      <div className="mb-12">
        <div className="flex items-center justify-center gap-2.5 sm:gap-3 flex-wrap">
          {stagePills.map((pill) => {
            const Icon = pill.icon;
            const isActive = activeFilter === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => setActiveFilter(pill.id)}
                className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#ed6140] text-white shadow-lg shadow-[#ed6140]/30 scale-105"
                    : "bg-white dark:bg-[#181920] text-gray-700 dark:text-white/70 hover:text-[#ed6140] border border-gray-200 dark:border-white/10 hover:border-[#ed6140]/40"
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isActive ? "bg-white/20 text-white" : "text-gray-400 dark:text-white/50"}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span>{pill.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Spotlight Section (Podium for Top 3 Students) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-end max-w-5xl mx-auto mb-16 pt-8">
        
        {/* === #2 Silver Podium Card (Rank 2) === */}
        <div className="order-2 md:order-1 flex flex-col items-center text-center">
          <div className="relative w-full rounded-28 bg-white dark:bg-[#181a24] border-2 border-slate-300 dark:border-slate-500/40 p-6 pt-12 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            
            {/* Crown #2 (Silver) */}
            <div className="absolute -top-7 inset-x-0 flex justify-center z-10 pointer-events-none">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
                <path d="M12 2L15 8L22 9L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9L9 8L12 2Z" fill="url(#silverGrad_preview)" stroke="#A0A0A0" strokeWidth="1" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="silverGrad_preview" x1="12" y1="2" x2="12" y2="21" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#E0E0E0"/>
                    <stop offset="50%" stopColor="#F5F5F5"/>
                    <stop offset="100%" stopColor="#9E9E9E"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Avatar with Silver Rank Badge */}
            <div className="relative w-24 h-24 mx-auto mb-4">
              <img
                src={top2.avatar}
                alt={top2.name}
                className="w-full h-full rounded-full object-cover border-4 border-slate-300 shadow-md"
              />
              <div className="absolute -bottom-2.5 inset-x-0 flex justify-center">
                <span className="px-3 py-0.5 rounded-full text-[11px] font-black bg-slate-400 text-slate-950 shadow-md">
                  #2 الترتيب
                </span>
              </div>
            </div>

            {/* Student Info */}
            <div className="space-y-1 mb-5">
              <h3 className="font-black text-base sm:text-lg text-gray-900 dark:text-white">
                {top2.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-white/50 font-mono" dir="ltr">
                {top2.username || `@user-${top2.id}`}
              </p>
            </div>

            {/* 4-Item Stats Grid */}
            <div className="grid grid-cols-4 gap-1.5 p-2 rounded-16 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 mb-4 text-center">
              <div className="space-y-0.5">
                <div className="text-[10px] text-gray-500 dark:text-white/50">كورسات</div>
                <div className="text-xs font-black text-gray-900 dark:text-white">{top2.purchasedCourses || 3}</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] text-gray-500 dark:text-white/50">دروس</div>
                <div className="text-xs font-black text-gray-900 dark:text-white">{top2.completedLessons || 7}</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] text-gray-500 dark:text-white/50">اختبارات</div>
                <div className="text-xs font-black text-gray-900 dark:text-white">{top2.passedExams || 1}</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] text-gray-500 dark:text-white/50">واجبات</div>
                <div className="text-xs font-black text-gray-900 dark:text-white">{top2.passedAssignments || 0}</div>
              </div>
            </div>

            {/* Total Points Badge */}
            <div className="pt-3 border-t border-gray-100 dark:border-white/10 flex items-center justify-between text-xs font-bold">
              <span className="text-gray-500 dark:text-white/60">مجموع النقاط:</span>
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-500/20 text-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-500/30">
                {top2.points} نقطة
              </span>
            </div>

          </div>
        </div>

        {/* === #1 Gold Podium Card (Rank 1 - Elevated Center) === */}
        <div className="order-1 md:order-2 flex flex-col items-center text-center -translate-y-4 sm:-translate-y-6">
          <div className="relative w-full rounded-28 bg-gradient-to-b from-amber-50/80 via-white to-amber-50/40 dark:from-[#222430] dark:via-[#1c1e28] dark:to-[#171822] border-2 border-amber-400 p-6 pt-14 shadow-2xl shadow-amber-500/20 hover:-translate-y-2 transition-all duration-300">
            
            {/* Crown #1 (Gold) */}
            <div className="absolute -top-9 inset-x-0 flex justify-center z-10 pointer-events-none">
              <svg width="58" height="58" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_10px_20px_rgba(255,215,0,0.5)] animate-bounce">
                <path d="M12 2L15 8L22 9L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9L9 8L12 2Z" fill="url(#goldGrad_preview)" stroke="#DAA520" strokeWidth="1" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="goldGrad_preview" x1="12" y1="2" x2="12" y2="21" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FFE259"/>
                    <stop offset="100%" stopColor="#FFA751"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Avatar with Pulsing Gold Glow & Rank Badge */}
            <div className="relative w-28 h-28 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-md animate-pulse" />
              <img
                src={top1.avatar}
                alt={top1.name}
                className="relative w-full h-full rounded-full object-cover border-4 border-amber-400 shadow-xl"
              />
              <div className="absolute -bottom-3 inset-x-0 flex justify-center z-10">
                <span className="px-3.5 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-lg">
                  #1 الترتيب
                </span>
              </div>
            </div>

            {/* Student Info */}
            <div className="space-y-1 mb-5">
              <h3 className="font-black text-lg sm:text-xl text-gray-900 dark:text-white">
                {top1.name}
              </h3>
              <p className="text-xs text-amber-700 dark:text-amber-300 font-mono" dir="ltr">
                {top1.username || `@user-${top1.id}`}
              </p>
            </div>

            {/* 4-Item Stats Grid */}
            <div className="grid grid-cols-4 gap-1.5 p-2.5 rounded-16 bg-amber-100/60 dark:bg-amber-400/10 border border-amber-300 dark:border-amber-400/20 mb-4 text-center">
              <div className="space-y-0.5">
                <div className="text-[10px] text-amber-800 dark:text-amber-200/60">كورسات</div>
                <div className="text-xs font-black text-amber-950 dark:text-amber-300">{top1.purchasedCourses || 3}</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] text-amber-800 dark:text-amber-200/60">دروس</div>
                <div className="text-xs font-black text-amber-950 dark:text-amber-300">{top1.completedLessons || 3}</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] text-amber-800 dark:text-amber-200/60">اختبارات</div>
                <div className="text-xs font-black text-amber-950 dark:text-amber-300">{top1.passedExams || 1}</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] text-amber-800 dark:text-amber-200/60">واجبات</div>
                <div className="text-xs font-black text-amber-950 dark:text-amber-300">{top1.passedAssignments || 0}</div>
              </div>
            </div>

            {/* Total Points Badge */}
            <div className="pt-3 border-t border-amber-300 dark:border-amber-400/20 flex items-center justify-between text-xs font-bold">
              <span className="text-amber-900 dark:text-amber-200/80">مجموع النقاط:</span>
              <span className="px-3.5 py-1 rounded-full bg-amber-400 text-black font-black shadow-md">
                {top1.points} نقطة
              </span>
            </div>

          </div>
        </div>

        {/* === #3 Bronze Podium Card (Rank 3) === */}
        <div className="order-3 flex flex-col items-center text-center">
          <div className="relative w-full rounded-28 bg-white dark:bg-[#181a24] border-2 border-amber-700/30 dark:border-amber-800/40 p-6 pt-12 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            
            {/* Crown #3 (Bronze) */}
            <div className="absolute -top-7 inset-x-0 flex justify-center z-10 pointer-events-none">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
                <path d="M12 2L15 8L22 9L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9L9 8L12 2Z" fill="url(#bronzeGrad_preview)" stroke="#A0522D" strokeWidth="1" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="bronzeGrad_preview" x1="12" y1="2" x2="12" y2="21" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#E5A97C"/>
                    <stop offset="50%" stopColor="#F1C2A2"/>
                    <stop offset="100%" stopColor="#A75A28"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Avatar with Bronze Rank Badge */}
            <div className="relative w-24 h-24 mx-auto mb-4">
              <img
                src={top3.avatar}
                alt={top3.name}
                className="w-full h-full rounded-full object-cover border-4 border-amber-700/50 shadow-md"
              />
              <div className="absolute -bottom-2.5 inset-x-0 flex justify-center">
                <span className="px-3 py-0.5 rounded-full text-[11px] font-black bg-amber-800 text-amber-100 shadow-md">
                  #3 الترتيب
                </span>
              </div>
            </div>

            {/* Student Info */}
            <div className="space-y-1 mb-5">
              <h3 className="font-black text-base sm:text-lg text-gray-900 dark:text-white">
                {top3.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-white/50 font-mono" dir="ltr">
                {top3.username || `@user-${top3.id}`}
              </p>
            </div>

            {/* 4-Item Stats Grid */}
            <div className="grid grid-cols-4 gap-1.5 p-2 rounded-16 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 mb-4 text-center">
              <div className="space-y-0.5">
                <div className="text-[10px] text-gray-500 dark:text-white/50">كورسات</div>
                <div className="text-xs font-black text-gray-900 dark:text-white">{top3.purchasedCourses || 3}</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] text-gray-500 dark:text-white/50">دروس</div>
                <div className="text-xs font-black text-gray-900 dark:text-white">{top3.completedLessons || 7}</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] text-gray-500 dark:text-white/50">اختبارات</div>
                <div className="text-xs font-black text-gray-900 dark:text-white">{top3.passedExams || 1}</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] text-gray-500 dark:text-white/50">واجبات</div>
                <div className="text-xs font-black text-gray-900 dark:text-white">{top3.passedAssignments || 0}</div>
              </div>
            </div>

            {/* Total Points Badge */}
            <div className="pt-3 border-t border-gray-100 dark:border-white/10 flex items-center justify-between text-xs font-bold">
              <span className="text-gray-500 dark:text-white/60">مجموع النقاط:</span>
              <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800/40">
                {top3.points} نقطة
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* 4. Ranked Students Table */}
      <div className="w-full rounded-28 bg-white dark:bg-[#14151c] border border-gray-200 dark:border-white/10 shadow-xl p-6 sm:p-8">
        
        {/* Title Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-white/10 mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">
              ترتيب باقي الطلاب
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 dark:bg-white/10 text-[#ed6140]">
              {remainingStudents.length} طلاب
            </span>
          </div>

          {onViewFullLeaderboard && (
            <button
              onClick={onViewFullLeaderboard}
              className="text-xs sm:text-sm font-bold text-[#ed6140] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>عرض تفاصيل الترتيب</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            
            {/* Header */}
            <div className="grid grid-cols-[70px_1fr_90px_90px_90px_90px_110px] px-4 py-3 rounded-12 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/60 text-xs font-black text-center items-center mb-2">
              <span className="text-right pr-2">الترتيب</span>
              <span className="text-right">الطالب</span>
              <span>الكورسات</span>
              <span>الدروس</span>
              <span>الاختبارات</span>
              <span>الواجبات</span>
              <span>مجموع النقاط</span>
            </div>

            {/* Rows */}
            <div className="space-y-2">
              {remainingStudents.map((student) => (
                <div
                  key={student.id}
                  className="grid grid-cols-[70px_1fr_90px_90px_90px_90px_110px] px-4 py-3.5 rounded-16 bg-gray-50 dark:bg-[#1a1c24] hover:bg-orange-50/50 dark:hover:bg-[#20222e] border border-gray-100 dark:border-white/5 transition-all text-center items-center font-bold"
                >
                  {/* Rank */}
                  <div className="text-right pr-2 font-mono font-black text-sm text-[#ed6140]">
                    #{student.rank}
                  </div>

                  {/* Student Name & Username */}
                  <div className="flex items-center gap-3 text-right">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-white/20 shrink-0"
                    />
                    <div className="space-y-0.5">
                      <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                        {student.name}
                      </div>
                      <div className="text-[10px] text-gray-400 dark:text-white/40 font-mono" dir="ltr">
                        {student.username || `@user-${student.id}`}
                      </div>
                    </div>
                  </div>

                  {/* Purchased Courses */}
                  <div className="text-xs text-gray-700 dark:text-white/80 font-mono">
                    {student.purchasedCourses || 1}
                  </div>

                  {/* Completed Lessons */}
                  <div className="text-xs text-gray-700 dark:text-white/80 font-mono">
                    {student.completedLessons || 5}
                  </div>

                  {/* Passed Exams */}
                  <div className="text-xs text-gray-700 dark:text-white/80 font-mono">
                    {student.passedExams || 0}
                  </div>

                  {/* Passed Assignments */}
                  <div className="text-xs text-gray-700 dark:text-white/80 font-mono">
                    {student.passedAssignments || 0}
                  </div>

                  {/* Points Badge */}
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-orange-100 dark:bg-[#ed6140]/15 text-[#ed6140] font-mono">
                      {student.points} نقطة
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

    </section>
  );
};
