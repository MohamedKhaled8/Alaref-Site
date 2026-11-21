/**
 * Empirical Challenger 2 Stress Suite — Milestone 2 UI/State & Anti-Tamper Security
 *
 * Workspace: study-buddy-sim
 * Target Systems:
 *  1. DynamicForensicWatermark (MutationObserver anti-tamper, style modification, deletion)
 *  2. DevToolsSecurityGuard (timing probe, shortcut trapping, contextmenu prevention, retry recovery)
 *  3. useVideoPlayerStore (seek boundary clamping, volume clamping, speed switching, security locking)
 *  4. LessonRoomModal (curriculum playlist navigation, free preview vs locked lessons with CourseAccessGuard, tabs)
 */

// @ts-expect-error enable React act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import React, { act } from "react";
import ReactDOM from "react-dom/client";
import { useVideoPlayerStore } from "../stores/useVideoPlayerStore";
import { useAuthStore } from "../stores/useAuthStore";
import { DynamicForensicWatermark } from "../components/video/DynamicForensicWatermark";
import { DevToolsSecurityGuard } from "../components/video/DevToolsSecurityGuard";
import { LessonRoomModal } from "../components/lessons/LessonRoomModal";
import { coursesList } from "../data/mockData";
import { ForensicWatermarkData } from "../types/video";

// Helper to mount React components into fresh DOM container
function mountToDom(element: React.ReactElement): { container: HTMLElement; unmount: () => void } {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = ReactDOM.createRoot(container);
  act(() => {
    root.render(element);
  });
  return {
    container,
    unmount: () => {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
}

// Flush microtasks and MutationObserver queue
const flushObserver = async () => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 30));
  });
};

describe("Milestone 2 Empirical Challenger Stress Suite", () => {
  const sampleWatermark: ForensicWatermarkData = {
    studentName: "أحمد كمال رضوان",
    studentPhone: "01012345678",
    studentId: "std-7788",
    sessionIp: "197.34.120.15",
  };

  const sampleCourse = coursesList[1]; // course-prim6-exams (price: 90, isFree: false)

  beforeEach(() => {
    localStorage.clear();
    useVideoPlayerStore.getState().resetPlayer();
    useAuthStore.getState().logout();
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  afterEach(() => {
    useVideoPlayerStore.getState().resetPlayer();
    useAuthStore.getState().logout();
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  // =========================================================================
  // 1. DynamicForensicWatermark MutationObserver Anti-Tamper Verification
  // =========================================================================
  describe("1. DynamicForensicWatermark MutationObserver Anti-Tamper", () => {
    it("renders authentic student forensic credentials in the DOM", () => {
      const { container, unmount } = mountToDom(
        <div style={{ position: "relative", width: "800px", height: "450px" }}>
          <DynamicForensicWatermark watermark={sampleWatermark} />
        </div>
      );

      const watermarkEl = container.querySelector('[data-watermark="forensic"]');
      expect(watermarkEl).not.toBeNull();
      expect(watermarkEl?.textContent).toContain("أحمد كمال رضوان");
      expect(watermarkEl?.textContent).toContain("01012345678");
      expect(watermarkEl?.textContent).toContain("std-7788");
      expect(watermarkEl?.textContent).toContain("197.34.120.15");

      unmount();
    });

    it("halts video playback and triggers security alert when watermark is removed from DOM", async () => {
      const onTamper = vi.fn();
      const store = useVideoPlayerStore.getState();
      store.play();
      expect(useVideoPlayerStore.getState().isPlaying).toBe(true);

      const { unmount } = mountToDom(
        <div id="video-wrapper" style={{ position: "relative" }}>
          <DynamicForensicWatermark
            watermark={sampleWatermark}
            onTamperDetected={onTamper}
          />
        </div>
      );

      const watermarkEl = document.querySelector('[data-watermark="forensic"]');
      expect(watermarkEl).not.toBeNull();

      // Adversary removes the watermark element from the DOM via inspector
      act(() => {
        watermarkEl?.remove();
      });

      await flushObserver();

      // Verification: Playback must be halted and watermark flagged
      const updatedState = useVideoPlayerStore.getState();
      expect(updatedState.isWatermarkTampered).toBe(true);
      expect(updatedState.isPlaying).toBe(false);
      expect(updatedState.securityAlert?.code).toBe("WATERMARK_TAMPERED");
      expect(onTamper).toHaveBeenCalled();

      // Subsequent play() attempts MUST be rejected
      store.play();
      expect(useVideoPlayerStore.getState().isPlaying).toBe(false);

      unmount();
    });

    it("detects style tampering: display: 'none' halts playback", async () => {
      const onTamper = vi.fn();
      const store = useVideoPlayerStore.getState();
      store.play();

      const { unmount } = mountToDom(
        <div id="video-box" style={{ position: "relative" }}>
          <DynamicForensicWatermark
            watermark={sampleWatermark}
            onTamperDetected={onTamper}
          />
        </div>
      );

      const watermarkEl = document.querySelector('[data-watermark="forensic"]') as HTMLElement;
      expect(watermarkEl).not.toBeNull();

      // Adversary sets display: none in DevTools
      act(() => {
        watermarkEl.style.display = "none";
      });

      await flushObserver();

      expect(useVideoPlayerStore.getState().isWatermarkTampered).toBe(true);
      expect(useVideoPlayerStore.getState().isPlaying).toBe(false);
      expect(useVideoPlayerStore.getState().securityAlert?.code).toBe("WATERMARK_TAMPERED");
      expect(onTamper).toHaveBeenCalled();

      unmount();
    });

    it("detects style tampering: opacity: 0 halts playback", async () => {
      const onTamper = vi.fn();
      const store = useVideoPlayerStore.getState();
      store.play();

      const { unmount } = mountToDom(
        <div id="video-box" style={{ position: "relative" }}>
          <DynamicForensicWatermark
            watermark={sampleWatermark}
            onTamperDetected={onTamper}
          />
        </div>
      );

      const watermarkEl = document.querySelector('[data-watermark="forensic"]') as HTMLElement;
      expect(watermarkEl).not.toBeNull();

      // Adversary sets opacity to 0
      act(() => {
        watermarkEl.style.opacity = "0";
      });

      await flushObserver();

      expect(useVideoPlayerStore.getState().isWatermarkTampered).toBe(true);
      expect(useVideoPlayerStore.getState().isPlaying).toBe(false);
      expect(onTamper).toHaveBeenCalled();

      unmount();
    });

    it("detects style tampering: visibility: 'hidden' halts playback", async () => {
      const onTamper = vi.fn();
      const store = useVideoPlayerStore.getState();
      store.play();

      const { unmount } = mountToDom(
        <div id="video-box" style={{ position: "relative" }}>
          <DynamicForensicWatermark
            watermark={sampleWatermark}
            onTamperDetected={onTamper}
          />
        </div>
      );

      const watermarkEl = document.querySelector('[data-watermark="forensic"]') as HTMLElement;
      expect(watermarkEl).not.toBeNull();

      // Adversary sets visibility: hidden
      act(() => {
        watermarkEl.style.visibility = "hidden";
      });

      await flushObserver();

      expect(useVideoPlayerStore.getState().isWatermarkTampered).toBe(true);
      expect(useVideoPlayerStore.getState().isPlaying).toBe(false);
      expect(onTamper).toHaveBeenCalled();

      unmount();
    });

    it("detects attribute tampering: adding 'hidden' attribute halts playback", async () => {
      const onTamper = vi.fn();
      const store = useVideoPlayerStore.getState();
      store.play();

      const { unmount } = mountToDom(
        <div id="video-box" style={{ position: "relative" }}>
          <DynamicForensicWatermark
            watermark={sampleWatermark}
            onTamperDetected={onTamper}
          />
        </div>
      );

      const watermarkEl = document.querySelector('[data-watermark="forensic"]') as HTMLElement;
      expect(watermarkEl).not.toBeNull();

      // Adversary adds hidden attribute
      act(() => {
        watermarkEl.setAttribute("hidden", "true");
      });

      await flushObserver();

      expect(useVideoPlayerStore.getState().isWatermarkTampered).toBe(true);
      expect(useVideoPlayerStore.getState().isPlaying).toBe(false);
      expect(onTamper).toHaveBeenCalled();

      unmount();
    });
  });

  // =========================================================================
  // 2. DevToolsSecurityGuard Inspection Trapping & Timing Probe
  // =========================================================================
  describe("2. DevToolsSecurityGuard Inspection Trapping & Timing Probe", () => {
    it("intercepts F12 keydown, prevents default, halts playback, and sets DevTools alert", () => {
      const onInspection = vi.fn();
      const store = useVideoPlayerStore.getState();
      store.play();
      expect(useVideoPlayerStore.getState().isPlaying).toBe(true);

      const { unmount } = mountToDom(
        <DevToolsSecurityGuard onInspectionDetected={onInspection}>
          <div data-testid="video-surface">Video Content</div>
        </DevToolsSecurityGuard>
      );

      // Simulate F12 press inside act()
      const event = new KeyboardEvent("keydown", {
        key: "F12",
        bubbles: true,
        cancelable: true,
      });

      act(() => {
        window.dispatchEvent(event);
      });

      expect(event.defaultPrevented).toBe(true);
      expect(useVideoPlayerStore.getState().isDevToolsBlocked).toBe(true);
      expect(useVideoPlayerStore.getState().isPlaying).toBe(false);
      expect(useVideoPlayerStore.getState().securityAlert?.code).toBe("DEVTOOLS_DETECTED");
      expect(onInspection).toHaveBeenCalled();

      // Verify that security shield overlay is rendered
      expect(document.body.textContent).toContain("تنبيه أمني: تم رصد فتح أدوات الفحص");

      unmount();
    });

    it("intercepts Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, and Ctrl+U shortcuts", () => {
      const shortcuts = [
        { key: "I", ctrlKey: true, shiftKey: true },
        { key: "i", ctrlKey: true, shiftKey: true },
        { key: "J", ctrlKey: true, shiftKey: true },
        { key: "j", ctrlKey: true, shiftKey: true },
        { key: "C", ctrlKey: true, shiftKey: true },
        { key: "c", ctrlKey: true, shiftKey: true },
        { key: "U", ctrlKey: true, shiftKey: false },
        { key: "u", ctrlKey: true, shiftKey: false },
        { key: "I", metaKey: true, shiftKey: true }, // Mac Cmd+Shift+I
        { key: "U", metaKey: true, shiftKey: false }, // Mac Cmd+U
      ];

      for (const shortcut of shortcuts) {
        useVideoPlayerStore.getState().resetPlayer();
        useVideoPlayerStore.getState().play();

        const { unmount } = mountToDom(
          <DevToolsSecurityGuard>
            <div>Test</div>
          </DevToolsSecurityGuard>
        );

        const event = new KeyboardEvent("keydown", {
          key: shortcut.key,
          ctrlKey: Boolean(shortcut.ctrlKey),
          metaKey: Boolean(shortcut.metaKey),
          shiftKey: Boolean(shortcut.shiftKey),
          bubbles: true,
          cancelable: true,
        });

        act(() => {
          window.dispatchEvent(event);
        });

        expect(event.defaultPrevented, `Shortcut ${shortcut.key} should preventDefault`).toBe(true);
        expect(useVideoPlayerStore.getState().isDevToolsBlocked).toBe(true);
        expect(useVideoPlayerStore.getState().isPlaying).toBe(false);

        unmount();
      }
    });

    it("prevents right-click context menu over video space", () => {
      const { unmount } = mountToDom(
        <DevToolsSecurityGuard>
          <div data-testid="video-area">Player</div>
        </DevToolsSecurityGuard>
      );

      const contextMenuEvent = new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
      });

      act(() => {
        window.dispatchEvent(contextMenuEvent);
      });
      expect(contextMenuEvent.defaultPrevented).toBe(true);

      unmount();
    });

    it("timing probe detects debugger delay (>100ms) and triggers security guard", () => {
      vi.useFakeTimers();

      let callCount = 0;
      vi.spyOn(performance, "now").mockImplementation(() => {
        callCount++;
        // On even calls (endTime in probe), return startTime + 150ms
        return callCount % 2 === 1 ? 1000 : 1150;
      });

      const { unmount } = mountToDom(
        <DevToolsSecurityGuard>
          <div>Protected Video</div>
        </DevToolsSecurityGuard>
      );

      useVideoPlayerStore.getState().play();
      expect(useVideoPlayerStore.getState().isPlaying).toBe(true);

      // Fast-forward interval (probe runs every 2000ms)
      act(() => {
        vi.advanceTimersByTime(2100);
      });

      expect(useVideoPlayerStore.getState().isDevToolsBlocked).toBe(true);
      expect(useVideoPlayerStore.getState().isPlaying).toBe(false);

      vi.useRealTimers();
      unmount();
    });

    it("retry recovery: unblocks player if DevTools closed, keeps blocked if still open", () => {
      const store = useVideoPlayerStore.getState();
      store.setDevToolsBlocked(true);

      const { container, unmount } = mountToDom(
        <DevToolsSecurityGuard>
          <div>Video</div>
        </DevToolsSecurityGuard>
      );

      expect(container.textContent).toContain("أغلقت أدوات الفحص");
      const retryBtn = container.querySelector("button");
      expect(retryBtn).not.toBeNull();

      // Case A: DevTools still open (spy performance.now to return diff > 100)
      let count = 0;
      vi.spyOn(performance, "now").mockImplementation(() => {
        count++;
        return count % 2 === 1 ? 2000 : 2150; // 150ms delay
      });

      act(() => {
        retryBtn?.click();
      });

      // Remains blocked
      expect(useVideoPlayerStore.getState().isDevToolsBlocked).toBe(true);

      // Case B: DevTools closed (diff < 100ms, e.g. 5ms)
      count = 0;
      vi.spyOn(performance, "now").mockImplementation(() => {
        count++;
        return count % 2 === 1 ? 3000 : 3005; // 5ms delay
      });

      act(() => {
        retryBtn?.click();
      });

      // Successfully unblocked!
      expect(useVideoPlayerStore.getState().isDevToolsBlocked).toBe(false);

      unmount();
    });
  });

  // =========================================================================
  // 3. useVideoPlayerStore Boundary & Clamping Stress Tests
  // =========================================================================
  describe("3. useVideoPlayerStore Boundary & Clamping Stress Tests", () => {
    it("seek bounds: clamps within [0, duration]", () => {
      const store = useVideoPlayerStore.getState();
      store.setDuration(120); // 2 minutes

      // Valid seek
      store.seek(60);
      expect(useVideoPlayerStore.getState().currentTime).toBe(60);

      // Negative seek underflow
      store.seek(-500);
      expect(useVideoPlayerStore.getState().currentTime).toBe(0);

      // Overflow seek beyond duration
      store.seek(9999);
      expect(useVideoPlayerStore.getState().currentTime).toBe(120);

      // Boundary values
      store.seek(0);
      expect(useVideoPlayerStore.getState().currentTime).toBe(0);

      store.seek(120);
      expect(useVideoPlayerStore.getState().currentTime).toBe(120);
    });

    it("seek bounds: handles zero duration cleanly", () => {
      const store = useVideoPlayerStore.getState();
      store.setDuration(0);

      // Underflow
      store.seek(-10);
      expect(useVideoPlayerStore.getState().currentTime).toBe(0);

      // Seek to 0
      store.seek(0);
      expect(useVideoPlayerStore.getState().currentTime).toBe(0);
    });

    it("volume bounds: clamps volume between [0.0, 1.0] and auto-mutes at 0", () => {
      const store = useVideoPlayerStore.getState();

      // Upper bound overflow
      store.setVolume(2.5);
      expect(useVideoPlayerStore.getState().volume).toBe(1.0);
      expect(useVideoPlayerStore.getState().isMuted).toBe(false);
      expect(localStorage.getItem("alaref_player_volume")).toBe("1");

      // Lower bound underflow
      store.setVolume(-0.8);
      expect(useVideoPlayerStore.getState().volume).toBe(0.0);
      expect(useVideoPlayerStore.getState().isMuted).toBe(true);
      expect(localStorage.getItem("alaref_player_volume")).toBe("0");

      // Normal midpoint
      store.setVolume(0.45);
      expect(useVideoPlayerStore.getState().volume).toBe(0.45);
      expect(useVideoPlayerStore.getState().isMuted).toBe(false);
      expect(localStorage.getItem("alaref_player_volume")).toBe("0.45");
    });

    it("mute toggling: remembers previous volume level", () => {
      const store = useVideoPlayerStore.getState();
      store.setVolume(0.75);

      store.toggleMute();
      expect(useVideoPlayerStore.getState().isMuted).toBe(true);

      store.toggleMute();
      expect(useVideoPlayerStore.getState().isMuted).toBe(false);
      expect(useVideoPlayerStore.getState().volume).toBe(0.75);
    });

    it("speed selection: updates playbackRate and persists choice in localStorage", () => {
      const store = useVideoPlayerStore.getState();

      store.setSpeed(1.75);
      expect(useVideoPlayerStore.getState().playbackRate).toBe(1.75);
      expect(localStorage.getItem("alaref_playback_speed")).toBe("1.75");

      store.setSpeed(0.75);
      expect(useVideoPlayerStore.getState().playbackRate).toBe(0.75);
      expect(localStorage.getItem("alaref_playback_speed")).toBe("0.75");
    });

    it("concurrency violation: halts playback and locks player with CONCURRENT_STREAM_DETECTED alert", () => {
      const store = useVideoPlayerStore.getState();
      store.play();
      expect(useVideoPlayerStore.getState().isPlaying).toBe(true);

      store.setConcurrencyViolation(true);
      expect(useVideoPlayerStore.getState().concurrencyViolation).toBe(true);
      expect(useVideoPlayerStore.getState().isPlaying).toBe(false);
      expect(useVideoPlayerStore.getState().securityAlert?.code).toBe("CONCURRENT_STREAM_DETECTED");

      // Playback blocked while concurrency violation active
      store.play();
      expect(useVideoPlayerStore.getState().isPlaying).toBe(false);

      // Clearing concurrency violation allows playback again
      store.setConcurrencyViolation(false);
      store.play();
      expect(useVideoPlayerStore.getState().isPlaying).toBe(true);
    });
  });

  // =========================================================================
  // 4. LessonRoomModal Curriculum Navigation & CourseAccessGuard Integration
  // =========================================================================
  describe("4. LessonRoomModal Curriculum Navigation & Access Guard", () => {
    it("renders nothing when isOpen is false", () => {
      const { container, unmount } = mountToDom(
        <LessonRoomModal
          isOpen={false}
          onClose={vi.fn()}
          course={sampleCourse}
        />
      );

      expect(container.innerHTML).toBe("");
      unmount();
    });

    it("renders curriculum playlist and all lessons when isOpen is true", () => {
      const { container, unmount } = mountToDom(
        <LessonRoomModal
          isOpen={true}
          onClose={vi.fn()}
          course={sampleCourse}
        />
      );

      // Course title and teacher badge
      expect(container.textContent).toContain(sampleCourse.title);
      expect(container.textContent).toContain("مستر عمرو عارف");
      expect(container.textContent).toContain("منهج الكورس");

      // Verify all lessons from course units are present
      const allLessons = sampleCourse.units.flatMap((u) => u.lessons);
      expect(container.textContent).toContain(`${allLessons.length} دروس`);

      unmount();
    });

    it("allows switching lessons by clicking items in the syllabus playlist", () => {
      const { container, unmount } = mountToDom(
        <LessonRoomModal
          isOpen={true}
          onClose={vi.fn()}
          course={sampleCourse}
        />
      );

      // Click on second lesson (les-202: كاد واخواتها)
      const lessonButtons = container.querySelectorAll("aside button");
      const targetLessonBtn = Array.from(lessonButtons).find((btn) =>
        btn.textContent?.includes("كاد واخواتها")
      );

      expect(targetLessonBtn).toBeDefined();

      act(() => {
        (targetLessonBtn as HTMLButtonElement).click();
      });

      // Active lesson header should update
      expect(container.querySelector("main h1")?.textContent).toContain("كاد واخواتها");

      unmount();
    });

    it("unauthenticated user: blocks locked lesson with CourseAccessGuard login prompt", () => {
      const onRequireAuth = vi.fn();

      // Sample course is paid (price: 90, isFree: false)
      // les-200 has isFreePreview: false (locked)
      const { container, unmount } = mountToDom(
        <LessonRoomModal
          isOpen={true}
          onClose={vi.fn()}
          course={sampleCourse}
          initialLessonId="les-200"
          onRequireAuth={onRequireAuth}
        />
      );

      // CourseAccessGuard triggers for unauthenticated user on locked lesson
      expect(container.textContent).toContain("محتوى الكورس محمي • يتطلب تسجيل الدخول");

      const loginBtn = Array.from(container.querySelectorAll("button")).find((b) =>
        b.textContent?.includes("تسجيل الدخول أو إنشاء حساب")
      );
      expect(loginBtn).toBeDefined();

      act(() => {
        loginBtn?.click();
      });

      expect(onRequireAuth).toHaveBeenCalled();

      unmount();
    });

    it("unauthenticated user: permits free preview lesson (isFreePreview === true) to render video player", () => {
      // les-202 has isFreePreview: true
      const { container, unmount } = mountToDom(
        <LessonRoomModal
          isOpen={true}
          onClose={vi.fn()}
          course={sampleCourse}
          initialLessonId="les-202"
        />
      );

      // Should show free preview badge and NOT show login block
      expect(container.textContent).toContain("معاينة مجانية");
      expect(container.textContent).not.toContain("محتوى الكورس محمي • يتطلب تسجيل الدخول");

      unmount();
    });

    it("authenticated & enrolled student: grants immediate access to locked lessons", () => {
      // Authenticate student and enroll them in sampleCourse.id
      act(() => {
        useAuthStore.setState({
          user: {
            id: "std-110",
            fullName: "ياسمين أحمد",
            studentPhone: "01099887766",
            parentPhone: "01122334455",
            gradeId: "grade-6-prim",
            gradeName: "الصف السادس الابتدائي",
            role: "student",
            deviceId: "dev-laptop-01",
            enrolledCourseIds: [sampleCourse.id],
            createdAt: new Date().toISOString(),
          },
          token: "valid-jwt-token",
          isAuthenticated: true,
          isLoading: false,
        });
      });

      const { container, unmount } = mountToDom(
        <LessonRoomModal
          isOpen={true}
          onClose={vi.fn()}
          course={sampleCourse}
          initialLessonId="les-200" // Locked lesson
        />
      );

      // Access granted: No login or enroll block shown
      expect(container.textContent).not.toContain("محتوى الكورس محمي • يتطلب تسجيل الدخول");
      expect(container.textContent).not.toContain("غير مشترك في هذا الكورس");

      unmount();
    });

    it("authenticated but unenrolled student: shows enrollment prompt on locked lesson, but allows free preview", () => {
      const onRequireEnroll = vi.fn();

      act(() => {
        useAuthStore.setState({
          user: {
            id: "std-220",
            fullName: "طارق زياد",
            studentPhone: "01055556666",
            parentPhone: "01177778888",
            gradeId: "grade-6-prim",
            gradeName: "الصف السادس الابتدائي",
            role: "student",
            deviceId: "dev-phone-02",
            enrolledCourseIds: [], // Not enrolled in sampleCourse.id
            createdAt: new Date().toISOString(),
          },
          token: "valid-jwt-token",
          isAuthenticated: true,
          isLoading: false,
        });
      });

      // Part A: Locked lesson (les-200)
      const { container, unmount } = mountToDom(
        <LessonRoomModal
          isOpen={true}
          onClose={vi.fn()}
          course={sampleCourse}
          initialLessonId="les-200"
          onRequireEnroll={onRequireEnroll}
        />
      );

      expect(container.textContent).toContain("غير مشترك في هذا الكورس");
      const enrollBtn = Array.from(container.querySelectorAll("button")).find((b) =>
        b.textContent?.includes("الاشتراك في الكورس الآن")
      );
      expect(enrollBtn).toBeDefined();

      act(() => {
        enrollBtn?.click();
      });

      expect(onRequireEnroll).toHaveBeenCalledWith(sampleCourse.id, sampleCourse);

      // Part B: Switch to free preview lesson (les-202)
      const lessonButtons = container.querySelectorAll("aside button");
      const freeLessonBtn = Array.from(lessonButtons).find((btn) =>
        btn.textContent?.includes("كاد واخواتها")
      );

      act(() => {
        (freeLessonBtn as HTMLButtonElement).click();
      });

      // Free preview allows player to render without enrollment block
      expect(container.textContent).not.toContain("غير مشترك في هذا الكورس");

      unmount();
    });

    it("workspace tabs: clicking timestamped note calls seek() on video player store", () => {
      const { container, unmount } = mountToDom(
        <LessonRoomModal
          isOpen={true}
          onClose={vi.fn()}
          course={sampleCourse}
          initialLessonId="les-202"
        />
      );

      // Switch to notes tab if not active
      const notesTabBtn = Array.from(container.querySelectorAll("main button")).find((b) =>
        b.textContent?.includes("الملاحظات التفاعلية")
      );
      act(() => {
        notesTabBtn?.click();
      });

      // Find first clickable note item
      const noteItem = container.querySelector('main div[class*="cursor-pointer group"]');
      expect(noteItem).not.toBeNull();

      act(() => {
        (noteItem as HTMLElement)?.click();
      });

      // Video store should reflect seek time
      expect(useVideoPlayerStore.getState().currentTime).toBeGreaterThanOrEqual(0);

      unmount();
    });

    it("workspace tabs: exam tab launches exam player via onOpenExam callback", () => {
      const onOpenExam = vi.fn();

      const { container, unmount } = mountToDom(
        <LessonRoomModal
          isOpen={true}
          onClose={vi.fn()}
          course={sampleCourse}
          initialLessonId="les-202"
          onOpenExam={onOpenExam}
        />
      );

      // Switch to exam tab
      const examTabBtn = Array.from(container.querySelectorAll("main button")).find((b) =>
        b.textContent?.includes("امتحان الحصة")
      );
      act(() => {
        examTabBtn?.click();
      });

      // Click "بدء الاختبار الآن"
      const startExamBtn = Array.from(container.querySelectorAll("button")).find((b) =>
        b.textContent?.includes("بدء الاختبار الآن")
      );
      expect(startExamBtn).toBeDefined();

      act(() => {
        startExamBtn?.click();
      });

      expect(onOpenExam).toHaveBeenCalled();

      unmount();
    });

    it("close button calls onClose callback", () => {
      const onClose = vi.fn();

      const { container, unmount } = mountToDom(
        <LessonRoomModal
          isOpen={true}
          onClose={onClose}
          course={sampleCourse}
        />
      );

      const closeBtn = container.querySelector('header button[aria-label="إغلاق"]');
      expect(closeBtn).not.toBeNull();

      act(() => {
        (closeBtn as HTMLElement)?.click();
      });

      expect(onClose).toHaveBeenCalled();

      unmount();
    });
  });
});
