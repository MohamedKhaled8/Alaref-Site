import { create } from "zustand";
import { ExamData, StudentExamAttempt } from "../types/educational";

export const LOCAL_STORAGE_EXAM_ATTEMPTS_KEY = "alaref_exam_attempts";

export interface ExamStoreState {
  // Active session
  activeExam: ExamData | null;
  currentQuestionIndex: number;
  selectedAnswers: Record<string, string | number>;
  timeRemainingSeconds: number;
  isSubmitted: boolean;
  attemptResult: StudentExamAttempt | null;
  isTimerRunning: boolean;
  studentInfo: { studentId: string; studentName?: string };

  // Attempt history
  userAttempts: StudentExamAttempt[];

  // Actions
  startExam: (
    examData: ExamData,
    studentInfo?: { studentId: string; studentName?: string }
  ) => void;
  selectAnswer: (questionId: string, answer: string | number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  goToQuestion: (index: number) => void;
  tickTimer: () => void;
  submitExam: () => StudentExamAttempt | null;
  resetExam: () => void;
  getAttemptsForExam: (examId: string) => StudentExamAttempt[];
  clearAttemptHistory: () => void;
}

// Safely load initial attempts from localStorage
const loadInitialAttempts = (): StudentExamAttempt[] => {
  if (typeof window === "undefined" || !window.localStorage) {
    return [];
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_EXAM_ATTEMPTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to load stored exam attempts:", err);
    return [];
  }
};

const saveAttemptsToStorage = (attempts: StudentExamAttempt[]) => {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }
  try {
    localStorage.setItem(
      LOCAL_STORAGE_EXAM_ATTEMPTS_KEY,
      JSON.stringify(attempts)
    );
  } catch (err) {
    console.error("Failed to persist exam attempts:", err);
  }
};

export const useExamStore = create<ExamStoreState>((set, get) => ({
  activeExam: null,
  currentQuestionIndex: 0,
  selectedAnswers: {},
  timeRemainingSeconds: 0,
  isSubmitted: false,
  attemptResult: null,
  isTimerRunning: false,
  studentInfo: { studentId: "student-guest", studentName: "طالب المنصة" },
  userAttempts: loadInitialAttempts(),

  startExam: (examData, studentInfo) => {
    const initialTime = Math.max(1, examData.durationMinutes) * 60;
    set({
      activeExam: examData,
      currentQuestionIndex: 0,
      selectedAnswers: {},
      timeRemainingSeconds: initialTime,
      isSubmitted: false,
      attemptResult: null,
      isTimerRunning: true,
      studentInfo: studentInfo || {
        studentId: "student-guest",
        studentName: "طالب المنصة",
      },
    });
  },

  selectAnswer: (questionId, answer) => {
    const { isSubmitted } = get();
    if (isSubmitted) return; // Do not allow answers after submission

    set((state) => ({
      selectedAnswers: {
        ...state.selectedAnswers,
        [questionId]: answer,
      },
    }));
  },

  nextQuestion: () => {
    const { activeExam, currentQuestionIndex } = get();
    if (!activeExam) return;
    if (currentQuestionIndex < activeExam.questions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    }
  },

  prevQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1 });
    }
  },

  goToQuestion: (index) => {
    const { activeExam } = get();
    if (!activeExam) return;
    if (index >= 0 && index < activeExam.questions.length) {
      set({ currentQuestionIndex: index });
    }
  },

  tickTimer: () => {
    const { isTimerRunning, isSubmitted, timeRemainingSeconds } = get();
    if (!isTimerRunning || isSubmitted) return;

    if (timeRemainingSeconds <= 1) {
      set({ timeRemainingSeconds: 0, isTimerRunning: false });
      get().submitExam();
    } else {
      set({ timeRemainingSeconds: timeRemainingSeconds - 1 });
    }
  },

  submitExam: () => {
    const {
      activeExam,
      selectedAnswers,
      timeRemainingSeconds,
      isSubmitted,
      attemptResult,
      studentInfo,
      userAttempts,
    } = get();

    if (!activeExam) return null;
    if (isSubmitted && attemptResult) {
      return attemptResult;
    }

    // Calculate score
    let score = 0;
    let totalPoints = 0;

    activeExam.questions.forEach((q) => {
      totalPoints += q.points;
      const studentAns = selectedAnswers[q.id];
      if (
        studentAns !== undefined &&
        String(studentAns).trim() === String(q.correctAnswer).trim()
      ) {
        score += q.points;
      }
    });

    const percentage =
      totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
    const passed = score >= activeExam.passScore;
    const totalDurationSeconds = activeExam.durationMinutes * 60;
    const durationSecondsSpent = Math.max(
      0,
      totalDurationSeconds - Math.max(0, timeRemainingSeconds)
    );

    let feedbackText = "";
    if (percentage >= 90) {
      feedbackText =
        "ما شاء الله! ممتاز جداً، إتقان فائق لقواعد اللغة العربية مع مستر عمرو عارف.";
    } else if (percentage >= 75) {
      feedbackText =
        "أداء متميز ودرجة مشرفة! راجع توضيح المعلم لبعض النقاط لتصل للدرجة الكاملة.";
    } else if (passed) {
      feedbackText =
        "أحسنت! اجتزت الاختبار بنجاح، يُفضل مراجعة الأسئلة الخاطئة لترسيخ القاعدة.";
    } else {
      feedbackText = `لم تحقق درجة النجاح المطلوبة (${activeExam.passScore} من ${totalPoints}). راجع شرح المحاضرة والمذكرة وأعد المحاولة.`;
    }

    const newAttempt: StudentExamAttempt = {
      attemptId: `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      examId: activeExam.id,
      studentId: studentInfo.studentId,
      studentName: studentInfo.studentName,
      timestamp: new Date().toISOString(),
      durationSecondsSpent,
      answers: { ...selectedAnswers },
      score,
      totalPoints,
      percentage,
      passed,
      feedbackText,
    };

    const updatedAttempts = [newAttempt, ...userAttempts];
    saveAttemptsToStorage(updatedAttempts);

    set({
      isSubmitted: true,
      isTimerRunning: false,
      attemptResult: newAttempt,
      userAttempts: updatedAttempts,
    });

    return newAttempt;
  },

  resetExam: () => {
    set({
      activeExam: null,
      currentQuestionIndex: 0,
      selectedAnswers: {},
      timeRemainingSeconds: 0,
      isSubmitted: false,
      attemptResult: null,
      isTimerRunning: false,
    });
  },

  getAttemptsForExam: (examId: string) => {
    return get().userAttempts.filter((a) => a.examId === examId);
  },

  clearAttemptHistory: () => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem(LOCAL_STORAGE_EXAM_ATTEMPTS_KEY);
    }
    set({ userAttempts: [] });
  },
}));
