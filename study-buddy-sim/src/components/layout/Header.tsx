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
      {/* Main Sticky Navigation Bar matching Waleed Mohsen Benchmark */}
      <div className="max-w-7xl mx-auto rounded-2xl bg-white/95 dark:bg-[#161926]/95 backdrop-blur-md shadow-xl border border-gray-100 dark:border-white/10 px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between gap-4 pointer-events-auto transition-colors duration-300">
        
        {/* Right Side (RTL Start): Waleed-Mohsen Master Calligraphy Brand Signature */}
        <div 
          onClick={() => handleNavClick("home")}
          className="flex items-center gap-3 sm:gap-4 cursor-pointer group shrink-0"
        >
          {/* Authentic Calligraphy Logo with Gold Tashkeel */}
          <AmrArefCalligraphyLogo size="md" />

          {/* Theme Switcher next to brand on desktop (matching Waleed Mohsen nav position) */}
          <div className="hidden sm:block">
            <WaleedThemeToggle isDark={isDark} onToggle={toggleTheme} />
          </div>

          {/* Authentic Arabic Identity Badge */}
          <div className="hidden xl:flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-700 dark:text-amber-300">
            <span>لُغَةُ الضَّادِ</span>
            <span className="text-amber-500">✦</span>
          </div>
        </div>

        {/* Center: Clean Nav Links (Waleed Mohsen Style) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const ItemIcon = item.icon;
            
            if (item.hasDropdown) {
              return (
                <div key={item.id} className="relative">
                  <button
                    onClick={() => setGradesDropdownOpen(!gradesDropdownOpen)}
                    className={`px-3.5 py-2 rounded-10 text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer font-almarai ${
                      gradesDropdownOpen || isActive 
                        ? "text-[#ed6140] bg-orange-50 dark:bg-white/10" 
                        : "text-gray-700 dark:text-white/80 hover:text-[#ed6140] hover:bg-gray-50 dark:hover:bg-white/5"
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${gradesDropdownOpen ? "rotate-180 text-[#ed6140]" : ""}`} />
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
                        <div className="px-3 py-1.5 text-[10px] font-extrabold text-gray-400 dark:text-white/40 tracking-wider">
                          اختر السنة الدراسية
                        </div>
                        {gradeStages.map((grade) => (
                          <button
                            key={grade.id}
                            onClick={() => handleGradeSelect(grade.id)}
                            className="w-full px-3 py-2.5 rounded-10 text-xs font-bold text-right text-gray-800 dark:text-white/90 hover:bg-orange-50 dark:hover:bg-white/10 hover:text-[#ed6140] transition-colors flex items-center justify-between group cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5">
                              <img 
                                src={grade.badgeImage} 
                                alt={grade.title} 
                                className="w-6 h-6 rounded-full object-cover border border-gray-200 dark:border-white/20"
                              />
                              <span>{grade.title}</span>
                            </div>
                            <span className="text-[10px] text-gray-400 group-hover:text-[#ed6140] font-mono">
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
                className={`px-3.5 py-2 rounded-10 text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer font-almarai ${
                  isActive 
                    ? "text-[#ed6140] bg-orange-50 dark:bg-white/10 font-black" 
                    : item.isAccent
                      ? "text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-white/5"
                      : "text-gray-700 dark:text-white/80 hover:text-[#ed6140] hover:bg-gray-50 dark:hover:bg-white/5"
                }`}
              >
                {ItemIcon && <ItemIcon className="w-4 h-4 text-amber-500 shrink-0" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Left Side (RTL End): Buttons & Search */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Mobile Theme Toggle */}
          <div className="sm:hidden">
            <WaleedThemeToggle isDark={isDark} onToggle={toggleTheme} />
          </div>

          {/* Search Trigger */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 sm:px-3 sm:py-2 rounded-12 text-gray-600 dark:text-white/80 hover:text-[#ed6140] hover:bg-orange-50 dark:hover:bg-white/10 transition-colors flex items-center gap-2 cursor-pointer text-xs font-bold font-almarai"
              title="ابحث في الموقع"
            >
              <Search className="w-4 h-4" />
              <span>ابحث في الموقع</span>
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

          {/* Login Button (Outline Red) */}
          <button
            onClick={() => onOpenAuth("login")}
            className="hidden sm:inline-flex px-5 py-2 rounded-12 text-xs sm:text-sm font-bold text-[#ed6140] border-2 border-[#ed6140] hover:bg-[#ed6140] hover:text-white transition-all cursor-pointer font-almarai"
          >
            تسجيل الدخول
          </button>

          {/* Register Button (Solid Red - Exact Waleed Mohsen "حساب جديد") */}
          <button
            onClick={() => onOpenAuth("register")}
            className="px-5 sm:px-6 py-2 rounded-12 text-xs sm:text-sm font-black text-white bg-[#ed6140] hover:bg-[#d94f30] border-2 border-[#ed6140] shadow-md shadow-[#ed6140]/25 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 font-almarai"
          >
            <UserPlus className="w-4 h-4" />
            <span>حساب جديد</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-10 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
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
                  className="w-full px-4 py-2.5 rounded-12 text-sm font-bold text-gray-800 dark:text-white/90 hover:bg-orange-50 dark:hover:bg-white/10 hover:text-[#ed6140] transition-colors flex items-center justify-between"
                >
                  <span>{item.label}</span>
                  {ItemIcon && <ItemIcon className="w-4 h-4 text-amber-500" />}
                </button>
              );
            })}

            <div className="pt-3 border-t border-gray-100 dark:border-white/10 flex items-center gap-2">
              <button
                onClick={() => {
                  onOpenAuth("login");
                  setMobileMenuOpen(false);
                }}
                className="w-1/2 py-2.5 rounded-12 text-xs font-bold text-[#ed6140] border-2 border-[#ed6140] text-center"
              >
                تسجيل الدخول
              </button>
              <button
                onClick={() => {
                  onOpenAuth("register");
                  setMobileMenuOpen(false);
                }}
                className="w-1/2 py-2.5 rounded-12 text-xs font-black text-white bg-[#ed6140] text-center shadow-md shadow-[#ed6140]/25"
              >
                حساب جديد
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
};
