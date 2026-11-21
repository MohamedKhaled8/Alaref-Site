import React from "react";
import { BookOpen, Check, HelpCircle } from "lucide-react";
import { ExamQuestion } from "../../types/educational";

export interface ExamQuestionViewProps {
  question: ExamQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer?: string | number;
  onSelectAnswer: (answer: string | number) => void;
  disabled?: boolean;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  نحو: {
    bg: "bg-[#753b47]/20",
    text: "text-[#fe6257]",
    border: "border-[#fe6257]/30",
  },
  بلاغة: {
    bg: "bg-purple-500/20",
    text: "text-purple-300",
    border: "border-purple-500/30",
  },
  نصوص: {
    bg: "bg-emerald-500/20",
    text: "text-emerald-300",
    border: "border-emerald-500/30",
  },
  قراءة: {
    bg: "bg-blue-500/20",
    text: "text-blue-300",
    border: "border-blue-500/30",
  },
  إملاء: {
    bg: "bg-amber-500/20",
    text: "text-amber-300",
    border: "border-amber-500/30",
  },
  قصة: {
    bg: "bg-rose-500/20",
    text: "text-rose-300",
    border: "border-rose-500/30",
  },
};

const ARABIC_OPTION_LETTERS = ["أ", "ب", "ج", "د", "هـ"];

export const ExamQuestionView: React.FC<ExamQuestionViewProps> = ({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  disabled = false,
}) => {
  const catStyle =
    CATEGORY_COLORS[question.category] || CATEGORY_COLORS["نحو"];

  // Options handling: if options provided, use them; if true_false, supply default
  const options =
    question.options && question.options.length > 0
      ? question.options
      : question.type === "true_false"
      ? ["صواب", "خطأ"]
      : [];

  return (
    <div className="space-y-5" style={{ direction: "rtl" }}>
      {/* Question Header & Meta */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-10 bg-[#753b47] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
            {questionNumber}
          </span>
          <span className="text-xs text-white/50">
            من إجمالي {totalQuestions} أسئلة
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-1 rounded-8 text-[11px] font-bold border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
          >
            {question.category}
          </span>
          <span className="px-2 py-0.5 rounded-6 bg-white/5 border border-white/10 text-[11px] text-white/60 font-mono">
            {question.points} {question.points === 1 ? "درجة" : "درجات"}
          </span>
        </div>
      </div>

      {/* Passage Box (if present) */}
      {question.passage && (
        <div className="p-4 sm:p-5 rounded-16 bg-[#161926] border border-white/10 relative overflow-hidden space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#fe6257]">
            <BookOpen className="w-4 h-4" />
            <span>سياق القطعة النحوية / الأدبية:</span>
          </div>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-almarai pr-2 border-r-2 border-[#fe6257]/40">
            {question.passage}
          </p>
        </div>
      )}

      {/* Question Prompt */}
      <div className="space-y-2">
        <h3 className="text-sm sm:text-base font-bold text-white leading-relaxed">
          {question.prompt}
        </h3>
      </div>

      {/* Selectable Options */}
      <div className="space-y-3 pt-2">
        {options.map((optionText, index) => {
          // Compare both index-based and string-based equality
          const isSelected =
            selectedAnswer !== undefined &&
            (selectedAnswer === index ||
              String(selectedAnswer).trim() === String(optionText).trim() ||
              (question.type === "true_false" &&
                ((selectedAnswer === 0 && optionText === "صواب") ||
                  (selectedAnswer === 1 && optionText === "خطأ"))));

          const letter = ARABIC_OPTION_LETTERS[index] || `${index + 1}`;

          return (
            <button
              key={index}
              type="button"
              disabled={disabled}
              onClick={() => onSelectAnswer(index)}
              className={`w-full p-3.5 sm:p-4 rounded-14 border text-right transition-all flex items-center justify-between gap-3 cursor-pointer group ${
                isSelected
                  ? "bg-[#753b47]/25 border-[#fe6257] shadow-[0_0_20px_rgba(254,98,87,0.15)] ring-1 ring-[#fe6257]"
                  : "bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-white/80 hover:text-white"
              } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span
                  className={`w-7 h-7 rounded-8 flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                    isSelected
                      ? "bg-[#fe6257] text-white"
                      : "bg-white/10 text-white/60 group-hover:bg-white/15 group-hover:text-white"
                  }`}
                >
                  {letter}
                </span>

                <span
                  className={`text-xs sm:text-sm font-medium ${
                    isSelected ? "text-white font-bold" : "text-white/80"
                  }`}
                >
                  {optionText}
                </span>
              </div>

              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                  isSelected
                    ? "bg-[#fe6257] border-[#fe6257] text-white"
                    : "border-white/20 group-hover:border-white/40"
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
