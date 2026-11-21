import React, { useEffect, useState, useMemo } from "react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { ExamData } from "../../types/educational";
import { useExamStore } from "../../stores/useExamStore";
import { useAuthStore } from "../../stores/useAuthStore";
import { getExamById, getExamByLessonId } from "../../data/mockExams";
import { ExamTimer } from "./ExamTimer";
import { ExamQuestionView } from "./ExamQuestionView";
import { ExamNavigationGrid } from "./ExamNavigationGrid";
import { ExamResultModal } from "./ExamResultModal";
import { ExamReviewModal } from "./ExamReviewModal";

export interface ExamPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  examId?: string;
  lessonId?: string;
  customExam?: ExamData;
}

export const ExamPlayerModal: React.FC<ExamPlayerModalProps> = ({
  isOpen,
  onClose,
  examId,
  lessonId,
  customExam,
}) => {
  const { user } = useAuthStore();
  const {
    activeExam,
    currentQuestionIndex,
    selectedAnswers,
    timeRemainingSeconds,
    isSubmitted,
    attemptResult,
    isTimerRunning,
    startExam,
    selectAnswer,
    nextQuestion,
    prevQuestion,
    goToQuestion,
    tickTimer,
    submitExam,
    resetExam,
  } = useExamStore();

  const [isConfirmSubmitOpen, setIsConfirmSubmitOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // Determine which exam to load
  const targetExam: ExamData | undefined = useMemo(() => {
    if (customExam) return customExam;
    if (examId) return getExamById(examId);
    if (lessonId) return getExamByLessonId(lessonId);
    return getExamById("quiz-62");
  }, [customExam, examId, lessonId]);

  // Start exam session on open
  useEffect(() => {
    if (isOpen && targetExam) {
      // If we don't already have this exam active in the store or if it was previously submitted
      if (!activeExam || activeExam.id !== targetExam.id || isSubmitted) {
        startExam(targetExam, {
          studentId: user?.id || "student-guest",
          studentName: user?.name || "طالب المنصة",
        });
      }
    }
  }, [isOpen, targetExam, user]);

  // Interval timer ticker
  useEffect(() => {
    if (!isOpen || !isTimerRunning || isSubmitted) return;

    const timer = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isTimerRunning, isSubmitted, tickTimer]);

  if (!isOpen || !activeExam) return null;

  const currentQuestion = activeExam.questions[currentQuestionIndex];
  const totalQuestions = activeExam.questions.length;

  // Calculate answered indices
  const answeredQuestionIndices = activeExam.questions
    .map((q, idx) => (selectedAnswers[q.id] !== undefined ? idx : -1))
    .filter((idx) => idx !== -1);

  const unansweredCount = totalQuestions - answeredQuestionIndices.length;

  const handleConfirmSubmit = () => {
    setIsConfirmSubmitOpen(false);
    submitExam();
  };

  const handleRetake = () => {
    if (targetExam) {
      startExam(targetExam, {
        studentId: user?.id || "student-guest",
        studentName: user?.name || "طالب المنصة",
      });
    }
  };

  const handleCloseAll = () => {
    setIsConfirmSubmitOpen(false);
    setIsReviewOpen(false);
    resetExam();
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-200 font-almarai">
        <div
          className="w-full h-full flex flex-col bg-[#0c101c] text-white overflow-hidden"
          style={{ direction: "rtl" }}
        >
          {/* Top Bar */}
          <header className="h-16 px-4 sm:px-6 border-b border-white/10 bg-[#111625] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-12 bg-[#753b47]/30 text-[#fe6257] border border-[#fe6257]/30 flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-black text-sm sm:text-base text-white line-clamp-1">
                    {activeExam.title}
                  </h2>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-6 bg-[#fe6257]/15 text-[#fe6257] text-[10px] font-bold">
                    اختبار إلكتروني
                  </span>
                </div>
                <p className="text-xs text-white/50">
                  مستر عمرو عارف • درجة النجاح: {activeExam.passScore} من {totalQuestions}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Countdown Timer */}
              <ExamTimer timeRemainingSeconds={timeRemainingSeconds} />

              {/* Close Button */}
              <button
                type="button"
                onClick={handleCloseAll}
                className="p-2 rounded-12 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
                title="إغلاق الاختبار"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Progress Indicator Bar */}
          <div className="w-full h-1 bg-white/5 relative">
            <div
              className="h-full bg-gradient-to-r from-[#753b47] to-[#fe6257] transition-all duration-300"
              style={{
                width: `${
                  ((currentQuestionIndex + 1) / totalQuestions) * 100
                }%`,
              }}
            />
          </div>

          {/* Body Workspace: Responsive 2-Column Split */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Center Area: Current Question View */}
            <main className="flex-1 flex flex-col justify-between overflow-y-auto p-4 sm:p-8 max-w-3xl mx-auto w-full">
              {currentQuestion ? (
                <div className="space-y-6">
                  <ExamQuestionView
                    question={currentQuestion}
                    questionNumber={currentQuestionIndex + 1}
                    totalQuestions={totalQuestions}
                    selectedAnswer={selectedAnswers[currentQuestion.id]}
                    onSelectAnswer={(ans) =>
                      selectAnswer(currentQuestion.id, ans)
                    }
                    disabled={isSubmitted}
                  />
                </div>
              ) : (
                <div className="text-center text-white/50 p-8">
                  لا يوجد سؤال متاح.
                </div>
              )}

              {/* Question Navigation Bottom Strip */}
              <div className="pt-8 flex items-center justify-between gap-3 border-t border-white/10 mt-8">
                <button
                  type="button"
                  onClick={prevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2.5 rounded-12 font-bold text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>السؤال السابق</span>
                </button>

                {currentQuestionIndex < totalQuestions - 1 ? (
                  <button
                    type="button"
                    onClick={nextQuestion}
                    className="px-5 py-2.5 rounded-12 font-bold text-xs bg-[#753b47] hover:bg-[#854351] text-white transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <span>السؤال التالي</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsConfirmSubmitOpen(true)}
                    className="px-6 py-2.5 rounded-12 font-black text-xs bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-lg shadow-emerald-900/40 flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>إنهاء وتسليم الاختبار</span>
                  </button>
                )}
              </div>
            </main>

            {/* Side Navigation Grid (Sidebar on Desktop) */}
            <aside className="w-full lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-r border-white/10 bg-[#111625] p-4 sm:p-6 flex flex-col justify-between shrink-0 overflow-y-auto">
              <div className="space-y-4">
                <ExamNavigationGrid
                  totalQuestions={totalQuestions}
                  currentIndex={currentQuestionIndex}
                  answeredQuestionIndices={answeredQuestionIndices}
                  onSelectQuestion={goToQuestion}
                />
              </div>

              {/* Submit Button in Sidebar */}
              <div className="pt-4 border-t border-white/10 mt-6 space-y-2">
                <button
                  type="button"
                  onClick={() => setIsConfirmSubmitOpen(true)}
                  className="w-full py-3 px-4 rounded-12 font-bold text-xs text-white bg-[#753b47] hover:bg-[#854351] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <CheckCircle className="w-4 h-4 text-[#fe6257]" />
                  <span>تسليم الإجابات وإنهاء الاختبار</span>
                </button>
                {unansweredCount > 0 && (
                  <p className="text-[11px] text-amber-400 text-center">
                    تنبيه: متبقي لديك {unansweredCount} أسئلة لم تُجب عليها بعد.
                  </p>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      {isConfirmSubmitOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div
            className="w-full max-w-md rounded-20 bg-[#161926] border border-white/10 p-6 space-y-4 text-center text-white"
            style={{ direction: "rtl" }}
          >
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-black text-base text-white">
                هل أنت متأكد من تسليم الإجابات الآن؟
              </h3>
              <p className="text-xs text-white/60">
                {unansweredCount > 0
                  ? `لديك ${unansweredCount} أسئلة لم يتم الإجابة عليها. لن تتمكن من تعديل إجاباتك بعد التسليم.`
                  : "لقد أجبت عن جميع الأسئلة! سيتم احتساب درجتك وعرض النتيجة والتعليق التربوي فوراً."}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleConfirmSubmit}
                className="flex-1 py-2.5 rounded-12 font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer"
              >
                نعم، إنهاء وتسليم
              </button>
              <button
                type="button"
                onClick={() => setIsConfirmSubmitOpen(false)}
                className="flex-1 py-2.5 rounded-12 font-bold text-xs bg-white/10 hover:bg-white/15 text-white transition-all cursor-pointer"
              >
                متابعة الحل
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result Celebration Modal */}
      <ExamResultModal
        isOpen={isSubmitted && !isReviewOpen}
        onClose={handleCloseAll}
        attempt={attemptResult}
        examTitle={activeExam.title}
        passScore={activeExam.passScore}
        onReviewAnswers={() => setIsReviewOpen(true)}
        onRetakeExam={handleRetake}
      />

      {/* Detailed Review Modal */}
      {attemptResult && (
        <ExamReviewModal
          isOpen={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
          exam={activeExam}
          attempt={attemptResult}
        />
      )}
    </>
  );
};
