import React, { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import { Play, Pause, AlertOctagon, Loader2, Lock } from "lucide-react";
import { useVideoPlayerStore } from "../../stores/useVideoPlayerStore";
import { useAuthStore } from "../../stores/useAuthStore";
import { videoSecurityService } from "../../services/videoSecurityService";
import {
  VideoSourceManifest,
  SignedStreamToken,
  ForensicWatermarkData,
} from "../../types/video";
import { DynamicForensicWatermark } from "./DynamicForensicWatermark";
import { DevToolsSecurityGuard } from "./DevToolsSecurityGuard";
import { VideoControlsBar } from "./VideoControlsBar";

export interface ProtectedVideoPlayerProps {
  manifest: VideoSourceManifest;
  autoPlay?: boolean;
  onEnded?: () => void;
  className?: string;
}

export const ProtectedVideoPlayer: React.FC<ProtectedVideoPlayerProps> = ({
  manifest,
  autoPlay = false,
  onEnded,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const { user, deviceId } = useAuthStore();

  // Store state
  const isPlaying = useVideoPlayerStore((s) => s.isPlaying);
  const play = useVideoPlayerStore((s) => s.play);
  const pause = useVideoPlayerStore((s) => s.pause);
  const togglePlay = useVideoPlayerStore((s) => s.togglePlay);
  const currentTime = useVideoPlayerStore((s) => s.currentTime);
  const setCurrentTime = useVideoPlayerStore((s) => s.setCurrentTime);
  const setDuration = useVideoPlayerStore((s) => s.setDuration);
  const setBuffered = useVideoPlayerStore((s) => s.setBuffered);
  const volume = useVideoPlayerStore((s) => s.volume);
  const isMuted = useVideoPlayerStore((s) => s.isMuted);
  const playbackRate = useVideoPlayerStore((s) => s.playbackRate);
  const currentQuality = useVideoPlayerStore((s) => s.currentQuality);
  const setAvailableQualities = useVideoPlayerStore((s) => s.setAvailableQualities);
  const isFullscreen = useVideoPlayerStore((s) => s.isFullscreen);
  const setIsFullscreen = useVideoPlayerStore((s) => s.setIsFullscreen);
  const controlsVisible = useVideoPlayerStore((s) => s.controlsVisible);
  const setControlsVisible = useVideoPlayerStore((s) => s.setControlsVisible);
  const isWatermarkTampered = useVideoPlayerStore((s) => s.isWatermarkTampered);
  const isDevToolsBlocked = useVideoPlayerStore((s) => s.isDevToolsBlocked);
  const concurrencyViolation = useVideoPlayerStore((s) => s.concurrencyViolation);
  const setConcurrencyViolation = useVideoPlayerStore((s) => s.setConcurrencyViolation);
  const securityAlert = useVideoPlayerStore((s) => s.securityAlert);
  const loadManifest = useVideoPlayerStore((s) => s.loadManifest);

  // Local component state
  const [signedToken, setSignedToken] = useState<SignedStreamToken | null>(null);
  const [isLoadingStream, setIsLoadingStream] = useState<boolean>(true);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const activeBlobUrlRef = useRef<string | null>(null);
  const hideControlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1. Initialize Manifest in Zustand store
  useEffect(() => {
    loadManifest(manifest);
  }, [manifest, loadManifest]);

  // 2. Cryptographic Token Generation & URL Signing
  useEffect(() => {
    let isCancelled = false;

    const setupSecureStream = async () => {
      setIsLoadingStream(true);
      setStreamError(null);

      try {
        const studentId = user?.id || "guest-student-001";
        const studentName = user?.fullName || "طالب منصة مستر عمرو عارف";
        const studentPhone = user?.studentPhone || "01097303002";
        const activeDeviceId = deviceId || user?.deviceId || "device-fingerprint-default";

        // Generate HMAC-SHA256 token
        const tokenData = await videoSecurityService.generateSignedStreamToken({
          lessonId: manifest.lessonId,
          studentId,
          deviceId: activeDeviceId,
          studentName,
          studentPhone,
          format: manifest.format,
          streamUrl: manifest.streamUrl,
          ttlSeconds: 15 * 60, // 15-min rolling TTL
        });

        if (!isCancelled) {
          setSignedToken(tokenData);
        }
      } catch (err) {
        if (!isCancelled) {
          setStreamError(
            `تعذر تجهيز رابط البث المشفر: ${
              err instanceof Error ? err.message : String(err)
            }`
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingStream(false);
        }
      }
    };

    setupSecureStream();

    return () => {
      isCancelled = true;
    };
  }, [manifest.lessonId, manifest.format, manifest.streamUrl, user, deviceId]);

  // 3. Attach Media Source (HLS / Native Blob / MP4)
  useEffect(() => {
    if (!signedToken || !videoRef.current) return;

    const video = videoRef.current;
    let destroyed = false;

    // Teardown previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Teardown previous Blob URL
    if (activeBlobUrlRef.current) {
      videoSecurityService.revokeBlobUrl(activeBlobUrlRef.current);
      activeBlobUrlRef.current = null;
    }

    const initStream = async () => {
      const isHls =
        signedToken.format === "hls" ||
        signedToken.streamUrl.includes(".m3u8");

      if (isHls && Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
          xhrSetup: (xhr) => {
            xhr.setRequestHeader("X-Stream-Token", signedToken.token);
          },
        });

        hlsRef.current = hls;
        hls.loadSource(signedToken.streamUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
          if (destroyed) return;
          // Build available qualities from HLS manifest levels
          if (data.levels && data.levels.length > 0) {
            const hlsQualities = [
              { id: "auto", label: "تلقائي (Auto)" },
              ...data.levels.map((lvl, idx) => ({
                id: `${lvl.height}p`,
                label: `${lvl.height}p (${lvl.height >= 720 ? "عالية" : "متوسطة"})`,
                height: lvl.height,
                bitrate: lvl.bitrate,
              })),
            ];
            setAvailableQualities(hlsQualities);
          }

          if (autoPlay) {
            video.play().catch(() => {});
          }
        });

        hls.on(Hls.Events.ERROR, (_, errData) => {
          if (errData.fatal) {
            switch (errData.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                hls.destroy();
                setStreamError("حدث خطأ في تحميل بث الفيديو المباشر");
                break;
            }
          }
        });
      } else if (
        isHls &&
        video.canPlayType("application/vnd.apple.mpegurl")
      ) {
        // Native Safari HLS
        video.src = signedToken.streamUrl;
        if (autoPlay) {
          video.play().catch(() => {});
        }
      } else {
        // In-Memory Progressive MP4 / Blob URL Decoupling
        try {
          const obfuscatedBlob = await videoSecurityService.createObfuscatedBlobUrl(
            signedToken.streamUrl
          );
          if (destroyed) {
            videoSecurityService.revokeBlobUrl(obfuscatedBlob);
            return;
          }
          activeBlobUrlRef.current = obfuscatedBlob;
          video.src = obfuscatedBlob;
          if (autoPlay) {
            video.play().catch(() => {});
          }
        } catch {
          // Fallback to direct tokenized url if blob generation fails
          video.src = signedToken.streamUrl;
        }
      }
    };

    initStream();

    return () => {
      destroyed = true;
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (activeBlobUrlRef.current) {
        videoSecurityService.revokeBlobUrl(activeBlobUrlRef.current);
        activeBlobUrlRef.current = null;
      }
    };
  }, [signedToken, autoPlay, setAvailableQualities]);

  // 4. Quality Level Switching Hook
  useEffect(() => {
    if (!hlsRef.current) return;
    const hls = hlsRef.current;

    if (currentQuality === "auto") {
      hls.currentLevel = -1; // Auto level
    } else {
      const targetHeight = parseInt(currentQuality.replace("p", ""), 10);
      if (!isNaN(targetHeight) && hls.levels) {
        const foundIndex = hls.levels.findIndex(
          (lvl) => lvl.height === targetHeight
        );
        if (foundIndex !== -1) {
          hls.currentLevel = foundIndex;
        }
      }
    }
  }, [currentQuality]);

  // 5. Volume, Mute, PlaybackRate, and Play/Pause sync
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.volume = volume;
    videoRef.current.muted = isMuted;
  }, [volume, isMuted]);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      if (isWatermarkTampered || isDevToolsBlocked || concurrencyViolation) {
        pause();
        return;
      }
      video.play().catch(() => {
        pause();
      });
    } else {
      video.pause();
    }
  }, [isPlaying, isWatermarkTampered, isDevToolsBlocked, concurrencyViolation, pause]);

  // 6. Seeking sync from Store to Video element
  const prevTimeRef = useRef<number>(0);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Only update if external seek differed significantly
    if (Math.abs(video.currentTime - currentTime) > 1.2) {
      video.currentTime = currentTime;
    }
    prevTimeRef.current = currentTime;
  }, [currentTime]);

  // 7. Video HTML5 Event Handlers
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleDurationChange = () => {
    if (!videoRef.current) return;
    const dur = videoRef.current.duration;
    if (!isNaN(dur) && dur > 0) {
      setDuration(dur);
    }
  };

  const handleProgress = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    if (video.buffered.length > 0) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      setBuffered(bufferedEnd);
    }
  };

  const handleWaiting = () => setIsBuffering(true);
  const handlePlaying = () => {
    setIsBuffering(false);
    play();
  };
  const handlePause = () => {
    pause();
  };

  const handleVideoEnded = () => {
    pause();
    onEnded?.();
  };

  // 8. Single-Device Concurrency Heartbeat Ping
  useEffect(() => {
    if (!signedToken || !isPlaying) return;

    const studentId = user?.id || "guest-student-001";
    const activeDeviceId = deviceId || user?.deviceId || "device-fingerprint-default";

    // Initial ping
    const res = videoSecurityService.sendHeartbeat({
      lessonId: manifest.lessonId,
      studentId,
      deviceId: activeDeviceId,
      sessionToken: signedToken.token,
    });

    if (!res.allowed) {
      setConcurrencyViolation(true);
      pause();
    }

    const intervalId = setInterval(() => {
      const ping = videoSecurityService.sendHeartbeat({
        lessonId: manifest.lessonId,
        studentId,
        deviceId: activeDeviceId,
        sessionToken: signedToken.token,
      });

      if (!ping.allowed) {
        setConcurrencyViolation(true);
        pause();
      }
    }, 25000);

    return () => {
      clearInterval(intervalId);
      videoSecurityService.terminateStream(signedToken.token);
    };
  }, [signedToken, isPlaying, user, deviceId, manifest.lessonId, setConcurrencyViolation, pause]);

  // 9. Fullscreen Toggle
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => {});
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(() => {});
    }
  }, [setIsFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [setIsFullscreen]);

  // 10. Auto-Hide Controls On Inactivity
  const triggerControlsActivity = useCallback(() => {
    setControlsVisible(true);
    if (hideControlsTimerRef.current) {
      clearTimeout(hideControlsTimerRef.current);
    }

    if (isPlaying) {
      hideControlsTimerRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 3500);
    }
  }, [isPlaying, setControlsVisible]);

  // 11. Keyboard Shortcuts (Space, Left/Right arrows, M, F)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't hijack typing in inputs/textareas
      if (
        ["INPUT", "TEXTAREA", "SELECT"].includes(
          (e.target as HTMLElement)?.tagName
        )
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
        triggerControlsActivity();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        // In RTL, left arrow is advance forward 10s
        setCurrentTime(currentTime + 10);
        triggerControlsActivity();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        // In RTL, right arrow is rewind 10s
        setCurrentTime(Math.max(0, currentTime - 10));
        triggerControlsActivity();
      } else if (e.code === "KeyF") {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay, currentTime, setCurrentTime, toggleFullscreen, triggerControlsActivity]);

  const defaultWatermark: ForensicWatermarkData = {
    studentName: user?.fullName || "طالب منصة مستر عمرو عارف",
    studentPhone: user?.studentPhone || "01097303002",
    studentId: user?.id || "10482",
    sessionIp: "156.204.48.12",
    timestamp: new Date().toLocaleTimeString("ar-EG"),
  };

  const activeWatermark = signedToken?.watermark || defaultWatermark;

  return (
    <DevToolsSecurityGuard>
      <div
        ref={containerRef}
        onMouseMove={triggerControlsActivity}
        onTouchStart={triggerControlsActivity}
        className={`relative w-full aspect-video rounded-24 overflow-hidden bg-[#0c101c] border border-white/10 shadow-2xl select-none group font-almarai ${className}`}
        style={{ direction: "rtl" }}
      >
        {/* Core HTML5 Video Element */}
        <video
          ref={videoRef}
          onTimeUpdate={handleTimeUpdate}
          onDurationChange={handleDurationChange}
          onProgress={handleProgress}
          onWaiting={handleWaiting}
          onPlaying={handlePlaying}
          onPause={handlePause}
          onEnded={handleVideoEnded}
          onClick={togglePlay}
          playsInline
          poster={manifest.poster}
          className="w-full h-full object-contain cursor-pointer bg-black"
        />

        {/* Dynamic Moving Forensic Watermark */}
        <DynamicForensicWatermark
          watermark={activeWatermark}
          containerRef={containerRef}
        />

        {/* Top Info Bar (Visible on controls active) */}
        <div
          className={`absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between text-white pointer-events-none transition-opacity duration-300 z-20 ${
            controlsVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#fe6257] animate-ping" />
            <span className="text-xs sm:text-sm font-bold text-white line-clamp-1">
              {manifest.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-8 bg-black/60 border border-white/15 text-[10px] sm:text-xs font-mono font-bold text-[#fe6257]">
              {manifest.format.toUpperCase()} • مشفر ومحمي
            </span>
          </div>
        </div>

        {/* Center Loading Spinner */}
        {(isLoadingStream || isBuffering) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs pointer-events-none z-20">
            <div className="p-4 rounded-20 bg-black/70 border border-white/10 flex flex-col items-center gap-2 text-white">
              <Loader2 className="w-8 h-8 text-[#fe6257] animate-spin" />
              <span className="text-xs font-bold">جارٍ فك تشفير وتجهيز البث...</span>
            </div>
          </div>
        )}

        {/* Center Large Play Button on Pause */}
        {!isPlaying && !isLoadingStream && !securityAlert && (
          <div
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#753b47]/90 hover:bg-[#854351] text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all border border-white/20">
              <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white ml-1" />
            </div>
          </div>
        )}

        {/* Stream Error or Security Violation Overlay */}
        {(streamError || securityAlert) && (
          <div className="absolute inset-0 z-40 flex items-center justify-center p-6 bg-black/95 backdrop-blur-md text-white text-center">
            <div className="max-w-md p-6 rounded-24 bg-[#161926] border border-[#fe6257]/40 shadow-2xl space-y-4">
              <div className="w-14 h-14 rounded-20 bg-[#fe6257]/20 text-[#fe6257] flex items-center justify-center mx-auto">
                <AlertOctagon className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-base text-white">
                {securityAlert ? "تنبيه أمني في مشغل الفيديو" : "تعذر تشغيل الفيديو"}
              </h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                {securityAlert?.message || streamError}
              </p>
            </div>
          </div>
        )}

        {/* Bottom Floating Glassmorphic Controls Bar */}
        <div
          className={`absolute bottom-0 inset-x-0 z-30 transition-opacity duration-300 ${
            controlsVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          <VideoControlsBar
            notes={manifest.notes}
            onToggleFullscreen={toggleFullscreen}
          />
        </div>
      </div>
    </DevToolsSecurityGuard>
  );
};
