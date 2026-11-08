import React, { useState, useEffect } from "react";
import { Home, User, UserPlus } from "lucide-react";

interface MobileBottomNavProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  onOpenAuth: (mode: "login" | "register") => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onNavigate,
  onOpenAuth,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 120) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`lg:hidden fixed bottom-5 left-1/2 -translate-x-1/2 w-[92%] max-w-[480px] h-[65px] rounded-[22px] bg-white/95 dark:bg-[#1a1c24]/95 backdrop-blur-xl border border-gray-200 dark:border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)] z-50 flex items-center justify-around px-4 transition-transform duration-300 select-none font-almarai ${
        isVisible ? "translate-y-0" : "translate-y-[120px]"
      }`}
      aria-label="القائمة السفلية"
    >
      {/* 1. انشاء حساب */}
      <button
        onClick={() => onOpenAuth("register")}
        className="flex-1 flex flex-col items-center justify-center gap-1 text-gray-600 dark:text-white/70 hover:text-[#ed6140] dark:hover:text-white transition-colors"
      >
        <UserPlus className="w-5 h-5 text-[#ed6140]" />
        <span className="text-[10px] font-bold">انشاء حساب</span>
      </button>

      {/* 2. الرئيسية (Elevated Centerpiece) */}
      <button
        onClick={() => onNavigate("home")}
        className="relative -top-4 w-14 h-14 rounded-full bg-[#ed6140] hover:bg-[#d94f30] text-white flex items-center justify-center shadow-xl shadow-[#ed6140]/40 border-4 border-[#faf9f6] dark:border-[#0c0e17] transition-transform active:scale-95 cursor-pointer"
        aria-label="الرئيسية"
      >
        <Home className="w-6 h-6 fill-current text-white" />
      </button>

      {/* 3. تسجيل دخول */}
      <button
        onClick={() => onOpenAuth("login")}
        className="flex-1 flex flex-col items-center justify-center gap-1 text-gray-600 dark:text-white/70 hover:text-[#ed6140] dark:hover:text-white transition-colors"
      >
        <User className="w-5 h-5 text-gray-600 dark:text-white/80" />
        <span className="text-[10px] font-bold">تسجيل دخول</span>
      </button>
    </nav>
  );
};
