import { describe, it, expect, beforeEach } from "vitest";
import { 
  authService, 
  LOCAL_STORAGE_USERS_KEY, 
  LOCAL_STORAGE_DEVICE_KEY, 
  LOCAL_STORAGE_ACCESS_TOKEN_KEY, 
  LOCAL_STORAGE_REFRESH_TOKEN_KEY 
} from "../services/authService";
import { jwtService, JWTService, JWT_ISSUER } from "../services/jwtService";
import { useAuthStore } from "../stores/useAuthStore";

describe("Milestone 1 Adversarial Challenge & Stress Suite", () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.getState().logout();
  });

  // =========================================================================
  // 1. Web Crypto JWT Engine Adversarial Attacks
  // =========================================================================
  describe("Web Crypto JWT Engine Adversarial Attacks", () => {
    it("CHALLENGE-JWT-1: Detects and rejects single-bit/character corruption in signature data bits", async () => {
      const validToken = await jwtService.signToken({
        sub: "student-challenger-1",
        name: "طالب التحدي",
        phone: "01011112222",
        gradeId: "grade-3-prep",
        role: "student",
        deviceId: "dev_challenge_1",
      });

      const parts = validToken.split(".");
      expect(parts).toHaveLength(3);
      const [header, payload, signature] = parts;

      // Bit-flip: corrupt character at index 10 (which is guaranteed to alter 6 data bits of the signature)
      const targetIndex = 10;
      const originalChar = signature[targetIndex];
      const flippedChar = originalChar === "x" ? "y" : "x";
      const corruptedSignature = 
        signature.slice(0, targetIndex) + flippedChar + signature.slice(targetIndex + 1);
      const tamperedToken = `${header}.${payload}.${corruptedSignature}`;

      const result = await jwtService.verifyToken(tamperedToken);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("فشل التحقق من التوقيع الرقمي للرمز");
    });

    it("CHALLENGE-JWT-2: Detects and rejects 'alg: none' algorithm confusion attack", async () => {
      // Helper for UTF-8 Base64Url in test
      const toB64Url = (str: string) => {
        const bytes = new TextEncoder().encode(str);
        let binary = "";
        for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
        return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      };

      // Forge a token with alg: "none"
      const maliciousHeader = toB64Url(JSON.stringify({ alg: "none", typ: "JWT" }));
      const payload = toB64Url(JSON.stringify({
        sub: "admin-attacker",
        name: "مهاجم",
        phone: "01000000000",
        gradeId: "grade-3-prep",
        role: "admin",
        deviceId: "dev_attacker",
        iss: JWT_ISSUER,
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
      }));

      const noneToken = `${maliciousHeader}.${payload}.`;

      const result = await jwtService.verifyToken(noneToken);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("خوارزمية التشفير غير مدعومة");
    });

    it("CHALLENGE-JWT-3: Detects and rejects unsupported / unexpected algorithms (HS384, RS256, empty)", async () => {
      const testAlgs = ["HS384", "HS512", "RS256", "ES256", "", "none", "NONE"];

      for (const alg of testAlgs) {
        const header = btoa(JSON.stringify({ alg, typ: "JWT" }))
          .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
        const payload = btoa(JSON.stringify({
          sub: "test-user",
          iss: JWT_ISSUER,
          exp: Math.floor(Date.now() / 1000) + 3600,
        })).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

        const token = `${header}.${payload}.fakesignature`;
        const result = await jwtService.verifyToken(token);
        expect(result.valid).toBe(false);
        expect(result.error).toContain("خوارزمية التشفير غير مدعومة");
      }
    });

    it("CHALLENGE-JWT-4: Handles structurally malformed tokens gracefully without uncaught throws", async () => {
      const malformedTokens = [
        "",
        "   ",
        "headeronly",
        "header.payload",
        "header.payload.signature.extra",
        "header.payload.signature.extra.part5",
        "....",
        "invalid-base64-json!.also-invalid!.signature!",
        "eyJhbGciOiJIUzI1NiJ9.not-valid-json.signature",
        "not-valid-header.eyJzdWIiOiIxMjMifQ.signature",
      ];

      for (const token of malformedTokens) {
        const result = await jwtService.verifyToken(token);
        expect(result.valid).toBe(false);
        expect(typeof result.error).toBe("string");
      }
    });

    it("CHALLENGE-JWT-5: Rejects non-string and falsy token inputs gracefully", async () => {
      const falsyInputs: unknown[] = [null, undefined, 0, false, {}, []];

      for (const input of falsyInputs) {
        // @ts-expect-error Testing adversarial invalid inputs
        const result = await jwtService.verifyToken(input);
        expect(result.valid).toBe(false);
        expect(result.error).toContain("رمز المصادقة غير موجود أو غير صالح");
      }
    });

    it("CHALLENGE-JWT-6: Rejects tokens with forged or unauthorized issuer (iss claim)", async () => {
      // Create a token signed with the valid key but forged issuer
      const validToken = await jwtService.signToken({
        sub: "student-issuer-test",
        name: "طالب التزوير",
        phone: "01011112222",
        gradeId: "grade-3-prep",
        role: "student",
        deviceId: "dev_1",
      });

      const [hB64, pB64] = validToken.split(".");
      const decodedPayload = JSON.parse(atob(pB64.replace(/-/g, "+").replace(/_/g, "/")));

      // Change issuer to malicious/foreign
      decodedPayload.iss = "attacker-unauthorized-portal";

      // Re-sign with master key to test that issuer check explicitly fails
      const tamperedPB64 = btoa(JSON.stringify(decodedPayload))
        .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

      // Sign with real secret key
      const subtle = globalThis.crypto.subtle;
      const key = await subtle.importKey(
        "raw",
        new TextEncoder().encode("alaref-academy-master-jwt-secret-key-hmac-sha256-2026"),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const dataToSign = new TextEncoder().encode(`${hB64}.${tamperedPB64}`);
      const sigBuf = await subtle.sign("HMAC", key, dataToSign);
      const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sigBuf)))
        .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

      const signedForgedIssToken = `${hB64}.${tamperedPB64}.${sigB64}`;

      const result = await jwtService.verifyToken(signedForgedIssToken);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("جهة إصدار الرمز غير معتمدة");
    });

    it("CHALLENGE-JWT-7: Rigorously verifies expiration boundaries (exact second, past, zero)", async () => {
      const now = Math.floor(Date.now() / 1000);

      // Expired 1 second ago
      const expired1s = await jwtService.signToken({
        sub: "user-exp-1",
        name: "منتهي 1",
        phone: "01011112222",
        gradeId: "grade-taasis",
        role: "student",
        deviceId: "dev_1",
      }, -1);

      expect(jwtService.isTokenExpired(expired1s)).toBe(true);
      const res1 = await jwtService.verifyToken(expired1s);
      expect(res1.valid).toBe(false);
      expect(res1.error).toContain("انتهت صلاحية جلسة تسجيل الدخول");

      // Expired long ago (-100000s)
      const expiredLong = await jwtService.signToken({
        sub: "user-exp-long",
        name: "منتهي قديم",
        phone: "01011112222",
        gradeId: "grade-taasis",
        role: "student",
        deviceId: "dev_1",
      }, -100000);

      expect(jwtService.isTokenExpired(expiredLong)).toBe(true);
      const resLong = await jwtService.verifyToken(expiredLong);
      expect(resLong.valid).toBe(false);
      expect(resLong.error).toContain("انتهت صلاحية جلسة تسجيل الدخول");
    });

    it("CHALLENGE-JWT-8: Web Crypto blocks zero-length secrets and rejects foreign secret keys", async () => {
      // 1. Zero-length secret is blocked by Web Crypto
      const emptySecretService = new JWTService("");
      await expect(
        emptySecretService.signToken({
          sub: "attacker-empty-secret",
          name: "مهاجم",
          phone: "01000000000",
          gradeId: "grade-3-prep",
          role: "student",
          deviceId: "dev_empty",
        })
      ).rejects.toThrow();

      // 2. Foreign secret produces signature that fails verification
      const foreignSecretService = new JWTService("attacker-random-foreign-secret-2026");
      const foreignToken = await foreignSecretService.signToken({
        sub: "attacker-foreign",
        name: "طالب أجنبي",
        phone: "01011112222",
        gradeId: "grade-3-prep",
        role: "student",
        deviceId: "dev_foreign",
      });

      const result = await jwtService.verifyToken(foreignToken);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("فشل التحقق من التوقيع الرقمي");
    });

    it("CHALLENGE-JWT-9: Rejects refresh token when payload sub is missing or non-existent in DB", async () => {
      const ghostRefreshToken = await jwtService.createRefreshToken("ghost-nonexistent-student-id", "dev_ghost");
      await expect(authService.refreshSession(ghostRefreshToken)).rejects.toThrow(
        "المستخدم المرتبط بهذا الرمز لم يعد موجوداً"
      );
    });
  });

  // =========================================================================
  // 2. Egyptian Mobile Phone Validation & Forensic Discrepancy Stress Tests
  // =========================================================================
  describe("Egyptian Phone Validation & Forensic Discrepancy Edge Cases", () => {
    it("CHALLENGE-PHONE-1: Validates authentic Egyptian carrier prefixes (010, 011, 012, 015)", () => {
      expect(authService.validateEgyptianPhone("01000000000")).toBe(true);
      expect(authService.validateEgyptianPhone("01199999999")).toBe(true);
      expect(authService.validateEgyptianPhone("01234567890")).toBe(true);
      expect(authService.validateEgyptianPhone("01555555555")).toBe(true);
    });

    it("CHALLENGE-PHONE-2: Rejects invalid carrier prefixes (013, 014, 016, 017, 018, 019)", () => {
      const invalidPrefixes = [
        "01312345678", // 013 Benha/Qalyubia landline
        "01412345678", // 014 unassigned
        "01612345678", // 016 unassigned
        "01712345678", // 017 unassigned
        "01812345678", // 018 unassigned
        "01912345678", // 019 unassigned
      ];

      for (const phone of invalidPrefixes) {
        expect(authService.validateEgyptianPhone(phone)).toBe(false);
      }
    });

    it("CHALLENGE-PHONE-3: Trims surrounding whitespace and rejects internal spaces or formatting", () => {
      // Surrounding whitespace is trimmed by service
      expect(authService.validateEgyptianPhone("  01012345678  ")).toBe(true);
      expect(authService.validateEgyptianPhone("\t01198765432\n")).toBe(true);

      // Internal spaces / dashes must be rejected
      expect(authService.validateEgyptianPhone("010 1234 5678")).toBe(false);
      expect(authService.validateEgyptianPhone("010-1234-5678")).toBe(false);
      expect(authService.validateEgyptianPhone("+20 01012345678")).toBe(false);
    });

    it("CHALLENGE-PHONE-4: Rejects international dial prefixes (+20, 0020, 20)", () => {
      expect(authService.validateEgyptianPhone("+201012345678")).toBe(false);
      expect(authService.validateEgyptianPhone("00201012345678")).toBe(false);
      expect(authService.validateEgyptianPhone("201012345678")).toBe(false);
    });

    it("CHALLENGE-PHONE-5: Rejects Arabic-indic numerals unless normalized (empirical behavior check)", () => {
      // Testing whether Arabic-indic digits (٠١٠١٢٣٤٥٦٧٨) pass or fail regex
      const arabicIndicPhone = "٠١٠١٢٣٤٥٦٧٨";
      const isValid = authService.validateEgyptianPhone(arabicIndicPhone);
      // Since regex is /^01[0125][0-9]{8}$/, Arabic-indic characters are rejected as expected
      expect(isValid).toBe(false);
    });

    it("CHALLENGE-PHONE-6: Rejects extreme lengths and potential ReDoS inputs cleanly", () => {
      expect(authService.validateEgyptianPhone("010")).toBe(false);
      expect(authService.validateEgyptianPhone("0101234567")).toBe(false); // 10 digits
      expect(authService.validateEgyptianPhone("010123456789")).toBe(false); // 12 digits
      // ReDoS probe: 10,000 digits
      const hugeInput = "010" + "9".repeat(10000);
      const start = performance.now();
      expect(authService.validateEgyptianPhone(hugeInput)).toBe(false);
      const elapsed = performance.now() - start;
      expect(elapsed).toBeLessThan(100); // Must evaluate in <100ms
    });

    it("CHALLENGE-PHONE-7: Rigorously tests forensic discrepancy rule edge cases", () => {
      // Exact identical
      const r1 = authService.validatePhonesDiscrepancy("01012345678", "01012345678");
      expect(r1.valid).toBe(false);
      expect(r1.error).toContain("يجب أن يكون رقم ولي الأمر مختلفاً");

      // Identical after whitespace trimming
      const r2 = authService.validatePhonesDiscrepancy(" 01012345678 ", "01012345678");
      expect(r2.valid).toBe(false);
      expect(r2.error).toContain("يجب أن يكون رقم ولي الأمر مختلفاً");

      // Empty or whitespace only
      const r3 = authService.validatePhonesDiscrepancy("", "01198765432");
      expect(r3.valid).toBe(false);
      expect(r3.error).toContain("يرجى إدخال رقم هاتف الطالب ورقم هاتف ولي الأمر");

      const r4 = authService.validatePhonesDiscrepancy("   ", "   ");
      expect(r4.valid).toBe(false);

      // Student valid, parent invalid carrier prefix
      const r5 = authService.validatePhonesDiscrepancy("01012345678", "01334567890");
      expect(r5.valid).toBe(false);
      expect(r5.error).toContain("رقم هاتف ولي الأمر غير صالح");

      // Student invalid, parent valid
      const r6 = authService.validatePhonesDiscrepancy("02234567890", "01198765432");
      expect(r6.valid).toBe(false);
      expect(r6.error).toContain("رقم هاتف الطالب غير صالح");
    });
  });

  // =========================================================================
  // 3. Single-Device Lock Enforcement & Concurrency Stress
  // =========================================================================
  describe("Single-Device Lock Enforcement & Concurrency Stress", () => {
    it("CHALLENGE-DEVICE-1: Concurrency lock: foreign device login is rejected when student is bound", async () => {
      // Seeded student Ahmed is bound to "device-demo-ahmed"
      await expect(
        authService.login({
          studentPhone: "01012345678",
          password: "password123",
          deviceId: "attacker-foreign-phone-xyz",
        })
      ).rejects.toThrow("الأجهزة المسموح بها: 1");

      // Bound device succeeds concurrently
      const successLogin = await authService.login({
        studentPhone: "01012345678",
        password: "password123",
        deviceId: "device-demo-ahmed",
      });
      expect(successLogin.user.id).toBe("student-ahmed-ali");
    });

    it("CHALLENGE-DEVICE-2: Registration automatically binds to creator's deviceId and locks out secondary devices", async () => {
      const regPhone = "01033334444";
      const parentPhone = "01144445555";
      const creatorDeviceId = "tablet-samsung-student-original";

      // Register from device 1
      const reg = await authService.register({
        fullName: "طارق زياد عبد الرحمن",
        studentPhone: regPhone,
        parentPhone: parentPhone,
        gradeId: "grade-3-prep",
        password: "securePassword2026",
        deviceId: creatorDeviceId,
      });

      expect(reg.user.deviceId).toBe(creatorDeviceId);

      // Attempt login from Device 2 (unauthorized device)
      await expect(
        authService.login({
          studentPhone: regPhone,
          password: "securePassword2026",
          deviceId: "laptop-secondary-unauthorized",
        })
      ).rejects.toThrow("الأجهزة المسموح بها: 1");

      // Login from original device succeeds
      const originalLogin = await authService.login({
        studentPhone: regPhone,
        password: "securePassword2026",
        deviceId: creatorDeviceId,
      });
      expect(originalLogin.user.deviceId).toBe(creatorDeviceId);
    });

    it("CHALLENGE-DEVICE-3: Device reset transitions binding to new device and locks out old device", async () => {
      const phone = "01099887766"; // Mariam Hossam (initially bound to device-demo-mariam)

      // Verify old device works
      const initialLogin = await authService.login({
        studentPhone: phone,
        password: "password123",
        deviceId: "device-demo-mariam",
      });
      expect(initialLogin.user.deviceId).toBe("device-demo-mariam");

      // Reset device through support channel
      const resetOk = authService.resetDevice(phone);
      expect(resetOk).toBe(true);

      // Re-bind to Device NEW
      const newDeviceLogin = await authService.login({
        studentPhone: phone,
        password: "password123",
        deviceId: "new-iphone-15-pro-mariam",
      });
      expect(newDeviceLogin.user.deviceId).toBe("new-iphone-15-pro-mariam");

      // Old device MUST NOW BE REJECTED!
      await expect(
        authService.login({
          studentPhone: phone,
          password: "password123",
          deviceId: "device-demo-mariam",
        })
      ).rejects.toThrow("الأجهزة المسموح بها: 1");
    });

    it("CHALLENGE-DEVICE-4: Zustand hydration gracefully handles corrupted localStorage tokens without crashing", async () => {
      // Put completely invalid / corrupted values into localStorage
      localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, "corrupted.garbage.signature");
      localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY, "malformed-refresh-token");

      // Call store initialize()
      await useAuthStore.getState().initialize();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      // Tokens must have been purged from localStorage
      expect(localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY)).toBeNull();
    });

    it("CHALLENGE-DEVICE-5: Concurrent logins from same bound device succeed without conflict", async () => {
      const results = await Promise.all([
        authService.login({
          studentPhone: "01012345678",
          password: "password123",
          deviceId: "device-demo-ahmed",
        }),
        authService.login({
          studentPhone: "01012345678",
          password: "password123",
          deviceId: "device-demo-ahmed",
        }),
      ]);

      expect(results[0].user.id).toBe("student-ahmed-ali");
      expect(results[1].user.id).toBe("student-ahmed-ali");
      expect(results[0].tokens.accessToken).toBeDefined();
      expect(results[1].tokens.accessToken).toBeDefined();
    });

    it("CHALLENGE-DEVICE-6: Race condition between authorized and unauthorized devices", async () => {
      const p1 = authService.login({
        studentPhone: "01012345678",
        password: "password123",
        deviceId: "device-demo-ahmed", // authorized
      });

      const p2 = authService.login({
        studentPhone: "01012345678",
        password: "password123",
        deviceId: "device-hacker-concurrent", // unauthorized
      });

      const [r1, r2] = await Promise.allSettled([p1, p2]);
      expect(r1.status).toBe("fulfilled");
      expect(r2.status).toBe("rejected");
      if (r2.status === "rejected") {
        expect(r2.reason.message).toContain("الأجهزة المسموح بها: 1");
      }
    });

    it("CHALLENGE-DEVICE-7: Defends against phone number normalization bypasses in registration", async () => {
      // Attempt to register with the same phone padded with whitespace or different casing
      await expect(
        authService.register({
          fullName: "طالب مسافات",
          studentPhone: "  01012345678  ", // Ahmed's phone with whitespace
          parentPhone: "01288887777",
          gradeId: "grade-3-prep",
          password: "password123",
        })
      ).rejects.toThrow("رقم الهاتف مسجل مسبقاً في المنصة");
    });
  });

  // =========================================================================
  // 4. Role-Based Access & Protected Route Defense
  // =========================================================================
  describe("Role-Based Authorization & Session Invariants", () => {
    it("CHALLENGE-AUTHZ-1: Student token cannot claim admin role without invalidating signature", async () => {
      const studentLogin = await authService.login({
        studentPhone: "01012345678",
        password: "password123",
        deviceId: "device-demo-ahmed",
      });

      const token = studentLogin.tokens.accessToken;
      const [h, p, s] = token.split(".");
      const payloadObj = JSON.parse(atob(p.replace(/-/g, "+").replace(/_/g, "/")));

      // Escalate role to admin
      payloadObj.role = "admin";
      const tamperedP = btoa(JSON.stringify(payloadObj))
        .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

      const tamperedToken = `${h}.${tamperedP}.${s}`;
      const verifyResult = await jwtService.verifyToken(tamperedToken);
      expect(verifyResult.valid).toBe(false);
      expect(verifyResult.error).toContain("فشل التحقق من التوقيع الرقمي");
    });

    it("CHALLENGE-AUTHZ-2: Refresh token is rejected if user was removed from system database", async () => {
      // Register a temporary student
      const tempStudent = await authService.register({
        fullName: "طالب مؤقت للحذف",
        studentPhone: "01055551111",
        parentPhone: "01255552222",
        gradeId: "grade-1-prep",
        password: "password123",
        deviceId: "dev_temp_delete",
      });

      const refreshToken = tempStudent.tokens.refreshToken;

      // Manually simulate user deletion from DB
      const usersDbStr = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
      if (usersDbStr) {
        const users = JSON.parse(usersDbStr);
        const filtered = users.filter((u: { id: string }) => u.id !== tempStudent.user.id);
        localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(filtered));
      }

      // Now attempt session refresh
      await expect(authService.refreshSession(refreshToken)).rejects.toThrow(
        "المستخدم المرتبط بهذا الرمز لم يعد موجوداً"
      );
    });
  });
});
