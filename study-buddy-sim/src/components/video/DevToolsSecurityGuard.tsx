import React, { useEffect, useCallback } from "react";
import { ShieldAlert, AlertTriangle, RefreshCw } from "lucide-react";
import { useVideoPlayerStore } from "../../stores/useVideoPlayerStore";

export interface DevToolsSecurityGuardProps {
  enabled?: boolean;
  onInspectionDetected?: () => void;
  children?: React.ReactNode;
}

export const DevToolsSecurityGuard: React.FC<DevToolsSecurityGuardProps> = ({
  enabled = true,
  onInspectionDetected,
  children,
}) => {
  const isDevToolsBlocked = useVideoPlayerStore((s) => s.isDevToolsBlocked);
  const setDevToolsBlocked = useVideoPlayerStore((s) => s.setDevToolsBlocked);
  const pause = useVideoPlayerStore((s) => s.pause);

  const handleDetection = useCallback(() => {
    pause();
    setDevToolsBlocked(true);
    onInspectionDetected?.();
  }, [pause, setDevToolsBlocked, onInspectionDetected]);

  // 1. Keyboard Shortcut Trapping & Right-Click Context Menu Prevention
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === "F12") {
        e.preventDefault();
        e.stopPropagation();
        handleDetection();
        return;
      }

      // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C / Cmd+Opt+I
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        ["I", "i", "J", "j", "C", "c"].includes(e.key)
      ) {
        e.preventDefault();
        e.stopPropagation();
        handleDetection();
        return;
      }

      // Ctrl+U (View Source)
      if ((e.ctrlKey || e.metaKey) && ["U", "u"].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        handleDetection();
        return;
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      // Prevent context menu over video space
      e.preventDefault();
    };

    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("contextmenu", handleContextMenu);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [enabled, handleDetection]);

  // 2. High-Frequency Timing Probe (Detects pause caused by open DevTools)
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    let probeId: ReturnType<typeof setInterval>;

    const runTimingProbe = () => {
      if (typeof performance === "undefined") return;

      const startTime = performance.now();
      // Debugger statement triggers a delay only when DevTools are actively open
      try {
        // eslint-disable-next-line no-debugger
        const fn = new Function("debugger");
        fn();
      } catch {
        // ignore errors
      }
      const endTime = performance.now();

      if (endTime - startTime > 100) {
        handleDetection();
      }
    };

    probeId = setInterval(runTimingProbe, 2000);

    return () => clearInterval(probeId);
  }, [enabled, handleDetection]);

  const handleRetry = () => {
    // Re-verify if DevTools are still open
    if (typeof performance !== "undefined") {
      const startTime = performance.now();
      try {
        const fn = new Function("debugger");
        fn();
      } catch {
        // ignore
      }
      const endTime = performance.now();
      if (endTime - startTime > 100) {
        // Still open
        return;
      }
    }
    setDevToolsBlocked(false);
  };

  return (
    <div className="relative w-full h-full">
      {children}

      {/* Security Shield Overlay when DevTools are Detected */}
      {isDevToolsBlocked && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl text-white font-almarai text-center animate-in fade-in duration-200">
          <div className="max-w-md w-full p-6 sm:p-8 rounded-24 bg-[#161926] border border-[#fe6257]/30 shadow-2xl space-y-4">
            <div className="w-16 h-16 rounded-24 bg-[#fe6257]/15 text-[#fe6257] border border-[#fe6257]/30 flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="font-black text-lg sm:text-xl text-white">
                تنبيه أمني: تم رصد فتح أدوات الفحص
              </h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                حرصاً على حماية المحتوى الفكري والتعليمي لمنصة مستر عمرو عارف، تم
                إيقاف تشغيل الفيديو مؤقتاً بسبب فتح أدوات المطورين أو فحص العناصر.
              </p>
            </div>

            <div className="p-3.5 rounded-14 bg-[#753b47]/20 border border-[#fe6257]/20 text-right flex items-center gap-3 text-xs text-white/80">
              <AlertTriangle className="w-4 h-4 text-[#fe6257] shrink-0" />
              <span>يُرجى إغلاق لوحة المطورين (DevTools) والضغط على زر المتابعة بالأسفل.</span>
            </div>

            <button
              onClick={handleRetry}
              className="w-full py-3 px-6 rounded-14 font-black text-xs sm:text-sm text-white bg-[#753b47] hover:bg-[#854351] transition-all shadow-lg shadow-[#753b47]/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>أغلقت أدوات الفحص • متابعة المشاهدة</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
