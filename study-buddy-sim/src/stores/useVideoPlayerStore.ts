/**
 * Video Player State Store
 * Zustand v5 state management for playback, media metrics, quality selection,
 * forensic watermarking status, and anti-tamper security alerts.
 *
 * Platform: Al Aref Academy (منصة مستر عمرو عارف التعليمية)
 */

import { create } from "zustand";
import {
  VideoQualityLevel,
  TimestampedNote,
  VideoSourceManifest,
  StreamSecurityViolation,
} from "../types/video";

export interface VideoPlayerState {
  // Playback state
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  buffered: number;
  volume: number; // 0.0 to 1.0
  isMuted: boolean;
  playbackRate: number;

  // Media & Quality
  currentQuality: string; // "auto", "1080p", "720p", "480p", "360p"
  availableQualities: VideoQualityLevel[];
  currentLessonId: string | null;
  currentManifest: VideoSourceManifest | null;
  sessionToken: string | null;
  activeNotes: TimestampedNote[];

  // Viewport & UI
  isFullscreen: boolean;
  controlsVisible: boolean;
  isSeeking: boolean;

  // Security Flags
  isDevToolsBlocked: boolean;
  isWatermarkTampered: boolean;
  concurrencyViolation: boolean;
  securityAlert: StreamSecurityViolation | null;

  // Actions
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setBuffered: (buffered: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setSpeed: (speed: number) => void;
  setQuality: (quality: string) => void;
  setAvailableQualities: (qualities: VideoQualityLevel[]) => void;
  setIsFullscreen: (isFullscreen: boolean) => void;
  setControlsVisible: (visible: boolean) => void;
  setIsSeeking: (isSeeking: boolean) => void;
  setSecurityAlert: (alert: StreamSecurityViolation | null) => void;
  setDevToolsBlocked: (blocked: boolean) => void;
  setWatermarkTampered: (tampered: boolean) => void;
  setConcurrencyViolation: (violated: boolean) => void;
  loadManifest: (manifest: VideoSourceManifest, sessionToken?: string) => void;
  resetPlayer: () => void;
}

const getInitialVolume = (): number => {
  if (typeof window === "undefined" || !window.localStorage) return 0.8;
  const stored = localStorage.getItem("alaref_player_volume");
  if (stored) {
    const parsed = parseFloat(stored);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) return parsed;
  }
  return 0.8;
};

const getInitialSpeed = (): number => {
  if (typeof window === "undefined" || !window.localStorage) return 1.0;
  const stored = localStorage.getItem("alaref_playback_speed");
  if (stored) {
    const parsed = parseFloat(stored);
    if (!isNaN(parsed) && parsed >= 0.5 && parsed <= 2.5) return parsed;
  }
  return 1.0;
};

export const useVideoPlayerStore = create<VideoPlayerState>((set, get) => ({
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  buffered: 0,
  volume: getInitialVolume(),
  isMuted: false,
  playbackRate: getInitialSpeed(),

  currentQuality: "auto",
  availableQualities: [],
  currentLessonId: null,
  currentManifest: null,
  sessionToken: null,
  activeNotes: [],

  isFullscreen: false,
  controlsVisible: true,
  isSeeking: false,

  isDevToolsBlocked: false,
  isWatermarkTampered: false,
  concurrencyViolation: false,
  securityAlert: null,

  play: () => {
    // If security violation active, reject playback
    const { isDevToolsBlocked, isWatermarkTampered, concurrencyViolation } = get();
    if (isDevToolsBlocked || isWatermarkTampered || concurrencyViolation) {
      return;
    }
    set({ isPlaying: true });
  },

  pause: () => {
    set({ isPlaying: false });
  },

  togglePlay: () => {
    const { isPlaying, play, pause } = get();
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  },

  seek: (time: number) => {
    const duration = get().duration;
    const clampedTime = Math.max(0, Math.min(time, duration || time));
    set({ currentTime: clampedTime });
  },

  setCurrentTime: (currentTime: number) => {
    set({ currentTime });
  },

  setDuration: (duration: number) => {
    set({ duration });
  },

  setBuffered: (buffered: number) => {
    set({ buffered });
  },

  setVolume: (volume: number) => {
    const clamped = Math.max(0, Math.min(volume, 1));
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        localStorage.setItem("alaref_player_volume", clamped.toString());
      } catch {
        // ignore storage errors
      }
    }
    set({ volume: clamped, isMuted: clamped === 0 });
  },

  toggleMute: () => {
    const { isMuted, volume } = get();
    if (isMuted) {
      set({ isMuted: false, volume: volume > 0 ? volume : 0.8 });
    } else {
      set({ isMuted: true });
    }
  },

  setSpeed: (speed: number) => {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        localStorage.setItem("alaref_playback_speed", speed.toString());
      } catch {
        // ignore storage errors
      }
    }
    set({ playbackRate: speed });
  },

  setQuality: (quality: string) => {
    set({ currentQuality: quality });
  },

  setAvailableQualities: (availableQualities: VideoQualityLevel[]) => {
    set({ availableQualities });
  },

  setIsFullscreen: (isFullscreen: boolean) => {
    set({ isFullscreen });
  },

  setControlsVisible: (controlsVisible: boolean) => {
    set({ controlsVisible });
  },

  setIsSeeking: (isSeeking: boolean) => {
    set({ isSeeking });
  },

  setSecurityAlert: (securityAlert: StreamSecurityViolation | null) => {
    set({
      securityAlert,
      isPlaying: securityAlert ? false : get().isPlaying,
    });
  },

  setDevToolsBlocked: (isDevToolsBlocked: boolean) => {
    set({
      isDevToolsBlocked,
      isPlaying: isDevToolsBlocked ? false : get().isPlaying,
      securityAlert: isDevToolsBlocked
        ? {
            code: "DEVTOOLS_DETECTED",
            message: "تنبيه أمني: تم رصد فتح أدوات الفحص والمطورين. يُرجى إغلاق أدوات الفحص لمتابعة مشاهدة الدرس.",
            timestamp: Date.now(),
          }
        : null,
    });
  },

  setWatermarkTampered: (isWatermarkTampered: boolean) => {
    set({
      isWatermarkTampered,
      isPlaying: isWatermarkTampered ? false : get().isPlaying,
      securityAlert: isWatermarkTampered
        ? {
            code: "WATERMARK_TAMPERED",
            message: "تنبيه أمني: تم رصد محاولة التلاعب بالعلامة المائية. تم إيقاف المشغل لحماية المحتوى.",
            timestamp: Date.now(),
          }
        : null,
    });
  },

  setConcurrencyViolation: (concurrencyViolation: boolean) => {
    set({
      concurrencyViolation,
      isPlaying: concurrencyViolation ? false : get().isPlaying,
      securityAlert: concurrencyViolation
        ? {
            code: "CONCURRENT_STREAM_DETECTED",
            message: "تم رصد تشغيل متزامن لنفس الحساب على جهاز آخر. تم إيقاف المشغل لحماية حسابك.",
            timestamp: Date.now(),
          }
        : null,
    });
  },

  loadManifest: (manifest: VideoSourceManifest, sessionToken?: string) => {
    set({
      currentLessonId: manifest.lessonId,
      currentManifest: manifest,
      availableQualities: manifest.qualities,
      currentQuality: "auto",
      activeNotes: manifest.notes || [],
      currentTime: 0,
      duration: (manifest.durationMinutes || 0) * 60,
      buffered: 0,
      isPlaying: false,
      isDevToolsBlocked: false,
      isWatermarkTampered: false,
      concurrencyViolation: false,
      securityAlert: null,
      sessionToken: sessionToken || null,
    });
  },

  resetPlayer: () => {
    set({
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      buffered: 0,
      currentLessonId: null,
      currentManifest: null,
      sessionToken: null,
      activeNotes: [],
      isFullscreen: false,
      isDevToolsBlocked: false,
      isWatermarkTampered: false,
      concurrencyViolation: false,
      securityAlert: null,
    });
  },
}));
