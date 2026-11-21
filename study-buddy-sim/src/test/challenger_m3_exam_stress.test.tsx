/**
 * Empirical Challenger 1 Stress Suite — Milestone 3: Educational Modules (Exams & Quiz Engine)
 *
 * Workspace: study-buddy-sim
 * Target Systems:
 *  1. useExamStore (Timer countdown exact boundary, grading math, missing questions, tampering, attempt history)
 *  2. ExamPlayerModal & ExamResultModal (Lifecycle, retake behavior, UI state, maxAttempts enforcement)
 *  3. LocalStorage persistence (alaref_exam_attempts, corruption recovery)
 */

// @ts-expect-error enable React act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import React, { act } from "react";
import ReactDOM from "react-dom/client";
import {
  useExamStore,
  LOCAL_STORAGE_EXAM_ATTEMPTS_KEY,
} from "../stores/useExamStore";
import { mockExams, getExamById } from "../data/mockExams";
import { ExamData, ExamQuestion } from "../types/educational";
import { ExamPlayerModal } from "../components/exams/ExamPlayerModal";
import { ExamResultModal } from "../components/exams/ExamResultModal";

// Helper to mount React components into fresh DOM container
function mountToDom(element: React.ReactElement): {
  container: HTMLElement;
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
    unmount: () => {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
}

describe("Milestone 3 Empirical Challenger: Exam & Quiz Engine Adversarial Stress Suite", () => {
  // Test fixture: Standard 4-question exam
  const testExam: ExamData = {
    id: "stress-exam-arabic-01",
    lessonId: "les-stress-100",
    courseId: "course-prep1-summary",
    title: "اختبار تجريبي مكثف: النحو والبلاغة",
    instructions: "أجب عن الأسئلة بدقة للتحقق من سلامة المحرك.",
    durationMinutes: 5,
    passScore: 6,
    maxAttempts: 2,
    questions: [
      {
        id: "sq-1",
        type: "mcq",
        category: "نحو",
        prompt: "ما إعراب كلمة «العلم» في «إنّ العلمَ نور»؟",
        options: ["اسم إن منصوب", "خبر إن مرفوع", "مبتدأ مؤخر", "فاعل"],
        correctAnswer: 0,
        explanation: "اسم إن منصوب بالفتحة الظاهرة.",
        points: 2,
      },
      {
        id: "sq-2",
        type: "mcq",
        category: "نحو",
        prompt: "حدد الفعل الناسخ في «أصبح المهندسون مخلصين»:",
        options: ["المهندسون", "مخلصين", "أصبح", "ضمير مستتر"],
        correctAnswer: 2,
        explanation: "«أصبح» فعل ماضٍ ناسخ يرفع المبتدأ وينصب الخبر.",
        points: 2,
      },
      {
        id: "sq-3",
        type: "mcq",
        category: "بلاغة",
        prompt: "«الجندي كالأسد في الشجاعة» نوع التشبيه:",
        options: ["بليغ", "مجمل", "مفصل", "ضمني"],
        correctAnswer: 2,
        explanation: "مفصل لاشتماله على المشبه والمشبه به وأداة التشبيه ووجه الشبه.",
        points: 3,
      },
      {
        id: "sq-4",
        type: "mcq",
        category: "بلاغة",
        prompt: "«العلم نور» نوع التشبيه:",
        options: ["بليغ", "مفصل", "مجمل", "تمثيلي"],
        correctAnswer: 0,
        explanation: "تشبيه بليغ لحذف الأداة ووجه الشبه وبقاء المشبه والمشبه به.",
        points: 3,
      },
    ],
  };

  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = "";
    useExamStore.getState().resetExam();
    useExamStore.getState().clearAttemptHistory();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
    document.body.innerHTML = "";
    useExamStore.getState().resetExam();
    vi.restoreAllMocks();
  });

  /* -------------------------------------------------------------------------
   * Suite 1: Timer Countdown & Exact Boundary Conditions
   * ----------------------------------------------------------------------- */
  describe("1. Timer Countdown & Exact Boundary Conditions", () => {
    it("initializes timeRemainingSeconds correctly based on durationMinutes", () => {
      useExamStore.getState().startExam(testExam);
      const state = useExamStore.getState();
      expect(state.timeRemainingSeconds).toBe(5 * 60); // 300 seconds
      expect(state.isTimerRunning).toBe(true);
      expect(state.isSubmitted).toBe(false);
    });

    it("clamps duration to minimum 1 minute (60s) if durationMinutes is 0 or negative", () => {
      const zeroDurationExam: ExamData = {
        ...testExam,
        id: "zero-duration-exam",
        durationMinutes: 0,
      };
      useExamStore.getState().startExam(zeroDurationExam);
      expect(useExamStore.getState().timeRemainingSeconds).toBe(60);

      const negDurationExam: ExamData = {
        ...testExam,
        id: "neg-duration-exam",
        durationMinutes: -10,
      };
      useExamStore.getState().startExam(negDurationExam);
      expect(useExamStore.getState().timeRemainingSeconds).toBe(60);
    });

    it("decrements timeRemainingSeconds on normal ticks when time > 1", () => {
      useExamStore.getState().startExam(testExam);
      useExamStore.getState().tickTimer();
      expect(useExamStore.getState().timeRemainingSeconds).toBe(299);
      useExamStore.getState().tickTimer();
      expect(useExamStore.getState().timeRemainingSeconds).toBe(298);
      expect(useExamStore.getState().isSubmitted).toBe(false);
    });

    it("boundary transition: ticking at timeRemainingSeconds === 1 triggers automatic submit and halts timer", () => {
      useExamStore.getState().startExam(testExam);
      // Select an answer prior to timeout
      useExamStore.getState().selectAnswer("sq-1", 0);

      // Artificially fast-forward to 1 second remaining
      useExamStore.setState({ timeRemainingSeconds: 1 });

      // This tick must trigger auto-submit
      useExamStore.getState().tickTimer();

      const finalState = useExamStore.getState();
      expect(finalState.timeRemainingSeconds).toBe(0);
      expect(finalState.isTimerRunning).toBe(false);
      expect(finalState.isSubmitted).toBe(true);
      expect(finalState.attemptResult).not.toBeNull();
      // Verify answer was preserved upon timeout submission
      expect(finalState.attemptResult?.answers["sq-1"]).toBe(0);
      expect(finalState.attemptResult?.score).toBe(2);
      expect(finalState.attemptResult?.durationSecondsSpent).toBe(5 * 60);
    });

    it("prevents state corruption if tickTimer is called after time hits 0 or exam is submitted", () => {
      useExamStore.getState().startExam(testExam);
      useExamStore.setState({ timeRemainingSeconds: 1 });
      useExamStore.getState().tickTimer(); // submits and sets time to 0

      expect(useExamStore.getState().timeRemainingSeconds).toBe(0);
      expect(useExamStore.getState().isSubmitted).toBe(true);

      const attemptsCountBefore = useExamStore.getState().userAttempts.length;

      // Excess ticks should be safely ignored
      useExamStore.getState().tickTimer();
      useExamStore.getState().tickTimer();

      expect(useExamStore.getState().timeRemainingSeconds).toBe(0);
      expect(useExamStore.getState().userAttempts.length).toBe(attemptsCountBefore);
    });
  });

  /* -------------------------------------------------------------------------
   * Suite 2: Grading Mathematics & Scoring Extremes
   * ----------------------------------------------------------------------- */
  describe("2. Grading Mathematics & Scoring Extremes", () => {
    it("awards 0 points and marks passed: false for completely wrong answers", () => {
      useExamStore.getState().startExam(testExam);
      // Submit incorrect answers for all questions
      useExamStore.getState().selectAnswer("sq-1", 3); // wrong (correct: 0)
      useExamStore.getState().selectAnswer("sq-2", 0); // wrong (correct: 2)
      useExamStore.getState().selectAnswer("sq-3", 1); // wrong (correct: 2)
      useExamStore.getState().selectAnswer("sq-4", 1); // wrong (correct: 0)

      const attempt = useExamStore.getState().submitExam();
      expect(attempt).not.toBeNull();
      expect(attempt?.score).toBe(0);
      expect(attempt?.totalPoints).toBe(10); // 2 + 2 + 3 + 3
      expect(attempt?.percentage).toBe(0);
      expect(attempt?.passed).toBe(false);
      expect(attempt?.feedbackText).toContain("لم تحقق درجة النجاح المطلوبة");
    });

    it("awards full points (10/10, 100%) and marks passed: true for 100% correct answers", () => {
      useExamStore.getState().startExam(testExam);
      useExamStore.getState().selectAnswer("sq-1", 0); // +2
      useExamStore.getState().selectAnswer("sq-2", 2); // +2
      useExamStore.getState().selectAnswer("sq-3", 2); // +3
      useExamStore.getState().selectAnswer("sq-4", 0); // +3

      const attempt = useExamStore.getState().submitExam();
      expect(attempt?.score).toBe(10);
      expect(attempt?.totalPoints).toBe(10);
      expect(attempt?.percentage).toBe(100);
      expect(attempt?.passed).toBe(true);
      expect(attempt?.feedbackText).toContain("ما شاء الله! ممتاز جداً");
    });

    it("handles exact pass boundary: passScore (6) passes, passScore - 1 (5) fails", () => {
      // Test 1: Exactly 6 points (sq-1: 2, sq-2: 2, sq-3: wrong, sq-4: wrong -> 4 pts fails)
      // sq-1 (2) + sq-4 (3) = 5 points -> fails (5 < 6)
      useExamStore.getState().startExam(testExam);
      useExamStore.getState().selectAnswer("sq-1", 0); // +2
      useExamStore.getState().selectAnswer("sq-4", 0); // +3
      const attempt5 = useExamStore.getState().submitExam();
      expect(attempt5?.score).toBe(5);
      expect(attempt5?.passed).toBe(false);

      // Reset and test exactly 6 points: sq-3 (3) + sq-4 (3) = 6 points -> passes (6 >= 6)
      useExamStore.getState().startExam(testExam);
      useExamStore.getState().selectAnswer("sq-3", 2); // +3
      useExamStore.getState().selectAnswer("sq-4", 0); // +3
      const attempt6 = useExamStore.getState().submitExam();
      expect(attempt6?.score).toBe(6);
      expect(attempt6?.percentage).toBe(60);
      expect(attempt6?.passed).toBe(true);
    });

    it("safely handles exams with zero total points without producing NaN or Infinity", () => {
      const zeroPointExam: ExamData = {
        ...testExam,
        id: "zero-points-exam",
        questions: [],
      };
      useExamStore.getState().startExam(zeroPointExam);
      const attempt = useExamStore.getState().submitExam();
      expect(attempt?.totalPoints).toBe(0);
      expect(attempt?.score).toBe(0);
      expect(attempt?.percentage).toBe(0);
      expect(Number.isNaN(attempt?.percentage)).toBe(false);
    });
  });

  /* -------------------------------------------------------------------------
   * Suite 3: Missing & Skipped Questions Calculation
   * ----------------------------------------------------------------------- */
  describe("3. Missing & Skipped Questions Calculation", () => {
    it("accurately scores exam when student answers only 1 question and skips all others", () => {
      useExamStore.getState().startExam(testExam);
      // Answer only sq-2 correctly (+2 points)
      useExamStore.getState().selectAnswer("sq-2", 2);

      const attempt = useExamStore.getState().submitExam();
      expect(attempt?.score).toBe(2);
      expect(attempt?.totalPoints).toBe(10);
      expect(attempt?.percentage).toBe(20);
      expect(attempt?.passed).toBe(false);
      // Only sq-2 exists in answers dictionary
      expect(Object.keys(attempt?.answers || {})).toEqual(["sq-2"]);
    });

    it("correctly records unanswered questions when student jumps between questions via goToQuestion", () => {
      useExamStore.getState().startExam(testExam);
      useExamStore.getState().goToQuestion(3); // Jump to sq-4
      useExamStore.getState().selectAnswer("sq-4", 0); // +3

      useExamStore.getState().goToQuestion(0); // Jump back to sq-1
      useExamStore.getState().selectAnswer("sq-1", 0); // +2

      // Questions sq-2 and sq-3 were skipped
      const attempt = useExamStore.getState().submitExam();
      expect(attempt?.score).toBe(5);
      expect(attempt?.answers["sq-2"]).toBeUndefined();
      expect(attempt?.answers["sq-3"]).toBeUndefined();
    });

    it("evaluates unanswered questions as 0 when total exam is submitted completely blank", () => {
      useExamStore.getState().startExam(testExam);
      const attempt = useExamStore.getState().submitExam();
      expect(attempt?.score).toBe(0);
      expect(attempt?.percentage).toBe(0);
      expect(attempt?.passed).toBe(false);
      expect(attempt?.answers).toEqual({});
    });
  });

  /* -------------------------------------------------------------------------
   * Suite 4: MCQ Option Tampering & Input Sanitization
   * ----------------------------------------------------------------------- */
  describe("4. MCQ Option Tampering & Input Sanitization", () => {
    it("submitting an out-of-bounds index (e.g. 999 or -1) yields 0 points without error", () => {
      useExamStore.getState().startExam(testExam);
      useExamStore.getState().selectAnswer("sq-1", 999);
      useExamStore.getState().selectAnswer("sq-2", -5);

      const attempt = useExamStore.getState().submitExam();
      expect(attempt?.score).toBe(0);
      expect(attempt?.answers["sq-1"]).toBe(999);
      expect(attempt?.answers["sq-2"]).toBe(-5);
    });

    it("submitting malicious payloads (XSS or SQL-like strings) does not match correct answer", () => {
      useExamStore.getState().startExam(testExam);
      useExamStore.getState().selectAnswer("sq-1", "<script>alert('xss')</script>");
      useExamStore.getState().selectAnswer("sq-2", "' OR '1'='1");

      const attempt = useExamStore.getState().submitExam();
      expect(attempt?.score).toBe(0);
    });

    it("prevents changing answers after exam has been submitted", () => {
      useExamStore.getState().startExam(testExam);
      useExamStore.getState().selectAnswer("sq-1", 0); // correct (+2)
      useExamStore.getState().submitExam();

      expect(useExamStore.getState().isSubmitted).toBe(true);

      // Attempt to tamper with answer after submission
      useExamStore.getState().selectAnswer("sq-1", 3);
      useExamStore.getState().selectAnswer("sq-2", 2);

      // Selected answers in store must remain unchanged
      expect(useExamStore.getState().selectedAnswers["sq-1"]).toBe(0);
      expect(useExamStore.getState().selectedAnswers["sq-2"]).toBeUndefined();
    });

    it("handles string vs number type coercion gracefully (e.g. '0' matches 0)", () => {
      useExamStore.getState().startExam(testExam);
      // sq-1 correctAnswer is number 0, student submits string "0"
      useExamStore.getState().selectAnswer("sq-1", "0");
      // sq-2 correctAnswer is number 2, student submits string "2"
      useExamStore.getState().selectAnswer("sq-2", " 2 "); // with whitespace

      const attempt = useExamStore.getState().submitExam();
      expect(attempt?.score).toBe(4); // 2 + 2 = 4
    });

    it("ignores fictitious question IDs injected into selectedAnswers during scoring", () => {
      useExamStore.getState().startExam(testExam);
      useExamStore.getState().selectAnswer("sq-1", 0); // 2 pts
      useExamStore.getState().selectAnswer("fake-question-x", 0);

      const attempt = useExamStore.getState().submitExam();
      expect(attempt?.score).toBe(2);
      expect(attempt?.totalPoints).toBe(10);
    });
  });

  /* -------------------------------------------------------------------------
   * Suite 5: Max Attempts Enforcement & Retake Restrictions (EMPIRICAL FINDING)
   * ----------------------------------------------------------------------- */
  describe("5. Max Attempts Enforcement & Retake Behavior", () => {
    it("accurately records and retrieves multiple attempts per exam", () => {
      useExamStore.getState().startExam(testExam);
      useExamStore.getState().selectAnswer("sq-1", 0);
      useExamStore.getState().submitExam();

      useExamStore.getState().startExam(testExam);
      useExamStore.getState().selectAnswer("sq-1", 0);
      useExamStore.getState().selectAnswer("sq-2", 2);
      useExamStore.getState().submitExam();

      const attempts = useExamStore.getState().getAttemptsForExam(testExam.id);
      expect(attempts).toHaveLength(2);
      expect(attempts[0].score).toBe(4); // latest attempt first
      expect(attempts[1].score).toBe(2);
    });

    it("adversarial audit: inspects whether startExam or store prevents retakes beyond maxAttempts", () => {
      // testExam specifies maxAttempts: 2
      expect(testExam.maxAttempts).toBe(2);

      // Attempt 1
      useExamStore.getState().startExam(testExam);
      useExamStore.getState().submitExam();

      // Attempt 2
      useExamStore.getState().startExam(testExam);
      useExamStore.getState().submitExam();

      const attemptsAfter2 = useExamStore.getState().getAttemptsForExam(testExam.id);
      expect(attemptsAfter2.length).toBe(2);

      // Attempt 3: In a strict system, taking a 3rd attempt when maxAttempts is 2
      // should either be blocked by the store or recorded as exceeding max attempts.
      // Let's empirically test the current store behavior:
      useExamStore.getState().startExam(testExam);
      const is3rdAttemptStarted = useExamStore.getState().activeExam?.id === testExam.id;
      const is3rdTimerRunning = useExamStore.getState().isTimerRunning;

      // EMPIRICAL OBSERVATION:
      // Does startExam currently reject or allow exceeding maxAttempts?
      // We observe that useExamStore currently does NOT guard startExam with maxAttempts check.
      // We record this finding:
      expect(is3rdAttemptStarted).toBe(true);
      expect(is3rdTimerRunning).toBe(true);
    });

    it("inspects ExamResultModal retake button behavior", () => {
      const mockRetake = vi.fn();
      const sampleAttempt = {
        attemptId: "att-1",
        examId: testExam.id,
        studentId: "std-1",
        timestamp: new Date().toISOString(),
        durationSecondsSpent: 120,
        answers: { "sq-1": 0 },
        score: 2,
        totalPoints: 10,
        percentage: 20,
        passed: false,
        feedbackText: "حاول مرة أخرى.",
      };

      const { container, unmount } = mountToDom(
        <ExamResultModal
          isOpen={true}
          onClose={() => {}}
          attempt={sampleAttempt}
          examTitle={testExam.title}
          passScore={testExam.passScore}
          onReviewAnswers={() => {}}
          onRetakeExam={mockRetake}
        />
      );

      // Find retake button
      const retakeBtn = Array.from(container.querySelectorAll("button")).find(
        (b) => b.textContent?.includes("إعادة المحاولة")
      );
      expect(retakeBtn).toBeDefined();

      act(() => {
        retakeBtn?.click();
      });
      expect(mockRetake).toHaveBeenCalledTimes(1);

      unmount();
    });
  });

  /* -------------------------------------------------------------------------
   * Suite 6: Multi-Attempt History & LocalStorage Persistence
   * ----------------------------------------------------------------------- */
  describe("6. Multi-Attempt History & LocalStorage Persistence Integrity", () => {
    it("persists submitted attempts to localStorage under alaref_exam_attempts", () => {
      useExamStore.getState().startExam(testExam);
      useExamStore.getState().selectAnswer("sq-1", 0);
      const attempt = useExamStore.getState().submitExam();

      const raw = localStorage.getItem(LOCAL_STORAGE_EXAM_ATTEMPTS_KEY);
      expect(raw).toBeTruthy();

      const parsed = JSON.parse(raw!);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].attemptId).toBe(attempt?.attemptId);
      expect(parsed[0].score).toBe(2);
    });

    it("clears attempt history in both store state and localStorage via clearAttemptHistory", () => {
      useExamStore.getState().startExam(testExam);
      useExamStore.getState().submitExam();
      expect(useExamStore.getState().userAttempts.length).toBe(1);
      expect(localStorage.getItem(LOCAL_STORAGE_EXAM_ATTEMPTS_KEY)).toBeTruthy();

      useExamStore.getState().clearAttemptHistory();
      expect(useExamStore.getState().userAttempts).toHaveLength(0);
      expect(localStorage.getItem(LOCAL_STORAGE_EXAM_ATTEMPTS_KEY)).toBeNull();
    });

    it("recovers gracefully without crash when localStorage contains malformed JSON", () => {
      localStorage.setItem(LOCAL_STORAGE_EXAM_ATTEMPTS_KEY, "MALFORMED_JSON_CORRUPTED{{{");

      // Verify that accessing or clearing or starting an exam does not throw
      expect(() => {
        useExamStore.getState().startExam(testExam);
      }).not.toThrow();

      expect(() => {
        useExamStore.getState().submitExam();
      }).not.toThrow();
    });

    it("properly isolates attempts across multiple different exam IDs", () => {
      const examA = testExam;
      const examB: ExamData = {
        ...testExam,
        id: "stress-exam-arabic-02",
        title: "امتحان النصوص والقراءة",
      };

      // 2 attempts for Exam A
      useExamStore.getState().startExam(examA);
      useExamStore.getState().submitExam();
      useExamStore.getState().startExam(examA);
      useExamStore.getState().submitExam();

      // 1 attempt for Exam B
      useExamStore.getState().startExam(examB);
      useExamStore.getState().submitExam();

      const attemptsA = useExamStore.getState().getAttemptsForExam(examA.id);
      const attemptsB = useExamStore.getState().getAttemptsForExam(examB.id);

      expect(attemptsA).toHaveLength(2);
      expect(attemptsB).toHaveLength(1);
      expect(useExamStore.getState().userAttempts).toHaveLength(3);
    });
  });

  /* -------------------------------------------------------------------------
   * Suite 7: Concurrent Exam Lifecycle & State Machine Edge Cases
   * ----------------------------------------------------------------------- */
  describe("7. Concurrent Exam Lifecycle & State Machine Edge Cases", () => {
    it("calling startExam mid-session overwrites previous active exam cleanly", () => {
      useExamStore.getState().startExam(testExam);
      useExamStore.getState().selectAnswer("sq-1", 0);
      expect(useExamStore.getState().selectedAnswers["sq-1"]).toBe(0);

      const examB: ExamData = {
        ...testExam,
        id: "exam-concurrent-switch",
        title: "امتحان جديد تم البدء فيه",
        durationMinutes: 15,
      };

      useExamStore.getState().startExam(examB);
      const state = useExamStore.getState();
      expect(state.activeExam?.id).toBe("exam-concurrent-switch");
      expect(state.selectedAnswers).toEqual({});
      expect(state.timeRemainingSeconds).toBe(15 * 60);
      expect(state.currentQuestionIndex).toBe(0);
      expect(state.isSubmitted).toBe(false);
    });

    it("calling submitExam multiple times consecutively is idempotent and returns cached attempt", () => {
      useExamStore.getState().startExam(testExam);
      useExamStore.getState().selectAnswer("sq-1", 0);

      const attempt1 = useExamStore.getState().submitExam();
      const attemptsCountAfter1 = useExamStore.getState().userAttempts.length;

      // Call submit again
      const attempt2 = useExamStore.getState().submitExam();
      const attemptsCountAfter2 = useExamStore.getState().userAttempts.length;

      expect(attempt1?.attemptId).toBe(attempt2?.attemptId);
      expect(attemptsCountAfter1).toBe(attemptsCountAfter2);
    });

    it("calling submitExam when activeExam is null safely returns null", () => {
      useExamStore.getState().resetExam();
      const result = useExamStore.getState().submitExam();
      expect(result).toBeNull();
    });

    it("calling resetExam completely tears down active session state", () => {
      useExamStore.getState().startExam(testExam);
      useExamStore.getState().selectAnswer("sq-1", 0);
      useExamStore.getState().tickTimer();

      useExamStore.getState().resetExam();

      const state = useExamStore.getState();
      expect(state.activeExam).toBeNull();
      expect(state.currentQuestionIndex).toBe(0);
      expect(state.selectedAnswers).toEqual({});
      expect(state.timeRemainingSeconds).toBe(0);
      expect(state.isSubmitted).toBe(false);
      expect(state.attemptResult).toBeNull();
      expect(state.isTimerRunning).toBe(false);
    });

    it("calling navigation methods on boundary limits does not produce out-of-range indices", () => {
      useExamStore.getState().startExam(testExam);
      expect(useExamStore.getState().currentQuestionIndex).toBe(0);

      // Prev on index 0 should stay 0
      useExamStore.getState().prevQuestion();
      expect(useExamStore.getState().currentQuestionIndex).toBe(0);

      // Advance to end
      useExamStore.getState().goToQuestion(testExam.questions.length - 1);
      expect(useExamStore.getState().currentQuestionIndex).toBe(3);

      // Next on last question should stay last
      useExamStore.getState().nextQuestion();
      expect(useExamStore.getState().currentQuestionIndex).toBe(3);

      // Invalid goToQuestion should be ignored
      useExamStore.getState().goToQuestion(999);
      expect(useExamStore.getState().currentQuestionIndex).toBe(3);
      useExamStore.getState().goToQuestion(-1);
      expect(useExamStore.getState().currentQuestionIndex).toBe(3);
    });
  });
});
