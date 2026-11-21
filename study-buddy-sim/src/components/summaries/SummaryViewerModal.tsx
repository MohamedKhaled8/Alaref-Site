import React, { useState } from "react";
import {
  X,
  FileText,
  BookOpen,
  Sparkles,
  Layers,
  Lock,
  Download,
  CheckCircle2,
  HelpCircle,
  Eye,
} from "lucide-react";
import { LessonSummaryItem } from "../../types/educational";
import { useAuthStore } from "../../stores/useAuthStore";
import { SummaryDownloadButton } from "./SummaryDownloadButton";

export interface SummaryViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: LessonSummaryItem | null;
  courseTitle?: string;
  onRequireEnroll?: () => void;
}

export const SummaryViewerModal: React.FC<SummaryViewerModalProps> = ({
  isOpen,
  onClose,
  summary,
  courseTitle,
  onRequireEnroll,
}) => {
  const [activeTab, setActiveTab] = useState<
    "keypoints" | "rules" | "vocab" | "mindmap"
  >("keypoints");

  const { user, isEnrolled } = useAuthStore();

  if (!isOpen || !summary) return null;

  const hasAccess =
    summary.isFreePreview ||
    (summary.courseId ? isEnrolled(summary.courseId) : false) ||
    user?.role === "admin";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200 font-almarai">
      <div
        className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-24 bg-[#0c101c] border border-white/10 shadow-2xl overflow-hidden text-white"
        style={{ direction: "rtl" }}
      >
        {/* Header */}
        <header className="p-4 sm:p-5 border-b border-white/10 bg-[#111625] flex items-center justify-between shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-12 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-black text-sm sm:text-base text-white truncate">
                  {summary.title}
                </h2>
                {summary.isFreePreview && (
                  <span className="px-2 py-0.5 rounded-6 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold shrink-0">
                    معاينة مجانية
                  </span>
                )}
              </div>
              <p className="text-xs text-white/50 truncate">
                {courseTitle || "منصة مستر عمرو عارف"} • {summary.totalPages} صفحات • {summary.fileSizeText}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <SummaryDownloadButton
              summaryTitle={summary.title}
              pdfUrl={summary.pdfUrl}
              courseId={summary.courseId}
              isFreePreview={summary.isFreePreview}
              onRequireEnroll={onRequireEnroll}
              size="sm"
            />
            <button
              onClick={onClose}
              className="p-2 rounded-10 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Locked Screen Guard */}
        {!hasAccess ? (
          <div className="flex-1 p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-24 bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-lg">
              <Lock className="w-8 h-8" />
            </div>
            <div className="space-y-1.5 max-w-md">
              <h3 className="font-black text-lg text-white">
                هذه المذكرة مخصصة للطلاب المشتركين
              </h3>
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                تحتوي هذه المذكرة على ملخصات الخرائط الذهنية والقواعد النحوية الكاملة وجدول المفردات الخاص بدروس مستر عمرو عارف.
              </p>
            </div>
            <button
              type="button"
              onClick={onRequireEnroll}
              className="px-6 py-3 rounded-12 bg-[#753b47] hover:bg-[#854351] text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-[#753b47]/30 cursor-pointer"
            >
              الاشتراك في الكورس لفتح كافة المذكرات
            </button>
          </div>
        ) : (
          <>
            {/* Navigation Tabs */}
            <div className="px-4 sm:px-6 py-2.5 border-b border-white/5 bg-[#161926] flex items-center gap-2 overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab("keypoints")}
                className={`px-3.5 py-1.5 rounded-10 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeTab === "keypoints"
                    ? "bg-[#753b47] text-white shadow-sm"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#fe6257]" />
                <span>النقاط الذهبية ({summary.keyPoints.length})</span>
              </button>

              {summary.grammarRules && summary.grammarRules.length > 0 && (
                <button
                  onClick={() => setActiveTab("rules")}
                  className={`px-3.5 py-1.5 rounded-10 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    activeTab === "rules"
                      ? "bg-[#753b47] text-white shadow-sm"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                  <span>القواعد النحوية ({summary.grammarRules.length})</span>
                </button>
              )}

              {summary.vocabularyTable && summary.vocabularyTable.length > 0 && (
                <button
                  onClick={() => setActiveTab("vocab")}
                  className={`px-3.5 py-1.5 rounded-10 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    activeTab === "vocab"
                      ? "bg-[#753b47] text-white shadow-sm"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>معجم المفردات ({summary.vocabularyTable.length})</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab("mindmap")}
                className={`px-3.5 py-1.5 rounded-10 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeTab === "mindmap"
                    ? "bg-[#753b47] text-white shadow-sm"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-sky-400" />
                <span>الخريطة الذهنية التفاعلية</span>
              </button>
            </div>

            {/* Tab Panels */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* 1. Key Points */}
              {activeTab === "keypoints" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-16 bg-[#161926] border border-white/10 space-y-3">
                    <h3 className="font-bold text-sm text-[#fe6257] flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      <span>أهم نقاط التركيز في المحاضرة:</span>
                    </h3>
                    <ul className="space-y-2.5">
                      {summary.keyPoints.map((point, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-white/90 leading-relaxed"
                        >
                          <span className="w-5 h-5 rounded-full bg-[#753b47]/40 text-[#fe6257] flex items-center justify-center text-[10px] font-bold font-mono shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* 2. Grammar Rules */}
              {activeTab === "rules" && summary.grammarRules && (
                <div className="space-y-4">
                  {summary.grammarRules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="p-4 sm:p-5 rounded-16 bg-[#161926] border border-white/10 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-white flex items-center gap-2">
                          <span className="w-6 h-6 rounded-8 bg-purple-500/20 text-purple-300 flex items-center justify-center text-xs font-mono">
                            {idx + 1}
                          </span>
                          <span>{rule.rule}</span>
                        </h4>
                      </div>

                      <div className="p-3 rounded-12 bg-black/40 border border-white/5 text-xs font-bold text-emerald-400">
                        الشاهد والمثال: {rule.example}
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-white/50 block">
                          الإعراب التفصيلي:
                        </span>
                        <p className="text-xs text-white/80 leading-relaxed font-almarai pr-2 border-r-2 border-purple-500/40">
                          {rule.parsing}
                        </p>
                      </div>

                      {rule.notes && (
                        <div className="p-2.5 rounded-10 bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-center gap-2">
                          <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>تنبيه هام: {rule.notes}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* 3. Vocabulary Table */}
              {activeTab === "vocab" && summary.vocabularyTable && (
                <div className="overflow-x-auto rounded-16 border border-white/10 bg-[#161926]">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-[#111625] text-white/60 border-b border-white/10">
                      <tr>
                        <th className="p-3.5 font-bold">الكلمة</th>
                        <th className="p-3.5 font-bold">المعنى والدلالة</th>
                        <th className="p-3.5 font-bold">المضاد والعكس</th>
                        <th className="p-3.5 font-bold">السياق من النص</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-white/90">
                      {summary.vocabularyTable.map((item, idx) => (
                        <tr key={idx} className="hover:bg-white/5">
                          <td className="p-3.5 font-bold text-[#fe6257]">
                            {item.word}
                          </td>
                          <td className="p-3.5">{item.meaning}</td>
                          <td className="p-3.5 text-white/60">
                            {item.opposite || "-"}
                          </td>
                          <td className="p-3.5 text-white/50 font-almarai">
                            {item.context || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 4. Mind Map Preview */}
              {activeTab === "mindmap" && (
                <div className="p-6 rounded-16 bg-[#161926] border border-white/10 text-center space-y-4">
                  <div className="p-8 rounded-14 bg-[#0b0c10] border border-white/5 flex flex-col items-center justify-center space-y-3">
                    <div className="w-14 h-14 rounded-20 bg-sky-500/15 text-sky-400 flex items-center justify-center mx-auto">
                      <Layers className="w-7 h-7" />
                    </div>
                    <h4 className="font-bold text-sm text-white">
                      مخطط الخريطة الذهنية الشاملة • {summary.title}
                    </h4>
                    <p className="text-xs text-white/60 max-w-md">
                      تتضمن الخريطة ربطاً بصرياً بين أقسام القاعدة النحوية وفروع البلاغة مع شواهد الشعر وأمثلة الامتحانات السابقة.
                    </p>
                    <div className="pt-2">
                      <SummaryDownloadButton
                        summaryTitle={summary.title}
                        pdfUrl={summary.pdfUrl}
                        courseId={summary.courseId}
                        isFreePreview={summary.isFreePreview}
                        onRequireEnroll={onRequireEnroll}
                        size="md"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Watermark notice */}
            <footer className="p-3 px-6 border-t border-white/10 bg-[#111625] flex items-center justify-between text-[11px] text-white/40 shrink-0">
              <span>
                مرخص للاستخدام الشخصي للطالب • حقوق الطبع محفوظة لمنصة مستر عمرو عارف
              </span>
              <span className="font-mono">ID: AREF-{summary.id}</span>
            </footer>
          </>
        )}
      </div>
    </div>
  );
};
