import React, { useState } from "react";
import {
  ChevronDown,
  Menu,
  X,
  Search,
  UserPlus,
  Trophy,
  Phone,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { gradeStages } from "../../data/mockData";
import { AmrArefCalligraphyLogo } from "../common/AmrArefCalligraphyLogo";
import { WaleedThemeToggle } from "../common/WaleedThemeToggle";
import { useAuthStore } from "../../stores/useAuthStore";
import { UserProfileDropdown } from "../auth/UserProfileDropdown";

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
  onOpenAuth: (mode: "login" | "register") => void;
  onNavigate: (section: string) => void;
  onSelectGrade: (gradeId: string) => void;
  cartCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  isDark,
  toggleTheme,
  onOpenAuth,
  onNavigate,
  onSelectGrade,
}) => {
  const [gradesDropdownOpen, setGradesDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const { isAuthenticated, user, logout } = useAuthStore();

  const navItems = [
    { id: "home", label: "الرئيسية" },
    { id: "grades", label: "السنوات الدراسية", hasDropdown: true },
    { id: "courses", label: "الكورسات المقترحة" },
    { id: "leaderboard", label: "لوحة الشرف", icon: Trophy, isAccent: true },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    onNavigate(id);
    setMobileMenuOpen(false);
    setGradesDropdownOpen(false);
  };

  const handleGradeSelect = (gradeId: string) => {
    onSelectGrade(gradeId);
    setGradesDropdownOpen(false);
    setMobileMenuOpen(false);
    onNavigate("courses");
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 pt-3 px-3 sm:px-6 md:px-8 pointer-events-none select-none font-almarai">
      {/* Main Sticky Navigation Bar - Sleek Glassmorphic with Subtle Border */}
      <div className="max-w-7xl mx-auto rounded-2xl bg-white/85 dark:bg-[#121520]/85 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.35)] border border-gray-200/70 dark:border-white/10 px-3.5 sm:px-5 lg:px-6 h-18 sm:h-20 flex items-center justify-between gap-2 lg:gap-4 pointer-events-auto transition-all duration-300">

        {/* Right Side (RTL Start): Brand Signature & Theme Controls */}
        <div
          onClick={() => handleNavClick("home")}
          className="flex items-center gap-2.5 sm:gap-4 cursor-pointer group shrink-0 pr-0.5 sm:pr-2"
        >
          {/* Authentic Calligraphy Logo with responsive size and proper breathing room */}
          <div className="flex items-center pl-1 sm:pl-2 shrink-0">
            <AmrArefCalligraphyLogo size="sm" className="sm:hidden shrink-0" />
            <AmrArefCalligraphyLogo size="md" className="hidden sm:inline-flex shrink-0" />
          </div>

          {/* Theme Switcher next to brand on desktop */}
          <div className="hidden sm:flex items-center shrink-0">
            <WaleedThemeToggle isDark={isDark} onToggle={toggleTheme} />
          </div>

          {/* Authentic Arabic Identity Badge - 2xl only to preserve navbar space */}
          <div className="hidden 2xl:flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-700 dark:text-amber-300 shrink-0 whitespace-nowrap">
            <span>لُغَةُ الضَّادِ</span>
            <span className="text-amber-500">✦</span>
          </div>
        </div>

        {/* Center: Clean Nav Links with white-space: nowrap */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 shrink-0">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const ItemIcon = item.icon;

            if (item.hasDropdown) {
              return (
                <div key={item.id} className="relative shrink-0">
                  <button
                    onClick={() => setGradesDropdownOpen(!gradesDropdownOpen)}
                    className={`px-2.5 xl:px-3.5 py-2 rounded-10 text-xs xl:text-sm font-bold transition-all flex items-center gap-1 cursor-pointer font-almarai whitespace-nowrap shrink-0 ${gradesDropdownOpen || isActive
                      ? "text-[#ed6140] bg-orange-50 dark:bg-white/10"
                      : "text-gray-700 dark:text-white/80 hover:text-[#ed6140] hover:bg-gray-50 dark:hover:bg-white/5"
                      }`}
                  >
                    <span className="whitespace-nowrap">{item.label}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform duration-200 ${gradesDropdownOpen ? "rotate-180 text-[#ed6140]" : ""}`} />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {gradesDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.96 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-full right-0 mt-2 w-64 rounded-16 bg-white dark:bg-[#1a1e2d] border border-gray-100 dark:border-white/15 shadow-2xl p-2 z-50 text-right space-y-1 font-almarai"
                      >
                        <div className="px-3 py-1.5 text-[10px] font-extrabold text-gray-400 dark:text-white/40 tracking-wider whitespace-nowrap">
                          اختر السنة الدراسية
                        </div>
                        {gradeStages.map((grade) => (
                          <button
                            key={grade.id}
                            onClick={() => handleGradeSelect(grade.id)}
                            className="w-full px-3 py-2.5 rounded-10 text-xs font-bold text-right text-gray-800 dark:text-white/90 hover:bg-orange-50 dark:hover:bg-white/10 hover:text-[#ed6140] transition-colors flex items-center justify-between group cursor-pointer whitespace-nowrap"
                          >
                            <div className="flex items-center gap-2.5 shrink-0">
                              <img
                                src={grade.badgeImage}
                                alt={grade.title}
                                className="w-6 h-6 rounded-full object-cover border border-gray-200 dark:border-white/20 shrink-0"
                              />
                              <span className="whitespace-nowrap">{grade.title}</span>
                            </div>
                            <span className="text-[10px] text-gray-400 group-hover:text-[#ed6140] font-mono whitespace-nowrap">
                              {grade.subtitle}
                            </span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={isActive ? { borderRadius: "8px" } : undefined}
                className={`px-2.5 xl:px-3.5 py-2 text-xs xl:text-sm font-bold transition-all flex items-center gap-1 cursor-pointer font-almarai whitespace-nowrap shrink-0 ${
                  isActive 
                    ? "text-[#ed6140] bg-orange-50 dark:bg-white/10 font-black rounded-[8px]" 
                    : item.isAccent
                      ? "text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-white/5 rounded-10"
                      : "text-gray-700 dark:text-white/80 hover:text-[#ed6140] hover:bg-gray-50 dark:hover:bg-white/5 rounded-10"
                }`}
              >
                {ItemIcon && <ItemIcon className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Left Side (RTL End): Buttons & Search with white-space: nowrap */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">

          {/* Mobile Theme Toggle */}
          <div className="sm:hidden flex items-center shrink-0">
            <WaleedThemeToggle isDark={isDark} onToggle={toggleTheme} />
          </div>

          {/* Search Trigger */}
          <div className="relative hidden md:block shrink-0">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 sm:px-2.5 sm:py-2 rounded-12 text-gray-600 dark:text-white/80 hover:text-[#ed6140] hover:bg-orange-50 dark:hover:bg-white/10 transition-colors flex items-center gap-1.5 cursor-pointer text-xs font-bold font-almarai whitespace-nowrap shrink-0"
              title="ابحث في الموقع"
            >
              <Search className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap hidden xl:inline">ابحث في الموقع</span>
            </button>

            {/* Quick Search Dropdown */}
            <AnimatePresence>
              {searchOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  className="absolute top-full left-0 mt-2 w-72 sm:w-80 p-3 rounded-16 bg-white dark:bg-[#1a1e2d] border border-gray-100 dark:border-white/15 shadow-2xl z-50 text-right font-almarai"
                >
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="ابحث عن درس، مراجعة، أو كورس..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 rounded-10 text-xs bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:border-[#ed6140]"
                      autoFocus
                    />
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  </div>
                  {searchQuery && (
                    <div className="mt-2 text-[11px] text-gray-500 dark:text-white/60 p-2">
                      جارٍ البحث عن "{searchQuery}" في منصة أستاذي...
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Auth Actions */}
          {isAuthenticated ? (
            <UserProfileDropdown onNavigate={handleNavClick} />
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Login Button (Outline Red) */}
              <button
                onClick={() => onOpenAuth("login")}
                className="px-3.5 sm:px-4 py-2 rounded-12 text-xs sm:text-sm font-bold text-[#ed6140] border-2 border-[#ed6140] hover:bg-[#ed6140] hover:text-white transition-all cursor-pointer font-almarai whitespace-nowrap shrink-0"
              >
                تسجيل الدخول
              </button>

              {/* Register Button (Solid Red) */}
              <button
                onClick={() => onOpenAuth("register")}
                className="px-3.5 sm:px-4.5 py-2 rounded-12 text-xs sm:text-sm font-black text-white bg-[#ed6140] hover:bg-[#d94f30] border-2 border-[#ed6140] shadow-sm shadow-[#ed6140]/25 transition-all hover:scale-102 active:scale-95 cursor-pointer flex items-center gap-1.5 font-almarai whitespace-nowrap shrink-0"
              >
                <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="whitespace-nowrap">حساب جديد</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-10 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            aria-label="القائمة الرئيسية"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden mt-2 max-w-7xl mx-auto rounded-2xl bg-white dark:bg-[#161926] shadow-2xl border border-gray-100 dark:border-white/10 p-4 space-y-2 pointer-events-auto text-right font-almarai"
          >
            {navItems.map((item) => {
              const ItemIcon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="w-full px-4 py-2.5 rounded-12 text-sm font-bold text-gray-800 dark:text-white/90 hover:bg-orange-50 dark:hover:bg-white/10 hover:text-[#ed6140] transition-colors flex items-center justify-between whitespace-nowrap"
                >
                  <span className="whitespace-nowrap">{item.label}</span>
                  {ItemIcon && <ItemIcon className="w-4 h-4 text-amber-500 shrink-0" />}
                </button>
              );
            })}

            {isAuthenticated ? (
              <div className="pt-3 border-t border-gray-100 dark:border-white/10 space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-12 bg-gray-50 dark:bg-white/5">
                  <div>
                    <div className="font-bold text-xs text-gray-900 dark:text-white">{user?.fullName}</div>
                    <div className="text-[10px] text-gray-500 dark:text-white/60">{user?.gradeName}</div>
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold whitespace-nowrap">جهاز موثق ✓</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-12 text-xs font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 text-center cursor-pointer whitespace-nowrap"
                >
                  تسجيل الخروج
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-gray-100 dark:border-white/10 flex items-center gap-2">
                <button
                  onClick={() => {
                    onOpenAuth("login");
                    setMobileMenuOpen(false);
                  }}
                  className="w-1/2 py-2.5 rounded-12 text-xs font-bold text-[#ed6140] border-2 border-[#ed6140] text-center whitespace-nowrap"
                >
                  تسجيل الدخول
                </button>
                <button
                  onClick={() => {
                    onOpenAuth("register");
                    setMobileMenuOpen(false);
                  }}
                  className="w-1/2 py-2.5 rounded-12 text-xs font-black text-white bg-[#ed6140] text-center shadow-md shadow-[#ed6140]/25 whitespace-nowrap"
                >
                  حساب جديد
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
};
