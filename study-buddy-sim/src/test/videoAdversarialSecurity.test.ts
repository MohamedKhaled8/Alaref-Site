/**
 * Adversarial Security Verification Suite — Milestone 2
 * Protected Video Streaming Engine & Security Layers
 *
 * Platform: Al Aref Academy (منصة مستر عمرو عارف التعليمية)
 * Role: Empirical Challenger 1
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  VideoSecurityService,
  STREAM_TOKEN_TTL_SECONDS,
  CONCURRENCY_TIMEOUT_MS,
  STREAM_DEFAULT_SECRET,
} from "../services/videoSecurityService";
import { useVideoPlayerStore } from "../stores/useVideoPlayerStore";

describe("Milestone 2 Adversarial Security Challenge Suite", () => {
  let service: VideoSecurityService;
  const MASTER_SECRET = "alaref-adversarial-master-secret-key-2026";

  beforeEach(() => {
    vi.useRealTimers();
    service = new VideoSecurityService(MASTER_SECRET);
    useVideoPlayerStore.getState().resetPlayer();
  });

  afterEach(() => {
    service.cleanupAllBlobUrls();
    useVideoPlayerStore.getState().resetPlayer();
    vi.useRealTimers();
  });

  // =========================================================================
  // SUITE 1: Cryptographic Invariants & Signature Tampering
  // =========================================================================
  describe("Suite 1: Cryptographic Invariants & Signature Tampering", () => {
    it("rejects token with corrupted/bit-flipped signature bytes (beginning, middle, end)", async () => {
      const { token } = await service.generateSignedStreamToken({
        lessonId: "les-nahw-01",
        studentId: "std-777",
        deviceId: "dev-pc-win11",
      });

      const [payloadB64, sigB64] = token.split(".");

      // Flip beginning char
      const flippedStart = (sigB64[0] === "A" ? "B" : "A") + sigB64.slice(1);
      const resStart = await service.validateStreamToken(`${payloadB64}.${flippedStart}`);
      expect(resStart.valid).toBe(false);
      expect(resStart.violation?.code).toBe("INVALID_SIGNATURE");

      // Flip middle char
      const midIdx = Math.floor(sigB64.length / 2);
      const flippedMid =
        sigB64.slice(0, midIdx) +
        (sigB64[midIdx] === "Z" ? "X" : "Z") +
        sigB64.slice(midIdx + 1);
      const resMid = await service.validateStreamToken(`${payloadB64}.${flippedMid}`);
      expect(resMid.valid).toBe(false);
      expect(resMid.violation?.code).toBe("INVALID_SIGNATURE");

      // Flip end char (altering significant bits of the last byte)
      const lastChar = sigB64.slice(-1);
      const flippedEnd =
        sigB64.slice(0, -1) + (lastChar === "A" ? "w" : "A");
      const resEnd = await service.validateStreamToken(`${payloadB64}.${flippedEnd}`);
      expect(resEnd.valid).toBe(false);
      expect(resEnd.violation?.code).toBe("INVALID_SIGNATURE");
    });

    it("rejects signature truncation and garbage append attacks", async () => {
      const { token } = await service.generateSignedStreamToken({
        lessonId: "les-nahw-01",
        studentId: "std-777",
        deviceId: "dev-pc-win11",
      });

      const [payloadB64, sigB64] = token.split(".");

      // Truncated signature
      const truncatedSig = sigB64.slice(0, 16);
      const resTrunc = await service.validateStreamToken(`${payloadB64}.${truncatedSig}`);
      expect(resTrunc.valid).toBe(false);
      expect(resTrunc.violation?.code).toBe("INVALID_SIGNATURE");

      // Appended garbage bytes
      const garbageSig = sigB64 + "===EXTRA_GARBAGE_BYTES===";
      const resGarbage = await service.validateStreamToken(`${payloadB64}.${garbageSig}`);
      expect(resGarbage.valid).toBe(false);
      expect(resGarbage.violation?.code).toBe("INVALID_SIGNATURE");
    });

    it("rejects token when lessonId is swapped for an unauthorized paid lesson", async () => {
      const { token } = await service.generateSignedStreamToken({
        lessonId: "free-preview-lesson",
        studentId: "std-free-user",
        deviceId: "dev-01",
      });

      const [payloadB64, sigB64] = token.split(".");
      const decodedPayload = JSON.parse(
        atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"))
      );

      // Swapping to premium lesson without resigning
      decodedPayload.lessonId = "vip-paid-full-course-lesson-01";

      const tamperedPayloadB64 = btoa(JSON.stringify(decodedPayload))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      const tamperedToken = `${tamperedPayloadB64}.${sigB64}`;
      const res = await service.validateStreamToken(tamperedToken);

      expect(res.valid).toBe(false);
      expect(res.violation?.code).toBe("INVALID_SIGNATURE");
    });

    it("rejects token when studentId is modified to spoof another student identity", async () => {
      const { token } = await service.generateSignedStreamToken({
        lessonId: "les-101",
        studentId: "attacker-student-666",
        deviceId: "dev-01",
      });

      const [payloadB64, sigB64] = token.split(".");
      const decodedPayload = JSON.parse(
        atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"))
      );

      // Impersonating enrolled top student
      decodedPayload.studentId = "enrolled-vip-student-001";

      const tamperedPayloadB64 = btoa(JSON.stringify(decodedPayload))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      const tamperedToken = `${tamperedPayloadB64}.${sigB64}`;
      const res = await service.validateStreamToken(tamperedToken);

      expect(res.valid).toBe(false);
      expect(res.violation?.code).toBe("INVALID_SIGNATURE");
    });

    it("rejects temporal extension attack (adversary extends expiresAt into future)", async () => {
      const { token } = await service.generateSignedStreamToken({
        lessonId: "les-101",
        studentId: "std-01",
        deviceId: "dev-01",
        ttlSeconds: 60, // 1 min
      });

      const [payloadB64, sigB64] = token.split(".");
      const decodedPayload = JSON.parse(
        atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"))
      );

      // Adversary attempts infinite stream by extending 10 years
      decodedPayload.expiresAt = decodedPayload.expiresAt + 315360000;

      const tamperedPayloadB64 = btoa(JSON.stringify(decodedPayload))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      const tamperedToken = `${tamperedPayloadB64}.${sigB64}`;
      const res = await service.validateStreamToken(tamperedToken);

      expect(res.valid).toBe(false);
      expect(res.violation?.code).toBe("INVALID_SIGNATURE");
    });

    it("rejects signature transplantation attack (attaching valid signature from Lesson A to Lesson B)", async () => {
      const tokenA = await service.generateSignedStreamToken({
        lessonId: "lesson-A",
        studentId: "std-01",
        deviceId: "dev-01",
      });

      const tokenB = await service.generateSignedStreamToken({
        lessonId: "lesson-B",
        studentId: "std-01",
        deviceId: "dev-01",
      });

      const [payloadA] = tokenA.token.split(".");
      const [, sigB] = tokenB.token.split(".");

      // Hybrid token: Payload A + Signature B
      const hybridToken = `${payloadA}.${sigB}`;
      const res = await service.validateStreamToken(hybridToken);

      expect(res.valid).toBe(false);
      expect(res.violation?.code).toBe("INVALID_SIGNATURE");
    });

    it("enforces cryptographic isolation when service keys differ", async () => {
      const serviceA = new VideoSecurityService("secret-key-A");
      const serviceB = new VideoSecurityService("secret-key-B");

      const tokenA = await serviceA.generateSignedStreamToken({
        lessonId: "les-01",
        studentId: "std-01",
        deviceId: "dev-01",
      });

      const res = await serviceB.validateStreamToken(tokenA.token);
      expect(res.valid).toBe(false);
      expect(res.violation?.code).toBe("INVALID_SIGNATURE");
    });

    it("rejects non-JSON or malformed payload base64 strings", async () => {
      const maliciousPayloads = [
        "not-base64-content!@#$%",
        btoa("this is plain text not json"),
        btoa(JSON.stringify([1, 2, 3])), // Array instead of object
        btoa("null"),
        btoa("12345"),
      ];

      for (const badPayload of maliciousPayloads) {
        const fakeToken = `${badPayload}.fakeSig123`;
        const res = await service.validateStreamToken(fakeToken);
        expect(res.valid).toBe(false);
        expect(res.violation).toBeDefined();
      }
    });
  });

  // =========================================================================
  // SUITE 2: Rolling TTL Expiration Boundary Conditions
  // =========================================================================
  describe("Suite 2: Rolling TTL Expiration Boundary Conditions", () => {
    it("strictly rejects token at the exact boundary of expiration (expiresAt === now)", async () => {
      const nowEpoch = Math.floor(Date.now() / 1000);

      // Create token expiring at now
      const token = await service.generateSignedStreamToken({
        lessonId: "les-boundary",
        studentId: "std-01",
        deviceId: "dev-01",
        ttlSeconds: 0, // expires now
      });

      const res = await service.validateStreamToken(token.token);
      expect(res.valid).toBe(false);
      expect(res.violation?.code).toBe("EXPIRED_TOKEN");
    });

    it("verifies token remains valid at now + 5s but expires when system time advances", async () => {
      vi.useFakeTimers();
      const baseTime = 1762646400000; // fixed epoch
      vi.setSystemTime(baseTime);

      const token = await service.generateSignedStreamToken({
        lessonId: "les-time-travel",
        studentId: "std-01",
        deviceId: "dev-01",
        ttlSeconds: 60, // 60 seconds TTL
      });

      // At T+30s: should be valid
      vi.advanceTimersByTime(30 * 1000);
      const res30 = await service.validateStreamToken(token.token);
      expect(res30.valid).toBe(true);

      // At T+61s: should be strictly expired
      vi.advanceTimersByTime(31 * 1000); // Total 61s
      const res61 = await service.validateStreamToken(token.token);
      expect(res61.valid).toBe(false);
      expect(res61.violation?.code).toBe("EXPIRED_TOKEN");

      vi.useRealTimers();
    });

    it("enforces standard 15-minute rolling TTL expiration (900 seconds)", async () => {
      vi.useFakeTimers();
      const baseTime = 1762646400000;
      vi.setSystemTime(baseTime);

      const token = await service.generateSignedStreamToken({
        lessonId: "les-rolling-ttl",
        studentId: "std-01",
        deviceId: "dev-01",
      });

      // At 14 minutes (840s): Still valid
      vi.advanceTimersByTime(14 * 60 * 1000);
      const res14m = await service.validateStreamToken(token.token);
      expect(res14m.valid).toBe(true);

      // At 15 minutes + 2 seconds (902s): Expired
      vi.advanceTimersByTime((1 * 60 + 2) * 1000);
      const resPast15m = await service.validateStreamToken(token.token);
      expect(resPast15m.valid).toBe(false);
      expect(resPast15m.violation?.code).toBe("EXPIRED_TOKEN");

      vi.useRealTimers();
    });
  });

  // =========================================================================
  // SUITE 3: Device Binding & Authorization Enforcement
  // =========================================================================
  describe("Suite 3: Device Binding & Authorization Enforcement", () => {
    it("rejects token presented with mismatched expectedDeviceId", async () => {
      const token = await service.generateSignedStreamToken({
        lessonId: "les-auth-1",
        studentId: "std-01",
        deviceId: "authorized-device-pc",
      });

      // Different device
      const res = await service.validateStreamToken(token.token, {
        expectedDeviceId: "unauthorized-device-mobile",
      });

      expect(res.valid).toBe(false);
      expect(res.violation?.code).toBe("DEVICE_MISMATCH");
    });

    it("rejects token presented with mismatched expectedStudentId", async () => {
      const token = await service.generateSignedStreamToken({
        lessonId: "les-auth-1",
        studentId: "student-alpha",
        deviceId: "dev-pc",
      });

      const res = await service.validateStreamToken(token.token, {
        expectedStudentId: "student-beta",
      });

      expect(res.valid).toBe(false);
      expect(res.violation).toBeDefined();
    });

    it("rejects unenrolled student attempting access to paid lesson", async () => {
      const token = await service.generateSignedStreamToken({
        lessonId: "les-paid",
        studentId: "student-guest",
        deviceId: "dev-pc",
      });

      const res = await service.validateStreamToken(token.token, {
        isEnrolled: false,
        isFreePreview: false,
      });

      expect(res.valid).toBe(false);
      expect(res.violation?.code).toBe("UNENROLLED_ACCESS");
    });

    it("permits unenrolled student when lesson is marked as isFreePreview", async () => {
      const token = await service.generateSignedStreamToken({
        lessonId: "les-free-trial",
        studentId: "student-guest",
        deviceId: "dev-pc",
      });

      const res = await service.validateStreamToken(token.token, {
        isEnrolled: false,
        isFreePreview: true,
      });

      expect(res.valid).toBe(true);
      expect(res.violation).toBeUndefined();
    });
  });

  // =========================================================================
  // SUITE 4: Concurrency Heartbeats, Stale Sessions & High-Frequency Stress
  // =========================================================================
  describe("Suite 4: Concurrency Heartbeats, Stale Sessions & Stress Harness", () => {
    it("blocks second device from concurrent streaming while first device is active", () => {
      // Device A starts
      const hbA = service.sendHeartbeat({
        lessonId: "les-stream-1",
        studentId: "std-concurrency-01",
        deviceId: "dev-laptop-mac",
        sessionToken: "sess-token-mac",
      });
      expect(hbA.allowed).toBe(true);

      // Device B attempts concurrent stream under same student ID
      const hbB = service.sendHeartbeat({
        lessonId: "les-stream-1",
        studentId: "std-concurrency-01",
        deviceId: "dev-iphone-mobile",
        sessionToken: "sess-token-iphone",
      });
      expect(hbB.allowed).toBe(false);
      expect(hbB.message).toContain("تم رصد تشغيل متزامن");

      // Device A pings again: must remain allowed and uninterrupted
      const hbA2 = service.sendHeartbeat({
        lessonId: "les-stream-1",
        studentId: "std-concurrency-01",
        deviceId: "dev-laptop-mac",
        sessionToken: "sess-token-mac",
      });
      expect(hbA2.allowed).toBe(true);
    });

    it("purges stale sessions after 45-second CONCURRENCY_TIMEOUT_MS and allows new device", () => {
      vi.useFakeTimers();
      const baseTime = 1762646400000;
      vi.setSystemTime(baseTime);

      // Device A registers session
      service.sendHeartbeat({
        lessonId: "les-1",
        studentId: "std-stale-01",
        deviceId: "dev-stale-A",
        sessionToken: "sess-stale-A",
      });

      // At 30s: Device B is still blocked
      vi.advanceTimersByTime(30 * 1000);
      const hb30s = service.sendHeartbeat({
        lessonId: "les-1",
        studentId: "std-stale-01",
        deviceId: "dev-stale-B",
        sessionToken: "sess-stale-B",
      });
      expect(hb30s.allowed).toBe(false);

      // At 46s (> 45s without Device A heartbeat): Device A session is stale
      vi.advanceTimersByTime(16 * 1000); // Total 46s from Device A last heartbeat
      const hb46s = service.sendHeartbeat({
        lessonId: "les-1",
        studentId: "std-stale-01",
        deviceId: "dev-stale-B",
        sessionToken: "sess-stale-B",
      });
      expect(hb46s.allowed).toBe(true);

      vi.useRealTimers();
    });

    it("frees stream slot immediately upon explicit terminateStream call", () => {
      service.sendHeartbeat({
        lessonId: "les-1",
        studentId: "std-term-01",
        deviceId: "dev-device-1",
        sessionToken: "session-term-1",
      });

      // Explicitly terminate session 1
      service.terminateStream("session-term-1");

      // Device 2 immediately permitted
      const hb2 = service.sendHeartbeat({
        lessonId: "les-1",
        studentId: "std-term-01",
        deviceId: "dev-device-2",
        sessionToken: "session-term-2",
      });

      expect(hb2.allowed).toBe(true);
    });

    it("stress-tests high-frequency concurrent collisions (50 alternating pings)", () => {
      // Register Device Alpha
      const alphaToken = "sess-alpha";
      const betaToken = "sess-beta";
      const studentId = "stress-student-99";

      service.sendHeartbeat({
        lessonId: "les-stress",
        studentId,
        deviceId: "dev-alpha",
        sessionToken: alphaToken,
      });

      let alphaAllowedCount = 0;
      let betaRejectedCount = 0;

      // Hammer service with 50 alternating pings
      for (let i = 0; i < 50; i++) {
        // Alpha ping
        const resA = service.sendHeartbeat({
          lessonId: "les-stress",
          studentId,
          deviceId: "dev-alpha",
          sessionToken: alphaToken,
        });
        if (resA.allowed) alphaAllowedCount++;

        // Rogue Beta ping
        const resB = service.sendHeartbeat({
          lessonId: "les-stress",
          studentId,
          deviceId: "dev-beta-rogue",
          sessionToken: betaToken,
        });
        if (!resB.allowed) betaRejectedCount++;
      }

      expect(alphaAllowedCount).toBe(50);
      expect(betaRejectedCount).toBe(50);
    });

    it("permits multiple distinct students streaming concurrently without interference", () => {
      const student1Res = service.sendHeartbeat({
        lessonId: "les-01",
        studentId: "student-1",
        deviceId: "device-1",
        sessionToken: "token-1",
      });

      const student2Res = service.sendHeartbeat({
        lessonId: "les-01",
        studentId: "student-2",
        deviceId: "device-2",
        sessionToken: "token-2",
      });

      const student3Res = service.sendHeartbeat({
        lessonId: "les-02",
        studentId: "student-3",
        deviceId: "device-3",
        sessionToken: "token-3",
      });

      expect(student1Res.allowed).toBe(true);
      expect(student2Res.allowed).toBe(true);
      expect(student3Res.allowed).toBe(true);
    });
  });

  // =========================================================================
  // SUITE 5: In-Memory Blob URL Lifecycle & Revocation Resilience
  // =========================================================================
  describe("Suite 5: In-Memory Blob URL Lifecycle & Revocation Resilience", () => {
    it("creates unique ephemeral blob URLs and safely revokes them", async () => {
      const blob1 = await service.createObfuscatedBlobUrl("https://cdn.alaref.academy/v1.mp4");
      const blob2 = await service.createObfuscatedBlobUrl("https://cdn.alaref.academy/v2.mp4");

      expect(blob1).toBeDefined();
      expect(blob2).toBeDefined();
      expect(blob1.startsWith("blob:")).toBe(true);
      expect(blob2.startsWith("blob:")).toBe(true);

      // Revoking individual blob should not throw
      expect(() => service.revokeBlobUrl(blob1)).not.toThrow();

      // Revoking already revoked or invalid URL should be a graceful no-op
      expect(() => service.revokeBlobUrl(blob1)).not.toThrow();
      expect(() => service.revokeBlobUrl("https://raw-static-url.com")).not.toThrow();
      expect(() => service.revokeBlobUrl("")).not.toThrow();
    });

    it("cleans up all active blob URLs idempotently on cleanupAllBlobUrls", async () => {
      await service.createObfuscatedBlobUrl("stream-1");
      await service.createObfuscatedBlobUrl("stream-2");
      await service.createObfuscatedBlobUrl("stream-3");

      expect(() => service.cleanupAllBlobUrls()).not.toThrow();
      // Second cleanup is safe and idempotent
      expect(() => service.cleanupAllBlobUrls()).not.toThrow();
    });
  });

  // =========================================================================
  // SUITE 6: Zustand Security Guard Interlocks & Player Halts
  // =========================================================================
  describe("Suite 6: Zustand Security Guard Interlocks & Player Halts", () => {
    it("strictly halts playback when DevTools inspection is detected", () => {
      const store = useVideoPlayerStore.getState();
      store.play();
      expect(useVideoPlayerStore.getState().isPlaying).toBe(true);

      // Trigger DevTools detection
      store.setDevToolsBlocked(true);
      expect(useVideoPlayerStore.getState().isPlaying).toBe(false);
      expect(useVideoPlayerStore.getState().isDevToolsBlocked).toBe(true);
      expect(useVideoPlayerStore.getState().securityAlert?.code).toBe("DEVTOOLS_DETECTED");

      // Attempting to resume play while blocked MUST be rejected
      store.play();
      expect(useVideoPlayerStore.getState().isPlaying).toBe(false);

      // Resolving DevTools block enables play again
      store.setDevToolsBlocked(false);
      expect(useVideoPlayerStore.getState().isDevToolsBlocked).toBe(false);
      store.play();
      expect(useVideoPlayerStore.getState().isPlaying).toBe(true);
    });

    it("strictly halts playback when watermark tampering is detected", () => {
      const store = useVideoPlayerStore.getState();
      store.play();
      expect(useVideoPlayerStore.getState().isPlaying).toBe(true);

      // Trigger Watermark Tampered
      store.setWatermarkTampered(true);
      expect(useVideoPlayerStore.getState().isPlaying).toBe(false);
      expect(useVideoPlayerStore.getState().isWatermarkTampered).toBe(true);
      expect(useVideoPlayerStore.getState().securityAlert?.code).toBe("WATERMARK_TAMPERED");

      // Subsequent play() MUST fail
      store.play();
      expect(useVideoPlayerStore.getState().isPlaying).toBe(false);
    });

    it("strictly halts playback when concurrent stream is detected", () => {
      const store = useVideoPlayerStore.getState();
      store.play();
      expect(useVideoPlayerStore.getState().isPlaying).toBe(true);

      // Trigger Concurrency Violation
      store.setConcurrencyViolation(true);
      expect(useVideoPlayerStore.getState().isPlaying).toBe(false);
      expect(useVideoPlayerStore.getState().concurrencyViolation).toBe(true);
      expect(useVideoPlayerStore.getState().securityAlert?.code).toBe("CONCURRENT_STREAM_DETECTED");

      // Subsequent play() MUST fail
      store.play();
      expect(useVideoPlayerStore.getState().isPlaying).toBe(false);
    });
  });
});
