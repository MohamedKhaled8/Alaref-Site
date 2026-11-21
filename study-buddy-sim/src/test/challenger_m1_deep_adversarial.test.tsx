import { describe, it, expect, beforeEach, vi } from "vitest";
import React, { act } from "react";
import ReactDOM from "react-dom/client";
import { useAuthStore } from "../stores/useAuthStore";
import { 
  authService, 
  LOCAL_STORAGE_ACCESS_TOKEN_KEY, 
  LOCAL_STORAGE_REFRESH_TOKEN_KEY,
  LOCAL_STORAGE_USERS_KEY
} from "../services/authService";
import { jwtService } from "../services/jwtService";
import { CourseAccessGuard, AccessDenialReason } from "../components/auth/CourseAccessGuard";
import { CourseItem } from "../data/mockData";

function mountToDom(element: React.ReactElement): HTMLElement {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = ReactDOM.createRoot(container);
  act(() => {
    root.render(element);
  });
  return container;
}

const mockCourse: CourseItem = {
  id: "course-prep-3-comprehensive",
  title: "كورس اللغة العربية الشامل - الصف الثالث الإعدادي",
  gradeId: "grade-3-prep",
  gradeName: "الصف الثالث الإعدادي",
  instructor: "مستر عمرو عارف",
  description: "شرح شامل ومفصل لمنهج النحو والبلاغة والقراءة",
  price: 250,
  rating: 4.9,
  studentsCount: 1250,
  lessonsCount: 24,
  durationHours: 36,
  isFree: false,
  thumbnail: "/assets/banner.png",
  tags: ["نحو", "بلاغة", "امتحانات"],
};

describe("Milestone 1 Iteration 2 Deep Adversarial Challenge Suite", () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.getState().logout();
    document.body.innerHTML = "";
  });

  // =========================================================================
  // 1. CourseAccessGuard Deep Contract Verification
  // =========================================================================
  describe("CourseAccessGuard Behavioral Contract (F5)", () => {
    it("renders loading spinner and message when useAuthStore is initializing", () => {
      useAuthStore.setState({ isLoading: true, isAuthenticated: false, user: null });

      const container = mountToDom(
        <CourseAccessGuard courseId={mockCourse.id} course={mockCourse}>
          <div id="guarded-content">محتوى الدرس</div>
        </CourseAccessGuard>
      );

      expect(container.querySelector("#guarded-content")).toBeNull();
      expect(container.textContent).toContain("جارٍ التحقق من صلاحيات الاشتراك وأمان الحساب");
    });

    it("respects custom loading fallback when isLoading is true", () => {
      useAuthStore.setState({ isLoading: true, isAuthenticated: false, user: null });

      const container = mountToDom(
        <CourseAccessGuard 
          courseId={mockCourse.id} 
          fallback={(reason: AccessDenialReason) => <div id="custom-loader">تحميل: {reason}</div>}
        >
          <div id="guarded-content">محتوى الدرس</div>
        </CourseAccessGuard>
      );

      expect(container.querySelector("#guarded-content")).toBeNull();
      const customEl = container.querySelector("#custom-loader");
      expect(customEl).not.toBeNull();
      expect(customEl?.textContent).toBe("تحميل: loading");
    });

    it("unconditionally grants access when isFree={true} even for unauthenticated guests", () => {
      useAuthStore.setState({ isLoading: false, isAuthenticated: false, user: null });

      const container = mountToDom(
        <CourseAccessGuard courseId="free-course" isFree={true}>
          <div id="free-content">محتوى مجاني متاح للجميع</div>
        </CourseAccessGuard>
      );

      expect(container.querySelector("#free-content")).not.toBeNull();
      expect(container.textContent).toContain("محتوى مجاني متاح للجميع");
    });

    it("unconditionally grants access when course.isFree={true}", () => {
      useAuthStore.setState({ isLoading: false, isAuthenticated: false, user: null });
      const freeCourse: CourseItem = { ...mockCourse, isFree: true };

      const container = mountToDom(
        <CourseAccessGuard courseId={freeCourse.id} course={freeCourse}>
          <div id="free-course-content">محتوى الكورس المجاني</div>
        </CourseAccessGuard>
      );

      expect(container.querySelector("#free-course-content")).not.toBeNull();
    });

    it("unconditionally grants access when isFreePreview={true} for specific lesson", () => {
      useAuthStore.setState({ isLoading: false, isAuthenticated: false, user: null });

      const container = mountToDom(
        <CourseAccessGuard courseId={mockCourse.id} course={mockCourse} isFreePreview={true}>
          <div id="preview-lesson">معاينة مجانية للمحاضرة الأولى</div>
        </CourseAccessGuard>
      );

      expect(container.querySelector("#preview-lesson")).not.toBeNull();
    });

    it("blocks unauthenticated student and fires onRequireAuth on CTA click", () => {
      useAuthStore.setState({ isLoading: false, isAuthenticated: false, user: null });
      const onRequireAuthSpy = vi.fn();

      const container = mountToDom(
        <CourseAccessGuard 
          courseId={mockCourse.id} 
          course={mockCourse}
          onRequireAuth={onRequireAuthSpy}
        >
          <div id="guarded-content">محتوى محمي</div>
        </CourseAccessGuard>
      );

      expect(container.querySelector("#guarded-content")).toBeNull();
      expect(container.textContent).toContain("محتوى الكورس محمي • يتطلب تسجيل الدخول");
      expect(container.textContent).toContain("250 ج.م");

      const authButton = container.querySelector("button");
      expect(authButton).not.toBeNull();
      act(() => {
        authButton?.click();
      });
      expect(onRequireAuthSpy).toHaveBeenCalledTimes(1);
    });

    it("supports 'banner' variant for unauthenticated user", () => {
      useAuthStore.setState({ isLoading: false, isAuthenticated: false, user: null });
      const onRequireAuthSpy = vi.fn();

      const container = mountToDom(
        <CourseAccessGuard 
          courseId={mockCourse.id} 
          variant="banner"
          onRequireAuth={onRequireAuthSpy}
        >
          <div id="guarded-content">محتوى محمي</div>
        </CourseAccessGuard>
      );

      expect(container.querySelector("#guarded-content")).toBeNull();
      expect(container.textContent).toContain("محتوى الكورس محمي • يتطلب تسجيل الدخول");

      const authButton = container.querySelector("button");
      act(() => {
        authButton?.click();
      });
      expect(onRequireAuthSpy).toHaveBeenCalledTimes(1);
    });

    it("supports 'compact' variant for unauthenticated user", () => {
      useAuthStore.setState({ isLoading: false, isAuthenticated: false, user: null });
      const onRequireAuthSpy = vi.fn();

      const container = mountToDom(
        <CourseAccessGuard 
          courseId={mockCourse.id} 
          variant="compact"
          onRequireAuth={onRequireAuthSpy}
        >
          <div id="guarded-content">محتوى محمي</div>
        </CourseAccessGuard>
      );

      expect(container.querySelector("#guarded-content")).toBeNull();
      expect(container.textContent).toContain("يتطلب تسجيل الدخول");

      const badge = container.firstElementChild as HTMLElement;
      act(() => {
        badge.click();
      });
      expect(onRequireAuthSpy).toHaveBeenCalledTimes(1);
    });

    it("blocks authenticated unenrolled student and fires onRequireEnroll and onEnrollCourse", () => {
      useAuthStore.setState({
        isLoading: false,
        isAuthenticated: true,
        user: {
          id: "student-100",
          fullName: "زياد أحمد",
          studentPhone: "01099991111",
          parentPhone: "01099992222",
          gradeId: "grade-3-prep",
          gradeName: "الصف الثالث الإعدادي",
          role: "student",
          deviceId: "dev_100",
          enrolledCourseIds: [],
          createdAt: new Date().toISOString(),
        },
      });

      const onRequireEnrollSpy = vi.fn();
      const onEnrollCourseSpy = vi.fn();

      const container = mountToDom(
        <CourseAccessGuard 
          courseId={mockCourse.id} 
          course={mockCourse}
          onRequireEnroll={onRequireEnrollSpy}
          onEnrollCourse={onEnrollCourseSpy}
        >
          <div id="guarded-content">محتوى محمي</div>
        </CourseAccessGuard>
      );

      expect(container.querySelector("#guarded-content")).toBeNull();
      expect(container.textContent).toContain("غير مشترك في هذا الكورس");
      expect(container.textContent).toContain("زياد أحمد");
      expect(container.textContent).toContain("250");

      const enrollButtons = container.querySelectorAll("button");
      expect(enrollButtons.length).toBeGreaterThan(0);
      act(() => {
        enrollButtons[0].click();
      });

      expect(onRequireEnrollSpy).toHaveBeenCalledWith(mockCourse.id, mockCourse);
      expect(onEnrollCourseSpy).toHaveBeenCalledWith(mockCourse.id);
    });

    it("allows admin user unconditional access regardless of course enrollment", () => {
      useAuthStore.setState({
        isLoading: false,
        isAuthenticated: true,
        user: {
          id: "admin-amr-aref",
          fullName: "مستر عمرو عارف",
          studentPhone: "01097303002",
          parentPhone: "01097303002",
          gradeId: "all",
          gradeName: "المعلم والأدمن",
          role: "admin",
          deviceId: "admin_dev",
          enrolledCourseIds: [],
          createdAt: new Date().toISOString(),
        },
      });

      const container = mountToDom(
        <CourseAccessGuard courseId={mockCourse.id} course={mockCourse}>
          <div id="admin-unlocked">المحتوى التعليمي مفتوح بالكامل للأستاذ عمرو عارف</div>
        </CourseAccessGuard>
      );

      expect(container.querySelector("#admin-unlocked")).not.toBeNull();
      expect(container.textContent).toContain("المحتوى التعليمي مفتوح بالكامل للأستاذ عمرو عارف");
    });

    it("allows enrolled student immediate access", () => {
      useAuthStore.setState({
        isLoading: false,
        isAuthenticated: true,
        user: {
          id: "student-enrolled",
          fullName: "سارة محمد",
          studentPhone: "01088887777",
          parentPhone: "01088889999",
          gradeId: "grade-3-prep",
          gradeName: "الصف الثالث الإعدادي",
          role: "student",
          deviceId: "dev_sarah",
          enrolledCourseIds: [mockCourse.id],
          createdAt: new Date().toISOString(),
        },
      });

      const container = mountToDom(
        <CourseAccessGuard courseId={mockCourse.id} course={mockCourse}>
          <div id="student-lesson">المحاضرة الأولى: المنادى وحالاته الإعرابية</div>
        </CourseAccessGuard>
      );

      expect(container.querySelector("#student-lesson")).not.toBeNull();
      expect(container.textContent).toContain("المحاضرة الأولى: المنادى وحالاته الإعرابية");
    });
  });

  // =========================================================================
  // 2. Monotonic Epoch Adversarial Race Tests in useAuthStore
  // =========================================================================
  describe("useAuthStore Monotonic Epoch Stress & Edge Cases", () => {
    it("RACE BUG: in-flight register() followed immediately by logout() leaves store unauthenticated", async () => {
      const regPromise = useAuthStore.getState().register({
        fullName: "طالب جديد للتجربة",
        studentPhone: "01011223344",
        parentPhone: "01022334455",
        password: "password123",
        gradeId: "grade-3-prep",
        gradeName: "الصف الثالث الإعدادي",
      });

      // Synchronous logout right after register initiated
      useAuthStore.getState().logout();

      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAuthStore.getState().user).toBeNull();
      expect(localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY)).toBeNull();

      await regPromise;

      const finalState = useAuthStore.getState();
      expect(finalState.isAuthenticated, "Store became authenticated despite explicit logout during register").toBe(false);
      expect(finalState.user, "User was populated despite explicit logout during register").toBeNull();
      expect(localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY), "Token written to storage despite explicit logout").toBeNull();
    });

    it("RACE BUG: in-flight initialize() followed immediately by logout() does not restore session", async () => {
      // Seed a valid token
      const validToken = await jwtService.signToken(
        {
          sub: "student-ahmed-ali",
          name: "أحمد محمد علي",
          phone: "01012345678",
          gradeId: "grade-3-prep",
          role: "student",
          deviceId: "dev_test",
        },
        3600
      );
      localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, validToken);

      const initPromise = useAuthStore.getState().initialize();
      // User or system immediately issues logout
      useAuthStore.getState().logout();

      await initPromise;

      const finalState = useAuthStore.getState();
      expect(finalState.isAuthenticated, "initialize() resurrected session after logout").toBe(false);
      expect(finalState.user).toBeNull();
      expect(localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY)).toBeNull();
    });

    it("STRESS BURST: 10 interleaved rapid login/logout cycles end in deterministic state", async () => {
      authService.resetDevice("01012345678");

      // Fire 10 rapid alternating login and logout calls
      for (let i = 0; i < 10; i++) {
        if (i % 2 === 0) {
          useAuthStore.getState().login({
            studentPhone: "01012345678",
            password: "password123",
          });
        } else {
          useAuthStore.getState().logout();
        }
      }

      // Explicitly terminate with logout
      useAuthStore.getState().logout();

      // Wait a moment for any residual microtasks / promises to resolve
      await new Promise((r) => setTimeout(r, 100));

      const finalState = useAuthStore.getState();
      expect(finalState.isAuthenticated, "Final state must be unauthenticated").toBe(false);
      expect(finalState.user, "Final user must be null").toBeNull();
      expect(localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY)).toBeNull();
    });

    it("enrollCourse safely handles duplicate calls and prevents duplicate entries", async () => {
      useAuthStore.setState({
        isAuthenticated: true,
        user: {
          id: "student-dedup",
          fullName: "طالب التكرار",
          studentPhone: "01077778888",
          parentPhone: "01077779999",
          gradeId: "grade-3-prep",
          gradeName: "الصف الثالث الإعدادي",
          role: "student",
          deviceId: "dev_dedup",
          enrolledCourseIds: ["course-1"],
          createdAt: new Date().toISOString(),
        },
      });

      // Call enrollCourse twice with same ID
      await useAuthStore.getState().enrollCourse("course-1");
      await useAuthStore.getState().enrollCourse("course-1");

      const courses = useAuthStore.getState().user?.enrolledCourseIds;
      expect(courses).toEqual(["course-1"]);
      expect(courses?.filter(c => c === "course-1").length).toBe(1);
    });

    it("enrollCourse when logged out does nothing and does not throw", async () => {
      useAuthStore.setState({ isAuthenticated: false, user: null });

      let threw = false;
      try {
        await useAuthStore.getState().enrollCourse("course-any");
      } catch {
        threw = true;
      }

      expect(threw).toBe(false);
      expect(useAuthStore.getState().user).toBeNull();
    });
  });
});
