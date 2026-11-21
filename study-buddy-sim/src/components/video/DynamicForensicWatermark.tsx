import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ForensicWatermarkData } from "../../types/video";
import { useVideoPlayerStore } from "../../stores/useVideoPlayerStore";

export interface DynamicForensicWatermarkProps {
  watermark: ForensicWatermarkData;
  containerRef?: React.RefObject<HTMLElement | null>;
  onTamperDetected?: () => void;
  className?: string;
}

export const DynamicForensicWatermark: React.FC<DynamicForensicWatermarkProps> = ({
  watermark,
  containerRef,
  onTamperDetected,
  className = "",
}) => {
  const setWatermarkTampered = useVideoPlayerStore((s) => s.setWatermarkTampered);
  const watermarkElRef = useRef<HTMLDivElement>(null);

  // Random coordinates within safe inner viewport (15% to 70%)
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 25, y: 30 });
  const [opacity, setOpacity] = useState<number>(0.45);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      // Pick random safe coordinates
      const newX = Math.floor(12 + Math.random() * 58); // 12% to 70%
      const newY = Math.floor(15 + Math.random() * 55); // 15% to 70%
      const newOpacity = 0.3 + Math.random() * 0.25; // 0.30 to 0.55

      setCoords({ x: newX, y: newY });
      setOpacity(newOpacity);
    }, 12000);

    return () => clearInterval(moveInterval);
  }, []);

  // MutationObserver Anti-Tamper Guard
  useEffect(() => {
    const targetContainer = containerRef?.current || watermarkElRef.current?.parentElement;
    if (!targetContainer || typeof MutationObserver === "undefined") return;

    let isFlagged = false;

    const checkTampering = () => {
      if (isFlagged) return;

      const currentWatermark = targetContainer.querySelector('[data-watermark="forensic"]');
      if (!currentWatermark) {
        isFlagged = true;
        setWatermarkTampered(true);
        onTamperDetected?.();
        return;
      }

      if (typeof window !== "undefined" && window.getComputedStyle) {
        const style = window.getComputedStyle(currentWatermark);
        const isHidden =
          style.display === "none" ||
          style.visibility === "hidden" ||
          parseFloat(style.opacity || "1") < 0.05 ||
          currentWatermark.getAttribute("hidden") !== null;

        if (isHidden) {
          isFlagged = true;
          setWatermarkTampered(true);
          onTamperDetected?.();
        }
      }
    };

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === "childList" ||
          (mutation.type === "attributes" &&
            (mutation.attributeName === "style" ||
              mutation.attributeName === "class" ||
              mutation.attributeName === "hidden"))
        ) {
          checkTampering();
        }
      }
    });

    observer.observe(targetContainer, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class", "hidden"],
    });

    return () => observer.disconnect();
  }, [containerRef, onTamperDetected, setWatermarkTampered]);

  return (
    <motion.div
      ref={watermarkElRef}
      data-watermark="forensic"
      animate={{
        top: `${coords.y}%`,
        left: `${coords.x}%`,
        opacity,
      }}
      transition={{
        duration: 1.6,
        ease: "easeInOut",
      }}
      className={`absolute z-30 pointer-events-none select-none px-3 py-1.5 rounded-10 bg-black/65 backdrop-blur-md border border-white/10 text-white shadow-lg text-[10px] sm:text-xs font-mono font-bold tracking-wide flex items-center gap-2 font-almarai ${className}`}
      style={{
        direction: "rtl",
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#fe6257] animate-pulse shrink-0" />
      <span>{watermark.studentName}</span>
      <span className="text-white/40">•</span>
      <span dir="ltr">{watermark.studentPhone}</span>
      <span className="text-white/40">•</span>
      <span>ID: {watermark.studentId}</span>
      {watermark.sessionIp && (
        <>
          <span className="text-white/40 hidden sm:inline">•</span>
          <span className="text-white/50 text-[9px] hidden sm:inline" dir="ltr">
            {watermark.sessionIp}
          </span>
        </>
      )}
    </motion.div>
  );
};
