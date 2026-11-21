/**
 * Al Aref Academy - Educational Modules Types
 * Milestone 3: Exams, Summaries & Assignments (R3, F16-F22)
 *
 * Conforms to platform domain model: Arabic language instruction
 * (نحو، بلاغة، نصوص، قراءة متحررة، قصة، إملاء)
 */

export type QuestionType = "mcq" | "true_false" | "short_text";

export type QuestionCategory =
  | "نحو"
  | "بلاغة"
  | "نصوص"
  | "قراءة"
  | "قصة"
  | "إملاء";

export interface ExamQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  passage?: string; // قطعة النحو أو بيت الشعر أو النص القرائي
  options?: string[]; // خيارات الإجابة (للاختيار من متعدد)
  correctAnswer: string | number; // الفهرس (0-3) أو النص الصحيح
  explanation: string; // تعليل مستر عمرو عارف النحوي أو البلاغي
  points: number;
  category: QuestionCategory;
}

export interface ExamData {
  id: string;
  lessonId: string;
  courseId: string;
  title: string;
  instructions: string;
  durationMinutes: number;
  passScore: number;
  maxAttempts: number;
  questions: ExamQuestion[];
}

export interface StudentExamAttempt {
  attemptId: string;
  examId: string;
  studentId: string;
  studentName?: string;
  timestamp: string;
  durationSecondsSpent: number;
  answers: Record<string, string | number>; // questionId -> studentAnswer
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  feedbackText: string;
}

export type SummaryType = "mindmap" | "cheat_sheet" | "full_notes";

export interface VocabularyItem {
  word: string;
  meaning: string;
  opposite?: string;
  context?: string;
}

export interface GrammarRuleItem {
  rule: string;
  example: string;
  parsing: string; // إعراب تفصيلي
  notes?: string;
}

export interface LessonSummaryItem {
  id: string;
  lessonId: string;
  courseId: string;
  title: string;
  summaryType: SummaryType;
  totalPages: number;
  fileSizeText: string;
  pdfUrl: string;
  isFreePreview: boolean;
  keyPoints: string[];
  vocabularyTable?: VocabularyItem[];
  grammarRules?: GrammarRuleItem[];
  mindMapUrl?: string;
}

export interface AssignmentItem {
  id: string;
  lessonId: string;
  courseId: string;
  title: string;
  dueDate: string;
  maxScore: number;
  instructions: string;
  passagePrompt: string; // قطعة الواجب المطلوب إعرابها وحلها
  allowedFileTypes: string[]; // ["pdf", "docx", "doc", "jpg", "png", "webp"]
  maxFileSizeMB: number; // e.g. 10
}

export interface AssignmentSubmission {
  submissionId: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  status: "pending" | "submitted" | "graded";
  fileName: string;
  fileSize: number; // in bytes
  fileUrl: string;
  studentNotes?: string;
  score?: number;
  teacherFeedback?: string;
  gradedAt?: string;
}
