import React, { useState, useRef, useEffect } from "react";
import { 
  User as UserIcon, 
  LogOut, 
  BookOpen, 
  ShieldCheck, 
  Smartphone, 
  ChevronDown, 
  GraduationCap,
  Sparkles,
  Headphones,
  Receipt
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../stores/useAuthStore";
import { PurchaseHistoryModal } from "../payment/PurchaseHistoryModal";

interface UserProfileDropdownProps {
  onNavigate?: (section: string) => void;
  onOpenWhatsApp?: () => void;
  onOpenPurchaseHistory?: () => void;
}

export const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
  onNavigate,
  onOpenWhatsApp,
  onOpenPurchaseHistory,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPurchaseHistoryOpen, setIsPurchaseHistoryOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuthStore();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  // Derive initials from full name
  const initials = user.fullName
    ? user.fullName
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join(" ")
    : "ط";

  const enrolledCount = user.enrolledCourseIds ? user.enrolledCourseIds.length : 0;

  return (
    <div className="relative font-almarai" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-14 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 transition-all text-right cursor-pointer group select-none"
        aria-expanded={isOpen}
        aria-label="قائمة حساب الطالب"
      >
        {/* Student Avatar */}
        <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-[#753b47] to-[#fe6257] text-white flex items-center justify-center font-black text-xs shadow-md border-2 border-white dark:border-[#161926] shrink-0">
          {initials}
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#161926]" />
        </div>

        {/* Name and Grade (Hidden on smallest mobile) */}
        <div className="hidden sm:block text-right leading-tight max-w-[120px] lg:max-w-[150px]">
          <div className="text-xs font-black text-gray-900 dark:text-white truncate group-hover:text-[#ed6140] transition-colors">
            {user.fullName}
          </div>
          <div className="text-[10px] text-gray-500 dark:text-white/50 truncate">
            {user.gradeName}
          </div>
        </div>

        <ChevronDown 
          className={`w-4 h-4 text-gray-400 group-hover:text-[#ed6140] transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#ed6140]" : ""
          }`} 
        />
      </button>

      {/* Animated Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.16 }}
            className="absolute top-full left-0 sm:left-auto sm:right-0 mt-2 w-72 sm:w-80 rounded-20 bg-white dark:bg-[#14151c] border border-gray-200 dark:border-white/15 shadow-2xl p-3 z-50 text-right text-xs select-none backdrop-blur-xl"
          >
            {/* Student Card Summary */}
            <div className="p-3 rounded-16 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 space-y-2 mb-2">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-14 bg-gradient-to-tr from-[#753b47] to-[#fe6257] text-white flex items-center justify-center font-black text-sm shadow-md shrink-0">
                  {initials}
                </div>
                <div className="overflow-hidden">
                  <div className="font-black text-sm text-gray-900 dark:text-white truncate">
                    {user.fullName}
                  </div>
                  <div className="text-[11px] text-gray-500 dark:text-white/60 flex items-center gap-1 font-mono" dir="ltr">
                    <Smartphone className="w-3 h-3 text-gray-400" />
                    <span>{user.studentPhone}</span>
                  </div>
                </div>
              </div>

              {/* Badges Bar */}
              <div className="flex items-center gap-1.5 pt-1 border-t border-gray-200/60 dark:border-white/10 flex-wrap">
                <span className="px-2 py-0.5 rounded-full bg-[#753b47]/10 dark:bg-[#753b47]/30 text-[#753b47] dark:text-[#fe6257] font-bold text-[10px] flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" />
                  <span>{user.gradeName}</span>
                </span>

                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>جهاز موثق (1/1)</span>
                </span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-1.5 py-1 text-center font-bold">
              <div className="p-2 rounded-12 bg-gray-50 dark:bg-white/5">
                <div className="text-[10px] text-gray-400 dark:text-white/40">الكورسات المشترك بها</div>
                <div className="text-sm font-black text-gray-900 dark:text-white font-mono mt-0.5">
                  {enrolledCount}
                </div>
              </div>
              <div className="p-2 rounded-12 bg-gray-50 dark:bg-white/5">
                <div className="text-[10px] text-gray-400 dark:text-white/40">حالة الحساب</div>
                <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                  مفعل ✦
                </div>
              </div>
            </div>

            {/* Action Links */}
            <div className="space-y-1 pt-2 border-t border-gray-100 dark:border-white/10">
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (onNavigate) onNavigate("courses");
                }}
                className="w-full px-3 py-2.5 rounded-12 text-gray-700 dark:text-white/80 hover:bg-orange-50 dark:hover:bg-white/10 hover:text-[#ed6140] transition-colors flex items-center justify-between font-bold cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#ed6140]" />
                  <span>كورساتي ومحاضراتي</span>
                </div>
                <span className="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-white/10 text-[10px] font-mono">
                  {enrolledCount}
                </span>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  if (onOpenPurchaseHistory) {
                    onOpenPurchaseHistory();
                  } else {
                    setIsPurchaseHistoryOpen(true);
                  }
                }}
                className="w-full px-3 py-2.5 rounded-12 text-gray-700 dark:text-white/80 hover:bg-purple-50 dark:hover:bg-white/10 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center justify-between font-bold cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-purple-500" />
                  <span>سجل المدفوعات والفواتير</span>
                </div>
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">إيصالات</span>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  if (onOpenWhatsApp) onOpenWhatsApp();
                }}
                className="w-full px-3 py-2.5 rounded-12 text-gray-700 dark:text-white/80 hover:bg-emerald-50 dark:hover:bg-white/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center justify-between font-bold cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-emerald-500" />
                  <span>الدعم الفني المباشر</span>
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">واتساب</span>
              </button>
            </div>

            {/* Logout Action */}
            <div className="pt-2 mt-2 border-t border-gray-100 dark:border-white/10">
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="w-full px-3 py-2.5 rounded-12 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors flex items-center justify-between font-black cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل الخروج من الحساب</span>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Embedded Purchase History Modal */}
      <PurchaseHistoryModal
        isOpen={isPurchaseHistoryOpen}
        onClose={() => setIsPurchaseHistoryOpen(false)}
        onOpenCourse={(courseId) => {
          if (onNavigate) onNavigate("courses");
        }}
      />
    </div>
  );
};
