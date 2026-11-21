import React from "react";
import { Lock, ArrowLeft, ShieldAlert } from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onRequireAuth?: () => void;
  requiredRole?: "student" | "admin";
  message?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback,
  onRequireAuth,
  requiredRole,
  message = "هذا المحتوى محمي ويتطلب تسجيل الدخول بحساب طالب مفعل.",
}) => {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-[280px] w-full flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="w-10 h-10 rounded-full border-3 border-[#ed6140] border-t-transparent animate-spin" />
        <p className="text-xs text-gray-500 dark:text-white/60 font-bold font-almarai">
          جارٍ التحقق من صلاحيات الجلسة وأمان الرمز...
        </p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="p-8 sm:p-12 rounded-24 bg-white dark:bg-[#14151c] border border-gray-200 dark:border-white/10 shadow-xl text-center space-y-5 max-w-lg mx-auto font-almarai my-8">
        <div className="w-16 h-16 rounded-24 bg-[#753b47]/15 text-[#fe6257] border border-[#753b47]/30 flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h3 className="font-black text-lg text-gray-900 dark:text-white">
            محتوى تعليمي محمي
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-white/70 leading-relaxed">
            {message}
          </p>
        </div>

        {onRequireAuth && (
          <button
            onClick={onRequireAuth}
            className="w-full py-3.5 px-6 rounded-14 font-black text-sm text-white bg-[#ed6140] hover:bg-[#d94f30] transition-all shadow-lg shadow-[#ed6140]/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>تسجيل الدخول أو إنشاء حساب</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="p-6 rounded-20 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-center font-almarai max-w-md mx-auto my-6 space-y-2">
        <ShieldAlert className="w-6 h-6 mx-auto" />
        <div className="font-bold text-sm">ليس لديك الصلاحية الكافية للوصول لهذا القسم</div>
      </div>
    );
  }

  return <>{children}</>;
};

// Re-export CourseAccessGuard for F5 Route Protection Contract
export { CourseAccessGuard } from "./CourseAccessGuard";
export type { CourseAccessGuardProps, AccessDenialReason } from "./CourseAccessGuard";

