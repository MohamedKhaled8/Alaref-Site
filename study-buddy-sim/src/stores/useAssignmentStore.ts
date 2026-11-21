import { create } from "zustand";
import { AssignmentSubmission } from "../types/educational";
import { initialMockSubmissions } from "../data/mockAssignments";

export const LOCAL_STORAGE_ASSIGNMENTS_KEY = "alaref_assignments";
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 Megabytes

export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

export const ALLOWED_EXTENSIONS = [
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".docx",
  ".doc",
];

export const DISALLOWED_EXTENSIONS = [
  ".exe",
  ".sh",
  ".bat",
  ".cmd",
  ".js",
  ".html",
  ".vbs",
  ".msi",
  ".jar",
  ".scr",
  ".bin",
];

export interface FilePayload {
  name: string;
  size: number;
  type?: string;
  url?: string;
}

export interface AssignmentStoreState {
  submissions: Record<string, AssignmentSubmission>; // Keyed by assignmentId

  // Actions
  validateFile: (file: FilePayload) => { valid: boolean; error?: string };
  submitAssignment: (
    assignmentId: string,
    payload: {
      studentId: string;
      studentName: string;
      file: FilePayload;
      notes?: string;
    }
  ) => { success: boolean; submission?: AssignmentSubmission; error?: string };
  getSubmission: (assignmentId: string) => AssignmentSubmission | undefined;
  clearSubmissions: () => void;
}

// Safely load initial submissions from localStorage combined with mock defaults
const loadInitialSubmissions = (): Record<string, AssignmentSubmission> => {
  if (typeof window === "undefined" || !window.localStorage) {
    return { ...initialMockSubmissions };
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ASSIGNMENTS_KEY);
    if (!raw) {
      return { ...initialMockSubmissions };
    }
    const parsed = JSON.parse(raw);
    return { ...initialMockSubmissions, ...parsed };
  } catch (err) {
    console.error("Failed to load stored assignments:", err);
    return { ...initialMockSubmissions };
  }
};

const saveSubmissionsToStorage = (
  submissions: Record<string, AssignmentSubmission>
) => {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }
  try {
    localStorage.setItem(
      LOCAL_STORAGE_ASSIGNMENTS_KEY,
      JSON.stringify(submissions)
    );
  } catch (err) {
    console.error("Failed to persist assignments:", err);
  }
};

export const useAssignmentStore = create<AssignmentStoreState>((set, get) => ({
  submissions: loadInitialSubmissions(),

  validateFile: (file: FilePayload) => {
    const lowerName = (file.name || "").toLowerCase();

    // 0. Explicitly disallow executable and script extensions
    const hasDisallowedExt = DISALLOWED_EXTENSIONS.some((ext) =>
      lowerName.endsWith(ext)
    );
    if (hasDisallowedExt) {
      return {
        valid: false,
        error: "نوع الملف غير مدعوم. غير مسموح برفع ملفات تنفيذية أو برمجية لأسباب أمنية.",
      };
    }

    // 1. Check size (max 10MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return {
        valid: false,
        error: "حجم الملف كبير جداً. الحد الأقصى المسموح به لرفع الواجب هو 10 ميجابايت.",
      };
    }

    if (file.size <= 0) {
      return {
        valid: false,
        error: "الملف المختار فارغ. يرجى اختيار ملف صالح.",
      };
    }

    // 2. Check extension & MIME type
    const hasAllowedExt = ALLOWED_EXTENSIONS.some((ext) =>
      lowerName.endsWith(ext)
    );

    const hasAllowedMime = file.type
      ? ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())
      : false;

    if (!hasAllowedExt && !hasAllowedMime) {
      return {
        valid: false,
        error:
          "نوع الملف غير مدعوم. الصيغ المقبولة هي: PDF أو مستند Word أو صور (JPG, PNG).",
      };
    }

    return { valid: true };
  },

  submitAssignment: (assignmentId, { studentId, studentName, file, notes }) => {
    // Validate file first
    const validation = get().validateFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const submissionId = `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newSubmission: AssignmentSubmission = {
      submissionId,
      assignmentId,
      studentId: studentId || "student-guest",
      studentName: studentName || "طالب المنصة",
      submittedAt: new Date().toISOString(),
      status: "submitted",
      fileName: file.name,
      fileSize: file.size,
      fileUrl: file.url || `/uploads/assignments/${encodeURIComponent(file.name)}`,
      studentNotes: notes,
    };

    set((state) => {
      const updated = {
        ...state.submissions,
        [assignmentId]: newSubmission,
      };
      saveSubmissionsToStorage(updated);
      return { submissions: updated };
    });

    return { success: true, submission: newSubmission };
  },

  getSubmission: (assignmentId: string) => {
    return get().submissions[assignmentId];
  },

  clearSubmissions: () => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem(LOCAL_STORAGE_ASSIGNMENTS_KEY);
    }
    set({ submissions: { ...initialMockSubmissions } });
  },
}));
