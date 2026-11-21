// @ts-expect-error enable React act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import React, { act } from "react";
import ReactDOM from "react-dom/client";
import {
  mockExams,
  getExamById,
  getExamByLessonId,
} from "../data/mockExams";
import {
  mockSummaries,
  getSummaryByLessonId,
  getSummaryById,
} from "../data/mockSummaries";
import {
  mockAssignments,
  getAssignmentById,
  getAssignmentByLessonId,
} from "../data/mockAssignments";
import {
  useExamStore,
  LOCAL_STORAGE_EXAM_ATTEMPTS_KEY,
} from "../stores/useExamStore";
import {
  useAssignmentStore,
  LOCAL_STORAGE_ASSIGNMENTS_KEY,
  MAX_FILE_SIZE_BYTES,
} from "../stores/useAssignmentStore";
import { ExamTimer } from "../components/exams/ExamTimer";
import { ExamQuestionView } from "../components/exams/ExamQuestionView";
import { ExamNavigationGrid } from "../components/exams/ExamNavigationGrid";
import { AssignmentFeedbackCard } from "../components/assignments/AssignmentFeedbackCard";

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

describe("Milestone 3: Educational Modules (Exams, Summaries & Assignments)", () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = "";
    useExamStore.getState().resetExam();
    useExamStore.getState().clearAttemptHistory();
    useAssignmentStore.getState().clearSubmissions();
  });

  afterEach(() => {
    localStorage.clear();
    document.body.innerHTML = "";
    useExamStore.getState().resetExam();
  });

  /* -------------------------------------------------------------------------
   * Suite 1: Arabic Question Banks & Domain Integrity
   * ----------------------------------------------------------------------- */
  describe("1. Question Banks & Educational Data Models (F16)", () => {
    it("provides question banks covering the 5 core stages", () => {
      expect(mockExams.length).toBeGreaterThanOrEqual(5);

      const examIds = mockExams.map((e) => e.id);
      expect(examIds).toContain("quiz-62"); // Prep 1 / Chapter 194
      expect(examIds).toContain("quiz-prep3-final"); // Prep 3
      expect(examIds).toContain("quiz-prep2-units"); // Prep 2
      expect(examIds).toContain("quiz-prim6-essentials"); // Prim 6
      expect(examIds).toContain("quiz-foundation-mastery"); // Comprehensive Foundation
    });

    it("verifies quiz-62 matches the exact curriculum rules from mockData", () => {
      const quiz62 = getExamById("quiz-62");
      expect(quiz62).toBeDefined();
      expect(quiz62?.durationMinutes).toBe(10);
      expect(quiz62?.passScore).toBe(5);
      expect(quiz62?.questions).toHaveLength(10);
      expect(quiz62?.courseId).toBe("course-prep1-summary");
      expect(quiz62?.lessonId).toBe("les-200");
    });

    it("ensures each exam question has pedagogical explanation and points", () => {
      mockExams.forEach((exam) => {
        expect(exam.title).toBeTruthy();
        expect(exam.instructions).toBeTruthy();
        expect(exam.questions.length).toBeGreaterThan(0);

        exam.questions.forEach((q) => {
          expect(q.id).toBeTruthy();
          expect(q.prompt).toBeTruthy();
          expect(q.category).toMatch(/^(نحو|بلاغة|نصوص|قراءة|قصة|إملاء)$/);
          expect(q.points).toBeGreaterThanOrEqual(1);
          expect(q.explanation).toBeTruthy();
          expect(q.explanation.length).toBeGreaterThan(15); // Authentic deep teacher explanation
          expect(q.correctAnswer).toBeDefined();

          if (q.type === "mcq") {
            expect(q.options?.length).toBeGreaterThanOrEqual(3);
          } else if (q.type === "true_false") {
            expect(q.options).toBeDefined();
          }
        });
      });
    });

    it("resolves exams by lesson ID correctly via getExamByLessonId", () => {
      const exam = getExamByLessonId("les-200");
      expect(exam).toBeDefined();
      expect(exam?.id).toBe("quiz-62");

      const defaultExam = getExamByLessonId("non-existent-lesson");
      expect(defaultExam).toBeDefined();
      expect(defaultExam?.id).toBe("quiz-62");
    });
  });

  /* -------------------------------------------------------------------------
   * Suite 2: Lesson Summaries & Mind Maps (F19, F20)
   * ----------------------------------------------------------------------- */
  describe("2. Lesson Summaries & Mind Map Documents (F19, F20)", () => {
    it("contains rich summary items with grammar rules and vocabulary tables", () => {
      expect(mockSummaries.length).toBeGreaterThanOrEqual(4);

      const sum200 = getSummaryByLessonId("les-200");
      expect(sum200).toBeDefined();
      expect(sum200?.summaryType).toBe("mindmap");
      expect(sum200?.totalPages).toBeGreaterThan(0);
      expect(sum200?.fileSizeText).toContain("ميجابايت");
      expect(sum200?.keyPoints.length).toBeGreaterThanOrEqual(4);
      expect(sum200?.vocabularyTable?.length).toBeGreaterThanOrEqual(3);
      expect(sum200?.grammarRules?.length).toBeGreaterThanOrEqual(3);
    });

    it("validates vocabulary glossaries contain word, meaning, and contextual sentence", () => {
      const sum200 = getSummaryById("sum-200");
      expect(sum200?.vocabularyTable).toBeDefined();

      sum200?.vocabularyTable?.forEach((item) => {
        expect(item.word).toBeTruthy();
        expect(item.meaning).toBeTruthy();
        expect(item.context).toBeTruthy();
      });
    });

    it("validates grammar rules have complete parsing breakdowns and examples", () => {
      const sum200 = getSummaryById("sum-200");
      expect(sum200?.grammarRules).toBeDefined();

      sum200?.grammarRules?.forEach((rule) => {
        expect(rule.rule).toBeTruthy();
        expect(rule.example).toBeTruthy();
        expect(rule.parsing).toBeTruthy();
      });
    });
  });

  /* -------------------------------------------------------------------------
   * Suite 3: Homework & Assignment Submissions (F21, F22)
   * ----------------------------------------------------------------------- */
  describe("3. Assignments & File Upload Validation (F21, F22)", () => {
    it("provides assignments with sentence parsing instructions and max scores", () => {
      expect(mockAssignments.length).toBeGreaterThanOrEqual(3);

      const assign200 = getAssignmentByLessonId("les-200");
      expect(assign200).toBeDefined();
      expect(assign200?.maxScore).toBe(20);
      expect(assign200?.passagePrompt).toContain("المطلوب");
      expect(assign200?.allowedFileTypes).toContain("pdf");
      expect(assign200?.maxFileSizeMB).toBe(10);
    });

    it("rejects files larger than 10MB", () => {
      const store = useAssignmentStore.getState();

      const oversizedFile = {
        name: "heavy_assignment.pdf",
        size: 11 * 1024 * 1024, // 11 MB
        type: "application/pdf",
      };

      const result = store.validateFile(oversizedFile);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("10 ميجابايت");
    });

    it("rejects empty files (0 bytes)", () => {
      const store = useAssignmentStore.getState();

      const emptyFile = {
        name: "empty.pdf",
        size: 0,
        type: "application/pdf",
      };

      const result = store.validateFile(emptyFile);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("فارغ");
    });

    it("rejects unsupported MIME types and dangerous executable files", () => {
      const store = useAssignmentStore.getState();

      const invalidFiles = [
        { name: "script.exe", size: 1024, type: "application/x-msdownload" },
        { name: "archive.zip", size: 1024, type: "application/zip" },
        { name: "audio.mp3", size: 1024, type: "audio/mpeg" },
      ];

      invalidFiles.forEach((file) => {
        const result = store.validateFile(file);
        expect(result.valid).toBe(false);
        expect(result.error).toContain("نوع الملف غير مدعوم");
      });
    });

    it("accepts valid supported files (PDF, Word, Images)", () => {
      const store = useAssignmentStore.getState();

      const validFiles = [
        { name: "wajeb.pdf", size: 2 * 1024 * 1024, type: "application/pdf" },
        {
          name: "irab.docx",
          size: 1024 * 500,
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        },
        { name: "photo.jpg", size: 1024 * 800, type: "image/jpeg" },
        { name: "scan.png", size: 1024 * 900, type: "image/png" },
      ];

      validFiles.forEach((file) => {
        const result = store.validateFile(file);
        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
      });
    });

    it("submits an assignment, stores submission and updates status", () => {
      const store = useAssignmentStore.getState();

      const submissionPayload = {
        studentId: "student-105",
        studentName: "سارة أحمد",
        file: {
          name: "wajeb_sara.pdf",
          size: 1024 * 1500,
          type: "application/pdf",
        },
        notes: "تم إعراب جميع الكلمات مع استخراج أفعال الاستمرار.",
      };

      const submitResult = store.submitAssignment(
        "assign-200",
        submissionPayload
      );
      expect(submitResult.success).toBe(true);
      expect(submitResult.submission).toBeDefined();
      expect(submitResult.submission?.status).toBe("submitted");
      expect(submitResult.submission?.studentName).toBe("سارة أحمد");
      expect(submitResult.submission?.fileName).toBe("wajeb_sara.pdf");

      // Verify retrieval from store
      const retrieved = useAssignmentStore
        .getState()
        .getSubmission("assign-200");
      expect(retrieved).toBeDefined();
      expect(retrieved?.studentNotes).toBe(
        "تم إعراب جميع الكلمات مع استخراج أفعال الاستمرار."
      );

      // Verify persistence in localStorage
      const storedRaw = localStorage.getItem(LOCAL_STORAGE_ASSIGNMENTS_KEY);
      expect(storedRaw).toBeDefined();
      const parsed = JSON.parse(storedRaw || "{}");
      expect(parsed["assign-200"].studentName).toBe("سارة أحمد");
    });

    it("demonstrates pre-graded sample submission with teacher score and feedback", () => {
      const submission = useAssignmentStore
        .getState()
        .getSubmission("assign-200");
      expect(submission).toBeDefined();
      expect(submission?.status).toBe("graded");
      expect(submission?.score).toBe(19);
      expect(submission?.teacherFeedback).toContain("أحسنت يا بطل");
    });
  });

  /* -------------------------------------------------------------------------
   * Suite 4: Interactive Exam Store & Instant Grading Engine (F16, F17, F18)
   * ----------------------------------------------------------------------- */
  describe("4. Exam Session Store & Instant Grading Logic (F17, F18)", () => {
    it("starts an exam and initializes session state accurately", () => {
      const exam = getExamById("quiz-62")!;
      useExamStore.getState().startExam(exam, {
        studentId: "student-99",
        studentName: "محمود حسن",
      });

      const state = useExamStore.getState();
      expect(state.activeExam?.id).toBe("quiz-62");
      expect(state.currentQuestionIndex).toBe(0);
      expect(state.timeRemainingSeconds).toBe(10 * 60); // 600 seconds
      expect(state.isSubmitted).toBe(false);
      expect(state.isTimerRunning).toBe(true);
      expect(state.selectedAnswers).toEqual({});
      expect(state.studentInfo.studentName).toBe("محمود حسن");
    });

    it("selects answers and supports question navigation within valid bounds", () => {
      const exam = getExamById("quiz-62")!;
      const store = useExamStore.getState();
      store.startExam(exam);

      // Select answer for question 1
      useExamStore.getState().selectAnswer(exam.questions[0].id, 1);
      expect(useExamStore.getState().selectedAnswers[exam.questions[0].id]).toBe(
        1
      );

      // Next question navigation
      useExamStore.getState().nextQuestion();
      expect(useExamStore.getState().currentQuestionIndex).toBe(1);

      // Select answer for question 2
      useExamStore.getState().selectAnswer(exam.questions[1].id, 2);
      expect(useExamStore.getState().selectedAnswers[exam.questions[1].id]).toBe(
        2
      );

      // Prev question navigation
      useExamStore.getState().prevQuestion();
      expect(useExamStore.getState().currentQuestionIndex).toBe(0);

      // Boundary check: cannot go prev below 0
      useExamStore.getState().prevQuestion();
      expect(useExamStore.getState().currentQuestionIndex).toBe(0);

      // Jump to question
      useExamStore.getState().goToQuestion(5);
      expect(useExamStore.getState().currentQuestionIndex).toBe(5);

      // Jump beyond boundary is ignored
      useExamStore.getState().goToQuestion(999);
      expect(useExamStore.getState().currentQuestionIndex).toBe(5);
    });

    it("ticks timer and triggers auto-submit when countdown reaches 00:00", () => {
      const exam = getExamById("quiz-62")!;
      useExamStore.getState().startExam(exam);

      // Decrement by 1 second
      useExamStore.getState().tickTimer();
      expect(useExamStore.getState().timeRemainingSeconds).toBe(599);

      // Set timer to 1 second remaining and tick
      useExamStore.setState({ timeRemainingSeconds: 1 });
      useExamStore.getState().tickTimer();

      // Exam should now be automatically submitted!
      const state = useExamStore.getState();
      expect(state.timeRemainingSeconds).toBe(0);
      expect(state.isTimerRunning).toBe(false);
      expect(state.isSubmitted).toBe(true);
      expect(state.attemptResult).toBeDefined();
    });

    it("calculates 100% correct score, sets passed=true, and generates celebratory feedback", () => {
      const exam = getExamById("quiz-62")!;
      useExamStore.getState().startExam(exam);

      // Answer all 10 questions correctly
      exam.questions.forEach((q) => {
        useExamStore.getState().selectAnswer(q.id, q.correctAnswer);
      });

      const attempt = useExamStore.getState().submitExam();
      expect(attempt).toBeDefined();
      expect(attempt?.score).toBe(10);
      expect(attempt?.totalPoints).toBe(10);
      expect(attempt?.percentage).toBe(100);
      expect(attempt?.passed).toBe(true);
      expect(attempt?.feedbackText).toContain("ممتاز جداً");

      // Verify persistence to localStorage
      const storedAttemptsRaw = localStorage.getItem(
        LOCAL_STORAGE_EXAM_ATTEMPTS_KEY
      );
      expect(storedAttemptsRaw).toBeDefined();
      const storedAttempts = JSON.parse(storedAttemptsRaw || "[]");
      expect(storedAttempts[0].score).toBe(10);
      expect(storedAttempts[0].passed).toBe(true);
    });

    it("calculates partial score and evaluates pass/fail against passScore", () => {
      const exam = getExamById("quiz-62")!; // passScore = 5
      useExamStore.getState().startExam(exam);

      // Answer 4 questions correctly (under passScore 5)
      exam.questions.slice(0, 4).forEach((q) => {
        useExamStore.getState().selectAnswer(q.id, q.correctAnswer);
      });

      // Answer 6 questions incorrectly
      exam.questions.slice(4).forEach((q) => {
        useExamStore.getState().selectAnswer(q.id, 999);
      });

      const attempt = useExamStore.getState().submitExam();
      expect(attempt?.score).toBe(4);
      expect(attempt?.percentage).toBe(40);
      expect(attempt?.passed).toBe(false);
      expect(attempt?.feedbackText).toContain("لم تحقق درجة النجاح المطلوبة");
    });

    it("prevents changing answers after exam has been submitted", () => {
      const exam = getExamById("quiz-62")!;
      useExamStore.getState().startExam(exam);
      useExamStore.getState().selectAnswer(exam.questions[0].id, 1);
      useExamStore.getState().submitExam();

      // Attempt to modify answer
      useExamStore.getState().selectAnswer(exam.questions[0].id, 0);

      // Answer remains unchanged
      expect(useExamStore.getState().selectedAnswers[exam.questions[0].id]).toBe(
        1
      );
    });

    it("tracks multiple attempts history per exam", () => {
      const exam = getExamById("quiz-62")!;

      // Attempt 1
      useExamStore.getState().startExam(exam);
      useExamStore.getState().submitExam();

      // Attempt 2
      useExamStore.getState().startExam(exam);
      useExamStore.getState().submitExam();

      const attempts = useExamStore.getState().getAttemptsForExam("quiz-62");
      expect(attempts).toHaveLength(2);
    });
  });

  /* -------------------------------------------------------------------------
   * Suite 5: UI Components Smoke & Behavioral Rendering
   * ----------------------------------------------------------------------- */
  describe("5. UI Components Smoke & Visual Contracts", () => {
    it("renders ExamTimer with normal, amber warning, and red urgent states", () => {
      // 1. Normal state (> 120s)
      const { container, unmount } = mountToDom(
        <ExamTimer timeRemainingSeconds={300} />
      );
      expect(container.textContent).toContain("05:00");
      unmount();

      // 2. Warning state (<= 120s)
      const warningMount = mountToDom(<ExamTimer timeRemainingSeconds={90} />);
      expect(warningMount.container.textContent).toContain("01:30");
      warningMount.unmount();

      // 3. Urgent state (<= 30s)
      const urgentMount = mountToDom(<ExamTimer timeRemainingSeconds={25} />);
      expect(urgentMount.container.textContent).toContain("00:25");
      urgentMount.unmount();
    });

    it("renders ExamQuestionView with passage, prompt, category, and selectable options", () => {
      const sampleQuestion = mockExams[0].questions[0];
      const handleSelect = vi.fn();

      const { container, unmount } = mountToDom(
        <ExamQuestionView
          question={sampleQuestion}
          questionNumber={1}
          totalQuestions={10}
          selectedAnswer={1}
          onSelectAnswer={handleSelect}
        />
      );

      expect(container.textContent).toContain(sampleQuestion.prompt);
      expect(container.textContent).toContain(sampleQuestion.category);
      expect(container.textContent).toContain("سياق القطعة");

      // Verify options are in the document
      sampleQuestion.options?.forEach((opt) => {
        expect(container.textContent).toContain(opt);
      });

      // Find first option button and simulate click
      const optionButtons = container.querySelectorAll("button");
      expect(optionButtons.length).toBeGreaterThan(0);
      act(() => {
        optionButtons[0].click();
      });
      expect(handleSelect).toHaveBeenCalledWith(0);

      unmount();
    });

    it("renders ExamNavigationGrid with answered vs unanswered indicators", () => {
      const handleSelectQuestion = vi.fn();

      const { container, unmount } = mountToDom(
        <ExamNavigationGrid
          totalQuestions={5}
          currentIndex={1}
          answeredQuestionIndices={[0, 2]}
          onSelectQuestion={handleSelectQuestion}
        />
      );

      expect(container.textContent).toContain("قائمة الأسئلة");
      expect(container.textContent).toContain("2"); // 2 answered
      expect(container.textContent).toContain("5"); // 5 total

      // Click button 3 (index 2)
      const buttons = container.querySelectorAll("button");
      act(() => {
        buttons[2].click();
      });
      expect(handleSelectQuestion).toHaveBeenCalledWith(2);

      unmount();
    });

    it("renders AssignmentFeedbackCard with teacher score and commentary", () => {
      const sampleSubmission = {
        submissionId: "sub-1",
        assignmentId: "assign-200",
        studentId: "std-1",
        studentName: "أحمد",
        submittedAt: new Date().toISOString(),
        status: "graded" as const,
        fileName: "wajeb_ahmed.pdf",
        fileSize: 2000000,
        fileUrl: "/url",
        score: 19,
        teacherFeedback: "أحسنت يا بطل! إعراب دقيق.",
        gradedAt: new Date().toISOString(),
      };

      const { container, unmount } = mountToDom(
        <AssignmentFeedbackCard submission={sampleSubmission} maxScore={20} />
      );

      expect(container.textContent).toContain("تم تصحيح الواجب والتقييم");
      expect(container.textContent).toContain("19");
      expect(container.textContent).toContain("/ 20");
      expect(container.textContent).toContain("wajeb_ahmed.pdf");
      expect(container.textContent).toContain("أحسنت يا بطل! إعراب دقيق.");

      unmount();
    });
  });
});
