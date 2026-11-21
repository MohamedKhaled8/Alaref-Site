import React from "react";
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  BookOpen,
  Sparkles,
  X,
} from "lucide-react";
import { StudentExamAttempt } from "../../types/educational";

export interface ExamResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  attempt: StudentExamAttempt | null;
  onReviewAnswers: () => void;
  onRetakeExam?: () => void;
  examTitle?: string;
  passScore?: number;
}

export const ExamResultModal: React.FC<ExamResultModalProps> = ({
  isOpen,
  onClose,
  attempt,
  onReviewAnswers,
  onRetakeExam,
  examTitle,
  passScore = 5,
}) => {
  if (!isOpen || !attempt) return null;

  const {
    score,
    totalPoints,
    percentage,
    passed,
    durationSecondsSpent,
    feedbackText,
  } = attempt;

  const spentMinutes = Math.floor(durationSecondsSpent / 60);
  const spentSeconds = durationSecondsSpent % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-almarai">
      <div
        className="w-full max-w-lg rounded-24 bg-[#111625] border border-white/10 shadow-2xl overflow-hidden relative text-white"
        style={{ direction: "rtl" }}
      >
        {/* Top ambient glow */}
        <div
          className={`absolute top-0 left-0 right-0 h-32 opacity-20 pointer-events-none blur-3xl ${
            passed ? "bg-emerald-500" : "bg-red-500"
          }`}
        />

        {/* Header with close button */}
        <div className="p-4 sm:p-6 pb-0 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2 text-xs text-white/50">
            <Award className="w-4 h-4 text-[#fe6257]" />
            <span>نتيجة التقييم الفوري</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-10 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 text-center space-y-6 relative z-10">
          {/* Circular Score Badge */}
          <div className="relative inline-flex items-center justify-center">
            {/* Outer Ring */}
            <div
              className={`w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center shadow-2xl relative ${
                passed
                  ? "border-emerald-400 bg-emerald-500/10 text-emerald-400"
                  : "border-red-400 bg-red-500/10 text-red-400"
              }`}
            >
              <span className="text-3xl sm:text-4xl font-black font-mono">
                {percentage}%
              </span>
              <span className="text-xs font-bold text-white/70 mt-1 font-mono">
                {score} / {totalPoints} درجة
              </span>
            </div>

            {/* Sparkle icon for celebration if passed */}
            {passed && (
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#fe6257] text-white flex items-center justify-center shadow-lg animate-bounce">
                <Sparkles className="w-4 h-4 fill-white" />
              </div>
            )}
          </div>

          {/* Outcome Status Title */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-1">
              {passed ? (
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>اجتزت الاختبار بنجاح (درجة النجاح: {passScore})</span>
                </span>
              ) : (
                <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" />
                  <span>لم تجتز درجة النجاح المطلوبة ({passScore} درجات)</span>
                </span>
              )}
            </div>

            <h3 className="text-lg sm:text-xl font-black text-white">
              {examTitle || "اختبار المحاضرة"}
            </h3>

            {/* Teacher Feedback Box */}
            <div className="p-4 rounded-16 bg-[#161926] border border-white/10 text-right space-y-1.5 mt-3">
              <span className="text-[11px] font-bold text-[#fe6257] block">
                توجيه مستر عمرو عارف:
              </span>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-almarai">
                {feedbackText}
              </p>
            </div>
          </div>

          {/* Meta Statistics */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-white/5 p-3 rounded-14 border border-white/5">
            <div className="flex items-center justify-center gap-2 text-white/70">
              <Clock className="w-3.5 h-3.5 text-[#fe6257]" />
              <span>
                الوقت المستغرق:{" "}
                <strong className="text-white font-mono" dir="ltr">
                  {spentMinutes}m {spentSeconds}s
                </strong>
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 text-white/70">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>
                الدرجة النهائية:{" "}
                <strong className="text-white font-mono">
                  {score}/{totalPoints}
                </strong>
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onReviewAnswers}
              className="w-full sm:flex-1 py-3 px-4 rounded-12 font-bold text-xs sm:text-sm text-white bg-[#753b47] hover:bg-[#854351] transition-all shadow-lg shadow-[#753b47]/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#fe6257]" />
              <span>مراجعة الإجابات بالتفصيل</span>
            </button>

            {onRetakeExam && (
              <button
                type="button"
                onClick={onRetakeExam}
                className="w-full sm:w-auto py-3 px-4 rounded-12 font-bold text-xs sm:text-sm text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة المحاولة</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto py-3 px-4 rounded-12 font-bold text-xs sm:text-sm text-white/60 hover:text-white bg-transparent hover:bg-white/5 transition-all cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
