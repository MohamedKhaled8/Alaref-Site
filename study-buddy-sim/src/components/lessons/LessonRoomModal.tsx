import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Play,
  FileText,
  HelpCircle,
  Lock,
  CheckCircle2,
  Download,
  BookOpen,
  MessageSquare,
  Clock,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Sparkles,
  Layers,
  FileCheck,
  Eye,
} from "lucide-react";
import { CourseItem, LessonItem, CurriculumUnit } from "../../data/mockData";
import { CourseAccessGuard } from "../auth/CourseAccessGuard";
import { ProtectedVideoPlayer } from "../video/ProtectedVideoPlayer";
import { videoSecurityService } from "../../services/videoSecurityService";
import { VideoSourceManifest, TimestampedNote } from "../../types/video";
import { useVideoPlayerStore } from "../../stores/useVideoPlayerStore";
import { ExamPlayerModal } from "../exams/ExamPlayerModal";
import { SummaryViewerModal } from "../summaries/SummaryViewerModal";
import { SummaryDownloadButton } from "../summaries/SummaryDownloadButton";
import { AssignmentModal } from "../assignments/AssignmentModal";
import { getSummaryByLessonId } from "../../data/mockSummaries";
import { getAssignmentByLessonId } from "../../data/mockAssignments";

export interface LessonRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: CourseItem;
  initialLessonId?: string;
  onRequireAuth?: () => void;
  onRequireEnroll?: (courseId: string, course?: CourseItem | null) => void;
  onOpenExam?: (quizId: string) => void;
}

export const LessonRoomModal: React.FC<LessonRoomModalProps> = ({
  isOpen,
  onClose,
  course,
  initialLessonId,
  onRequireAuth,
  onRequireEnroll,
  onOpenExam,
}) => {
  // Find all lessons across all units
  const allLessons = useMemo(() => {
    return course.units.flatMap((u) => u.lessons);
  }, [course.units]);

  // Active lesson state
  const [activeLessonId, setActiveLessonId] = useState<string>(() => {
    if (initialLessonId && allLessons.some((l) => l.id === initialLessonId)) {
      return initialLessonId;
    }
    return allLessons[0]?.id || "";
  });

  // Track completed lessons locally
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(
    new Set()
  );

  // Active footer tab: "notes" | "summaries" | "exam" | "assignment" | "questions"
  const [activeTab, setActiveTab] = useState<
    "notes" | "summaries" | "exam" | "assignment" | "questions"
  >("notes");

  // Educational module dialogs
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);

  // Expanded units accordion state
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({
    [course.units[0]?.id || ""]: true,
  });

  const seek = useVideoPlayerStore((s) => s.seek);

  // Sync initialLessonId when opened
  useEffect(() => {
    if (initialLessonId && allLessons.some((l) => l.id === initialLessonId)) {
      setActiveLessonId(initialLessonId);
    }
  }, [initialLessonId, allLessons]);

  const activeLesson: LessonItem | undefined = useMemo(() => {
    return allLessons.find((l) => l.id === activeLessonId) || allLessons[0];
  }, [allLessons, activeLessonId]);

  // Construct VideoSourceManifest for active lesson
  const videoManifest: VideoSourceManifest = useMemo(() => {
    const lessonTitle = activeLesson?.title || course.title;
    const isFree = Boolean(activeLesson?.isFreePreview || course.isFree);

    return videoSecurityService.getMockStreamManifest(activeLesson?.id || "les-default", {
      title: lessonTitle,
      courseTitle: course.title,
      gradeName: course.gradeName,
      durationMinutes: activeLesson?.durationMinutes || 40,
      isFreePreview: isFree,
      format: "hls", // Adaptive HLS streaming
    });
  }, [activeLesson, course]);

  // Retrieve matching summary and assignment models
  const activeSummary = useMemo(() => {
    return getSummaryByLessonId(activeLesson?.id || "les-200");
  }, [activeLesson]);

  const activeAssignment = useMemo(() => {
    return getAssignmentByLessonId(activeLesson?.id || "les-200");
  }, [activeLesson]);

  if (!isOpen) return null;

  const toggleUnit = (unitId: string) => {
    setExpandedUnits((prev) => ({
      ...prev,
      [unitId]: !prev[unitId],
    }));
  };

  const handleLessonEnd = () => {
    if (activeLesson) {
      setCompletedLessonIds((prev) => new Set(prev).add(activeLesson.id));
    }
  };

  const handleSeekToNote = (timeSeconds: number) => {
    seek(timeSeconds);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-200 font-almarai">
      <div
        className="w-full h-full flex flex-col bg-[#0c101c] text-white overflow-hidden"
        style={{ direction: "rtl" }}
      >
        {/* Top Navigation Bar */}
        <header className="h-16 px-4 sm:px-6 border-b border-white/10 bg-[#111625] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-12 bg-[#753b47]/30 text-[#fe6257] border border-[#fe6257]/30 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-sm sm:text-base text-white line-clamp-1">
                  {course.title}
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-6 bg-[#fe6257]/15 text-[#fe6257] text-[10px] font-bold">
                  {course.gradeName}
                </span>
              </div>
              <p className="text-xs text-white/50 flex items-center gap-1.5">
                <span>مستر عمرو عارف • أستاذ اللغة العربية</span>
                <span className="text-white/20">•</span>
                <span className="text-emerald-400">غرفة المحاضرات الذكية</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-12 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
              title="إغلاق غرفة الدرس"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Workspace Body: 2-Column Split (Center Video + Left Syllabus) */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Main Left Area: Video Player & Tabs */}
          <main className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Active Lesson Header Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-16 bg-[#161926] border border-white/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-6 text-[10px] font-bold bg-[#753b47] text-white">
                    الدرس الحالي
                  </span>
                  {activeLesson?.isFreePreview && (
                    <span className="px-2 py-0.5 rounded-6 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      معاينة مجانية
                    </span>
                  )}
                </div>
                <h1 className="font-black text-base sm:text-lg text-white">
                  {activeLesson?.title || course.title}
                </h1>
              </div>

              {activeLesson?.durationMinutes && (
                <div className="flex items-center gap-1.5 text-xs text-white/60 shrink-0">
                  <Clock className="w-3.5 h-3.5 text-[#fe6257]" />
                  <span>{activeLesson.durationMinutes} دقيقة</span>
                </div>
              )}
            </div>

            {/* Video Player Wrapped in CourseAccessGuard */}
            <CourseAccessGuard
              courseId={course.id}
              course={course}
              isFreePreview={activeLesson?.isFreePreview}
              onRequireAuth={onRequireAuth}
              onRequireEnroll={onRequireEnroll}
              customMessage="هذا الدرس محمي ويتطلب تفعيل الاشتراك في الكورس لمتابعته بالكامل."
            >
              <ProtectedVideoPlayer
                manifest={videoManifest}
                autoPlay={false}
                onEnded={handleLessonEnd}
              />
            </CourseAccessGuard>

            {/* Footer Workspace Tabs */}
            <div className="rounded-20 bg-[#161926] border border-white/10 overflow-hidden shadow-xl">
              {/* Tab Header */}
              <div className="flex items-center border-b border-white/10 overflow-x-auto p-2 gap-1 bg-[#111625]">
                <button
                  onClick={() => setActiveTab("notes")}
                  className={`px-4 py-2 rounded-12 text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                    activeTab === "notes"
                      ? "bg-[#753b47] text-white shadow-md"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#fe6257]" />
                  <span>الملاحظات التفاعلية ({videoManifest.notes?.length || 0})</span>
                </button>

                <button
                  onClick={() => setActiveTab("summaries")}
                  className={`px-4 py-2 rounded-12 text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                    activeTab === "summaries"
                      ? "bg-[#753b47] text-white shadow-md"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-[#3fcd82]" />
                  <span>المذكرات والملخصات (PDF)</span>
                </button>

                <button
                  onClick={() => setActiveTab("exam")}
                  className={`px-4 py-2 rounded-12 text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                    activeTab === "exam"
                      ? "bg-[#753b47] text-white shadow-md"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-[#ffa200]" />
                  <span>امتحان الحصة</span>
                </button>

                <button
                  onClick={() => setActiveTab("assignment")}
                  className={`px-4 py-2 rounded-12 text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                    activeTab === "assignment"
                      ? "bg-[#753b47] text-white shadow-md"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <FileCheck className="w-3.5 h-3.5 text-[#fe6257]" />
                  <span>واجب الحصة</span>
                </button>

                <button
                  onClick={() => setActiveTab("questions")}
                  className={`px-4 py-2 rounded-12 text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                    activeTab === "questions"
                      ? "bg-[#753b47] text-white shadow-md"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                  <span>اسأل مستر عمرو عارف</span>
                </button>
              </div>

              {/* Tab Content Panel */}
              <div className="p-5">
                {/* 1. Timestamped Notes Tab */}
                {activeTab === "notes" && (
                  <div className="space-y-3">
                    <div className="text-xs text-white/50 font-semibold mb-2">
                      اضغط على أي فكرة للانتقال مباشرة إلى وقت شرحها في الفيديو:
                    </div>
                    {videoManifest.notes?.map((note: TimestampedNote) => (
                      <div
                        key={note.id}
                        onClick={() => handleSeekToNote(note.timeSeconds)}
                        className="p-3 rounded-14 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#fe6257]/30 transition-all cursor-pointer flex items-center justify-between gap-4 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-10 bg-[#753b47]/30 text-[#fe6257] group-hover:bg-[#fe6257] group-hover:text-white transition-all flex items-center justify-center shrink-0">
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-[#fe6257] transition-colors">
                              {note.title}
                            </h4>
                            {note.description && (
                              <p className="text-[11px] text-white/50 line-clamp-1">
                                {note.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <span className="font-mono text-xs font-bold text-[#fe6257] bg-black/40 px-2 py-1 rounded-6 shrink-0" dir="ltr">
                          {Math.floor(note.timeSeconds / 60)
                            .toString()
                            .padStart(2, "0")}
                          :
                          {(note.timeSeconds % 60).toString().padStart(2, "0")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. Summaries Tab */}
                {activeTab === "summaries" && (
                  <div className="space-y-4">
                    <div className="p-4 sm:p-5 rounded-18 bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-14 bg-[#3fcd82]/15 text-[#3fcd82] flex items-center justify-center shrink-0">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-white">
                            {activeSummary?.title || `مذكرة الشرح • ${activeLesson?.title}`}
                          </h4>
                          <span className="text-xs text-white/50 block mt-0.5">
                            {activeSummary?.totalPages || 8} صفحات • {activeSummary?.fileSizeText || "2.4 ميجابايت"} • خرائط ذهنية وجداول مفردات
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setIsSummaryModalOpen(true)}
                          className="px-4 py-2.5 rounded-12 bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                        >
                          <Eye className="w-4 h-4 text-[#fe6257]" />
                          <span>عرض المذكرة الكاملة</span>
                        </button>

                        <SummaryDownloadButton
                          summaryTitle={activeSummary?.title || activeLesson?.title || "مذكرة الدرس"}
                          pdfUrl={activeSummary?.pdfUrl || videoManifest.summaryPdfUrl || "#"}
                          courseId={course.id}
                          isFreePreview={Boolean(activeLesson?.isFreePreview || course.isFree)}
                          onRequireEnroll={() => onRequireEnroll?.(course.id, course)}
                          size="md"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Exam Tab */}
                {activeTab === "exam" && (
                  <div className="p-6 rounded-16 bg-[#111625] border border-white/10 text-center space-y-4 max-w-md mx-auto">
                    <div className="w-14 h-14 rounded-20 bg-[#ffa200]/15 text-[#ffa200] border border-[#ffa200]/30 flex items-center justify-center mx-auto shadow-inner">
                      <HelpCircle className="w-7 h-7" />
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-black text-base text-white">
                        اختبار تقييم استيعاب المحاضرة
                      </h4>
                      <p className="text-xs text-white/60">
                        {course.examRules.questionsCount} أسئلة بنظام الاختيار من متعدد • مدة الاختبار {course.examRules.durationMinutes} دقائق.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        onOpenExam?.(videoManifest.quizId || "quiz-62");
                        setIsExamModalOpen(true);
                      }}
                      className="w-full py-3 px-6 rounded-12 font-black text-xs sm:text-sm text-white bg-[#753b47] hover:bg-[#854351] transition-all shadow-lg shadow-[#753b47]/30 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>بدء الاختبار الآن</span>
                      <Sparkles className="w-4 h-4 text-[#fe6257]" />
                    </button>
                  </div>
                )}

                {/* 4. Assignment Tab */}
                {activeTab === "assignment" && (
                  <div className="p-4 sm:p-5 rounded-18 bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-14 bg-[#fe6257]/15 text-[#fe6257] flex items-center justify-center shrink-0">
                        <FileCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">
                          {activeAssignment?.title || "واجب الحصة وتطبيقات الإعراب"}
                        </h4>
                        <span className="text-xs text-white/50 block mt-0.5">
                          الدرجة القصوى: {activeAssignment?.maxScore || 20} درجة • تصحيح شخصي من مستر عمرو عارف
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsAssignmentModalOpen(true)}
                      className="px-5 py-2.5 rounded-12 bg-[#753b47] hover:bg-[#854351] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shrink-0 cursor-pointer"
                    >
                      <FileCheck className="w-4 h-4 text-[#fe6257]" />
                      <span>فتح صفحة تسليم الواجب</span>
                    </button>
                  </div>
                )}

                {/* 5. Questions Tab */}
                {activeTab === "questions" && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-16 bg-white/5 border border-white/10 text-center space-y-3">
                      <MessageSquare className="w-8 h-8 text-sky-400 mx-auto" />
                      <h4 className="font-bold text-sm text-white">
                        هل لديك استفسار حول نقطة في المحاضرة؟
                      </h4>
                      <p className="text-xs text-white/60 max-w-md mx-auto">
                        فريق مستر عمرو عارف التعليمي يجيب على جميع أسئلة الطلاب خلال أقل من ساعتين.
                      </p>
                      <button className="px-5 py-2.5 rounded-12 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all cursor-pointer">
                        كتابة سؤال جديد للمحاضر
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>

          {/* Right Area (In RTL it's the Sidebar): Curriculum Playlist */}
          <aside className="w-full lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-r border-white/10 bg-[#111625] flex flex-col shrink-0">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#fe6257]" />
                <h3 className="font-black text-sm text-white">منهج الكورس</h3>
              </div>
              <span className="text-xs text-white/50">
                {allLessons.length} دروس
              </span>
            </div>

            {/* Units & Lessons List */}
            <div className="flex-1 overflow-y-auto divide-y divide-white/5">
              {course.units.map((unit: CurriculumUnit) => {
                const isExpanded = Boolean(expandedUnits[unit.id]);
                return (
                  <div key={unit.id} className="bg-black/10">
                    {/* Unit Accordion Trigger */}
                    <button
                      onClick={() => toggleUnit(unit.id)}
                      className="w-full p-3.5 flex items-center justify-between text-right hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <div>
                        <h4 className="font-bold text-xs text-white">
                          {unit.title}
                        </h4>
                        <span className="text-[10px] text-white/40">
                          {unit.lessons.length} أجزاء
                        </span>
                      </div>

                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-white/50" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-white/50" />
                      )}
                    </button>

                    {/* Unit Lessons */}
                    {isExpanded && (
                      <div className="divide-y divide-white/5 bg-black/20">
                        {unit.lessons.map((lesson: LessonItem) => {
                          const isSelected = lesson.id === activeLessonId;
                          const isCompleted = completedLessonIds.has(lesson.id);

                          return (
                            <button
                              key={lesson.id}
                              onClick={() => {
                                setActiveLessonId(lesson.id);
                                if (lesson.type === "quiz") {
                                  onOpenExam?.(lesson.id);
                                  setIsExamModalOpen(true);
                                } else if (lesson.type === "pdf") {
                                  setIsSummaryModalOpen(true);
                                }
                              }}
                              className={`w-full p-3 flex items-center justify-between text-right text-xs transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-[#753b47]/30 border-r-4 border-[#fe6257] text-white"
                                  : "text-white/70 hover:bg-white/5 hover:text-white"
                              }`}
                            >
                              <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-1">
                                {isCompleted ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                ) : lesson.type === "video" ? (
                                  <Play className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-[#fe6257] fill-[#fe6257]" : "text-white/60"}`} />
                                ) : lesson.type === "pdf" ? (
                                  <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                ) : (
                                  <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                )}

                                <span className={`line-clamp-1 font-almarai ${isSelected ? "font-bold text-white" : ""}`}>
                                  {lesson.title}
                                </span>
                              </div>

                              <div className="shrink-0 mr-2 flex items-center gap-1.5">
                                {lesson.isFreePreview ? (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded-4 bg-emerald-500/20 text-emerald-300 font-bold">
                                    مجاني
                                  </span>
                                ) : !course.isFree ? (
                                  <Lock className="w-3 h-3 text-white/40" />
                                ) : null}

                                {lesson.durationMinutes && (
                                  <span className="text-[10px] text-white/40 font-mono" dir="ltr">
                                    {lesson.durationMinutes}m
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      </div>

      {/* 1. Exam Player Modal */}
      <ExamPlayerModal
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
        examId={videoManifest.quizId || "quiz-62"}
        lessonId={activeLesson?.id}
      />

      {/* 2. Summary & Mind Map Viewer Modal */}
      <SummaryViewerModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        summary={activeSummary}
        courseTitle={course.title}
        onRequireEnroll={() => onRequireEnroll?.(course.id, course)}
      />

      {/* 3. Assignment Submission Modal */}
      <AssignmentModal
        isOpen={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
        customAssignment={activeAssignment}
        courseTitle={course.title}
      />
    </div>
  );
};
