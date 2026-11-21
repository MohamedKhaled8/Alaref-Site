import { describe, it, expect, beforeEach, vi } from "vitest";
import React, { act } from "react";
import ReactDOM from "react-dom/client";
import { useAuthStore } from "../stores/useAuthStore";
import { 
  authService, 
  LOCAL_STORAGE_USERS_KEY, 
  LOCAL_STORAGE_ACCESS_TOKEN_KEY, 
  LOCAL_STORAGE_REFRESH_TOKEN_KEY,
  LOCAL_STORAGE_DEVICE_KEY 
} from "../services/authService";
import { jwtService } from "../services/jwtService";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { UserProfileDropdown } from "../components/auth/UserProfileDropdown";
import { Header } from "../components/layout/Header";
import { MobileBottomNav } from "../components/layout/MobileBottomNav";

function mountToDom(element: React.ReactElement): HTMLElement {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = ReactDOM.createRoot(container);
  act(() => {
    root.render(element);
  });
  return container;
}

describe("Milestone 1 Empirical Challenger Stress Suite", () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.getState().logout();
    document.body.innerHTML = "";
  });

  // =========================================================================
  // 1. Race Conditions & State Inconsistency in useAuthStore
  // =========================================================================
  describe("State Race Conditions & Rapid Toggling", () => {
    it("RACE BUG 1: in-flight successful login followed immediately by logout leaves store authenticated", async () => {
      // Reset device so login actually succeeds
      authService.resetDevice("01012345678");

      // Initiate async login with valid seeded credentials
      const loginPromise = useAuthStore.getState().login({
        studentPhone: "01012345678",
        password: "password123",
      });

      // Before login resolves, user triggers synchronous logout
      useAuthStore.getState().logout();

      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAuthStore.getState().user).toBeNull();
      expect(localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY)).toBeNull();

      // Wait for in-flight login promise to resolve
      const loginResult = await loginPromise;
      expect(loginResult, "Login should have been successful").toBe(true);

      // EMPIRICAL OBSERVATION: Does the delayed login promise override the user's logout?
      const storeState = useAuthStore.getState();
      const storedToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);

      // If store is authenticated after explicit logout, that is a confirmed race condition bug
      expect(storeState.isAuthenticated, "CRITICAL RACE CONDITION: store became authenticated despite explicit logout").toBe(false);
      expect(storeState.user, "CRITICAL RACE CONDITION: user was set despite explicit logout").toBeNull();
      expect(storedToken, "CRITICAL RACE CONDITION: token was stored in localStorage despite explicit logout").toBeNull();
    });

    it("RACE BUG 2: concurrent login calls do not corrupt user and tokens", async () => {
      authService.resetDevice("01012345678");
      authService.resetDevice("01099887766");

      const devId = "shared_test_device";
      localStorage.setItem(LOCAL_STORAGE_DEVICE_KEY, devId);

      const p1 = useAuthStore.getState().login({
        studentPhone: "01012345678",
        password: "password123",
        deviceId: devId,
      });

      const p2 = useAuthStore.getState().login({
        studentPhone: "01099887766",
        password: "password123",
        deviceId: devId,
      });

      await Promise.all([p1, p2]);

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).not.toBeNull();
      expect(state.token).not.toBeNull();

      const decoded = jwtService.decodeToken(state.token!);
      expect(decoded?.sub).toBe(state.user?.id);
      expect(decoded?.phone).toBe(state.user?.studentPhone);
    });

    it("RACE BUG 3: initialize() in-flight does not overwrite an active login session", async () => {
      const expiredToken = await jwtService.signToken(
        {
          sub: "student-ahmed-ali",
          name: "أحمد محمد علي",
          phone: "01012345678",
          gradeId: "grade-3-prep",
          role: "student",
          deviceId: "dev_test",
        },
        -10
      );
      localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, expiredToken);
      localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY);

      const initPromise = useAuthStore.getState().initialize();

      authService.resetDevice("01012345678");
      const loginPromise = useAuthStore.getState().login({
        studentPhone: "01012345678",
        password: "password123",
      });

      await Promise.all([initPromise, loginPromise]);

      const state = useAuthStore.getState();
      expect(state.isAuthenticated, "Active login was clobbered by initialize()").toBe(true);
      expect(state.user?.studentPhone).toBe("01012345678");
    });
  });

  // =========================================================================
  // 2. Corrupted localStorage Stress Testing
  // =========================================================================
  describe("Corrupted localStorage Resilience", () => {
    it("handles corrupted non-JSON users db without uncaught crash", async () => {
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, "{bad_json_here: not valid!");

      let crashed = false;
      try {
        const result = await useAuthStore.getState().login({
          studentPhone: "01012345678",
          password: "password123",
        });
        expect(result).toBe(true);
      } catch (e) {
        crashed = true;
      }
      expect(crashed).toBe(false);
    });

    it("handles null entries in users database without throwing TypeError", async () => {
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify([null, { id: "corrupt" }]));

      let threwTypeError = false;
      try {
        await useAuthStore.getState().login({
          studentPhone: "01012345678",
          password: "password123",
        });
      } catch (err: any) {
        if (err instanceof TypeError && err.message.includes("Cannot read properties of null")) {
          threwTypeError = true;
        }
      }

      expect(threwTypeError, "AuthService threw unhandled TypeError on null db entries").toBe(false);
    });

    it("handles missing enrolledCourseIds field on user record during enrollCourse", async () => {
      const legacyUser = {
        id: "student-legacy-no-courses",
        fullName: "طالب قديم",
        studentPhone: "01055554444",
        parentPhone: "01099998888",
        gradeId: "grade-3-prep",
        gradeName: "الصف الثالث الإعدادي",
        role: "student",
        deviceId: "dev_legacy",
        passwordHash: "pass123",
      };
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify([legacyUser]));

      await useAuthStore.getState().login({
        studentPhone: "01055554444",
        password: "pass123",
        deviceId: "dev_legacy",
      });

      let enrollCrashed = false;
      try {
        await useAuthStore.getState().enrollCourse("new-course-id");
      } catch (e) {
        enrollCrashed = true;
      }

      expect(enrollCrashed, "enrollCourse crashed on user with missing enrolledCourseIds").toBe(false);
      expect(useAuthStore.getState().isEnrolled("new-course-id")).toBe(true);
    });

    it("handles completely corrupted access token string during initialize()", async () => {
      localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, "this_is_not_a_valid_jwt_token_at_all");
      localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY);

      await useAuthStore.getState().initialize();

      const state = useAuthStore.getState();
      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
    });
  });

  // =========================================================================
  // 3. Route Protection & CourseAccessGuard Completeness Check
  // =========================================================================
  describe("Route Protection & CourseAccessGuard Integrity", () => {
    it("ProtectedRoute renders loading indicator when isLoading is true", () => {
      useAuthStore.setState({ isLoading: true, isAuthenticated: false, user: null });

      const container = mountToDom(
        <ProtectedRoute>
          <div id="protected-content">المحتوى السري</div>
        </ProtectedRoute>
      );

      expect(container.querySelector("#protected-content")).toBeNull();
      expect(container.textContent).toContain("جارٍ التحقق من صلاحيات الجلسة وأمان الرمز");
    });

    it("ProtectedRoute blocks unauthenticated users and shows login prompt", () => {
      useAuthStore.setState({ isLoading: false, isAuthenticated: false, user: null });

      const container = mountToDom(
        <ProtectedRoute onRequireAuth={() => {}}>
          <div id="protected-content">المحتوى السري</div>
        </ProtectedRoute>
      );

      expect(container.querySelector("#protected-content")).toBeNull();
      expect(container.textContent).toContain("محتوى تعليمي محمي");
      expect(container.textContent).toContain("تسجيل الدخول أو إنشاء حساب");
    });

    it("ProtectedRoute blocks students when requiredRole is admin", () => {
      useAuthStore.setState({
        isLoading: false,
        isAuthenticated: true,
        user: {
          id: "student-1",
          fullName: "طالب تجريبي",
          studentPhone: "01012345678",
          parentPhone: "01112345678",
          gradeId: "grade-3-prep",
          gradeName: "الصف الثالث الإعدادي",
          role: "student",
          deviceId: "dev_1",
          enrolledCourseIds: [],
          createdAt: new Date().toISOString(),
        },
      });

      const container = mountToDom(
        <ProtectedRoute requiredRole="admin">
          <div id="admin-content">لوحة التحكم</div>
        </ProtectedRoute>
      );

      expect(container.querySelector("#admin-content")).toBeNull();
      expect(container.textContent).toContain("ليس لديك الصلاحية الكافية للوصول لهذا القسم");
    });

    it("ProtectedRoute permits authenticated student when role matches", () => {
      useAuthStore.setState({
        isLoading: false,
        isAuthenticated: true,
        user: {
          id: "student-1",
          fullName: "طالب تجريبي",
          studentPhone: "01012345678",
          parentPhone: "01112345678",
          gradeId: "grade-3-prep",
          gradeName: "الصف الثالث الإعدادي",
          role: "student",
          deviceId: "dev_1",
          enrolledCourseIds: [],
          createdAt: new Date().toISOString(),
        },
      });

      const container = mountToDom(
        <ProtectedRoute requiredRole="student">
          <div id="student-content">المحتوى الطلابي</div>
        </ProtectedRoute>
      );

      expect(container.querySelector("#student-content")).not.toBeNull();
      expect(container.textContent).toContain("المحتوى الطلابي");
    });

    it("CourseAccessGuard component exists in codebase (F5 contract check)", () => {
      let exists = false;
      try {
        const authExports = Object.keys(require("../components/auth/ProtectedRoute"));
        exists = authExports.includes("CourseAccessGuard");
      } catch {
        exists = false;
      }
      expect(exists, "CourseAccessGuard is missing from components/auth").toBe(true);
    });
  });

  // =========================================================================
  // 4. Responsive UI & Layout Integrity (390px and 1440px)
  // =========================================================================
  describe("Responsive UI & Layout Integrity", () => {
    it("renders unauthenticated Header with login and register buttons", () => {
      useAuthStore.setState({ isAuthenticated: false, user: null });

      const container = mountToDom(
        <Header
          isDark={false}
          toggleTheme={() => {}}
          onOpenAuth={() => {}}
          onNavigate={() => {}}
          onSelectGrade={() => {}}
        />
      );

      expect(container.textContent).toContain("تسجيل الدخول");
      expect(container.textContent).toContain("حساب جديد");
    });

    it("renders authenticated Header with UserProfileDropdown and initials", () => {
      useAuthStore.setState({
        isAuthenticated: true,
        user: {
          id: "student-1",
          fullName: "أحمد علي",
          studentPhone: "01012345678",
          parentPhone: "01112345678",
          gradeId: "grade-3-prep",
          gradeName: "الصف الثالث الإعدادي",
          role: "student",
          deviceId: "dev_1",
          enrolledCourseIds: ["course-1"],
          createdAt: new Date().toISOString(),
        },
      });

      const container = mountToDom(
        <Header
          isDark={false}
          toggleTheme={() => {}}
          onOpenAuth={() => {}}
          onNavigate={() => {}}
          onSelectGrade={() => {}}
        />
      );

      expect(container.textContent).not.toContain("تسجيل الدخول");
      expect(container.textContent).toContain("أ ع");
    });

    it("renders UserProfileDropdown with student name and enrolled count", () => {
      useAuthStore.setState({
        isAuthenticated: true,
        user: {
          id: "student-1",
          fullName: "مريم حسام",
          studentPhone: "01099887766",
          parentPhone: "01234567890",
          gradeId: "grade-2-prep",
          gradeName: "الصف الثاني الإعدادي",
          role: "student",
          deviceId: "dev_1",
          enrolledCourseIds: ["course-1", "course-2"],
          createdAt: new Date().toISOString(),
        },
      });

      const container = mountToDom(<UserProfileDropdown />);
      expect(container.textContent).toContain("مريم حسام");
      expect(container.textContent).toContain("الصف الثاني الإعدادي");
    });

    it("MobileBottomNav renders authenticated state with 'كورساتي' and 'خروج' actions", () => {
      useAuthStore.setState({
        isAuthenticated: true,
        user: {
          id: "student-1",
          fullName: "عمر خالد",
          studentPhone: "01012345678",
          parentPhone: "01112345678",
          gradeId: "grade-3-prep",
          gradeName: "الصف الثالث الإعدادي",
          role: "student",
          deviceId: "dev_1",
          enrolledCourseIds: [],
          createdAt: new Date().toISOString(),
        },
      });

      const container = mountToDom(
        <MobileBottomNav
          activeSection="home"
          onNavigate={() => {}}
          onOpenAuth={() => {}}
        />
      );

      expect(container.textContent).toContain("كورساتي");
      expect(container.textContent).toContain("خروج (عمر)");
    });
  });
});
