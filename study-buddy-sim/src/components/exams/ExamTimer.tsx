import React from "react";
import { Clock, AlertTriangle } from "lucide-react";

export interface ExamTimerProps {
  timeRemainingSeconds: number;
  totalDurationSeconds?: number;
  className?: string;
}

export const ExamTimer: React.FC<ExamTimerProps> = ({
  timeRemainingSeconds,
  className = "",
}) => {
  const minutes = Math.floor(timeRemainingSeconds / 60);
  const seconds = timeRemainingSeconds % 60;

  const isUrgent = timeRemainingSeconds <= 30; // Under 30 seconds: Red alert
  const isWarning = timeRemainingSeconds <= 120 && !isUrgent; // Under 2 minutes: Amber warning

  const timeFormatted = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-12 border font-mono text-xs sm:text-sm font-bold transition-all ${
        isUrgent
          ? "bg-red-500/15 border-red-500/50 text-red-400 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.25)]"
          : isWarning
          ? "bg-amber-500/15 border-amber-500/50 text-amber-300"
          : "bg-white/5 border-white/10 text-white/90"
      } ${className}`}
      dir="ltr"
      role="timer"
      aria-label={`الوقت المتبقي: ${minutes} دقيقة و ${seconds} ثانية`}
    >
      {isUrgent ? (
        <AlertTriangle className="w-4 h-4 text-red-400 animate-bounce" />
      ) : (
        <Clock
          className={`w-4 h-4 ${
            isWarning ? "text-amber-300" : "text-[#fe6257]"
          }`}
        />
      )}
      <span className="tracking-wider">{timeFormatted}</span>
    </div>
  );
};
