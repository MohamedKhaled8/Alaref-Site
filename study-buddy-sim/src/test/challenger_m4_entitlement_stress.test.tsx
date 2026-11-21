// @ts-expect-error enable React act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import React, { act } from "react";
import ReactDOM from "react-dom/client";
import { 
  useEnrollmentStore, 
  LOCAL_STORAGE_ENROLLMENTS_KEY, 
  LOCAL_STORAGE_PURCHASE_HISTORY_KEY 
} from "../stores/useEnrollmentStore";
import { useAuthStore } from "../stores/useAuthStore";
import { authService, LOCAL_STORAGE_USERS_KEY } from "../services/authService";
import { videoSecurityService } from "../services/videoSecurityService";
import { CourseAccessGuard } from "../components/auth/CourseAccessGuard";
import { CourseCard } from "../components/courses/CourseCard";
import { CourseDetailsModal } from "../components/courses/CourseDetailsModal";
import { SummaryDownloadButton } from "../components/summaries/SummaryDownloadButton";
import { ExamPlayerModal } from "../components/exams/ExamPlayerModal";
import { CourseItem, teacherProfile } from "../data/mockData";
import { User } from "../types/auth";
import { CheckoutPayload } from "../types/payment";

// Helper to mount React components into a clean DOM container with rerender and unmount
function mountComponent(element: React.ReactElement): {
  container: HTMLElement;
  rerender: (newElement: React.ReactElement) => void;
  unmount: () => void;
} {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = ReactDOM.createRoot(container);
  act(() => {
    root.render(element);
  });
  return {
    container,
    rerender: (newElement: React.ReactElement) => {
      act(() => {
        root.render(newElement);
      });
    },
    unmount: () => {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
}

// Canonical mock test course
const testPaidCourse: CourseItem = {
  id: "course-prep-3-comprehensive",
  slug: "prep-3-arabic-mastery",
  title: "كورس اللغة العربية الشامل - الصف الثالث الإعدادي",
  gradeId: "prep-3",
  gradeName: "الصف الثالث الإعدادي",
  archetype: "curriculum",
  archetypeLabel: "المنهج الكامل",
  description: "شرح شامل للنحو والبلاغة مع مستر عمرو عارف",
  longDescription: "شرح وافٍ وتفصيلي لكافة أركان المنهج",
  price: 320,
  originalPrice: 400,
  isFree: false,
  studentCount: 1850,
  lecturesCount: 16,
  durationHours: 28,
  durationText: "28 ساعة",
  rating: 4.96,
  reviewsCount: 380,
  isFeatured: true,
  thumbnail: "/assets/banner.png",
  units: [
    {
      id: "unit-grammar-1",
      title: "الوحدة الأولى: قواعد النحو والإعراب",
      lessons: [
        {
          id: "lesson-v1-nidaa",
          title: "الدرس الأول: أسلوب النداء وأحكامه",
          type: "video",
          durationMinutes: 45,
          isFreePreview: false,
        },
        {
          id: "lesson-q1-quiz",
          title: "امتحان شامل على أسلوب النداء",
          type: "quiz",
          durationMinutes: 15,
          isFreePreview: false,
        },
        {
          id: "lesson-pdf-summary",
          title: "مذكرة وخلاصة النداء (PDF)",
          type: "pdf",
          durationMinutes: 10,
          isFreePreview: false,
        },
      ],
    },
  ],
  quizCount: 4,
  examRules: {
    questionsCount: 10,
    durationMinutes: 15,
    passScore: 6,
    maxAttempts: 2,
  },
};

const secondPaidCourse: CourseItem = {
  ...testPaidCourse,
  id: "course-prep-2-rhetoric",
  slug: "prep-2-rhetoric",
  title: "كورس البلاغة والنصوص - الصف الثاني الإعدادي",
  price: 280,
  isFree: false,
};

const freeCourseItem: CourseItem = {
  ...testPaidCourse,
  id: "course-free-foundations",
  slug: "free-foundations",
  title: "كورس تأسيس النحو المجاني",
  price: 0,
  isFree: true,
};

const testStudentUser: User = {
  id: "student-adv-901",
  fullName: "كريم أحمد الشناوي",
  studentPhone: "01099887766",
  parentPhone: "01011223344",
  gradeId: "prep-3",
  gradeName: "الصف الثالث الإعدادي",
  role: "student",
  deviceId: "device-adv-stress-node",
  enrolledCourseIds: [],
  createdAt: "2026-11-01T08:00:00Z",
};

describe("Milestone 4 Adversarial Stress Harness: Entitlement & Subsystem Unlocking", () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = "";
    useEnrollmentStore.getState().resetEnrollments();
    
    // Seed test student in authService users db to allow DB syncing
    try {
      const usersDb = authService.getUsersDb();
      const existingIdx = usersDb.findIndex((u) => u.id === testStudentUser.id);
      if (existingIdx >= 0) {
        usersDb[existingIdx] = { ...testStudentUser, enrolledCourseIds: [] };
      } else {
        usersDb.push({ ...testStudentUser, enrolledCourseIds: [] });
      }
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(usersDb));
    } catch {
      // ignore in isolated environments
    }

    useAuthStore.setState({
      user: { ...testStudentUser, enrolledCourseIds: [] },
      isAuthenticated: true,
      isLoading: false,
      token: "test-valid-jwt-token",
    });
  });

  afterEach(() => {
    localStorage.clear();
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  // =========================================================================
  // 1. Immediate Access Entitlement & CourseAccessGuard Unblocking
  // =========================================================================
  describe("1. Immediate Access Entitlement & Zero-Reload CourseAccessGuard Unblocking", () => {
    it("empirically verifies post-checkout immediate unblocking without reload", async () => {
      // 1. Initial State: Mount CourseAccessGuard around a protected lecture view
      let enrollTriggered = false;
      const { container, rerender, unmount } = mountComponent(
        <CourseAccessGuard
          courseId={testPaidCourse.id}
          course={testPaidCourse}
          onRequireEnroll={() => {
            enrollTriggered = true;
          }}
        >
          <div data-testid="protected-lesson-content">
            <h1>محتوى المحاضرة المحمي: أسلوب النداء</h1>
          </div>
        </CourseAccessGuard>
      );

      // Verify initially guarded: student is authenticated but unenrolled
      expect(container.textContent).toContain("غير مشترك في هذا الكورس");
      expect(container.textContent).toContain("320");
      expect(container.querySelector('[data-testid="protected-lesson-content"]')).toBeNull();

      // Trigger enroll CTA
      const enrollBtn = container.querySelector("button");
      expect(enrollBtn).not.toBeNull();
      act(() => {
        enrollBtn?.click();
      });
      expect(enrollTriggered).toBe(true);

      // 2. Execute processCheckout in store
      const checkoutPayload: CheckoutPayload = {
        paymentMethod: "vodafone_cash",
        phoneNumber: "01099887766",
      };

      let invoice;
      await act(async () => {
        invoice = await useEnrollmentStore
          .getState()
          .processCheckout(testPaidCourse, testStudentUser, checkoutPayload);
      });

      expect(invoice).toBeDefined();
      expect(invoice.status).toBe("completed");
      expect(invoice.courseId).toBe(testPaidCourse.id);

      // Verify useEnrollmentStore immediately confirms enrollment
      expect(useEnrollmentStore.getState().isCourseEnrolled(testPaidCourse.id)).toBe(true);

      // Wait a microtask cycle for store subscriptions to propagate to React
      await act(async () => {
        await new Promise((r) => setTimeout(r, 50));
      });

      // Re-render CourseAccessGuard with the same props
      rerender(
        <CourseAccessGuard
          courseId={testPaidCourse.id}
          course={testPaidCourse}
          onRequireEnroll={() => {
            enrollTriggered = true;
          }}
        >
          <div data-testid="protected-lesson-content">
            <h1>محتوى المحاضرة المحمي: أسلوب النداء</h1>
          </div>
        </CourseAccessGuard>
      );

      // 3. Verify CourseAccessGuard is UNBLOCKED and renders protected content
      const protectedEl = container.querySelector('[data-testid="protected-lesson-content"]');
      expect(protectedEl).not.toBeNull();
      expect(container.textContent).toContain("محتوى المحاضرة المحمي: أسلوب النداء");
      expect(container.textContent).not.toContain("غير مشترك في هذا الكورس");

      unmount();
    });

    it("verifies double purchase of an already enrolled course is strictly rejected", async () => {
      // First checkout succeeds
      await act(async () => {
        await useEnrollmentStore.getState().processCheckout(testPaidCourse, testStudentUser, {
          paymentMethod: "vodafone_cash",
          phoneNumber: "01099887766",
        });
      });

      expect(useEnrollmentStore.getState().isCourseEnrolled(testPaidCourse.id)).toBe(true);

      // Second checkout must throw error and keep state intact
      await expect(
        useEnrollmentStore.getState().processCheckout(testPaidCourse, testStudentUser, {
          paymentMethod: "vodafone_cash",
          phoneNumber: "01099887766",
        })
      ).rejects.toThrow("أنت مشترك بالفعل في هذا الكورس ومفعل على حسابك");

      // Verify no duplicate in enrolledCourseIds
      const enrolled = useEnrollmentStore.getState().enrolledCourseIds;
      const occurrences = enrolled.filter((id) => id === testPaidCourse.id).length;
      expect(occurrences).toBe(1);
    });

    it("verifies free course entitlement grants immediate access without payment gateway", async () => {
      const { container, rerender, unmount } = mountComponent(
        <CourseAccessGuard courseId={freeCourseItem.id} course={freeCourseItem}>
          <div data-testid="free-lesson-content">محتوى الكورس المجاني متاح فوراً</div>
        </CourseAccessGuard>
      );

      // Initially, since course.isFree is true, CourseAccessGuard grants immediate access
      expect(container.querySelector('[data-testid="free-lesson-content"]')).not.toBeNull();

      // Now enroll explicitly via enrollFreeCourse
      act(() => {
        const freeInvoice = useEnrollmentStore
          .getState()
          .enrollFreeCourse(freeCourseItem.id, testStudentUser, freeCourseItem);
        expect(freeInvoice.finalPrice).toBe(0);
        expect(freeInvoice.status).toBe("completed");
      });

      expect(useEnrollmentStore.getState().isCourseEnrolled(freeCourseItem.id)).toBe(true);

      rerender(
        <CourseAccessGuard courseId={freeCourseItem.id} course={freeCourseItem}>
          <div data-testid="free-lesson-content">محتوى الكورس المجاني متاح فوراً</div>
        </CourseAccessGuard>
      );

      expect(container.textContent).toContain("محتوى الكورس المجاني متاح فوراً");
      unmount();
    });

    it("investigates CourseAccessGuard when useEnrollmentStore is enrolled but useAuthStore is unsynced", () => {
      // Set useEnrollmentStore to have course
      useEnrollmentStore.setState({
        enrolledCourseIds: [testPaidCourse.id],
      });
      // But useAuthStore has empty enrolledCourseIds
      useAuthStore.setState({
        user: { ...testStudentUser, enrolledCourseIds: [] },
        isAuthenticated: true,
      });

      expect(useEnrollmentStore.getState().isCourseEnrolled(testPaidCourse.id)).toBe(true);

      const { container, unmount } = mountComponent(
        <CourseAccessGuard courseId={testPaidCourse.id} course={testPaidCourse}>
          <div data-testid="protected-content">محتوى الدرس</div>
        </CourseAccessGuard>
      );

      // Document empirical finding: CourseAccessGuard relies strictly on useAuthStore.isEnrolled.
      // If useAuthStore is unsynced, CourseAccessGuard remains locked (false)
      // unlike CourseCard, CourseDetailsModal, and SummaryDownloadButton which check both stores.
      const isUnblocked = container.querySelector('[data-testid="protected-content"]') !== null;
      expect(isUnblocked).toBe(false);

      unmount();
    });
  });

  // =========================================================================
  // 2. Subsystem Unlocking: Video Tokens, Exams & Summary Downloads
  // =========================================================================
  describe("2. Subsystem Unlocking (Video Streams, Exams & Summaries)", () => {
    it("unlocks SummaryDownloadButton from locked state to downloadable upon enrollment", async () => {
      let enrollCalled = false;
      const { container, rerender, unmount } = mountComponent(
        <SummaryDownloadButton
          summaryTitle="مذكرة النحو والبلاغة"
          pdfUrl="/assets/notes.pdf"
          courseId={testPaidCourse.id}
          onRequireEnroll={() => {
            enrollCalled = true;
          }}
        />
      );

      // Initially unenrolled: button shows locked indicator
      expect(container.textContent).toContain("تحميل المذكرة (مغلق)");
      const button = container.querySelector("button");
      expect(button).not.toBeNull();

      // Clicking locked button triggers onRequireEnroll callback
      act(() => {
        button?.click();
      });
      expect(enrollCalled).toBe(true);

      // Now student enrolls via processCheckout
      await act(async () => {
        await useEnrollmentStore.getState().processCheckout(testPaidCourse, testStudentUser, {
          paymentMethod: "vodafone_cash",
          phoneNumber: "01099887766",
        });
      });

      // Wait microtask
      await act(async () => {
        await new Promise((r) => setTimeout(r, 30));
      });

      // Re-render SummaryDownloadButton
      rerender(
        <SummaryDownloadButton
          summaryTitle="مذكرة النحو والبلاغة"
          pdfUrl="/assets/notes.pdf"
          courseId={testPaidCourse.id}
          onRequireEnroll={() => {
            enrollCalled = true;
          }}
        />
      );

      // Button is now unlocked: shows "تحميل المذكرة (PDF)"
      expect(container.textContent).toContain("تحميل المذكرة (PDF)");
      expect(container.textContent).not.toContain("(مغلق)");

      unmount();
    });

    it("verifies ExamPlayerModal successfully mounts and initiates exam session for enrolled student", async () => {
      // First enroll in course
      await act(async () => {
        await useEnrollmentStore.getState().processCheckout(testPaidCourse, testStudentUser, {
          paymentMethod: "fawry",
        });
      });

      expect(useEnrollmentStore.getState().isCourseEnrolled(testPaidCourse.id)).toBe(true);

      let closed = false;
      const { container, unmount } = mountComponent(
        <ExamPlayerModal
          isOpen={true}
          onClose={() => {
            closed = true;
          }}
          examId="quiz-62"
        />
      );

      // Verify exam session is running: renders question view and navigation
      expect(container.textContent).toContain("السؤال");
      expect(container.textContent).toContain("اختبار إلكتروني");
      const timerEl = container.querySelector('[role="timer"]');
      expect(timerEl).not.toBeNull();
      expect(timerEl?.getAttribute("aria-label")).toContain("الوقت المتبقي");

      // Verify timer and options render
      const optionButtons = container.querySelectorAll("button");
      expect(optionButtons.length).toBeGreaterThan(0);

      unmount();
    });

    it("verifies video security HMAC token can be generated and validated for enrolled student", async () => {
      // Enroll in course
      await act(async () => {
        await useEnrollmentStore.getState().processCheckout(testPaidCourse, testStudentUser, {
          paymentMethod: "vodafone_cash",
          phoneNumber: "01099887766",
        });
      });

      expect(useEnrollmentStore.getState().isCourseEnrolled(testPaidCourse.id)).toBe(true);

      // Generate rolling video stream token
      const signedToken = await videoSecurityService.generateSignedStreamToken({
        lessonId: "lesson-v1-nidaa",
        studentId: testStudentUser.id,
        deviceId: testStudentUser.deviceId,
      });

      expect(signedToken).toBeDefined();
      expect(typeof signedToken.token).toBe("string");
      expect(signedToken.token.length).toBeGreaterThan(20);

      // Validate the generated stream token
      const validation = await videoSecurityService.validateStreamToken(
        signedToken.token,
        "lesson-v1-nidaa",
        testStudentUser.id,
        testStudentUser.deviceId
      );

      expect(validation.valid).toBe(true);
      expect(validation.payload?.studentId).toBe(testStudentUser.id);
      expect(validation.payload?.lessonId).toBe("lesson-v1-nidaa");
    });
  });

  // =========================================================================
  // 3. CourseCard & CourseDetailsModal UI Dynamic State Integration
  // =========================================================================
  describe("3. CourseCard & CourseDetailsModal UI State Synchronization", () => {
    it("updates CourseCard CTA and badge immediately upon enrollment", async () => {
      let openDetailsCalled = false;
      let enrollNowCalled = false;

      const { container, rerender, unmount } = mountComponent(
        <CourseCard
          course={testPaidCourse}
          onOpenDetails={() => {
            openDetailsCalled = true;
          }}
          onEnrollNow={() => {
            enrollNowCalled = true;
          }}
        />
      );

      // 1. Unenrolled state: Shows price and "الإشتراك في الكورس !"
      expect(container.textContent).toContain("320 ج.م");
      expect(container.textContent).toContain("الإشتراك في الكورس !");
      expect(container.textContent).not.toContain("مُشترك بالفعل");

      // 2. Perform checkout
      await act(async () => {
        await useEnrollmentStore.getState().processCheckout(testPaidCourse, testStudentUser, {
          paymentMethod: "vodafone_cash",
          phoneNumber: "01099887766",
        });
      });

      await act(async () => {
        await new Promise((r) => setTimeout(r, 30));
      });

      // 3. Re-render CourseCard
      rerender(
        <CourseCard
          course={testPaidCourse}
          onOpenDetails={() => {
            openDetailsCalled = true;
          }}
          onEnrollNow={() => {
            enrollNowCalled = true;
          }}
        />
      );

      // Card now displays "مُشترك" badge and action button "مُشترك بالفعل • ابدأ التعلم"
      expect(container.textContent).toContain("مُشترك");
      expect(container.textContent).toContain("مُشترك بالفعل • ابدأ التعلم");

      unmount();
    });

    it("updates CourseDetailsModal hero banner and sidebar CTA immediately upon enrollment", async () => {
      let enrollTriggered = false;
      const { container, rerender, unmount } = mountComponent(
        <CourseDetailsModal
          course={testPaidCourse}
          onClose={() => {}}
          onEnrollNow={() => {
            enrollTriggered = true;
          }}
          onOpenWhatsApp={() => {}}
        />
      );

      // Unenrolled state: Shows "الإشتراك في الكورس" and price
      expect(container.textContent).toContain("الإشتراك في الكورس");
      expect(container.textContent).not.toContain("أنت مشترك بالفعل في هذا الكورس");

      // Perform checkout
      await act(async () => {
        await useEnrollmentStore.getState().processCheckout(testPaidCourse, testStudentUser, {
          paymentMethod: "vodafone_cash",
          phoneNumber: "01099887766",
        });
      });

      await act(async () => {
        await new Promise((r) => setTimeout(r, 30));
      });

      rerender(
        <CourseDetailsModal
          course={testPaidCourse}
          onClose={() => {}}
          onEnrollNow={() => {
            enrollTriggered = true;
          }}
          onOpenWhatsApp={() => {}}
        />
      );

      // Enrolled state: Hero displays green banner and sidebar button updates to "أنت مشترك بالفعل في هذا الكورس • ابدأ المشاهدة"
      expect(container.textContent).toContain("أنت مشترك بالفعل في هذا الكورس • ابدأ المشاهدة");

      unmount();
    });
  });

  // =========================================================================
  // 4. Multi-Course Isolation & Unenrolled State Enforcement
  // =========================================================================
  describe("4. Multi-Course Isolation & Unenrolled Guarding", () => {
    it("ensures purchasing Course A does NOT unlock Course B", async () => {
      // Purchase only Course A
      await act(async () => {
        await useEnrollmentStore.getState().processCheckout(testPaidCourse, testStudentUser, {
          paymentMethod: "vodafone_cash",
          phoneNumber: "01099887766",
        });
      });

      expect(useEnrollmentStore.getState().isCourseEnrolled(testPaidCourse.id)).toBe(true);
      expect(useEnrollmentStore.getState().isCourseEnrolled(secondPaidCourse.id)).toBe(false);

      // Mount CourseAccessGuard for Course B
      const { container, unmount } = mountComponent(
        <CourseAccessGuard courseId={secondPaidCourse.id} course={secondPaidCourse}>
          <div data-testid="course-b-content">محتوى كورس البلاغة</div>
        </CourseAccessGuard>
      );

      // Course B must remain strictly guarded
      expect(container.querySelector('[data-testid="course-b-content"]')).toBeNull();
      expect(container.textContent).toContain("غير مشترك في هذا الكورس");
      expect(container.textContent).toContain("280");

      unmount();
    });

    it("verifies unauthenticated visitor is gated with authentication prompt, not enrollment prompt", () => {
      // Simulate unauthenticated guest
      useAuthStore.setState({
        user: null,
        isAuthenticated: false,
        token: null,
      });

      let authRequested = false;
      const { container, unmount } = mountComponent(
        <CourseAccessGuard
          courseId={testPaidCourse.id}
          course={testPaidCourse}
          onRequireAuth={() => {
            authRequested = true;
          }}
        >
          <div data-testid="secret-lesson">محتوى سري</div>
        </CourseAccessGuard>
      );

      expect(container.querySelector('[data-testid="secret-lesson"]')).toBeNull();
      expect(container.textContent).toContain("محتوى الكورس محمي • يتطلب تسجيل الدخول");

      const loginBtn = container.querySelector("button");
      act(() => {
        loginBtn?.click();
      });
      expect(authRequested).toBe(true);

      unmount();
    });
  });

  // =========================================================================
  // 5. Store Synchronization between useEnrollmentStore & useAuthStore
  // =========================================================================
  describe("5. Bidirectional Store Synchronization", () => {
    it("synchronizes enrolledCourseIds across useEnrollmentStore and useAuthStore on checkout", async () => {
      expect(useEnrollmentStore.getState().enrolledCourseIds).toEqual([]);
      expect(useAuthStore.getState().user?.enrolledCourseIds).toEqual([]);

      await act(async () => {
        await useEnrollmentStore.getState().processCheckout(testPaidCourse, testStudentUser, {
          paymentMethod: "vodafone_cash",
          phoneNumber: "01099887766",
        });
      });

      // Allow async sync to resolve
      await act(async () => {
        await new Promise((r) => setTimeout(r, 40));
      });

      // Both stores reflect enrollment
      expect(useEnrollmentStore.getState().enrolledCourseIds).toContain(testPaidCourse.id);
      expect(useEnrollmentStore.getState().isCourseEnrolled(testPaidCourse.id)).toBe(true);
      expect(useAuthStore.getState().isEnrolled(testPaidCourse.id)).toBe(true);
      expect(useAuthStore.getState().user?.enrolledCourseIds).toContain(testPaidCourse.id);
    });

    it("synchronizes on center voucher enrollment", async () => {
      await act(async () => {
        await useEnrollmentStore.getState().processCheckout(secondPaidCourse, testStudentUser, {
          paymentMethod: "voucher",
          voucherCode: "AREF-2026-GOLD",
        });
      });

      await act(async () => {
        await new Promise((r) => setTimeout(r, 40));
      });

      expect(useEnrollmentStore.getState().isCourseEnrolled(secondPaidCourse.id)).toBe(true);
      expect(useAuthStore.getState().isEnrolled(secondPaidCourse.id)).toBe(true);
    });
  });

  // =========================================================================
  // 6. Persistence & Rehydration across Simulated Page Reloads
  // =========================================================================
  describe("6. Persistence & Rehydration across Simulated Page Reloads", () => {
    it("persists enrolled courses and purchase invoices into localStorage under exact keys", async () => {
      // 1. Purchase Course A
      await act(async () => {
        await useEnrollmentStore.getState().processCheckout(testPaidCourse, testStudentUser, {
          paymentMethod: "vodafone_cash",
          phoneNumber: "01099887766",
        });
      });

      // 2. Purchase Course B
      await act(async () => {
        await useEnrollmentStore.getState().processCheckout(secondPaidCourse, testStudentUser, {
          paymentMethod: "fawry",
        });
      });

      // Verify localStorage entries
      const rawEnrollments = localStorage.getItem(LOCAL_STORAGE_ENROLLMENTS_KEY);
      expect(rawEnrollments).not.toBeNull();
      const parsedEnrollments = JSON.parse(rawEnrollments!);
      expect(parsedEnrollments).toContain(testPaidCourse.id);
      expect(parsedEnrollments).toContain(secondPaidCourse.id);

      const rawHistory = localStorage.getItem(LOCAL_STORAGE_PURCHASE_HISTORY_KEY);
      expect(rawHistory).not.toBeNull();
      const parsedHistory = JSON.parse(rawHistory!);
      expect(parsedHistory.length).toBe(2);
      expect(parsedHistory[0].courseId).toBe(secondPaidCourse.id);
      expect(parsedHistory[1].courseId).toBe(testPaidCourse.id);
    });

    it("rehydrates enrolled courses and purchase history from localStorage on reload", async () => {
      // Seed localStorage as if from a prior user session
      const preStoredEnrollments = [testPaidCourse.id, secondPaidCourse.id];
      const preStoredHistory = [
        {
          orderId: "ORD-PREV-001",
          studentId: testStudentUser.id,
          studentName: testStudentUser.fullName,
          studentPhone: testStudentUser.studentPhone,
          courseId: testPaidCourse.id,
          courseTitle: testPaidCourse.title,
          gradeName: testPaidCourse.gradeName,
          originalPrice: 320,
          discountAmount: 0,
          finalPrice: 320,
          paymentMethod: "vodafone_cash" as const,
          transactionReference: "VF-998877",
          createdAt: new Date().toISOString(),
          status: "completed" as const,
        },
      ];

      localStorage.setItem(LOCAL_STORAGE_ENROLLMENTS_KEY, JSON.stringify(preStoredEnrollments));
      localStorage.setItem(LOCAL_STORAGE_PURCHASE_HISTORY_KEY, JSON.stringify(preStoredHistory));

      // Simulate store rehydration (Zustand state initialization from localStorage)
      act(() => {
        useEnrollmentStore.setState({
          enrolledCourseIds: JSON.parse(localStorage.getItem(LOCAL_STORAGE_ENROLLMENTS_KEY) || "[]"),
          purchaseHistory: JSON.parse(localStorage.getItem(LOCAL_STORAGE_PURCHASE_HISTORY_KEY) || "[]"),
        });
        useAuthStore.setState({
          user: {
            ...testStudentUser,
            enrolledCourseIds: preStoredEnrollments,
          },
        });
      });

      // Verify rehydrated state
      expect(useEnrollmentStore.getState().isCourseEnrolled(testPaidCourse.id)).toBe(true);
      expect(useEnrollmentStore.getState().isCourseEnrolled(secondPaidCourse.id)).toBe(true);
      expect(useEnrollmentStore.getState().purchaseHistory.length).toBe(1);
      expect(useEnrollmentStore.getState().getOrder("ORD-PREV-001")).toBeDefined();

      // Verify CourseCard detects rehydrated enrollment immediately
      const { container, unmount } = mountComponent(
        <CourseCard
          course={testPaidCourse}
          onOpenDetails={() => {}}
          onEnrollNow={() => {}}
        />
      );

      expect(container.textContent).toContain("مُشترك");
      expect(container.textContent).toContain("مُشترك بالفعل • ابدأ التعلم");

      unmount();
    });
  });

  // =========================================================================
  // 7. Multi-Course Purchase History Integrity & Edge Case Matrix
  // =========================================================================
  describe("7. Multi-Course Purchase History & Gateway Validation Stress", () => {
    it("records distinct sequential invoices with accurate gateway references and timestamps", async () => {
      // Order 1: Vodafone Cash
      const invoice1 = await act(async () => {
        return await useEnrollmentStore.getState().processCheckout(testPaidCourse, testStudentUser, {
          paymentMethod: "vodafone_cash",
          phoneNumber: "01099887766",
        });
      });

      // Order 2: Fawry
      const invoice2 = await act(async () => {
        return await useEnrollmentStore.getState().processCheckout(secondPaidCourse, testStudentUser, {
          paymentMethod: "fawry",
        });
      });

      // Order 3: Free grant
      let invoice3: any;
      act(() => {
        invoice3 = useEnrollmentStore
          .getState()
          .enrollFreeCourse(freeCourseItem.id, testStudentUser, freeCourseItem);
      });

      const history = useEnrollmentStore.getState().purchaseHistory;
      expect(history.length).toBe(3);

      // Verify newest first
      expect(history[0].orderId).toBe(invoice3.orderId);
      expect(history[1].orderId).toBe(invoice2.orderId);
      expect(history[2].orderId).toBe(invoice1.orderId);

      // Verify distinct transaction references
      expect(invoice1.transactionReference).toMatch(/^VF-/);
      expect(invoice2.transactionReference).toMatch(/^FAWRY-/);
      expect(invoice3.transactionReference).toMatch(/^FREE-GRANT-/);

      // Verify getOrder retrieval
      expect(useEnrollmentStore.getState().getOrder(invoice1.orderId)).toEqual(invoice1);
      expect(useEnrollmentStore.getState().getOrder(invoice2.orderId)).toEqual(invoice2);
      expect(useEnrollmentStore.getState().getOrder(invoice3.orderId)).toEqual(invoice3);
    });

    it("rejects invalid Egyptian phone numbers on Vodafone Cash and leaves state uncorrupted", async () => {
      const invalidPhones = [
        "12345",
        "01912345678", // 019 invalid prefix
        "010123456789", // 12 digits
        "abcdefghijk",
        "",
      ];

      for (const phone of invalidPhones) {
        await expect(
          useEnrollmentStore.getState().processCheckout(testPaidCourse, testStudentUser, {
            paymentMethod: "vodafone_cash",
            phoneNumber: phone,
          })
        ).rejects.toThrow();

        expect(useEnrollmentStore.getState().isCourseEnrolled(testPaidCourse.id)).toBe(false);
      }
    });

    it("rejects invalid credit card numbers and formats", async () => {
      // Too short
      await expect(
        useEnrollmentStore.getState().processCheckout(testPaidCourse, testStudentUser, {
          paymentMethod: "credit_card",
          cardNumber: "1234",
        })
      ).rejects.toThrow("رقم البطاقة الائتمانية غير صحيح");

      // Invalid expiry format
      await expect(
        useEnrollmentStore.getState().processCheckout(testPaidCourse, testStudentUser, {
          paymentMethod: "credit_card",
          cardNumber: "4111 2222 3333 4444",
          expiryDate: "13/99", // Month 13 invalid
        })
      ).rejects.toThrow("تاريخ انتهاء البطاقة غير صحيح");

      // Invalid CVV
      await expect(
        useEnrollmentStore.getState().processCheckout(testPaidCourse, testStudentUser, {
          paymentMethod: "credit_card",
          cardNumber: "4111 2222 3333 4444",
          expiryDate: "12/28",
          cvv: "1", // Too short
        })
      ).rejects.toThrow("رمز الأمان CVV غير صحيح");
    });

    it("rejects invalid center voucher codes without granting enrollment", async () => {
      await expect(
        useEnrollmentStore.getState().processCheckout(testPaidCourse, testStudentUser, {
          paymentMethod: "voucher",
          voucherCode: "INVALID-CODE-XXX",
        })
      ).rejects.toThrow("كود كارت السنتر غير صحيح");

      expect(useEnrollmentStore.getState().isCourseEnrolled(testPaidCourse.id)).toBe(false);
    });
  });
});
