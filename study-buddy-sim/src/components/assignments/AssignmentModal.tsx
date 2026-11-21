import React, { useState, useMemo } from "react";
import {
  X,
  FileCheck,
  Calendar,
  Award,
  BookOpen,
  Send,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { AssignmentItem } from "../../types/educational";
import {
  useAssignmentStore,
  FilePayload,
} from "../../stores/useAssignmentStore";
import { useAuthStore } from "../../stores/useAuthStore";
import {
  getAssignmentById,
  getAssignmentByLessonId,
} from "../../data/mockAssignments";
import { FileUploadDropzone } from "./FileUploadDropzone";
import { AssignmentFeedbackCard } from "./AssignmentFeedbackCard";

export interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignmentId?: string;
  lessonId?: string;
  customAssignment?: AssignmentItem;
  courseTitle?: string;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({
  isOpen,
  onClose,
  assignmentId,
  lessonId,
  customAssignment,
  courseTitle,
}) => {
  const { user } = useAuthStore();
  const { submissions, submitAssignment } = useAssignmentStore();

  const [selectedFile, setSelectedFile] = useState<FilePayload | null>(null);
  const [studentNotes, setStudentNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showReuploadForm, setShowReuploadForm] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Target assignment lookup
  const assignment: AssignmentItem | undefined = useMemo(() => {
    if (customAssignment) return customAssignment;
    if (assignmentId) return getAssignmentById(assignmentId);
    if (lessonId) return getAssignmentByLessonId(lessonId);
    return getAssignmentById("assign-200");
  }, [customAssignment, assignmentId, lessonId]);

  if (!isOpen || !assignment) return null;

  const existingSubmission = submissions[assignment.id];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!selectedFile) {
      setSubmitError("يرجى اختيار ملف الواجب قبل الضغط على زر التسليم.");
      return;
    }

    setIsSubmitting(true);

    const result = submitAssignment(assignment.id, {
      studentId: user?.id || "student-guest",
      studentName: user?.name || "طالب المنصة",
      file: selectedFile,
      notes: studentNotes.trim() || undefined,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setSubmitError(result.error || "فشل تسليم الواجب. يرجى المحاولة لاحقاً.");
    } else {
      setShowReuploadForm(false);
      setSelectedFile(null);
      setStudentNotes("");
    }
  };

  const formatDueDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("ar-EG", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200 font-almarai">
      <div
        className="w-full max-w-3xl max-h-[92vh] flex flex-col rounded-24 bg-[#0c101c] border border-white/10 shadow-2xl overflow-hidden text-white"
        style={{ direction: "rtl" }}
      >
        {/* Header */}
        <header className="p-4 sm:p-5 border-b border-white/10 bg-[#111625] flex items-center justify-between shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-12 bg-[#fe6257]/15 text-[#fe6257] border border-[#fe6257]/30 flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="font-black text-sm sm:text-base text-white truncate">
                {assignment.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-white/50 truncate">
                <span>{courseTitle || "منصة مستر عمرو عارف"}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-300">
                  <Calendar className="w-3 h-3" />
                  <span>آخر موعد: {formatDueDate(assignment.dueDate)}</span>
                </span>
                <span>•</span>
                <span className="text-emerald-400 font-mono">
                  الدرجة: {assignment.maxScore} درجة
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-10 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Instructions & Passage Prompt */}
          <div className="p-4 sm:p-5 rounded-18 bg-[#161926] border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#fe6257]">
              <BookOpen className="w-4 h-4" />
              <span>نص التكليف والقطعة المطلوبة:</span>
            </div>

            <p className="text-xs text-white/70 leading-relaxed font-almarai">
              {assignment.instructions}
            </p>

            <div className="p-4 rounded-14 bg-black/40 border border-white/5 text-xs sm:text-sm text-white/90 leading-relaxed whitespace-pre-line font-almarai border-r-2 border-[#fe6257]">
              {assignment.passagePrompt}
            </div>
          </div>

          {/* If already submitted and not re-uploading, show feedback card */}
          {existingSubmission && !showReuploadForm ? (
            <div className="space-y-4">
              <AssignmentFeedbackCard
                submission={existingSubmission}
                maxScore={assignment.maxScore}
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowReuploadForm(true)}
                  className="px-4 py-2 rounded-10 text-xs font-bold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>تسليم ملف جديد (إعادة التسليم)</span>
                </button>
              </div>
            </div>
          ) : (
            /* Upload & Submission Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-white block">
                  رفع ملف الإجابة:
                </label>
                <FileUploadDropzone
                  onFileSelected={setSelectedFile}
                  selectedFile={selectedFile}
                  disabled={isSubmitting}
                />
              </div>

              {/* Student Notes */}
              <div className="space-y-1.5">
                <label
                  htmlFor="student-notes"
                  className="text-xs font-bold text-white/80 block"
                >
                  ملاحظات أو أسئلة إضافية للأستاذ (اختياري):
                </label>
                <textarea
                  id="student-notes"
                  value={studentNotes}
                  onChange={(e) => setStudentNotes(e.target.value)}
                  placeholder="اكتب هنا أي استفسار نحوي أو جملة تود من مستر عمرو عارف مراجعتها معك بشكل خاص..."
                  rows={3}
                  className="w-full p-3 rounded-12 bg-white/5 border border-white/10 focus:border-[#fe6257] text-xs text-white placeholder-white/30 focus:outline-none transition-all resize-none font-almarai"
                  disabled={isSubmitting}
                />
              </div>

              {/* Error message */}
              {submitError && (
                <div className="p-3 rounded-10 bg-red-500/15 border border-red-500/30 text-xs text-red-300">
                  {submitError}
                </div>
              )}

              {/* Form Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                {showReuploadForm && (
                  <button
                    type="button"
                    onClick={() => setShowReuploadForm(false)}
                    className="px-4 py-2.5 rounded-12 text-xs font-bold text-white/60 hover:text-white cursor-pointer"
                  >
                    إلغاء والعودة للواجب المسلم
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !selectedFile}
                  className="mr-auto px-6 py-3 rounded-12 font-bold text-xs sm:text-sm text-white bg-[#753b47] hover:bg-[#854351] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#753b47]/30 flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-[#fe6257]" />
                  <span>{isSubmitting ? "جارِ التسليم..." : "تسليم الواجب الآن"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
