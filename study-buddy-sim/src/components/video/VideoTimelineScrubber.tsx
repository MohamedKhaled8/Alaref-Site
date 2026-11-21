import React, { useState, useRef, useCallback } from "react";
import { useVideoPlayerStore } from "../../stores/useVideoPlayerStore";
import { TimestampedNote } from "../../types/video";

export interface VideoTimelineScrubberProps {
  notes?: TimestampedNote[];
  onSeek?: (timeSeconds: number) => void;
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

export const VideoTimelineScrubber: React.FC<VideoTimelineScrubberProps> = ({
  notes = [],
  onSeek,
  className = "",
}) => {
  const currentTime = useVideoPlayerStore((s) => s.currentTime);
  const duration = useVideoPlayerStore((s) => s.duration);
  const buffered = useVideoPlayerStore((s) => s.buffered);
  const seek = useVideoPlayerStore((s) => s.seek);
  const setIsSeeking = useVideoPlayerStore((s) => s.setIsSeeking);

  const trackRef = useRef<HTMLDivElement>(null);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const [hoverTime, setHoverTime] = useState<number>(0);
  const [hoveredNote, setHoveredNote] = useState<TimestampedNote | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validDuration = duration > 0 ? duration : 1;
  const progressPercent = Math.min(100, Math.max(0, (currentTime / validDuration) * 100));
  const bufferedPercent = Math.min(100, Math.max(0, (buffered / validDuration) * 100));

  const calculateTimeFromEvent = useCallback(
    (clientX: number): number => {
      if (!trackRef.current) return 0;
      const rect = trackRef.current.getBoundingClientRect();
      const clickX = clientX - rect.left;
      const ratio = Math.max(0, Math.min(1, clickX / rect.width));
      return ratio * validDuration;
    },
    [validDuration]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    setIsSeeking(true);
    const targetTime = calculateTimeFromEvent(e.clientX);
    seek(targetTime);
    onSeek?.(targetTime);

    const onPointerMove = (moveEvent: PointerEvent) => {
      const newTime = calculateTimeFromEvent(moveEvent.clientX);
      seek(newTime);
      onSeek?.(newTime);
    };

    const onPointerUp = () => {
      setIsDragging(false);
      setIsSeeking(false);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    const targetTime = ratio * validDuration;

    setHoverPosition(x);
    setHoverTime(targetTime);

    // Check if near any note (within 10 seconds)
    const matchingNote = notes.find((n) => Math.abs(n.timeSeconds - targetTime) <= 8);
    setHoveredNote(matchingNote || null);
  };

  const handleMouseLeave = () => {
    setHoverPosition(null);
    setHoveredNote(null);
  };

  return (
    <div
      ref={trackRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onPointerDown={handlePointerDown}
      className={`relative w-full py-3 cursor-pointer group select-none ${className}`}
      style={{ direction: "ltr" }} // progress runs left-to-right standard for media
    >
      {/* Track Base */}
      <div className="relative w-full h-1.5 sm:h-2 rounded-full bg-white/20 backdrop-blur-md overflow-hidden transition-all group-hover:h-2.5">
        {/* Buffered Progress */}
        <div
          className="absolute top-0 left-0 h-full bg-white/30 rounded-full transition-all duration-200"
          style={{ width: `${bufferedPercent}%` }}
        />

        {/* Played Progress (Al Aref burgundy to coral gradient) */}
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#753b47] to-[#fe6257] rounded-full shadow-sm"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Scrubber Thumb */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white border-2 border-[#fe6257] shadow-lg shadow-[#fe6257]/50 pointer-events-none transition-transform ${
          isDragging ? "scale-125" : "scale-0 group-hover:scale-100"
        }`}
        style={{ left: `${progressPercent}%` }}
      />

      {/* Pinned Note Markers */}
      {notes.map((note) => {
        const notePercent = Math.min(100, Math.max(0, (note.timeSeconds / validDuration) * 100));
        return (
          <div
            key={note.id}
            title={`${note.title} (${formatTime(note.timeSeconds)})`}
            onClick={(e) => {
              e.stopPropagation();
              seek(note.timeSeconds);
              onSeek?.(note.timeSeconds);
            }}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#ffa200] border border-black shadow hover:scale-150 transition-transform z-10 cursor-pointer"
            style={{ left: `${notePercent}%` }}
          />
        );
      })}

      {/* Hover Time & Note Bubble */}
      {hoverPosition !== null && (
        <div
          className="absolute bottom-6 -translate-x-1/2 pointer-events-none z-30 flex flex-col items-center animate-in fade-in zoom-in-95 duration-100"
          style={{ left: `${hoverPosition}px` }}
        >
          <div className="px-2.5 py-1 rounded-8 bg-black/90 backdrop-blur-md border border-white/20 text-white shadow-xl text-center font-almarai">
            <span className="text-[11px] font-mono font-bold block" dir="ltr">
              {formatTime(hoverTime)}
            </span>
            {hoveredNote && (
              <span className="text-[10px] text-[#fe6257] font-bold block max-w-[140px] truncate">
                {hoveredNote.title}
              </span>
            )}
          </div>
          <div className="w-1.5 h-1.5 rotate-45 bg-black/90 border-r border-b border-white/20 -mt-1" />
        </div>
      )}
    </div>
  );
};
