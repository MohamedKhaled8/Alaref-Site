import React from "react";
import {
  Award,
  CheckCircle2,
  Clock,
  MessageSquareQuote,
  FileCheck,
  Calendar,
} from "lucide-react";
import { AssignmentSubmission } from "../../types/educational";

export interface AssignmentFeedbackCardProps {
  submission: AssignmentSubmission;
  maxScore?: number;
}

export const AssignmentFeedbackCard: React.FC<AssignmentFeedbackCardProps> = ({
  submission,
  maxScore = 20,
}) => {
  const isGraded = submission.status === "graded" && submission.score !== undefined;

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("ar-EG", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className="p-5 rounded-20 bg-[#161926] border border-white/10 space-y-4"
      style={{ direction: "rtl" }}
    >
      {/* Status Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          {isGraded ? (
            <div className="w-8 h-8 rounded-10 bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-10 bg-[#fe6257]/20 text-[#fe6257] flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
          )}

          <div>
            <h4 className="font-bold text-xs sm:text-sm text-white">
              {isGraded ? "تم تصحيح الواجب والتقييم" : "تم تسليم الواجب بنجاح"}
            </h4>
            <span className="text-[11px] text-white/50 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>تاريخ التسليم: {formatDate(submission.submittedAt)}</span>
            </span>
          </div>
        </div>

        {isGraded ? (
          <div className="text-left font-mono">
            <span className="text-xl sm:text-2xl font-black text-emerald-400">
              {submission.score}
            </span>
            <span className="text-xs text-white/50"> / {maxScore}</span>
          </div>
        ) : (
          <span className="px-2.5 py-1 rounded-8 bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-bold">
            في انتظار التصحيح
          </span>
        )}
      </div>

      {/* Submitted File Info */}
      <div className="p-3 rounded-12 bg-black/30 border border-white/5 flex items-center justify-between text-xs text-white/70">
        <span className="truncate max-w-[70%]">
          الملف المرفق: <strong className="text-white">{submission.fileName}</strong>
        </span>
        <span className="text-[10px] text-emerald-400 font-bold">
          ✓ موثق
        </span>
      </div>

      {/* Student Notes (if any) */}
      {submission.studentNotes && (
        <div className="text-xs text-white/60">
          <span className="font-bold text-white/80 block mb-0.5">ملاحظتك للمدرس:</span>
          <p className="font-almarai italic bg-white/5 p-2.5 rounded-10 border border-white/5">
            «{submission.studentNotes}»
          </p>
        </div>
      )}

      {/* Teacher's Feedback Box (if graded) */}
      {isGraded && submission.teacherFeedback && (
        <div className="p-4 rounded-16 bg-[#1f1a26] border border-[#fe6257]/30 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#fe6257]">
            <MessageSquareQuote className="w-4 h-4" />
            <span>ملاحظات وتصحيح مستر عمرو عارف:</span>
          </div>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-almarai pr-2 border-r-2 border-[#fe6257]">
            {submission.teacherFeedback}
          </p>
          {submission.gradedAt && (
            <span className="text-[10px] text-white/40 block text-left">
              تاريخ الاعتماد: {formatDate(submission.gradedAt)}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
