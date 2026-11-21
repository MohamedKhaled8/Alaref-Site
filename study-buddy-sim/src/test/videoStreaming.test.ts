import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  VideoSecurityService,
  videoSecurityService,
  STREAM_TOKEN_TTL_SECONDS,
} from "../services/videoSecurityService";
import { useVideoPlayerStore } from "../stores/useVideoPlayerStore";
import { VideoSourceManifest } from "../types/video";

describe("Milestone 2: Protected Video Streaming Engine & Security Layers", () => {
  let securityService: VideoSecurityService;

  beforeEach(() => {
    securityService = new VideoSecurityService("test-video-secret-key-2026");
    useVideoPlayerStore.getState().resetPlayer();
  });

  afterEach(() => {
    securityService.cleanupAllBlobUrls();
    useVideoPlayerStore.getState().resetPlayer();
  });

  describe("1. HMAC-SHA256 Token Generation & Signature Verification", () => {
    it("generates a cryptographically signed stream token with correct structure", async () => {
      const tokenResult = await securityService.generateSignedStreamToken({
        lessonId: "les-202",
        studentId: "std-901",
        deviceId: "dev-macbook-chrome-01",
        studentName: "ملك محمود",
        studentPhone: "01098765432",
        format: "hls",
      });

      expect(tokenResult.token).toBeDefined();
      expect(typeof tokenResult.token).toBe("string");
      expect(tokenResult.token.split(".")).toHaveLength(2); // payload.signature
      expect(tokenResult.format).toBe("hls");
      expect(tokenResult.expiresAt).toBeGreaterThan(Math.floor(Date.now() / 1000));
      expect(tokenResult.nonce).toBeDefined();

      // Forensic watermark verification
      expect(tokenResult.watermark.studentName).toBe("ملك محمود");
      expect(tokenResult.watermark.studentPhone).toBe("01098765432");
      expect(tokenResult.watermark.studentId).toBe("std-901");
      expect(tokenResult.streamUrl).toContain("token=");
    });

    it("cryptographically validates authentic token and extracts valid payload", async () => {
      const tokenResult = await securityService.generateSignedStreamToken({
        lessonId: "les-202",
        studentId: "std-901",
        deviceId: "dev-macbook-chrome-01",
      });

      const validation = await securityService.validateStreamToken(tokenResult.token, {
        expectedDeviceId: "dev-macbook-chrome-01",
        expectedStudentId: "std-901",
      });

      expect(validation.valid).toBe(true);
      expect(validation.violation).toBeUndefined();
      expect(validation.payload?.lessonId).toBe("les-202");
      expect(validation.payload?.studentId).toBe("std-901");
      expect(validation.payload?.deviceId).toBe("dev-macbook-chrome-01");
    });

    it("rejects token when secret key does not match", async () => {
      const foreignService = new VideoSecurityService("foreign-secret-key-mismatch");
      const foreignToken = await foreignService.generateSignedStreamToken({
        lessonId: "les-202",
        studentId: "std-901",
        deviceId: "dev-01",
      });

      const validation = await securityService.validateStreamToken(foreignToken.token);
      expect(validation.valid).toBe(false);
      expect(validation.violation?.code).toBe("INVALID_SIGNATURE");
    });
  });

  describe("2. Rolling TTL Expiration Validation", () => {
    it("enforces default 15-minute rolling TTL", async () => {
      const beforeNow = Math.floor(Date.now() / 1000);
      const tokenResult = await securityService.generateSignedStreamToken({
        lessonId: "les-202",
        studentId: "std-901",
        deviceId: "dev-01",
      });
      const afterNow = Math.floor(Date.now() / 1000);

      expect(tokenResult.expiresAt).toBeGreaterThanOrEqual(beforeNow + STREAM_TOKEN_TTL_SECONDS);
      expect(tokenResult.expiresAt).toBeLessThanOrEqual(afterNow + STREAM_TOKEN_TTL_SECONDS);
    });

    it("rejects expired token with EXPIRED_TOKEN violation code", async () => {
      // Generate token that expired 10 seconds ago
      const tokenResult = await securityService.generateSignedStreamToken({
        lessonId: "les-202",
        studentId: "std-901",
        deviceId: "dev-01",
        ttlSeconds: -10, // expired
      });

      const validation = await securityService.validateStreamToken(tokenResult.token);
      expect(validation.valid).toBe(false);
      expect(validation.violation?.code).toBe("EXPIRED_TOKEN");
      expect(validation.violation?.message).toContain("انتهت صلاحية");
    });
  });

  describe("3. Adversarial Token Tampering Rejection", () => {
    it("detects and rejects payload tampering (e.g. changing student ID or expiration)", async () => {
      const tokenResult = await securityService.generateSignedStreamToken({
        lessonId: "les-202",
        studentId: "std-901",
        deviceId: "dev-01",
      });

      const [payloadB64, sigB64] = tokenResult.token.split(".");

      // Adversary attempts to tamper with base64 payload to extend expiration or change lesson
      const decodedPayload = JSON.parse(atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/")));
      decodedPayload.studentId = "attacker-student-999";
      decodedPayload.expiresAt = decodedPayload.expiresAt + 86400; // +24 hours

      const tamperedPayloadB64 = btoa(JSON.stringify(decodedPayload))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      const tamperedToken = `${tamperedPayloadB64}.${sigB64}`;

      const validation = await securityService.validateStreamToken(tamperedToken);
      expect(validation.valid).toBe(false);
      expect(validation.violation?.code).toBe("INVALID_SIGNATURE");
      expect(validation.violation?.message).toContain("فشل التحقق من التوقيع الرقمي");
    });

    it("detects and rejects altered signature bytes", async () => {
      const tokenResult = await securityService.generateSignedStreamToken({
        lessonId: "les-202",
        studentId: "std-901",
        deviceId: "dev-01",
      });

      const [payloadB64, sigB64] = tokenResult.token.split(".");
      // Flip characters in signature
      const corruptedSig = sigB64.slice(0, -3) + "xyz";
      const corruptedToken = `${payloadB64}.${corruptedSig}`;

      const validation = await securityService.validateStreamToken(corruptedToken);
      expect(validation.valid).toBe(false);
      expect(validation.violation?.code).toBe("INVALID_SIGNATURE");
    });

    it("rejects malformed token strings", async () => {
      const malformedTokens = [
        "",
        "single-segment-string",
        "too.many.segments.here.invalid",
        "bad-b64!@#$.signature",
      ];

      for (const token of malformedTokens) {
        const res = await securityService.validateStreamToken(token);
        expect(res.valid).toBe(false);
        expect(res.violation).toBeDefined();
      }
    });
  });

  describe("4. Device Binding & Enrollment Entitlement Verification", () => {
    it("rejects token presented from a mismatched device ID (DEVICE_MISMATCH)", async () => {
      const tokenResult = await securityService.generateSignedStreamToken({
        lessonId: "les-202",
        studentId: "std-901",
        deviceId: "registered-laptop-device-01",
      });

      // Presented from a different device (e.g. shared link in another student's browser)
      const validation = await securityService.validateStreamToken(tokenResult.token, {
        expectedDeviceId: "foreign-phone-device-99",
      });

      expect(validation.valid).toBe(false);
      expect(validation.violation?.code).toBe("DEVICE_MISMATCH");
      expect(validation.violation?.message).toContain("مرتبط بجهاز آخر");
    });

    it("rejects locked content when student is not enrolled (UNENROLLED_ACCESS)", async () => {
      const tokenResult = await securityService.generateSignedStreamToken({
        lessonId: "les-locked-01",
        studentId: "std-901",
        deviceId: "dev-01",
      });

      const validation = await securityService.validateStreamToken(tokenResult.token, {
        isEnrolled: false,
        isFreePreview: false,
      });

      expect(validation.valid).toBe(false);
      expect(validation.violation?.code).toBe("UNENROLLED_ACCESS");
      expect(validation.violation?.message).toContain("غير مصرح بمشاهدة هذا الدرس");
    });

    it("allows free preview lessons even when student is unenrolled", async () => {
      const tokenResult = await securityService.generateSignedStreamToken({
        lessonId: "les-free-01",
        studentId: "guest-01",
        deviceId: "dev-01",
      });

      const validation = await securityService.validateStreamToken(tokenResult.token, {
        isEnrolled: false,
        isFreePreview: true, // Free preview
      });

      expect(validation.valid).toBe(true);
      expect(validation.violation).toBeUndefined();
    });
  });

  describe("5. In-Memory Media Decoupling & Ephemeral Blob URLs", () => {
    it("creates an ephemeral blob URL for progressive media preventing raw static links in DOM", async () => {
      const blobUrl = await securityService.createObfuscatedBlobUrl(
        "https://cdn.alaref.academy/streams/protected_lesson.mp4"
      );

      expect(blobUrl).toBeDefined();
      expect(blobUrl.startsWith("blob:")).toBe(true);
    });

    it("properly revokes blob URLs and cleans up memory", async () => {
      const blobUrl = await securityService.createObfuscatedBlobUrl("sample-content");
      expect(blobUrl.startsWith("blob:")).toBe(true);

      expect(() => {
        securityService.revokeBlobUrl(blobUrl);
      }).not.toThrow();
    });
  });

  describe("6. Single-Device Stream Concurrency Heartbeat Tracking", () => {
    it("allows single active stream session for student", () => {
      const heartbeat = securityService.sendHeartbeat({
        lessonId: "les-202",
        studentId: "std-100",
        deviceId: "device-alpha",
        sessionToken: "session-token-alpha-1",
      });

      expect(heartbeat.allowed).toBe(true);
      expect(heartbeat.activeStreamsCount).toBe(1);
    });

    it("detects and halts concurrent stream when second device connects with same student credentials", () => {
      // Device A starts stream
      securityService.sendHeartbeat({
        lessonId: "les-202",
        studentId: "std-100",
        deviceId: "device-alpha",
        sessionToken: "session-token-alpha-1",
      });

      // Device B attempts stream concurrently under same student ID
      const secondHeartbeat = securityService.sendHeartbeat({
        lessonId: "les-202",
        studentId: "std-100",
        deviceId: "device-beta-different",
        sessionToken: "session-token-beta-2",
      });

      expect(secondHeartbeat.allowed).toBe(false);
      expect(secondHeartbeat.message).toContain("تم رصد تشغيل متزامن");
    });

    it("clears stream cleanly on terminateStream", () => {
      securityService.sendHeartbeat({
        lessonId: "les-202",
        studentId: "std-100",
        deviceId: "device-alpha",
        sessionToken: "session-token-alpha-1",
      });

      securityService.terminateStream("session-token-alpha-1");

      // New device can now stream since previous session terminated
      const newSession = securityService.sendHeartbeat({
        lessonId: "les-202",
        studentId: "std-100",
        deviceId: "device-beta",
        sessionToken: "session-token-beta-1",
      });

      expect(newSession.allowed).toBe(true);
    });
  });

  describe("7. Stream Manifest Generator & Mock Streams", () => {
    it("generates adaptive HLS stream manifest with 5-tier quality ladders and timestamped notes", () => {
      const manifest = securityService.getMockStreamManifest("les-202", {
        title: "كاد وأخواتها",
        format: "hls",
        durationMinutes: 45,
      });

      expect(manifest.lessonId).toBe("les-202");
      expect(manifest.format).toBe("hls");
      expect(manifest.streamUrl).toContain(".m3u8");
      expect(manifest.qualities).toHaveLength(5);

      const qualityIds = manifest.qualities.map((q) => q.id);
      expect(qualityIds).toContain("auto");
      expect(qualityIds).toContain("1080p");
      expect(qualityIds).toContain("720p");
      expect(qualityIds).toContain("480p");
      expect(qualityIds).toContain("360p");

      expect(manifest.notes).toBeDefined();
      expect(manifest.notes!.length).toBeGreaterThanOrEqual(4);
      expect(manifest.notes![0].title).toContain("مقدمة");
    });

    it("generates progressive MP4 manifest when requested", () => {
      const manifest = securityService.getMockStreamManifest("les-205", {
        format: "mp4",
      });

      expect(manifest.format).toBe("mp4");
      expect(manifest.streamUrl).toContain(".mp4");
    });
  });

  describe("8. Zustand Video Player Store Behavior", () => {
    it("manages play and pause transitions cleanly", () => {
      const store = useVideoPlayerStore.getState();
      expect(store.isPlaying).toBe(false);

      store.play();
      expect(useVideoPlayerStore.getState().isPlaying).toBe(true);

      store.pause();
      expect(useVideoPlayerStore.getState().isPlaying).toBe(false);

      store.togglePlay();
      expect(useVideoPlayerStore.getState().isPlaying).toBe(true);
    });

    it("rejects play() when DevTools inspection guard or watermark tampering is flagged", () => {
      const store = useVideoPlayerStore.getState();

      store.setDevToolsBlocked(true);
      expect(useVideoPlayerStore.getState().isDevToolsBlocked).toBe(true);
      expect(useVideoPlayerStore.getState().securityAlert?.code).toBe("DEVTOOLS_DETECTED");

      // Attempt to play while security alert is active
      store.play();
      expect(useVideoPlayerStore.getState().isPlaying).toBe(false);

      // Reset DevTools flag and verify play works again
      store.setDevToolsBlocked(false);
      store.play();
      expect(useVideoPlayerStore.getState().isPlaying).toBe(true);

      // Now tamper watermark
      store.setWatermarkTampered(true);
      expect(useVideoPlayerStore.getState().isPlaying).toBe(false);
      expect(useVideoPlayerStore.getState().securityAlert?.code).toBe("WATERMARK_TAMPERED");
    });

    it("clamps seek time within [0, duration]", () => {
      const store = useVideoPlayerStore.getState();
      store.setDuration(100);

      store.seek(50);
      expect(useVideoPlayerStore.getState().currentTime).toBe(50);

      // Underflow
      store.seek(-20);
      expect(useVideoPlayerStore.getState().currentTime).toBe(0);

      // Overflow
      store.seek(150);
      expect(useVideoPlayerStore.getState().currentTime).toBe(100);
    });

    it("handles volume adjustments, mute toggling, and persistence", () => {
      const store = useVideoPlayerStore.getState();

      store.setVolume(0.6);
      expect(useVideoPlayerStore.getState().volume).toBe(0.6);
      expect(useVideoPlayerStore.getState().isMuted).toBe(false);

      store.toggleMute();
      expect(useVideoPlayerStore.getState().isMuted).toBe(true);

      store.toggleMute();
      expect(useVideoPlayerStore.getState().isMuted).toBe(false);
      expect(useVideoPlayerStore.getState().volume).toBe(0.6);
    });

    it("updates playback speed rate and persists choice", () => {
      const store = useVideoPlayerStore.getState();
      store.setSpeed(1.5);
      expect(useVideoPlayerStore.getState().playbackRate).toBe(1.5);
    });

    it("loads new manifest and resets state cleanly", () => {
      const mockManifest: VideoSourceManifest = {
        lessonId: "les-999",
        title: "المبتدأ والخبر",
        courseTitle: "كورس التأسيس",
        gradeName: "الصف الأول الإعدادي",
        durationMinutes: 30,
        format: "hls",
        streamUrl: "https://test.m3u8",
        qualities: [{ id: "auto", label: "Auto" }],
        isFreePreview: true,
      };

      const store = useVideoPlayerStore.getState();
      store.loadManifest(mockManifest, "test-session-token");

      const state = useVideoPlayerStore.getState();
      expect(state.currentLessonId).toBe("les-999");
      expect(state.duration).toBe(1800); // 30 mins * 60s
      expect(state.sessionToken).toBe("test-session-token");
      expect(state.isPlaying).toBe(false);

      store.resetPlayer();
      const resetState = useVideoPlayerStore.getState();
      expect(resetState.currentLessonId).toBeNull();
      expect(resetState.sessionToken).toBeNull();
      expect(resetState.duration).toBe(0);
    });
  });
});
