import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Gauge, Check } from "lucide-react";
import { useVideoPlayerStore } from "../../stores/useVideoPlayerStore";

export interface SpeedSelectorMenuProps {
  onSpeedChange?: (speed: number) => void;
  className?: string;
}

const PLAYBACK_SPEEDS = [
  { value: 0.5, label: "0.5x (بطيء جداً)" },
  { value: 0.75, label: "0.75x (بطيء)" },
  { value: 1.0, label: "1.0x (السرعة العادية)" },
  { value: 1.25, label: "1.25x (سريع قليلاً)" },
  { value: 1.5, label: "1.5x (سريع)" },
  { value: 1.75, label: "1.75x (سريع جداً)" },
  { value: 2.0, label: "2.0x (مضاعف)" },
];

export const SpeedSelectorMenu: React.FC<SpeedSelectorMenuProps> = ({
  onSpeedChange,
  className = "",
}) => {
  const playbackRate = useVideoPlayerStore((s) => s.playbackRate);
  const setSpeed = useVideoPlayerStore((s) => s.setSpeed);

  const handleSelect = (speed: number) => {
    setSpeed(speed);
    onSpeedChange?.(speed);
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="تغيير سرعة الفيديو"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-10 text-xs font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 transition-all cursor-pointer backdrop-blur-md border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#fe6257] font-almarai ${className}`}
        >
          <Gauge className="w-3.5 h-3.5 text-[#fe6257]" />
          <span className="font-mono">{playbackRate}x</span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 min-w-[160px] p-1.5 rounded-16 bg-[#161926]/95 backdrop-blur-xl border border-white/15 shadow-2xl text-white font-almarai text-right animate-in fade-in zoom-in-95 duration-150"
          style={{ direction: "rtl" }}
        >
          <div className="px-3 py-2 text-[11px] font-black text-white/50 border-b border-white/10">
            سرعة التشغيل
          </div>

          <div className="py-1 space-y-0.5">
            {PLAYBACK_SPEEDS.map((s) => {
              const isSelected = Math.abs(playbackRate - s.value) < 0.01;
              return (
                <DropdownMenu.Item
                  key={s.value}
                  onClick={() => handleSelect(s.value)}
                  className={`flex items-center justify-between px-3 py-2 rounded-10 text-xs cursor-pointer transition-colors outline-none ${
                    isSelected
                      ? "bg-[#753b47] text-white font-bold"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="font-almarai">{s.label}</span>
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
