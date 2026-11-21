import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Settings, Check, Sparkles } from "lucide-react";
import { useVideoPlayerStore } from "../../stores/useVideoPlayerStore";
import { VideoQualityLevel } from "../../types/video";

export interface QualitySelectorMenuProps {
  onQualityChange?: (qualityId: string) => void;
  className?: string;
}

const DEFAULT_QUALITIES: VideoQualityLevel[] = [
  { id: "auto", label: "تلقائي (Auto)" },
  { id: "1080p", label: "1080p (عالية جداً)" },
  { id: "720p", label: "720p (عالية)" },
  { id: "480p", label: "480p (متوسطة)" },
  { id: "360p", label: "360p (اقتصادية)" },
];

export const QualitySelectorMenu: React.FC<QualitySelectorMenuProps> = ({
  onQualityChange,
  className = "",
}) => {
  const currentQuality = useVideoPlayerStore((s) => s.currentQuality);
  const availableQualities = useVideoPlayerStore((s) => s.availableQualities);
  const setQuality = useVideoPlayerStore((s) => s.setQuality);

  const qualities = availableQualities.length > 0 ? availableQualities : DEFAULT_QUALITIES;

  const handleSelect = (qualityId: string) => {
    setQuality(qualityId);
    onQualityChange?.(qualityId);
  };

  const getDisplayLabel = () => {
    const found = qualities.find((q) => q.id === currentQuality);
    if (!found) return currentQuality === "auto" ? "تلقائي" : currentQuality;
    return found.id === "auto" ? "تلقائي" : found.id;
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="تغيير جودة الفيديو"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-10 text-xs font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 transition-all cursor-pointer backdrop-blur-md border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#fe6257] font-almarai ${className}`}
        >
          <Settings className="w-3.5 h-3.5 text-[#fe6257]" />
          <span className="font-mono">{getDisplayLabel()}</span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 min-w-[170px] p-1.5 rounded-16 bg-[#161926]/95 backdrop-blur-xl border border-white/15 shadow-2xl text-white font-almarai text-right animate-in fade-in zoom-in-95 duration-150"
          style={{ direction: "rtl" }}
        >
          <div className="px-3 py-2 text-[11px] font-black text-white/50 border-b border-white/10 flex items-center justify-between">
            <span>جودة الفيديو</span>
            <Sparkles className="w-3 h-3 text-[#fe6257]" />
          </div>

          <div className="py-1 space-y-0.5">
            {qualities.map((q) => {
              const isSelected = currentQuality === q.id;
              return (
                <DropdownMenu.Item
                  key={q.id}
                  onClick={() => handleSelect(q.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-10 text-xs cursor-pointer transition-colors outline-none ${
                    isSelected
                      ? "bg-[#753b47] text-white font-bold"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="font-almarai">{q.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#fe6257] shrink-0" />}
                </DropdownMenu.Item>
              );
            })}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
