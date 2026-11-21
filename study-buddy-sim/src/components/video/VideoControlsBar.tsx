import React, { useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Volume1,
  Maximize,
  Minimize,
} from "lucide-react";
import { useVideoPlayerStore } from "../../stores/useVideoPlayerStore";
import { VideoTimelineScrubber } from "./VideoTimelineScrubber";
import { SpeedSelectorMenu } from "./SpeedSelectorMenu";
import { QualitySelectorMenu } from "./QualitySelectorMenu";
import { TimestampedNote } from "../../types/video";

export interface VideoControlsBarProps {
  notes?: TimestampedNote[];
  onToggleFullscreen?: () => void;
  className?: string;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const hrs = Math.floor(mins / 60);

  if (hrs > 0) {
    const remMins = mins % 60;
    return `${hrs.toString().padStart(2, "0")}:${remMins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export const VideoControlsBar: React.FC<VideoControlsBarProps> = ({
  notes = [],
  onToggleFullscreen,
  className = "",
}) => {
  const isPlaying = useVideoPlayerStore((s) => s.isPlaying);
  const togglePlay = useVideoPlayerStore((s) => s.togglePlay);
  const currentTime = useVideoPlayerStore((s) => s.currentTime);
  const duration = useVideoPlayerStore((s) => s.duration);
  const seek = useVideoPlayerStore((s) => s.seek);
  const volume = useVideoPlayerStore((s) => s.volume);
  const isMuted = useVideoPlayerStore((s) => s.isMuted);
  const setVolume = useVideoPlayerStore((s) => s.setVolume);
  const toggleMute = useVideoPlayerStore((s) => s.toggleMute);
  const isFullscreen = useVideoPlayerStore((s) => s.isFullscreen);

  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const handleSeekDelta = (delta: number) => {
    seek(currentTime + delta);
  };

  const renderVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return <VolumeX className="w-4 h-4 text-white/70" />;
    }
    if (volume < 0.5) {
      return <Volume1 className="w-4 h-4 text-white/90" />;
    }
    return <Volume2 className="w-4 h-4 text-white" />;
  };

  return (
    <div
      className={`w-full px-3 sm:px-5 py-2.5 sm:py-3.5 bg-gradient-to-t from-black/95 via-black/75 to-transparent backdrop-blur-md rounded-b-24 transition-all duration-300 ${className}`}
      style={{ direction: "rtl" }}
    >
      {/* 1. Scrubber Timeline */}
      <VideoTimelineScrubber notes={notes} className="mb-1" />

      {/* 2. Control Buttons Row */}
      <div className="flex items-center justify-between gap-2 sm:gap-4 text-white font-almarai">
        {/* Right Section: Playback actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Play / Pause Primary Button */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#753b47] hover:bg-[#854351] text-white flex items-center justify-center shadow-lg shadow-[#753b47]/40 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
            ) : (
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white ml-0.5" />
            )}
          </button>

          {/* Quick 10s Forward / Backward */}
          <button
            type="button"
            onClick={() => handleSeekDelta(10)}
            title="تقديم 10 ثوانٍ"
            aria-label="تقديم 10 ثوانٍ"
            className="p-1.5 sm:p-2 rounded-10 text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer shrink-0"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => handleSeekDelta(-10)}
            title="تأخير 10 ثوانٍ"
            aria-label="تأخير 10 ثوانٍ"
            className="p-1.5 sm:p-2 rounded-10 text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Volume Control */}
          <div
            className="relative flex items-center"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? "إلغاء كتم الصوت" : "كتم الصوت"}
              className="p-1.5 sm:p-2 rounded-10 text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              {renderVolumeIcon()}
            </button>

            {/* Volume Slider Popover/Strip */}
            <div
              className={`transition-all duration-200 overflow-hidden flex items-center ${
                showVolumeSlider ? "w-16 sm:w-20 opacity-100 ml-1.5" : "w-0 opacity-0"
              }`}
              style={{ direction: "ltr" }}
            >
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                aria-label="مستوى الصوت"
                className="w-full h-1.5 accent-[#fe6257] bg-white/30 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Time Display */}
          <div
            className="text-[11px] sm:text-xs font-mono font-semibold text-white/75 select-none"
            dir="ltr"
          >
            <span className="text-white font-bold">{formatTime(currentTime)}</span>
            <span className="mx-1 text-white/40">/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Left Section: Settings & Fullscreen */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Quality Selector */}
          <QualitySelectorMenu />

          {/* Speed Selector */}
          <SpeedSelectorMenu />

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={onToggleFullscreen}
            title={isFullscreen ? "إنهاء وضع ملء الشاشة" : "ملء الشاشة"}
            aria-label="ملء الشاشة"
            className="p-1.5 sm:p-2 rounded-10 text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer shrink-0"
          >
            {isFullscreen ? (
              <Minimize className="w-4 h-4" />
            ) : (
              <Maximize className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
