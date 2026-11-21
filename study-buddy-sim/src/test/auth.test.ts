import { describe, it, expect, beforeEach } from "vitest";
import { authService, LOCAL_STORAGE_USERS_KEY, LOCAL_STORAGE_DEVICE_KEY, LOCAL_STORAGE_ACCESS_TOKEN_KEY, LOCAL_STORAGE_REFRESH_TOKEN_KEY } from "../services/authService";
import { jwtService, JWTService, JWT_ISSUER } from "../services/jwtService";
import { useAuthStore } from "../stores/useAuthStore";

describe("Milestone 1: Authentication & JWT Security Verification", () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.getState().logout();
  });

  // -------------------------------------------------------------
  // 1. Egyptian Mobile Phone Validation & Discrepancy Rules
  // -------------------------------------------------------------
  describe("Egyptian Phone Validation & Forensic Discrepancy Rules", () => {
    it("validates authentic Egyptian mobile network prefixes (010, 011, 012, 015)", () => {
      // Vodafone
      expect(authService.validateEgyptianPhone("01012345678")).toBe(true);
      // Etisalat
      expect(authService.validateEgyptianPhone("01123456789")).toBe(true);
      // Orange
      expect(authService.validateEgyptianPhone("01234567890")).toBe(true);
      // WE
      expect(authService.validateEgyptianPhone("01555555555")).toBe(true);
    });

    it("rejects non-mobile, incorrect length, or malformed phone numbers", () => {
      // Landline 10 digits
      expect(authService.validateEgyptianPhone("0223456789")).toBe(false);
      // Invalid prefix (013 is Benha landline code)
      expect(authService.validateEgyptianPhone("01334567890")).toBe(false);
      // Too short (10 digits)
      expect(authService.validateEgyptianPhone("0101234567")).toBe(false);
      // Too long (12 digits)
      expect(authService.validateEgyptianPhone("010123456789")).toBe(false);
      // Non-numeric
      expect(authService.validateEgyptianPhone("010abcdefgh")).toBe(false);
      // Empty
      expect(authService.validateEgyptianPhone("")).toBe(false);
    });

    it("enforces forensic rule: studentPhone !== parentPhone", () => {
      // Identical phones must be rejected
      const identicalResult = authService.validatePhonesDiscrepancy(
        "01012345678",
        "01012345678"
      );
      expect(identicalResult.valid).toBe(false);
      expect(identicalResult.error).toContain("يجب أن يكون رقم ولي الأمر مختلفاً عن رقم هاتف الطالب");

      // Distinct valid phones must pass
      const distinctResult = authService.validatePhonesDiscrepancy(
        "01012345678",
        "01198765432"
      );
      expect(distinctResult.valid).toBe(true);
      expect(distinctResult.error).toBeUndefined();

      // Invalid format of student phone must be caught
      const invalidStudent = authService.validatePhonesDiscrepancy(
        "12345",
        "01198765432"
      );
      expect(invalidStudent.valid).toBe(false);
      expect(invalidStudent.error).toContain("رقم هاتف الطالب غير صالح");

      // Invalid format of parent phone must be caught
      const invalidParent = authService.validatePhonesDiscrepancy(
        "01012345678",
        "0229876543"
      );
      expect(invalidParent.valid).toBe(false);
      expect(invalidParent.error).toContain("رقم هاتف ولي الأمر غير صالح");
    });
  });

  // -------------------------------------------------------------
  // 2. Standards-Compliant Web Crypto HMAC-SHA256 JWT Engine
  // -------------------------------------------------------------
  describe("Web Crypto HMAC-SHA256 JWT Engine", () => {
    it("mints standards-compliant 3-part JWT token with HS256 algorithm and claims", async () => {
      const token = await jwtService.signToken(
        {
          sub: "student-test-101",
          name: "عمر خالد الشافعي",
          phone: "01011112222",
          gradeId: "grade-3-prep",
          role: "student",
          deviceId: "dev_test_abc123",
        },
        900
      );

      expect(typeof token).toBe("string");
      const parts = token.split(".");
      expect(parts).toHaveLength(3);

      const decoded = jwtService.decodeToken(token);
      expect(decoded).not.toBeNull();
      expect(decoded?.sub).toBe("student-test-101");
      expect(decoded?.name).toBe("عمر خالد الشافعي");
      expect(decoded?.phone).toBe("01011112222");
      expect(decoded?.iss).toBe(JWT_ISSUER);
      expect(decoded?.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
    });

    it("verifies untampered token signature cryptographically using Web Crypto", async () => {
      const token = await jwtService.signToken(
        {
          sub: "student-verify-ok",
          name: "سلمى ياسر حامد",
          phone: "01233334444",
          gradeId: "grade-1-prep",
          role: "student",
          deviceId: "dev_device_1",
        },
        600
      );

      const result = await jwtService.verifyToken(token);
      expect(result.valid).toBe(true);
      expect(result.payload?.sub).toBe("student-verify-ok");
      expect(result.payload?.name).toBe("سلمى ياسر حامد");
    });

    it("detects tampered payload segments and rejects forged signatures", async () => {
      const originalToken = await jwtService.signToken(
        {
          sub: "student-honest",
          name: "طالب أصلي",
          phone: "01099998888",
          gradeId: "grade-2-prep",
          role: "student",
          deviceId: "dev_honest",
        },
        600
      );

      const [headerB64, payloadB64, signatureB64] = originalToken.split(".");

      // Tamper with payload: change student ID
      const decodedPayload = JSON.parse(atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/")));
      decodedPayload.sub = "hacker-student-tampered";
      decodedPayload.role = "admin"; // privilege escalation attempt

      const tamperedPayloadB64 = btoa(JSON.stringify(decodedPayload))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      const tamperedToken = `${headerB64}.${tamperedPayloadB64}.${signatureB64}`;

      const tamperedResult = await jwtService.verifyToken(tamperedToken);
      expect(tamperedResult.valid).toBe(false);
      expect(tamperedResult.error).toContain("فشل التحقق من التوقيع الرقمي");
    });

    it("rejects tokens signed with an unrecognized secret key", async () => {
      const rogueService = new JWTService("unauthorized-foreign-attacker-secret-key");
      const rogueToken = await rogueService.signToken(
        {
          sub: "rogue-agent",
          name: "مستخدم مزيف",
          phone: "01000000000",
          gradeId: "grade-3-prep",
          role: "student",
          deviceId: "dev_rogue",
        },
        600
      );

      const verifyResult = await jwtService.verifyToken(rogueToken);
      expect(verifyResult.valid).toBe(false);
      expect(verifyResult.error).toContain("فشل التحقق من التوقيع الرقمي");
    });

    it("detects expired tokens and refuses validation", async () => {
      // Sign with -10 seconds TTL (already expired)
      const expiredToken = await jwtService.signToken(
        {
          sub: "student-expired",
          name: "طالب منتهي الجلسة",
          phone: "01055554444",
          gradeId: "grade-taasis",
          role: "student",
          deviceId: "dev_expired",
        },
        -10
      );

      expect(jwtService.isTokenExpired(expiredToken)).toBe(true);

      const verifyResult = await jwtService.verifyToken(expiredToken);
      expect(verifyResult.valid).toBe(false);
      expect(verifyResult.error).toContain("انتهت صلاحية جلسة تسجيل الدخول");
    });

    it("generates and verifies 7-day companion refresh tokens", async () => {
      const refreshToken = await jwtService.createRefreshToken("student-user-refresh", "dev_refresh_1");
      expect(typeof refreshToken).toBe("string");

      const verifyResult = await jwtService.verifyToken(refreshToken);
      expect(verifyResult.valid).toBe(true);
      expect(verifyResult.payload?.sub).toBe("student-user-refresh");
    });
  });

  // -------------------------------------------------------------
  // 3. AuthService: Registry, Single-Device Policy & Flow
  // -------------------------------------------------------------
  describe("AuthService User Registry & Single-Device Policy", () => {
    it("successfully logs in seeded demo student with matching credentials", async () => {
      const response = await authService.login({
        studentPhone: "01012345678",
        password: "password123",
        deviceId: "device-demo-ahmed",
      });

      expect(response.user.id).toBe("student-ahmed-ali");
      expect(response.user.fullName).toBe("أحمد محمد علي");
      expect(response.user.gradeId).toBe("grade-3-prep");
      expect(response.tokens.accessToken).toBeDefined();
      expect(response.tokens.refreshToken).toBeDefined();
    });

    it("rejects login when password is incorrect", async () => {
      await expect(
        authService.login({
          studentPhone: "01012345678",
          password: "wrong-password",
        })
      ).rejects.toThrow("كلمة المرور غير صحيحة");
    });

    it("rejects login when student phone is not registered", async () => {
      await expect(
        authService.login({
          studentPhone: "01088887777",
          password: "password123",
        })
      ).rejects.toThrow("رقم الهاتف غير مسجل في المنصة");
    });

    it("enforces Single-Device Policy: rejects login from foreign device if bound to another", async () => {
      // Seeded student Ahmed is bound to "device-demo-ahmed"
      await expect(
        authService.login({
          studentPhone: "01012345678",
          password: "password123",
          deviceId: "foreign-unauthorized-device-id-999",
        })
      ).rejects.toThrow("الأجهزة المسموح بها: 1");
    });

    it("allows device reset and re-binding through support workflow", async () => {
      // Reset device binding
      const resetSuccess = authService.resetDevice("01012345678");
      expect(resetSuccess).toBe(true);

      // Now login with new device should succeed and bind to new device
      const response = await authService.login({
        studentPhone: "01012345678",
        password: "password123",
        deviceId: "newly-authorized-device-2026",
      });

      expect(response.user.deviceId).toBe("newly-authorized-device-2026");
    });

    it("registers a new student with valid inputs, binding device and issuing tokens", async () => {
      const newPhone = "01077776666";
      const parentPhone = "01188889999";

      const regResponse = await authService.register({
        fullName: "يوسف حسام الدين السيد",
        studentPhone: newPhone,
        parentPhone: parentPhone,
        gradeId: "grade-1-prep",
        password: "securePassword123",
        deviceId: "dev_youssef_laptop",
      });

      expect(regResponse.user.fullName).toBe("يوسف حسام الدين السيد");
      expect(regResponse.user.studentPhone).toBe(newPhone);
      expect(regResponse.user.gradeId).toBe("grade-1-prep");
      expect(regResponse.user.role).toBe("student");
      expect(regResponse.tokens.accessToken).toBeDefined();

      // Subsequent login with registered credentials succeeds
      const loginResponse = await authService.login({
        studentPhone: newPhone,
        password: "securePassword123",
        deviceId: "dev_youssef_laptop",
      });

      expect(loginResponse.user.id).toBe(regResponse.user.id);
    });

    it("rejects registering duplicate phone numbers", async () => {
      await expect(
        authService.register({
          fullName: "طالب مكرر",
          studentPhone: "01012345678", // already registered
          parentPhone: "01233334444",
          gradeId: "grade-3-prep",
          password: "password123",
        })
      ).rejects.toThrow("رقم الهاتف مسجل مسبقاً في المنصة");
    });

    it("refreshes expired session using refresh token", async () => {
      const loginResponse = await authService.login({
        studentPhone: "01012345678",
        password: "password123",
        deviceId: "device-demo-ahmed",
      });

      const refreshResponse = await authService.refreshSession(loginResponse.tokens.refreshToken);
      expect(refreshResponse.user.id).toBe(loginResponse.user.id);
      expect(refreshResponse.tokens.accessToken).toBeDefined();
    });
  });

  // -------------------------------------------------------------
  // 4. Zustand Store Integration & State Lifecycle
  // -------------------------------------------------------------
  describe("Zustand useAuthStore Reactive Integration", () => {
    it("initializes with unauthenticated empty state", () => {
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
    });

    it("performs full login flow, updates reactive state, and writes tokens to localStorage", async () => {
      const store = useAuthStore.getState();
      const loginSuccess = await store.login({
        studentPhone: "01012345678",
        password: "password123",
        deviceId: "device-demo-ahmed",
      });

      expect(loginSuccess).toBe(true);

      const updatedState = useAuthStore.getState();
      expect(updatedState.isAuthenticated).toBe(true);
      expect(updatedState.user?.fullName).toBe("أحمد محمد علي");
      expect(updatedState.token).not.toBeNull();
      expect(localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY)).toBe(updatedState.token);
    });

    it("checks course enrollment entitlement and updates courses on enrollCourse", async () => {
      const store = useAuthStore.getState();
      await store.login({
        studentPhone: "01012345678",
        password: "password123",
        deviceId: "device-demo-ahmed",
      });

      // Ahmed is pre-enrolled in "course-prep3-summary"
      expect(useAuthStore.getState().isEnrolled("course-prep3-summary")).toBe(true);
      expect(useAuthStore.getState().isEnrolled("course-new-grammar")).toBe(false);

      // Enroll in new course
      await useAuthStore.getState().enrollCourse("course-new-grammar");
      expect(useAuthStore.getState().isEnrolled("course-new-grammar")).toBe(true);
    });

    it("performs logout and clears state and localStorage tokens", async () => {
      const store = useAuthStore.getState();
      await store.login({
        studentPhone: "01012345678",
        password: "password123",
        deviceId: "device-demo-ahmed",
      });

      expect(useAuthStore.getState().isAuthenticated).toBe(true);

      useAuthStore.getState().logout();

      const loggedOutState = useAuthStore.getState();
      expect(loggedOutState.isAuthenticated).toBe(false);
      expect(loggedOutState.user).toBeNull();
      expect(loggedOutState.token).toBeNull();
      expect(localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY)).toBeNull();
    });

    it("hydrates authenticated state from valid localStorage tokens via initialize()", async () => {
      // First login to generate real tokens
      const loginResponse = await authService.login({
        studentPhone: "01012345678",
        password: "password123",
        deviceId: "device-demo-ahmed",
      });

      // Manually set localStorage tokens simulating app reload
      localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, loginResponse.tokens.accessToken);
      localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY, loginResponse.tokens.refreshToken);

      // Reset store in-memory state
      useAuthStore.setState({ user: null, token: null, isAuthenticated: false });

      // Run initialize()
      await useAuthStore.getState().initialize();

      const hydrated = useAuthStore.getState();
      expect(hydrated.isAuthenticated).toBe(true);
      expect(hydrated.user?.id).toBe("student-ahmed-ali");
      expect(hydrated.user?.fullName).toBe("أحمد محمد علي");
    });
  });
});
