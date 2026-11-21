/**
 * Protected Video Streaming & Media Contracts
 * Platform: Al Aref Academy (منصة مستر عمرو عارف التعليمية)
 */

export type VideoFormat = "hls" | "mp4" | "blob";

export interface VideoQualityLevel {
  id: string; // "auto" | "1080p" | "720p" | "480p" | "360p"
  label: string; // "تلقائي (Auto)" | "1080p (عالية جداً)" | "720p (عالية)" | ...
  height?: number;
  bitrate?: number;
  url?: string;
}

export interface TimestampedNote {
  id: string;
  timeSeconds: number;
  title: string;
  description?: string;
  isTeacherNote?: boolean;
}

export interface VideoSourceManifest {
  lessonId: string;
  title: string;
  courseTitle: string;
  gradeName: string;
  durationMinutes: number;
  format: VideoFormat;
  streamUrl: string; // Dynamic/signed stream URL or test stream
  qualities: VideoQualityLevel[];
  poster?: string;
  notes?: TimestampedNote[];
  isFreePreview: boolean;
  summaryPdfUrl?: string;
  quizId?: string;
  description?: string;
}

export interface ForensicWatermarkData {
  studentName: string;
  studentPhone: string;
  studentId: string;
  sessionIp: string;
  timestamp: string;
}

export interface SignedStreamToken {
  token: string;
  streamUrl: string;
  format: VideoFormat;
  expiresAt: number; // UNIX epoch seconds (15-min rolling TTL)
  nonce: string;
  watermark: ForensicWatermarkData;
}

export type SecurityViolationCode =
  | "EXPIRED_TOKEN"
  | "INVALID_SIGNATURE"
  | "DEVICE_MISMATCH"
  | "UNENROLLED_ACCESS"
  | "DEVTOOLS_DETECTED"
  | "WATERMARK_TAMPERED"
  | "CONCURRENT_STREAM_DETECTED";

export interface StreamSecurityViolation {
  code: SecurityViolationCode;
  message: string;
  timestamp: number;
  details?: Record<string, unknown>;
}

export interface ConcurrencyHeartbeatRequest {
  lessonId: string;
  studentId: string;
  deviceId: string;
  sessionToken: string;
}

export interface ConcurrencyHeartbeatResponse {
  allowed: boolean;
  activeStreamsCount: number;
  message?: string;
}
