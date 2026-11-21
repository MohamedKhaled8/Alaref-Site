import { JWTPayload } from "../types/auth";

export const JWT_ISSUER = "alaref-academy";
export const JWT_DEFAULT_SECRET = "alaref-academy-master-jwt-secret-key-hmac-sha256-2026";
export const ACCESS_TOKEN_TTL_SECONDS = 15 * 60; // 15 minutes
export const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

// Helper to resolve SubtleCrypto across browser, Node.js, and jsdom environments
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

export interface VerificationResult {
  valid: boolean;
  payload?: JWTPayload;
  error?: string;
}

export class JWTService {
  private secret: string;

  constructor(secret: string = JWT_DEFAULT_SECRET) {
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
   * Signs a JWT payload with HMAC-SHA256 and returns a standard JWT string.
   */
  public async signToken(
    claims: Omit<JWTPayload, "iat" | "exp" | "iss">,
    expiresInSeconds: number = ACCESS_TOKEN_TTL_SECONDS
  ): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    const payload: JWTPayload = {
      ...claims,
      iat: now,
      exp: now + expiresInSeconds,
      iss: JWT_ISSUER,
    };

    const header = {
      alg: "HS256",
      typ: "JWT",
    };

    const encodedHeader = stringToBase64Url(JSON.stringify(header));
    const encodedPayload = stringToBase64Url(JSON.stringify(payload));
    const dataToSign = new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`);

    const key = await this.getSigningKey();
    const subtle = await getCryptoSubtle();
    const signatureBuffer = await subtle.sign("HMAC", key, dataToSign);
    const encodedSignature = arrayBufferToBase64Url(signatureBuffer);

    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
  }

  /**
   * Verifies the signature, integrity, issuer, and expiration of a JWT token.
   */
  public async verifyToken(token: string): Promise<VerificationResult> {
    if (!token || typeof token !== "string") {
      return { valid: false, error: "رمز المصادقة غير موجود أو غير صالح" };
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      return { valid: false, error: "بنية رمز المصادقة غير مطابقة للمواصفات" };
    }

    const [headerB64, payloadB64, signatureB64] = parts;

    // Decode header and verify alg
    try {
      const headerStr = base64UrlToString(headerB64);
      const header = JSON.parse(headerStr);
      if (header.alg !== "HS256") {
        return { valid: false, error: "خوارزمية التشفير غير مدعومة" };
      }
    } catch {
      return { valid: false, error: "تعذر فك تشفير ترويسة الرمز" };
    }

    // Decode payload
    let payload: JWTPayload;
    try {
      const payloadStr = base64UrlToString(payloadB64);
      payload = JSON.parse(payloadStr) as JWTPayload;
    } catch {
      return { valid: false, error: "تعذر فك تشفير بيانات الرمز" };
    }

    // Cryptographic signature verification
    try {
      const key = await this.getSigningKey();
      const subtle = await getCryptoSubtle();
      const dataToVerify = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
      const signatureBytes = base64UrlToUint8Array(signatureB64);

      const isSignatureValid = await subtle.verify(
        "HMAC",
        key,
        signatureBytes,
        dataToVerify
      );

      if (!isSignatureValid) {
        return { valid: false, error: "فشل التحقق من التوقيع الرقمي للرمز" };
      }
    } catch (err) {
      return { valid: false, error: `خطأ أثناء التحقق من التوقيع: ${err instanceof Error ? err.message : String(err)}` };
    }

    // Check Issuer
    if (payload.iss !== JWT_ISSUER) {
      return { valid: false, error: "جهة إصدار الرمز غير معتمدة" };
    }

    // Check Expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp <= now) {
      return { valid: false, error: "انتهت صلاحية جلسة تسجيل الدخول" };
    }

    return { valid: true, payload };
  }

  /**
   * Decodes a JWT token without verifying signature (safe inspection).
   */
  public decodeToken<T = JWTPayload>(token: string): T | null {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;
      const jsonStr = base64UrlToString(parts[1]);
      return JSON.parse(jsonStr) as T;
    } catch {
      return null;
    }
  }

  /**
   * Checks if token is expired based on exp claim.
   */
  public isTokenExpired(token: string): boolean {
    const payload = this.decodeToken<JWTPayload>(token);
    if (!payload || !payload.exp) return true;
    return payload.exp <= Math.floor(Date.now() / 1000);
  }

  /**
   * Generates a companion refresh token with 7 days TTL.
   */
  public async createRefreshToken(userId: string, deviceId: string): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      sub: userId,
      type: "refresh",
      deviceId,
      iat: now,
      exp: now + REFRESH_TOKEN_TTL_SECONDS,
      iss: JWT_ISSUER,
    };

    const header = { alg: "HS256", typ: "JWT" };
    const encodedHeader = stringToBase64Url(JSON.stringify(header));
    const encodedPayload = stringToBase64Url(JSON.stringify(payload));
    const dataToSign = new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`);

    const key = await this.getSigningKey();
    const subtle = await getCryptoSubtle();
    const signatureBuffer = await subtle.sign("HMAC", key, dataToSign);
    const encodedSignature = arrayBufferToBase64Url(signatureBuffer);

    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
  }
}

export const jwtService = new JWTService();
