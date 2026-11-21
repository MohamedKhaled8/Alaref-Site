import React from "react";
import { CheckCircle2, Circle } from "lucide-react";

export interface ExamNavigationGridProps {
  totalQuestions: number;
  currentIndex: number;
  answeredQuestionIndices: number[]; // or questions that have answers
  onSelectQuestion: (index: number) => void;
  className?: string;
}

export const ExamNavigationGrid: React.FC<ExamNavigationGridProps> = ({
  totalQuestions,
  currentIndex,
  answeredQuestionIndices,
  onSelectQuestion,
  className = "",
}) => {
  const answeredCount = answeredQuestionIndices.length;

  return (
    <div
      className={`p-4 rounded-16 bg-[#161926] border border-white/10 space-y-4 ${className}`}
      style={{ direction: "rtl" }}
    >
      {/* Header and status counts */}
      <div className="flex items-center justify-between text-xs pb-3 border-b border-white/10">
        <span className="font-bold text-white">قائمة الأسئلة</span>
        <span className="text-white/60">
          تمت الإجابة:{" "}
          <strong className="text-emerald-400 font-mono">
            {answeredCount}
          </strong>{" "}
          / {totalQuestions}
        </span>
      </div>

      {/* Grid of question badges */}
      <div className="grid grid-cols-5 sm:grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }, (_, index) => {
          const isCurrent = index === currentIndex;
          const isAnswered = answeredQuestionIndices.includes(index);

          return (
            <button
              key={index}
              type="button"
              onClick={() => onSelectQuestion(index)}
              className={`h-10 rounded-10 font-mono text-xs font-bold transition-all flex items-center justify-center relative cursor-pointer ${
                isCurrent
                  ? "bg-[#753b47] border-2 border-[#fe6257] text-white shadow-md ring-2 ring-[#fe6257]/30 scale-105"
                  : isAnswered
                  ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30"
                  : "bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white"
              }`}
              title={`السؤال رقم ${index + 1} (${
                isAnswered ? "تمت الإجابة" : "لم تتم الإجابة"
              })`}
            >
              <span>{index + 1}</span>
              {isAnswered && !isCurrent && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="pt-2 flex flex-wrap items-center justify-between text-[10px] text-white/50 gap-2 border-t border-white/5">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#fe6257]" />
          <span>السؤال الحالي</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span>تمت الإجابة</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
          <span>لم تتم الإجابة</span>
        </div>
      </div>
    </div>
  );
};
