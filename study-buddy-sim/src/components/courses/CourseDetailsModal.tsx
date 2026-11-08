import React, { useState } from "react";
import { 
  X, 
  Play, 
  FileText, 
  HelpCircle, 
  Clock, 
  BookOpen, 
  Users, 
  Star, 
  Lock, 
  ChevronDown, 
  ChevronUp,
  Share2,
  Heart,
  Flag,
  Calendar,
  Layers,
  GraduationCap
} from "lucide-react";
import { CourseItem, teacherProfile } from "../../data/mockData";

interface CourseDetailsModalProps {
  course: CourseItem | null;
  onClose: () => void;
  onEnrollNow: (course: CourseItem) => void;
  onOpenWhatsApp: () => void;
}

export const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({
  course,
  onClose,
  onEnrollNow,
  onOpenWhatsApp,
}) => {
  const [activeTab, setActiveTab] = useState<"about" | "content" | "comments" | "reviews">("content");
  const [expandedUnitId, setExpandedUnitId] = useState<string>("chapter-194");
  const [previewLessonTitle, setPreviewLessonTitle] = useState<string | null>(null);

  if (!course) return null;

  const toggleUnit = (unitId: string) => {
    setExpandedUnitId(expandedUnitId === unitId ? "" : unitId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200 select-none">
      
      {/* Exact El-Ameed Course Modal / View Structure matching course_desktop_1440.png */}
      <div className="relative w-full max-w-5xl max-h-[94vh] flex flex-col rounded-24 bg-[#14151c] border border-white/10 shadow-2xl overflow-hidden text-right my-auto">
        
        {/* Top Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-30 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 flex items-center justify-center text-white transition-all shadow-md"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Body */}
        <div className="overflow-y-auto divide-y divide-white/5">
          
          {/* 1. Course Hero Banner (matching course_desktop_1440.png) */}
          <div className="relative min-h-[260px] sm:h-72 bg-gradient-to-l from-[#1e1f26] via-[#24171d] to-[#1e1f26] text-white p-6 sm:p-10 flex flex-col justify-end overflow-hidden">
            {/* Ambient Background Wave */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#fe6257_1px,transparent_1px)] [background-size:20px_20px]" />
            
            <div className="max-w-2xl space-y-2.5 z-10">
              {/* Breadcrumb */}
              <div className="text-xs text-white/60 font-semibold flex items-center gap-1.5">
                <span>كورسات</span>
                <span>&gt;</span>
                <span className="text-[var(--accent)] font-bold">{course.gradeName}</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                {course.title}
              </h1>

              {/* Meta information matching course_desktop_1440.png */}
              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-white/80">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-white/60" />
                  <span>{course.lecturesCount} محاضرات</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-white/60" />
                  <span>{course.studentCount} الطلاب</span>
                </span>
              </div>

              {/* Teacher Row in Hero */}
              <div className="pt-2 flex items-center gap-2.5">
                <img
                  src={teacherProfile.avatar}
                  alt={teacherProfile.name}
                  className="w-8 h-8 rounded-full object-cover border border-white/20"
                />
                <div>
                  <div className="text-xs font-bold text-white">{teacherProfile.name}</div>
                  <div className="text-[10px] text-white/50">مدرس أول لغة عربية</div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Asymmetric Split: Body Content on Right, Buy Sidebar on Left (RTL) */}
          <div className="p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            
            {/* Right Column: 4 Tabs & Content */}
            <div className="lg:col-span-8 space-y-6 order-2 lg:order-1">
              
              {/* 4 Navigation Tabs (.course-tabs-card) */}
              <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto scrollbar-none text-xs sm:text-sm font-bold">
                <button
                  onClick={() => setActiveTab("content")}
                  className={`px-4 py-2 rounded-12 transition-colors ${
                    activeTab === "content"
                      ? "bg-[#753b47] text-white"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  المحتوى
                </button>

                <button
                  onClick={() => setActiveTab("about")}
                  className={`px-4 py-2 rounded-12 transition-colors ${
                    activeTab === "about"
                      ? "bg-[#753b47] text-white"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  عن الكورس
                </button>

                <button
                  onClick={() => setActiveTab("comments")}
                  className={`px-4 py-2 rounded-12 transition-colors ${
                    activeTab === "comments"
                      ? "bg-[#753b47] text-white"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  التعليقات 0
                </button>

                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`px-4 py-2 rounded-12 transition-colors ${
                    activeTab === "reviews"
                      ? "bg-[#753b47] text-white"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  التقييمات 0
                </button>
              </div>

              {/* Tab 1: Curriculum Content Accordion */}
              {activeTab === "content" && (
                <div className="space-y-4">
                  
                  {/* Overview Card matching course_desktop_1440.png */}
                  <div className="p-4 rounded-16 bg-[#1a1c24] border border-white/10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-12 bg-white/5 flex items-center justify-center text-white/80 shrink-0">
                      <GraduationCap className="w-5 h-5 text-white/80" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">نظرة عامة على المنهج</h4>
                      <p className="text-xs text-white/50">
                        يحتوي هذا الكورس 1 وحدات، 8 دروساً، و 0 ساعة من المواد.
                      </p>
                    </div>
                  </div>

                  {/* Free Video Preview simulation */}
                  {previewLessonTitle && (
                    <div className="p-4 rounded-16 bg-black text-white space-y-2 border border-white/20 animate-in fade-in">
                      <div className="flex items-center justify-between text-xs pb-1 border-b border-white/10">
                        <span className="font-bold text-[#fe6257]">مشغل الفيديو المحمي • معاينة مجانية</span>
                        <button 
                          onClick={() => setPreviewLessonTitle(null)}
                          className="text-white/60 hover:text-white px-2 py-0.5 rounded bg-white/10"
                        >
                          إغلاق
                        </button>
                      </div>
                      <div className="aspect-video bg-[#0b0c10] rounded-12 flex items-center justify-center relative overflow-hidden">
                        {/* Dynamic Moving Watermark (Forensic Rule from REA Report) */}
                        <div className="absolute top-1/4 right-1/4 px-2.5 py-1 rounded bg-black/60 text-[10px] font-mono text-white/60 border border-white/10 pointer-events-none select-none animate-float-badge">
                          طالب: أحمد محمد • 01012345678 • ID: 10482
                        </div>
                        <div className="text-center space-y-3 p-4">
                          <div className="w-16 h-16 rounded-full bg-[#753b47] flex items-center justify-center mx-auto shadow-2xl hover:scale-110 transition-transform cursor-pointer">
                            <Play className="w-7 h-7 text-white fill-white ml-1" />
                          </div>
                          <h4 className="text-sm font-bold text-white max-w-md">{previewLessonTitle}</h4>
                          <span className="text-[11px] text-white/50 block">جودة العرض: 1080p • سيرفر سريع وخاص</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Units Accordion (#chaptersAccordion) */}
                  <div className="space-y-3">
                    {course.units.map((unit) => {
                      const isExpanded = expandedUnitId === unit.id;
                      return (
                        <div
                          key={unit.id}
                          className="rounded-16 border border-white/10 bg-[#1a1c24] overflow-hidden shadow-sm"
                        >
                          {/* Unit Title Header */}
                          <button
                            onClick={() => toggleUnit(unit.id)}
                            className="w-full p-4 flex items-center justify-between text-right hover:bg-white/5 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-12 bg-white/5 text-white flex items-center justify-center">
                                <Layers className="w-4 h-4 text-white/80" />
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-white">
                                  {unit.title}
                                </h4>
                                <span className="text-[11px] text-white/50">
                                  {unit.lessonsCount} الأجزاء
                                </span>
                              </div>
                            </div>

                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-white/60" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-white/60" />
                            )}
                          </button>

                          {/* Unit Lessons List */}
                          {isExpanded && (
                            <div className="border-t border-white/5 divide-y divide-white/5 bg-black/20">
                              {unit.lessons.map((lesson) => (
                                <div
                                  key={lesson.id}
                                  className="p-3.5 flex items-center justify-between text-xs hover:bg-white/5 transition-colors"
                                >
                                  <div className="flex items-center gap-2.5">
                                    {lesson.type === "video" && <Play className="w-3.5 h-3.5 text-white/70" />}
                                    {lesson.type === "pdf" && <FileText className="w-3.5 h-3.5 text-[#3fcd82]" />}
                                    {lesson.type === "quiz" && <HelpCircle className="w-3.5 h-3.5 text-[#ffa200]" />}
                                    
                                    <span className="font-bold text-white/90">
                                      {lesson.title}
                                    </span>
                                  </div>

                                  <div>
                                    {lesson.isFreePreview ? (
                                      <button
                                        onClick={() => setPreviewLessonTitle(lesson.title)}
                                        className="px-2.5 py-1 rounded-8 text-[11px] font-bold bg-[#753b47] text-white hover:bg-[#854351] transition-all"
                                      >
                                        معاينة مجانية
                                      </button>
                                    ) : (
                                      <span className="flex items-center gap-1 text-[11px] text-white/40 font-medium">
                                        <Lock className="w-3 h-3" />
                                        مغلق
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                </div>
              )}

              {/* Tab 2: About Course */}
              {activeTab === "about" && (
                <div className="p-6 rounded-16 bg-[#1a1c24] border border-white/10 space-y-4 text-sm leading-relaxed text-white">
                  <h4 className="font-bold text-base text-white">عن محتوى الكورس:</h4>
                  <p className="text-white/80">{course.longDescription}</p>
                </div>
              )}

              {/* Tab 3: Comments */}
              {activeTab === "comments" && (
                <div className="p-8 rounded-16 bg-[#1a1c24] border border-white/10 text-center text-xs text-white/50 space-y-2">
                  <p>لا توجد تعليقات حتى الآن في هذا الكورس.</p>
                  <p className="text-white/40">سجل دخولك لتتمكن من إضافة استفسارك للمعلم.</p>
                </div>
              )}

              {/* Tab 4: Reviews */}
              {activeTab === "reviews" && (
                <div className="p-8 rounded-16 bg-[#1a1c24] border border-white/10 space-y-4 text-center">
                  <div className="text-3xl font-black text-[#ffa200] flex items-center justify-center gap-2">
                    <Star className="w-7 h-7 fill-current" />
                    <span>{course.rating.toFixed(1)} / 5.0</span>
                  </div>
                  <p className="text-xs text-white/50">
                    بناءً على تقييم {course.reviewsCount} طالب مشترك في هذا الكورس
                  </p>
                </div>
              )}

            </div>

            {/* Left Column (Sidebar): Cover, Price, Inclusions, Specs, Teacher Profile */}
            <div className="lg:col-span-4 space-y-5 order-1 lg:order-2">
              
              {/* Card 1: Thumbnail + Price + Enroll CTA */}
              <div className="rounded-24 bg-[#1a1c24] border border-white/10 overflow-hidden shadow-xl">
                <div className="relative aspect-video w-full">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-5 space-y-4">
                  {/* Price Display */}
                  <div className="text-center">
                    {course.isFree ? (
                      <span className="text-2xl font-black text-[#fe6257]">
                        مجاني
                      </span>
                    ) : (
                      <div className="text-3xl font-black text-white">
                        {course.price} <span className="text-sm font-bold">ج.م</span>
                      </div>
                    )}
                  </div>

                  {/* Action CTA */}
                  <button
                    onClick={() => onEnrollNow(course)}
                    className="w-full py-3 rounded-12 font-black text-xs sm:text-sm text-white bg-[#753b47] hover:bg-[#854351] shadow-md transition-all text-center"
                  >
                    الإشتراك في الكورس
                  </button>

                  {/* Inclusions matching course_desktop_1440.png */}
                  <div className="pt-3 border-t border-white/5 space-y-2 text-xs text-white/70">
                    <div className="font-bold text-white text-[11px] mb-2">يتضمن هذا الكورس:</div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                      <span>دعم المحاضر</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                      <span>منتدى الكورس</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                      <span>غرفة الدردشة</span>
                    </div>
                  </div>

                  {/* Share & Favorite icons */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-around text-xs text-white/60">
                    <button className="flex items-center gap-1 hover:text-white transition-colors">
                      <Heart className="w-3.5 h-3.5" />
                      <span>مفضل</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-white transition-colors">
                      <Share2 className="w-3.5 h-3.5" />
                      <span>مشاركة</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-white transition-colors">
                      <Flag className="w-3.5 h-3.5" />
                      <span>إبلاغ عن محتوى</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 2: مواصفات الكورس (Course Specifications) */}
              <div className="rounded-24 bg-[#1a1c24] border border-white/10 p-5 space-y-3 text-xs text-white/80">
                <div className="font-bold text-sm text-white border-b border-white/5 pb-2">
                  مواصفات الكورس
                </div>

                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-white/50">الأقسام:</span>
                  <span className="font-bold text-white">1</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-white/50">دروس:</span>
                  <span className="font-bold text-white">{course.lecturesCount}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-white/50">السعة:</span>
                  <span className="font-bold text-white">غير محدود</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-white/50">المدة:</span>
                  <span className="font-bold text-white" dir="ltr">{course.durationText}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-white/50">الطلاب:</span>
                  <span className="font-bold text-white">{course.studentCount}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-white/50">تاريخ الإنشاء:</span>
                  <span className="font-bold text-white">6 أغسطس 2026</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-white/50">تاريخ التحديث:</span>
                  <span className="font-bold text-white">31 أكتوبر 2026</span>
                </div>
              </div>

              {/* Card 3: مستر محمد العميد Profile Card */}
              <div className="rounded-24 bg-[#1a1c24] border border-white/10 p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={teacherProfile.avatar}
                    alt={teacherProfile.name}
                    className="w-12 h-12 rounded-full object-cover border border-white/20"
                  />
                  <div>
                    <h5 className="font-bold text-sm text-white">
                      {teacherProfile.name}
                    </h5>
                    <p className="text-xs text-[var(--accent)] font-semibold">
                      عميد اللغة العربية
                    </p>
                  </div>
                </div>

                <button
                  onClick={onOpenWhatsApp}
                  className="w-full py-2.5 rounded-12 text-xs font-bold text-white bg-[#753b47] hover:bg-[#854351] transition-all text-center"
                >
                  الملف الشخصي
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
