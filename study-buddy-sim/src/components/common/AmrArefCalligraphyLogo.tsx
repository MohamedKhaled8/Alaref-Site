import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "horizontal" | "emblem";
  showSubtitle?: boolean;
}

export const AmrArefCalligraphyLogo: React.FC<LogoProps> = ({
  className = "",
  size = "md",
  variant = "horizontal",
  showSubtitle = false,
}) => {
  // Sizing styles for optimal visual proportion and responsiveness
  const sizeClasses = {
    sm: "h-9 sm:h-11 w-auto max-w-[210px] sm:max-w-[250px]",
    md: "h-12 sm:h-15 w-auto max-w-[280px] sm:max-w-[340px]",
    lg: "w-full max-w-[290px] sm:max-w-[390px] lg:max-w-[440px] h-auto",
    xl: "w-full max-w-[360px] sm:max-w-[480px] lg:max-w-[560px] h-auto",
  };

  const isEmblem = variant === "emblem";

  const lightSrc = isEmblem
    ? "/assets/amr_aref_calligraphy_logo_v2_transparent.png"
    : "/assets/amr_aref_horizontal_logo.png";

  const darkSrc = isEmblem
    ? "/assets/amr_aref_calligraphy_logo_v2_dark.png"
    : "/assets/amr_aref_horizontal_logo_dark.png";

  return (
    <div className={`inline-flex flex-col items-center md:items-start select-none ${className}`}>
      {/* Light Mode Authentic Arabic Calligraphy (Charcoal + Rich Gold) */}
      <img
        src={lightSrc}
        alt="أستاذي عمرو عارف"
        className={`${sizeClasses[size]} object-contain transition-transform duration-300 group-hover:scale-102 dark:hidden drop-shadow-xs`}
        loading="eager"
      />

      {/* Dark Mode Authentic Arabic Calligraphy (Glowing Ivory + Radiant Gold) */}
      <img
        src={darkSrc}
        alt="أستاذي عمرو عارف"
        className={`${sizeClasses[size]} object-contain transition-transform duration-300 group-hover:scale-102 hidden dark:block drop-shadow-[0_2px_12px_rgba(255,255,255,0.08)]`}
        loading="eager"
      />

      {showSubtitle && (
        <span className="text-[11px] sm:text-xs font-semibold font-ibm text-gray-500 dark:text-white/60 tracking-wider mt-1.5 text-center md:text-right">
          لُغَةُ الضَّادِ لِلْمَرْحَلَتَيْنِ الإِعْدَادِيَّةِ وَالاِبْتِدَائِيَّةِ
        </span>
      )}
    </div>
  );
};
