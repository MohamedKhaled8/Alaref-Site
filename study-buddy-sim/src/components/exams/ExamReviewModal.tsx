import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BookOpen,
  Filter,
  Sparkles,
} from "lucide-react";
import { ExamData, StudentExamAttempt } from "../../types/educational";

export interface ExamReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: ExamData;
  attempt: StudentExamAttempt;
}

export const ExamReviewModal: React.FC<ExamReviewModalProps> = ({
  isOpen,
  onClose,
  exam,
  attempt,
}) => {
  const [filterMode, setFilterMode] = useState<"all" | "correct" | "incorrect">(
    "all"
  );

  if (!isOpen) return null;

  const questionsWithStatus = exam.questions.map((q, idx) => {
    const studentAns = attempt.answers[q.id];
    const isCorrect =
      studentAns !== undefined &&
      String(studentAns).trim() === String(q.correctAnswer).trim();
    return {
      question: q,
      index: idx,
      studentAns,
      isCorrect,
    };
  });

  const filtered = questionsWithStatus.filter((item) => {
    if (filterMode === "correct") return item.isCorrect;
    if (filterMode === "incorrect") return !item.isCorrect;
    return true;
  });

  const correctCount = questionsWithStatus.filter((i) => i.isCorrect).length;
  const incorrectCount = questionsWithStatus.length - correctCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200 font-almarai">
      <div
        className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-24 bg-[#0c101c] border border-white/10 shadow-2xl overflow-hidden text-white"
        style={{ direction: "rtl" }}
      >
        {/* Modal Header */}
        <header className="p-4 sm:p-5 border-b border-white/10 bg-[#111625] flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-6 bg-[#fe6257]/20 text-[#fe6257] text-xs font-bold">
                مراجعة الإجابات
              </span>
              <h2 className="font-black text-sm sm:text-base text-white">
                {exam.title}
              </h2>
            </div>
            <p className="text-xs text-white/50 mt-0.5">
              درجتك:{" "}
              <strong className="text-emerald-400 font-mono">
                {attempt.score}/{attempt.totalPoints}
              </strong>{" "}
              ({attempt.percentage}%) • الإجابات الصحيحة: {correctCount} • الأخطاء:{" "}
              {incorrectCount}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-12 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Filter Bar */}
        <div className="px-4 sm:px-6 py-3 border-b border-white/5 bg-[#161926] flex items-center justify-between gap-3 flex-wrap shrink-0">
          <div className="flex items-center gap-2 text-xs text-white/60">
            <Filter className="w-3.5 h-3.5 text-[#fe6257]" />
            <span>تصفية الأسئلة:</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setFilterMode("all")}
              className={`px-3 py-1 rounded-8 font-bold transition-all cursor-pointer ${
                filterMode === "all"
                  ? "bg-[#753b47] text-white shadow-sm"
                  : "bg-white/5 text-white/60 hover:text-white"
              }`}
            >
              الكل ({questionsWithStatus.length})
            </button>
            <button
              onClick={() => setFilterMode("correct")}
              className={`px-3 py-1 rounded-8 font-bold transition-all cursor-pointer ${
                filterMode === "correct"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white/5 text-emerald-400/70 hover:text-emerald-400"
              }`}
            >
              الصحيحة ({correctCount})
            </button>
            <button
              onClick={() => setFilterMode("incorrect")}
              className={`px-3 py-1 rounded-8 font-bold transition-all cursor-pointer ${
                filterMode === "incorrect"
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-white/5 text-red-400/70 hover:text-red-400"
              }`}
            >
              الأخطاء ({incorrectCount})
            </button>
          </div>
        </div>

        {/* Review Questions Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-white/50 text-xs">
              لا توجد أسئلة تطابق التصفية المختارة.
            </div>
          ) : (
            filtered.map(({ question, index, studentAns, isCorrect }) => {
              const options =
                question.options && question.options.length > 0
                  ? question.options
                  : question.type === "true_false"
                  ? ["صواب", "خطأ"]
                  : [];

              return (
                <div
                  key={question.id}
                  className={`p-4 sm:p-5 rounded-20 border transition-all ${
                    isCorrect
                      ? "bg-[#111625] border-emerald-500/30"
                      : "bg-[#161420] border-red-500/30"
                  }`}
                >
                  {/* Top Question Status Line */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/5 gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-7 h-7 rounded-8 flex items-center justify-center text-xs font-bold font-mono ${
                          isCorrect
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className="text-xs text-white/60">
                        {question.category} • {question.points} درجة
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      {isCorrect ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>إجابة صحيحة</span>
                        </span>
                      ) : (
                        <span className="text-red-400 flex items-center gap-1">
                          <XCircle className="w-4 h-4" />
                          <span>إجابة غير صحيحة</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Passage snippet (if any) */}
                  {question.passage && (
                    <div className="mt-3 p-3 rounded-12 bg-black/30 border border-white/5 text-xs text-white/80 leading-relaxed font-almarai border-r-2 border-[#fe6257]">
                      {question.passage}
                    </div>
                  )}

                  {/* Question Prompt */}
                  <h4 className="mt-3 text-sm sm:text-base font-bold text-white leading-relaxed">
                    {question.prompt}
                  </h4>

                  {/* Options with Answer Highlights */}
                  <div className="mt-4 space-y-2">
                    {options.map((optText, optIdx) => {
                      const isCanonicalCorrect =
                        optIdx === question.correctAnswer ||
                        String(optText).trim() ===
                          String(question.correctAnswer).trim() ||
                        (question.type === "true_false" &&
                          ((question.correctAnswer === 0 && optText === "صواب") ||
                            (question.correctAnswer === 1 &&
                              optText === "خطأ")));

                      const isStudentChoice =
                        studentAns !== undefined &&
                        (studentAns === optIdx ||
                          String(studentAns).trim() === String(optText).trim() ||
                          (question.type === "true_false" &&
                            ((studentAns === 0 && optText === "صواب") ||
                              (studentAns === 1 && optText === "خطأ"))));

                      let badgeClass =
                        "bg-white/5 border-white/10 text-white/70";
                      let indicatorText = null;

                      if (isCanonicalCorrect) {
                        badgeClass =
                          "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold shadow-sm";
                        indicatorText = "الإجابة الصحيحة المعتمدة";
                      } else if (isStudentChoice && !isCorrect) {
                        badgeClass =
                          "bg-red-500/20 border-red-500 text-red-300 line-through font-medium";
                        indicatorText = "إجابتك السابقة";
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`p-3 rounded-12 border text-xs sm:text-sm flex items-center justify-between gap-3 ${badgeClass}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-6 bg-black/30 flex items-center justify-center font-mono text-xs">
                              {optIdx + 1}
                            </span>
                            <span>{optText}</span>
                          </div>

                          {indicatorText && (
                            <span className="text-[10px] px-2 py-0.5 rounded-4 bg-black/40 font-bold shrink-0">
                              {indicatorText}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Teacher's Pedagogical Explanation */}
                  {question.explanation && (
                    <div className="mt-4 p-3.5 rounded-14 bg-[#1f1a26] border border-[#fe6257]/30 text-right space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#fe6257]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>توضيح مستر عمرو عارف النحوي / البلاغي:</span>
                      </div>
                      <p className="text-xs text-white/90 leading-relaxed font-almarai pr-2">
                        {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <footer className="p-4 border-t border-white/10 bg-[#111625] flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-12 bg-[#753b47] hover:bg-[#854351] text-white font-bold text-xs transition-all cursor-pointer"
          >
            إغلاق المراجعة
          </button>
        </footer>
      </div>
    </div>
  );
};
