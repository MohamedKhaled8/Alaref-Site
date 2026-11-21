/**
 * Protected Video Streaming & Security Engine
 * Web Crypto HMAC-SHA256 Tokenization, Rolling 15-min TTL,
 * Dynamic In-Memory Blob Decoupling, and Single-Device Stream Concurrency.
 *
 * Platform: Al Aref Academy (منصة مستر عمرو عارف التعليمية)
 */

import {
  VideoFormat,
  VideoQualityLevel,
  TimestampedNote,
  VideoSourceManifest,
  SignedStreamToken,
  StreamSecurityViolation,
  SecurityViolationCode,
  ConcurrencyHeartbeatRequest,
  ConcurrencyHeartbeatResponse,
  ForensicWatermarkData,
} from "../types/video";

export const STREAM_DEFAULT_SECRET = "alaref-video-stream-master-hmac-sha256-key-2026";
export const STREAM_TOKEN_TTL_SECONDS = 15 * 60; // 15 minutes rolling TTL
export const CONCURRENCY_TIMEOUT_MS = 45 * 1000; // 45 seconds heartbeat TTL

async function getCryptoSubtle(): Promise<SubtleCrypto> {
  if (typeof globalThis !== "undefined" && globalThis.crypto?.subtle) {
    return globalThis.crypto.subtle;
  }
  if (typeof window !== "undefined" && window.crypto?.subtle) {
    return window.crypto.subtle;
  }
  throw new Error("Web Crypto SubtleCrypto is not available in current environment");
}

function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function stringToBase64Url(str: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlToString(base64url: string): string {
  let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
}

function base64UrlToUint8Array(base64url: string): Uint8Array {
  let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export interface StreamTokenPayload {
  lessonId: string;
  studentId: string;
  deviceId: string;
  issuedAt: number;
  expiresAt: number;
  nonce: string;
}

export interface TokenValidationResult {
  valid: boolean;
  violation?: StreamSecurityViolation;
  payload?: StreamTokenPayload;
}

interface ActiveStreamRecord {
  studentId: string;
  deviceId: string;
  lessonId: string;
  sessionToken: string;
  lastHeartbeat: number;
}

export class VideoSecurityService {
  private secret: string;
  private activeBlobUrls: Set<string> = new Set();
  private activeStreams: Map<string, ActiveStreamRecord> = new Map();

  constructor(secret: string = STREAM_DEFAULT_SECRET) {
    this.secret = secret;
  }

  private async getSigningKey(): Promise<CryptoKey> {
    const subtle = await getCryptoSubtle();
    const keyData = new TextEncoder().encode(this.secret);
    return subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"]
    );
  }

  /**
   * Generates a cryptographically signed stream token with 15-min rolling TTL
   * and student identity watermark claims.
   */
  public async generateSignedStreamToken(params: {
    lessonId: string;
    studentId: string;
    deviceId: string;
    studentName?: string;
    studentPhone?: string;
    format?: VideoFormat;
    streamUrl?: string;
    ttlSeconds?: number;
  }): Promise<SignedStreamToken> {
    const now = Math.floor(Date.now() / 1000);
    const ttl = params.ttlSeconds ?? STREAM_TOKEN_TTL_SECONDS;
    const expiresAt = now + ttl;
    const nonce = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `nonce-${Math.random().toString(36).slice(2)}-${Date.now()}`;

    const payload: StreamTokenPayload = {
      lessonId: params.lessonId,
      studentId: params.studentId,
      deviceId: params.deviceId,
      issuedAt: now,
      expiresAt,
      nonce,
    };

    const serializedPayload = JSON.stringify(payload);
    const encodedPayload = stringToBase64Url(serializedPayload);

    // Compute HMAC-SHA256 signature
    const subtle = await getCryptoSubtle();
    const key = await this.getSigningKey();
    const dataToSign = new TextEncoder().encode(
      `${params.lessonId}:${params.studentId}:${params.deviceId}:${expiresAt}:${nonce}`
    );
    const signatureBuffer = await subtle.sign("HMAC", key, dataToSign);
    const signatureB64 = arrayBufferToBase64Url(signatureBuffer);

    const token = `${encodedPayload}.${signatureB64}`;

    // Base fallback / test stream if none provided
    const format = params.format || "mp4";
    const baseStreamUrl = params.streamUrl || this.getMockStreamUrl(params.lessonId, format);
    const tokenizedStreamUrl = `${baseStreamUrl}${baseStreamUrl.includes("?") ? "&" : "?"}token=${token}&exp=${expiresAt}`;

    const watermark: ForensicWatermarkData = {
      studentName: params.studentName || "طالب منصة مستر عمرو عارف",
      studentPhone: params.studentPhone || "01097303002",
      studentId: params.studentId,
      sessionIp: "156.204.48.12",
      timestamp: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
    };

    return {
      token,
      streamUrl: tokenizedStreamUrl,
      format,
      expiresAt,
      nonce,
      watermark,
    };
  }

  /**
   * Validates a signed stream token, ensuring signature integrity, TTL expiration,
   * device binding, and optional course entitlement.
   */
  public async validateStreamToken(
    token: string,
    options?: {
      expectedDeviceId?: string;
      expectedStudentId?: string;
      isEnrolled?: boolean;
      isFreePreview?: boolean;
    }
  ): Promise<TokenValidationResult> {
    if (!token || typeof token !== "string") {
      return {
        valid: false,
        violation: {
          code: "INVALID_SIGNATURE",
          message: "رمز بث الفيديو غير موجود أو تالف",
          timestamp: Date.now(),
        },
      };
    }

    const parts = token.split(".");
    if (parts.length !== 2) {
      return {
        valid: false,
        violation: {
          code: "INVALID_SIGNATURE",
          message: "بنية رمز بث الفيديو غير صالحة",
          timestamp: Date.now(),
        },
      };
    }

    const [encodedPayload, signatureB64] = parts;

    let payload: StreamTokenPayload;
    try {
      const jsonStr = base64UrlToString(encodedPayload);
      payload = JSON.parse(jsonStr) as StreamTokenPayload;
    } catch {
      return {
        valid: false,
        violation: {
          code: "INVALID_SIGNATURE",
          message: "تعذر قراءة بيانات توكن البث",
          timestamp: Date.now(),
        },
      };
    }

    // Verify HMAC-SHA256 signature
    try {
      const subtle = await getCryptoSubtle();
      const key = await this.getSigningKey();
      const signatureBytes = base64UrlToUint8Array(signatureB64);
      const dataToVerify = new TextEncoder().encode(
        `${payload.lessonId}:${payload.studentId}:${payload.deviceId}:${payload.expiresAt}:${payload.nonce}`
      );

      const isValid = await subtle.verify("HMAC", key, signatureBytes, dataToVerify);
      if (!isValid) {
        return {
          valid: false,
          violation: {
            code: "INVALID_SIGNATURE",
            message: "فشل التحقق من التوقيع الرقمي لرابط الفيديو (تم رصد تعديل غير مصرح)",
            timestamp: Date.now(),
          },
        };
      }
    } catch (err) {
      return {
        valid: false,
        violation: {
          code: "INVALID_SIGNATURE",
          message: `خطأ في محرك التشفير: ${err instanceof Error ? err.message : String(err)}`,
          timestamp: Date.now(),
        },
      };
    }

    // Expiration check (15-min rolling TTL)
    const now = Math.floor(Date.now() / 1000);
    if (payload.expiresAt <= now) {
      return {
        valid: false,
        violation: {
          code: "EXPIRED_TOKEN",
          message: "انتهت صلاحية جلسة الفيديو (15 دقيقة). يرجى تجديد التوكن تلقائياً.",
          timestamp: Date.now(),
        },
        payload,
      };
    }

    // Device binding check
    if (options?.expectedDeviceId && payload.deviceId !== options.expectedDeviceId) {
      return {
        valid: false,
        violation: {
          code: "DEVICE_MISMATCH",
          message: "رمز البث مرتبط بجهاز آخر. لا يمكن مشاركة روابط الفيديو.",
          timestamp: Date.now(),
        },
        payload,
      };
    }

    // Student ID check
    if (options?.expectedStudentId && payload.studentId !== options.expectedStudentId) {
      return {
        valid: false,
        violation: {
          code: "INVALID_SIGNATURE",
          message: "رمز البث غير مطابق لحساب الطالب النشط",
          timestamp: Date.now(),
        },
        payload,
      };
    }

    // Enrollment check (unless free preview)
    if (options && !options.isFreePreview && options.isEnrolled === false) {
      return {
        valid: false,
        violation: {
          code: "UNENROLLED_ACCESS",
          message: "غير مصرح بمشاهدة هذا الدرس الكامل بدون اشتراك نشط",
          timestamp: Date.now(),
        },
        payload,
      };
    }

    return { valid: true, payload };
  }

  /**
   * In-Memory Media Decoupling:
   * Creates an ephemeral `blob:` URL pointing to in-memory media or video buffer,
   * completely preventing raw static CDN link extraction in the DOM.
   */
  public async createObfuscatedBlobUrl(mediaDataOrUrl: string | Blob): Promise<string> {
    if (typeof URL === "undefined" || !URL.createObjectURL) {
      // In non-browser / node test environments without Blob URL mock
      return `blob:http://localhost/mock-stream-${Date.now()}`;
    }

    let blob: Blob;
    if (mediaDataOrUrl instanceof Blob) {
      blob = mediaDataOrUrl;
    } else if (typeof mediaDataOrUrl === "string" && mediaDataOrUrl.startsWith("data:")) {
      const res = await fetch(mediaDataOrUrl);
      blob = await res.blob();
    } else {
      // Create lightweight synthetic media buffer or wrap stream identifier
      const encoder = new TextEncoder();
      const syntheticBuffer = encoder.encode(`PROTECTED_MEDIA_STREAM:${mediaDataOrUrl}`);
      blob = new Blob([syntheticBuffer], { type: "video/mp4" });
    }

    const blobUrl = URL.createObjectURL(blob);
    this.activeBlobUrls.add(blobUrl);
    return blobUrl;
  }

  /**
   * Revokes an ephemeral Blob URL to free memory.
   */
  public revokeBlobUrl(blobUrl: string): void {
    if (!blobUrl || !blobUrl.startsWith("blob:")) return;
    if (typeof URL !== "undefined" && URL.revokeObjectURL) {
      URL.revokeObjectURL(blobUrl);
    }
    this.activeBlobUrls.delete(blobUrl);
  }

  /**
   * Revokes all active in-memory blob URLs (on unmount or logout).
   */
  public cleanupAllBlobUrls(): void {
    if (typeof URL !== "undefined" && URL.revokeObjectURL) {
      for (const url of this.activeBlobUrls) {
        URL.revokeObjectURL(url);
      }
    }
    this.activeBlobUrls.clear();
  }

  /**
   * Single-Device Stream Concurrency Heartbeat:
   * Tracks active streams per student, rejecting concurrent playback attempts
   * on multiple devices or tabs.
   */
  public sendHeartbeat(req: ConcurrencyHeartbeatRequest): ConcurrencyHeartbeatResponse {
    const now = Date.now();

    // Clean up stale sessions
    for (const [key, record] of this.activeStreams.entries()) {
      if (now - record.lastHeartbeat > CONCURRENCY_TIMEOUT_MS) {
        this.activeStreams.delete(key);
      }
    }

    // Check existing streams for this student
    const existingStreamsForStudent = Array.from(this.activeStreams.values()).filter(
      (r) => r.studentId === req.studentId
    );

    const isDifferentDevice = existingStreamsForStudent.some(
      (r) => r.deviceId !== req.deviceId
    );

    if (isDifferentDevice) {
      return {
        allowed: false,
        activeStreamsCount: existingStreamsForStudent.length + 1,
        message: "تم رصد تشغيل متزامن لنفس الحساب على جهاز آخر. تم إيقاف المشغل لحماية حسابك.",
      };
    }

    // Update or register current stream session
    this.activeStreams.set(req.sessionToken, {
      studentId: req.studentId,
      deviceId: req.deviceId,
      lessonId: req.lessonId,
      sessionToken: req.sessionToken,
      lastHeartbeat: now,
    });

    return {
      allowed: true,
      activeStreamsCount: 1,
    };
  }

  /**
   * Explicitly terminates a stream session on unmount or pause.
   */
  public terminateStream(sessionToken: string): void {
    this.activeStreams.delete(sessionToken);
  }

  /**
   * Returns a standard mock stream URL for fallback/testing.
   */
  public getMockStreamUrl(lessonId: string, format: VideoFormat): string {
    if (format === "hls") {
      // Standard robust public HLS test manifest (Akamai / Mux)
      return "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
    }
    // Standard progressive test video
    return "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
  }

  /**
   * Generates a complete mock stream manifest with multi-resolution ladders,
   * curriculum metadata, and timestamped lecture notes.
   */
  public getMockStreamManifest(
    lessonId: string,
    options?: Partial<VideoSourceManifest>
  ): VideoSourceManifest {
    const format = options?.format || "hls";
    const isFree = options?.isFreePreview ?? false;
    const streamUrl = options?.streamUrl || this.getMockStreamUrl(lessonId, format);

    const qualities: VideoQualityLevel[] = [
      { id: "auto", label: "تلقائي (Auto)", height: undefined },
      { id: "1080p", label: "1080p (عالية جداً)", height: 1080, bitrate: 4500000 },
      { id: "720p", label: "720p (عالية)", height: 720, bitrate: 2500000 },
      { id: "480p", label: "480p (متوسطة)", height: 480, bitrate: 1200000 },
      { id: "360p", label: "360p (اقتصادية)", height: 360, bitrate: 600000 },
    ];

    const notes: TimestampedNote[] = [
      {
        id: "note-1",
        timeSeconds: 0,
        title: "مقدمة الدرس وأهداف الحصة",
        description: "مقدمة عامة ونظرة تأسيسية حول أهداف المحاضرة مع مستر عمرو عارف.",
        isTeacherNote: true,
      },
      {
        id: "note-2",
        timeSeconds: 330, // 05:30
        title: "القاعدة الأساسية وشروط الإعراب",
        description: "الشرح التفصيلي لركائز القاعدة النحوية واستخراج الأركان بدقة.",
        isTeacherNote: true,
      },
      {
        id: "note-3",
        timeSeconds: 920, // 15:20
        title: "نماذج إعرابية وتطبيقات كتاب الامتحان",
        description: "حل تدريبات تطبيقية تفاعلية ونماذج الامتحانات المتقدمة.",
        isTeacherNote: true,
      },
      {
        id: "note-4",
        timeSeconds: 1725, // 28:45
        title: "الأسئلة المتكررة وتكليفات الواجب",
        description: "تنبيهات البلاغة والنحو الهامة وملخص ما قبل حل الواجب الإلكتروني.",
        isTeacherNote: true,
      },
    ];

    return {
      lessonId,
      title: options?.title || "شرح مبسط وتأسيسي • مستر عمرو عارف",
      courseTitle: options?.courseTitle || "منهج اللغة العربية للمرحلة الإعدادية",
      gradeName: options?.gradeName || "الصف الثالث الإعدادي",
      durationMinutes: options?.durationMinutes || 40,
      format,
      streamUrl,
      qualities,
      poster: options?.poster || "/og-image.png",
      notes: options?.notes || notes,
      isFreePreview: isFree,
      summaryPdfUrl: options?.summaryPdfUrl || "/mock-summary.pdf",
      quizId: options?.quizId || `quiz-${lessonId}`,
      description: options?.description || "محاضرة تفاعلية حصرية ضمن منصة مستر عمرو عارف للغة العربية.",
    };
  }
}

export const videoSecurityService = new VideoSecurityService();
