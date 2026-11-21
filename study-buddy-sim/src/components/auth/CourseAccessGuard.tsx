import React from "react";
import { Lock, GraduationCap, ArrowLeft, MessageCircle, Sparkles } from "lucide-react";
import { CourseItem } from "../../data/mockData";
import { useAuthStore } from "../../stores/useAuthStore";

export type AccessDenialReason = "loading" | "unauthenticated" | "unenrolled";

export interface CourseAccessGuardProps {
  /** The unique identifier of the course to guard */
  courseId: string;
  /** Full course entity (optional, provides metadata like title, price, isFree) */
  course?: CourseItem | null;
  /** Optional course title if full course entity not passed */
  courseTitle?: string;
  /** Direct flag granting free access (e.g. promotional or introductory course) */
  isFree?: boolean;
  /** Optional lesson ID being accessed */
  lessonId?: string;
  /** Direct flag granting free preview for a specific lesson */
  isFreePreview?: boolean;
  /** The protected content to render when access is granted */
  children: React.ReactNode;
  /** Custom fallback renderer receiving the denial reason */
  fallback?: React.ReactNode | ((reason: AccessDenialReason) => React.ReactNode);
  /** Callback triggered when unauthenticated student clicks login CTA */
  onRequireAuth?: () => void;
  /** Callback triggered when unenrolled student clicks purchase/enroll CTA */
  onRequireEnroll?: (courseId: string, course?: CourseItem | null) => void;
  /** Callback alias for onRequireEnroll */
  onEnrollCourse?: (courseId: string) => void;
  /** Callback triggered when user clicks technical support CTA */
  onContactSupport?: () => void;
  /** Optional custom message overriding the default description */
  customMessage?: string;
  /** Message alias for customMessage */
  message?: string;
  /** UI presentation variant: "card" (default centered card), "banner" (inline strip), or "compact" */
  variant?: "card" | "banner" | "compact";
  /** Optional custom CSS classes for the container */
  className?: string;
}

export const CourseAccessGuard: React.FC<CourseAccessGuardProps> = ({
  courseId,
  course,
  courseTitle,
  isFree,
  isFreePreview,
  children,
  fallback,
  onRequireAuth,
  onRequireEnroll,
  onEnrollCourse,
  onContactSupport,
  customMessage,
  message,
  variant = "card",
  className = "",
}) => {
  const { user, isAuthenticated, isLoading, isEnrolled } = useAuthStore();
  const effectiveMessage = customMessage || message;
  const effectiveTitle = course?.title || courseTitle;

  const handleEnrollClick = () => {
    if (onRequireEnroll) {
      onRequireEnroll(courseId, course);
    }
    if (onEnrollCourse) {
      onEnrollCourse(courseId);
    }
  };

  // 1. Loading State (prevent flicker during session token hydration)
  if (isLoading) {
    if (typeof fallback === "function") {
      return <>{fallback("loading")}</>;
    }
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className={`min-h-[240px] w-full flex flex-col items-center justify-center p-8 text-center space-y-4 font-almarai ${className}`}>
        <div className="w-10 h-10 rounded-full border-3 border-[#fe6257] border-t-transparent animate-spin" />
        <p className="text-xs sm:text-sm text-gray-500 dark:text-white/60 font-bold">
          جارٍ التحقق من صلاحيات الاشتراك وأمان الحساب...
        </p>
      </div>
    );
  }

  // 2. Free Content Access Check (unconditionally permitted)
  const isContentFree = Boolean(isFree || course?.isFree || isFreePreview);
  if (isContentFree) {
    return <>{children}</>;
  }

  // 3. Unauthenticated Check
  if (!isAuthenticated || !user) {
    if (typeof fallback === "function") {
      return <>{fallback("unauthenticated")}</>;
    }
    if (fallback) {
      return <>{fallback}</>;
    }

    // Banner Variant
    if (variant === "banner") {
      return (
        <div className={`p-4 sm:p-5 rounded-16 bg-[#161926] border border-white/10 text-white flex flex-col sm:flex-row items-center justify-between gap-4 font-almarai text-right ${className}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-12 bg-[#753b47]/30 text-[#fe6257] flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">محتوى الكورس محمي • يتطلب تسجيل الدخول</h4>
              <p className="text-xs text-white/60">
                {effectiveMessage || "سجل الدخول بحسابك لمتابعة هذا الكورس والوصول للمواد التعليمية."}
              </p>
            </div>
          </div>
          {onRequireAuth && (
            <button
              onClick={onRequireAuth}
              className="w-full sm:w-auto px-5 py-2.5 rounded-12 font-bold text-xs text-white bg-[#ed6140] hover:bg-[#d94f30] transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <span>تسجيل الدخول أو إنشاء حساب</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      );
    }

    // Compact Variant
    if (variant === "compact") {
      return (
        <div 
          onClick={onRequireAuth}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-10 bg-[#753b47]/20 border border-[#fe6257]/30 text-[#fe6257] text-xs font-bold cursor-pointer hover:bg-[#753b47]/30 transition-all font-almarai ${className}`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>يتطلب تسجيل الدخول</span>
        </div>
      );
    }

    // Default Full Card Variant
    return (
      <div className={`p-6 sm:p-8 rounded-24 bg-white dark:bg-[#161926] border border-gray-200 dark:border-white/10 shadow-2xl text-center space-y-5 max-w-lg mx-auto font-almarai my-6 ${className}`}>
        <div className="w-16 h-16 rounded-24 bg-[#753b47]/15 text-[#fe6257] border border-[#753b47]/30 flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h3 className="font-black text-lg sm:text-xl text-gray-900 dark:text-white">
            محتوى الكورس محمي • يتطلب تسجيل الدخول
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-white/70 leading-relaxed">
            {effectiveMessage || "هذا المحتوى التعليمي مخصص لطلاب منصة مستر عمرو عارف. يرجى تسجيل الدخول بحسابك أو إنشاء حساب جديد للوصول الفوري."}
          </p>
        </div>

        {effectiveTitle && (
          <div className="p-3.5 rounded-14 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-right flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-gray-900 dark:text-white block">{effectiveTitle}</span>
              {course?.gradeName && (
                <span className="text-[11px] text-gray-500 dark:text-white/50">{course.gradeName}</span>
              )}
            </div>
            {course && course.price > 0 && (
              <span className="font-black text-[#fe6257] font-mono text-sm">
                {course.price} ج.م
              </span>
            )}
          </div>
        )}

        {onRequireAuth && (
          <button
            onClick={onRequireAuth}
            className="w-full py-3.5 px-6 rounded-14 font-black text-sm text-white bg-[#ed6140] hover:bg-[#d94f30] transition-all shadow-lg shadow-[#ed6140]/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>تسجيل الدخول أو إنشاء حساب جديد</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  // 4. Enrollment Check (Authenticated Student)
  const isUserEnrolled = isEnrolled(courseId) || user.role === "admin";
  if (!isUserEnrolled) {
    if (typeof fallback === "function") {
      return <>{fallback("unenrolled")}</>;
    }
    if (fallback) {
      return <>{fallback}</>;
    }

    // Banner Variant
    if (variant === "banner") {
      return (
        <div className={`p-4 sm:p-5 rounded-16 bg-[#161926] border border-white/10 text-white flex flex-col sm:flex-row items-center justify-between gap-4 font-almarai text-right ${className}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-12 bg-[#fe6257]/20 text-[#fe6257] flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">غير مشترك في هذا الكورس</h4>
              <p className="text-xs text-white/60">
                {effectiveMessage || `مرحباً يا ${user.fullName}، اشترك الآن في "${effectiveTitle || courseId}" لفتح جميع المحاضرات والملخصات والامتحانات.`}
              </p>
            </div>
          </div>
          {(onRequireEnroll || onEnrollCourse) && (
            <button
              onClick={handleEnrollClick}
              className="w-full sm:w-auto px-5 py-2.5 rounded-12 font-bold text-xs text-white bg-[#753b47] hover:bg-[#854351] transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <span>الاشتراك في الكورس الآن</span>
              <Sparkles className="w-3.5 h-3.5 text-[#fe6257]" />
            </button>
          )}
        </div>
      );
    }

    // Compact Variant
    if (variant === "compact") {
      return (
        <div 
          onClick={handleEnrollClick}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-10 bg-[#fe6257]/15 border border-[#fe6257]/30 text-[#fe6257] text-xs font-bold cursor-pointer hover:bg-[#fe6257]/25 transition-all font-almarai ${className}`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>يتطلب تفعيل الاشتراك</span>
        </div>
      );
    }

    // Default Full Card Variant
    return (
      <div className={`p-6 sm:p-8 rounded-24 bg-white dark:bg-[#161926] border border-gray-200 dark:border-white/10 shadow-2xl text-center space-y-5 max-w-lg mx-auto font-almarai my-6 ${className}`}>
        <div className="w-16 h-16 rounded-24 bg-[#fe6257]/15 text-[#fe6257] border border-[#fe6257]/30 flex items-center justify-center mx-auto shadow-inner">
          <GraduationCap className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h3 className="font-black text-lg sm:text-xl text-gray-900 dark:text-white">
            غير مشترك في هذا الكورس
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-white/70 leading-relaxed">
            {effectiveMessage || `أهلاً بك يا ${user.fullName} (${user.gradeName || "طالب"}). أنت مسجل كطالب، ولكن يلزم الاشتراك في "${effectiveTitle || courseId}" للوصول إلى المحاضرات والملخصات والامتحانات.`}
          </p>
        </div>

        {course && (
          <div className="p-4 rounded-16 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-center space-y-1">
            <div className="text-xs text-gray-500 dark:text-white/60 font-semibold">قيمة الاشتراك:</div>
            <div className="text-2xl font-black text-[#fe6257] font-mono">
              {course.price} <span className="text-xs font-bold font-almarai text-gray-700 dark:text-white/80">ج.م</span>
            </div>
            <div className="text-[11px] text-gray-500 dark:text-white/40 pt-1">
              شامل الشرح التفاعلي، الامتحانات الدورية والمذكرات بصيغة PDF
            </div>
          </div>
        )}

        <div className="space-y-2.5 pt-2">
          {(onRequireEnroll || onEnrollCourse) && (
            <button
              onClick={handleEnrollClick}
              className="w-full py-3.5 px-6 rounded-14 font-black text-sm text-white bg-[#753b47] hover:bg-[#854351] transition-all shadow-lg shadow-[#753b47]/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>الاشتراك في الكورس الآن</span>
              <Sparkles className="w-4 h-4 text-[#fe6257]" />
            </button>
          )}

          {onContactSupport && (
            <button
              onClick={onContactSupport}
              className="w-full py-2.5 px-4 rounded-12 font-bold text-xs text-gray-600 dark:text-white/70 hover:text-emerald-500 dark:hover:text-emerald-400 bg-transparent border border-gray-200 dark:border-white/10 hover:border-emerald-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-500" />
              <span>تواصل مع الدعم الفني للاشتراك عبر واتساب</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // 5. Entitlement Verified & Granted
  return <>{children}</>;
};
