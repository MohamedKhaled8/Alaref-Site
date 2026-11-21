import React from "react";
import { motion } from "framer-motion";

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export const WaleedThemeToggle: React.FC<ThemeToggleProps> = ({
  isDark,
  onToggle,
}) => {
  return (
    <button
      onClick={onToggle}
      type="button"
      dir="ltr"
      style={{
        width: "64px",
        height: "32px",
        padding: "4px",
        borderRadius: "9999px",
      }}
      className="relative inline-flex items-center bg-[#ed6140] text-white shadow-inner cursor-pointer transition-colors duration-300 focus:outline-none select-none shrink-0"
      title={isDark ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"}
      aria-label="تبديل الوضع النهاري والليلي"
    >
      {/* Background Track Icons */}
      <div className="w-full flex items-center justify-between px-1.5 pointer-events-none select-none text-white/80">
        {/* Sun Icon (Light Mode indicator on Left in LTR) */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3.5 h-3.5 text-orange-100 shrink-0"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>

        {/* Crescent Moon Icon (Dark Mode indicator on Right in LTR) */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3.5 h-3.5 text-orange-100 shrink-0"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </div>

      {/* Sliding White Circular Thumb - Strictly 24x24 inside 32px track */}
      <motion.div
        animate={{
          x: isDark ? 32 : 0,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        style={{
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          top: "4px",
          left: "4px",
        }}
        className="absolute bg-white shadow-md flex items-center justify-center text-[#ed6140] pointer-events-none"
      >
        {isDark ? (
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-3.5 h-3.5 text-[#ed6140] block"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        ) : (
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3.5 h-3.5 text-[#ed6140] block"
          >
            <circle cx="12" cy="12" r="4" fill="currentColor" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
        )}
      </motion.div>
    </button>
  );
};
