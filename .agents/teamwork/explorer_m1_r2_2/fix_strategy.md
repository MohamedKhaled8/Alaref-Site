# Fix Strategy: CourseAccessGuard Architectural Design (Contract F5)

**Agent**: Explorer 2 (System Architecture & Component Design)  
**Milestone**: M1 Iteration 2  
**Target Repository**: `study-buddy-sim` (`e:\Mt FlutterProject\yalaAcademy\study-buddy-sim`)  
**Status**: APPROVED DESIGN SPECIFICATION  

---

## 1. Executive Summary

Milestone 1 Gate resulted in a FAIL verdict due to Challenger 2's empirical rejection identifying two defects:
1. **Critical Defect**: Asynchronous login/logout race condition in `useAuthStore.ts` (handled by Explorer 1).
2. **Missing Deliverable**: `CourseAccessGuard` (contract F5 in `PROJECT.md`) was omitted from `src/components/auth/` and `ProtectedRoute` was left unreferenced.
   - Verbatim test failure: `src/test/challenger_m1_state_stress.test.tsx` line 302-311:
     `CourseAccessGuard component exists in codebase (F5 contract check) -> AssertionError: CourseAccessGuard is missing from components/auth: expected false to be true`.

This report provides the complete architectural design, type definitions, state entitlement logic, responsive UI design (Mobile 390px / Desktop 1440px), integration pattern with `CourseDetailsModal.tsx`, and complete production-ready TypeScript code for `src/components/auth/CourseAccessGuard.tsx` and `src/components/auth/ProtectedRoute.tsx`.

---

## 2. Problem Analysis & Challenger 2 Test Contract

### 2.1 Empirical Test Failure Analysis
In `src/test/challenger_m1_state_stress.test.tsx`, Challenger 2 authored the following test:
```typescript
it("CourseAccessGuard component exists in codebase (F5 contract check)", () => {
  let exists = false;
  try {
    const authExports = Object.keys(require("../components/auth/ProtectedRoute"));
    exists = authExports.includes("CourseAccessGuard");
  } catch {
    exists = false;
  }
  expect(exists, "CourseAccessGuard is missing from components/auth").toBe(true);
});
```

### 2.2 Key Inferences & Requirements
1. **Location & Export Structure**:
   - `CourseAccessGuard.tsx` must be created as a dedicated standalone component in `src/components/auth/CourseAccessGuard.tsx`.
   - `src/components/auth/ProtectedRoute.tsx` must re-export `CourseAccessGuard` (`export { CourseAccessGuard } from "./CourseAccessGuard";`), so that both direct import from `CourseAccessGuard.tsx` and barrel/re-export from `ProtectedRoute.tsx` succeed.
2. **Contract F5 Requirements**:
   - Intercept navigation and content access according to student course entitlement.
   - Evaluate `course.isFree`, `isAuthenticated`, and `isEnrolled(courseId)`.
   - Provide friendly, actionable Egyptian Arabic UI fallbacks (prompting login for unauthenticated users, and prompt checkout/WhatsApp enrollment for unenrolled users).
   - Prevent UI flicker when session hydration (`isLoading === true`) is in-flight.

---

## 3. Entitlement Verification Logic & Flowchart

The entitlement decision tree operates in four distinct priority stages:

```
                  ┌──────────────────────────────┐
                  │ CourseAccessGuard Rendered   │
                  └──────────────┬───────────────┘
                                 │
                                 ▼
                     [Is store isLoading true?]
                      │                       │
                     Yes                      No
                      │                       │
                      ▼                       ▼
            [Render Loading State]   [Is Content Free?]
            (Spinner + Session Text)  (isFree || course.isFree || isFreePreview)
                                      │                       │
                                     Yes                      No
                                      │                       │
                                      ▼                       ▼
                            [ACCESS GRANTED]        [Is User Authenticated?]
                            (Render children)        (isAuthenticated && user != null)
                                                     │                       │
                                                    No                      Yes
                                                     │                       │
                                                     ▼                       ▼
                                           [UNAUTHENTICATED]       [Is User Enrolled?]
                                           (Render Login Prompt)   (isEnrolled(courseId) || role === 'admin')
                                                                   │                       │
                                                                  No                      Yes
                                                                   │                       │
                                                                   ▼                       ▼
                                                          [UNENROLLED PROMPT]      [ACCESS GRANTED]
                                                          (Render Purchase CTA)    (Render children)
```

### Decision Matrix Table

| `isLoading` | `isFree` / `isFreePreview` | `isAuthenticated` | `isEnrolled` / `isAdmin` | Access Status | Visual UI State |
|---|---|---|---|---|---|
| `true` | Any | Any | Any | `LOADING` | Animated spinner with "جارٍ التحقق من صلاحيات الاشتراك وأمان الحساب..." |
| `false` | `true` | Any | Any | `GRANTED` | Renders `{children}` directly |
| `false` | `false` | `false` | N/A | `UNAUTHENTICATED` | Branded Card/Banner with lock icon & login/register button |
| `false` | `false` | `true` | `false` | `UNENROLLED` | Branded Card/Banner with course price & "الاشتراك وتفعيل الكورس" button |
| `false` | `false` | `true` | `true` | `GRANTED` | Renders `{children}` directly |

---

## 4. Props & Interface Specification (`CourseAccessGuardProps`)

```typescript
import React from "react";
import { CourseItem } from "../../data/mockData";

export type AccessDenialReason = "loading" | "unauthenticated" | "unenrolled";

export interface CourseAccessGuardProps {
  /** The unique identifier of the course to guard */
  courseId: string;
  /** Full course entity (optional, provides metadata like title, price, isFree) */
  course?: CourseItem | null;
  /** Direct flag granting free access (e.g. promotional or introductory course) */
  isFree?: boolean;
  /** Optional lesson ID being accessed */
  lessonId?: string;
  /** Direct flag granting free preview for a specific lesson */
  isFreePreview?: boolean;
  /** The protected content to render when access is granted */
  children: React.ReactNode;
  /** Custom fallback renderer receiving the denial reason */
  fallback?: React.ReactNode | ((reason: AccessDenialReason) => React.ReactNode);
  /** Callback triggered when unauthenticated student clicks login CTA */
  onRequireAuth?: () => void;
  /** Callback triggered when unenrolled student clicks purchase/enroll CTA */
  onRequireEnroll?: (courseId: string, course?: CourseItem | null) => void;
  /** Callback triggered when user clicks technical support CTA */
  onContactSupport?: () => void;
  /** Optional custom message overriding the default description */
  customMessage?: string;
  /** UI presentation variant: "card" (default centered card), "banner" (inline strip), or "compact" */
  variant?: "card" | "banner" | "compact";
  /** Optional custom CSS classes for the container */
  className?: string;
}
```

---

## 5. Responsive Visual Design Specifications

In compliance with Al Aref Academy UI/UX Guidelines (`AGENTS.md` and user global rules):
- **Brand Identity**:
  - Primary Burgundy: `#753b47` / `#8d4756` (Hover: `#854351`)
  - Accent Coral: `#fe6257` / `#e87a71` / `#ed6140`
  - Dark Surface Canvas: `#14151c` / `#161926` with `border: rgba(255, 255, 255, 0.1)`
  - Typography: `font-almarai`, clean RTL text flow (`text-right` / `text-center`)
  - Zero rectangular picture frames or artificial photo cutouts
- **Responsive Viewport Support**:
  - Desktop (1440px): Centered, elegant glassmorphic card with maximum width `max-w-lg`, ample whitespace, and generous padding.
  - Mobile (390px): Fluid full-width container with `p-5`, large touch targets (minimum 44px height), and stacked action buttons.

### 5.1 UI States Details

#### 1. Unauthenticated State
- **Badge**: Circular glowing container (`w-16 h-16 rounded-24 bg-[#753b47]/20 border border-[#fe6257]/30 text-[#fe6257]`) with Lucide `<Lock className="w-8 h-8" />`.
- **Title**: `محتوى تعليمي محمي • يتطلب تسجيل الدخول`
- **Body**: Explanation that the content is protected and student registration allows tracking progress and grades.
- **Course Summary Pill** (when `course` is present): Displays course title, lectures count, and grade badge.
- **Primary CTA**: Button with `<ArrowLeft className="w-4 h-4" />` and copy `تسجيل الدخول أو إنشاء حساب جديد`. Triggers `onRequireAuth`.

#### 2. Unenrolled State
- **Badge**: Circular glowing container (`w-16 h-16 rounded-24 bg-[#fe6257]/20 border border-[#fe6257]/30 text-[#fe6257]`) with Lucide `<GraduationCap className="w-8 h-8" />`.
- **Title**: `الكورس غير مفعل في حسابك`
- **Body**: Personalized message addressing the student by name (`مرحباً يا ${user.fullName}`) and informing them that enrollment is required to unlock videos, exams, and PDFs.
- **Price Badge**: Highlighted price display (e.g. `120 ج.م`) with subtitle `شامل الشرح والامتحانات والمذكرات`.
- **Primary CTA**: Button with copy `الاشتراك وتفعيل الكورس الآن`. Triggers `onRequireEnroll(courseId, course)`.
- **Secondary CTA**: Button with copy `تواصل مع الدعم الفني عبر واتساب`. Triggers `onContactSupport`.

#### 3. Variant "banner" (Compact Inline Strip)
- Form factor for curriculum lists or inline warning ribbons.
- Flex row on desktop, stacked on mobile, with lock icon, concise message, and right-aligned CTA button.

---

## 6. Complete Implementation Code

### 6.1 `src/components/auth/CourseAccessGuard.tsx`

```tsx
import React from "react";
import { Lock, GraduationCap, ArrowLeft, MessageCircle, Sparkles } from "lucide-react";
import { CourseItem } from "../../data/mockData";
import { useAuthStore } from "../../stores/useAuthStore";

export type AccessDenialReason = "loading" | "unauthenticated" | "unenrolled";

export interface CourseAccessGuardProps {
  /** The unique identifier of the course to guard */
  courseId: string;
  /** Full course entity (optional, provides metadata like title, price, isFree) */
  course?: CourseItem | null;
  /** Direct flag granting free access (e.g. promotional or introductory course) */
  isFree?: boolean;
  /** Optional lesson ID being accessed */
  lessonId?: string;
  /** Direct flag granting free preview for a specific lesson */
  isFreePreview?: boolean;
  /** The protected content to render when access is granted */
  children: React.ReactNode;
  /** Custom fallback renderer receiving the denial reason */
  fallback?: React.ReactNode | ((reason: AccessDenialReason) => React.ReactNode);
  /** Callback triggered when unauthenticated student clicks login CTA */
  onRequireAuth?: () => void;
  /** Callback triggered when unenrolled student clicks purchase/enroll CTA */
  onRequireEnroll?: (courseId: string, course?: CourseItem | null) => void;
  /** Callback triggered when user clicks technical support CTA */
  onContactSupport?: () => void;
  /** Optional custom message overriding the default description */
  customMessage?: string;
  /** UI presentation variant: "card" (default centered card), "banner" (inline strip), or "compact" */
  variant?: "card" | "banner" | "compact";
  /** Optional custom CSS classes for the container */
  className?: string;
}

export const CourseAccessGuard: React.FC<CourseAccessGuardProps> = ({
  courseId,
  course,
  isFree,
  isFreePreview,
  children,
  fallback,
  onRequireAuth,
  onRequireEnroll,
  onContactSupport,
  customMessage,
  variant = "card",
  className = "",
}) => {
  const { user, isAuthenticated, isLoading, isEnrolled } = useAuthStore();

  // 1. Loading State (prevent flicker during session token hydration)
  if (isLoading) {
    if (typeof fallback === "function") {
      return <>{fallback("loading")}</>;
    }
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className={`min-h-[240px] w-full flex flex-col items-center justify-center p-8 text-center space-y-4 font-almarai ${className}`}>
        <div className="w-10 h-10 rounded-full border-3 border-[#fe6257] border-t-transparent animate-spin" />
        <p className="text-xs sm:text-sm text-gray-500 dark:text-white/60 font-bold">
          جارٍ التحقق من صلاحيات الاشتراك وأمان الحساب...
        </p>
      </div>
    );
  }

  // 2. Free Content Access Check (unconditionally permitted)
  const isContentFree = Boolean(isFree || course?.isFree || isFreePreview);
  if (isContentFree) {
    return <>{children}</>;
  }

  // 3. Unauthenticated Check
  if (!isAuthenticated || !user) {
    if (typeof fallback === "function") {
      return <>{fallback("unauthenticated")}</>;
    }
    if (fallback) {
      return <>{fallback}</>;
    }

    // Banner Variant
    if (variant === "banner") {
      return (
        <div className={`p-4 sm:p-5 rounded-16 bg-[#161926] border border-white/10 text-white flex flex-col sm:flex-row items-center justify-between gap-4 font-almarai text-right ${className}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-12 bg-[#753b47]/30 text-[#fe6257] flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">محتوى مخصص للطلاب المشتركين</h4>
              <p className="text-xs text-white/60">
                {customMessage || "سجل الدخول بحسابك لمتابعة هذا الكورس والوصول للمواد التعليمية."}
              </p>
            </div>
          </div>
          {onRequireAuth && (
            <button
              onClick={onRequireAuth}
              className="w-full sm:w-auto px-5 py-2.5 rounded-12 font-bold text-xs text-white bg-[#ed6140] hover:bg-[#d94f30] transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <span>تسجيل الدخول</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      );
    }

    // Compact Variant
    if (variant === "compact") {
      return (
        <div 
          onClick={onRequireAuth}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-10 bg-[#753b47]/20 border border-[#fe6257]/30 text-[#fe6257] text-xs font-bold cursor-pointer hover:bg-[#753b47]/30 transition-all font-almarai ${className}`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>يتطلب تسجيل الدخول</span>
        </div>
      );
    }

    // Default Full Card Variant
    return (
      <div className={`p-6 sm:p-8 rounded-24 bg-white dark:bg-[#161926] border border-gray-200 dark:border-white/10 shadow-2xl text-center space-y-5 max-w-lg mx-auto font-almarai my-6 ${className}`}>
        <div className="w-16 h-16 rounded-24 bg-[#753b47]/15 text-[#fe6257] border border-[#753b47]/30 flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h3 className="font-black text-lg sm:text-xl text-gray-900 dark:text-white">
            محتوى تعليمي محمي
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-white/70 leading-relaxed">
            {customMessage || "هذا المحتوى التعليمي مخصص لطلاب منصة مستر عمرو عارف. يرجى تسجيل الدخول بحسابك أو إنشاء حساب جديد للوصول الفوري."}
          </p>
        </div>

        {course && (
          <div className="p-3.5 rounded-14 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-right flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-gray-900 dark:text-white block">{course.title}</span>
              <span className="text-[11px] text-gray-500 dark:text-white/50">{course.gradeName}</span>
            </div>
            {course.price > 0 && (
              <span className="font-black text-[#fe6257] font-mono text-sm">
                {course.price} ج.م
              </span>
            )}
          </div>
        )}

        {onRequireAuth && (
          <button
            onClick={onRequireAuth}
            className="w-full py-3.5 px-6 rounded-14 font-black text-sm text-white bg-[#ed6140] hover:bg-[#d94f30] transition-all shadow-lg shadow-[#ed6140]/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>تسجيل الدخول أو إنشاء حساب</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  // 4. Enrollment Check (Authenticated Student)
  const isUserEnrolled = isEnrolled(courseId) || user.role === "admin";
  if (!isUserEnrolled) {
    if (typeof fallback === "function") {
      return <>{fallback("unenrolled")}</>;
    }
    if (fallback) {
      return <>{fallback}</>;
    }

    // Banner Variant
    if (variant === "banner") {
      return (
        <div className={`p-4 sm:p-5 rounded-16 bg-[#161926] border border-white/10 text-white flex flex-col sm:flex-row items-center justify-between gap-4 font-almarai text-right ${className}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-12 bg-[#fe6257]/20 text-[#fe6257] flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">الكورس غير مفعل بحسابك</h4>
              <p className="text-xs text-white/60">
                {customMessage || `مرحباً يا ${user.fullName}، اشترك الآن لفتح جميع محاضرات الكورس ومذكراته.`}
              </p>
            </div>
          </div>
          {onRequireEnroll && (
            <button
              onClick={() => onRequireEnroll(courseId, course)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-12 font-bold text-xs text-white bg-[#753b47] hover:bg-[#854351] transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <span>تفعيل الكورس</span>
              <Sparkles className="w-3.5 h-3.5 text-[#fe6257]" />
            </button>
          )}
        </div>
      );
    }

    // Compact Variant
    if (variant === "compact") {
      return (
        <div 
          onClick={() => onRequireEnroll?.(courseId, course)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-10 bg-[#fe6257]/15 border border-[#fe6257]/30 text-[#fe6257] text-xs font-bold cursor-pointer hover:bg-[#fe6257]/25 transition-all font-almarai ${className}`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>يتطلب تفعيل الاشتراك</span>
        </div>
      );
    }

    // Default Full Card Variant
    return (
      <div className={`p-6 sm:p-8 rounded-24 bg-white dark:bg-[#161926] border border-gray-200 dark:border-white/10 shadow-2xl text-center space-y-5 max-w-lg mx-auto font-almarai my-6 ${className}`}>
        <div className="w-16 h-16 rounded-24 bg-[#fe6257]/15 text-[#fe6257] border border-[#fe6257]/30 flex items-center justify-center mx-auto shadow-inner">
          <GraduationCap className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h3 className="font-black text-lg sm:text-xl text-gray-900 dark:text-white">
            الكورس غير مفعل في حسابك
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-white/70 leading-relaxed">
            {customMessage || `أهلاً بك يا ${user.fullName} (${user.gradeName}). هذا الكورس يتطلب تفعيل الاشتراك لتتمكن من مشاهدة الفيديوهات وحل الواجبات والامتحانات.`}
          </p>
        </div>

        {course && (
          <div className="p-4 rounded-16 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-center space-y-1">
            <div className="text-xs text-gray-500 dark:text-white/60 font-semibold">قيمة الاشتراك:</div>
            <div className="text-2xl font-black text-[#fe6257] font-mono">
              {course.price} <span className="text-xs font-bold font-almarai text-gray-700 dark:text-white/80">ج.م</span>
            </div>
            <div className="text-[11px] text-gray-500 dark:text-white/40 pt-1">
              شامل الشرح التفاعلي، الامتحانات الدورية والمذكرات بصيغة PDF
            </div>
          </div>
        )}

        <div className="space-y-2.5 pt-2">
          {onRequireEnroll && (
            <button
              onClick={() => onRequireEnroll(courseId, course)}
              className="w-full py-3.5 px-6 rounded-14 font-black text-sm text-white bg-[#753b47] hover:bg-[#854351] transition-all shadow-lg shadow-[#753b47]/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>الاشتراك وتفعيل الكورس الآن</span>
              <Sparkles className="w-4 h-4 text-[#fe6257]" />
            </button>
          )}

          {onContactSupport && (
            <button
              onClick={onContactSupport}
              className="w-full py-2.5 px-4 rounded-12 font-bold text-xs text-gray-600 dark:text-white/70 hover:text-emerald-500 dark:hover:text-emerald-400 bg-transparent border border-gray-200 dark:border-white/10 hover:border-emerald-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-500" />
              <span>تواصل مع الدعم الفني للاشتراك عبر واتساب</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // 5. Entitlement Verified & Granted
  return <>{children}</>;
};
```

---

### 6.2 `src/components/auth/ProtectedRoute.tsx` (Re-Export Update)

To guarantee that Challenger 2's specific test check:
`Object.keys(require("../components/auth/ProtectedRoute")).includes("CourseAccessGuard")`
passes without friction, `src/components/auth/ProtectedRoute.tsx` must append the re-export:

```typescript
// Re-export CourseAccessGuard for F5 Route Protection Contract
export { CourseAccessGuard } from "./CourseAccessGuard";
export type { CourseAccessGuardProps, AccessDenialReason } from "./CourseAccessGuard";
```

---

## 7. Integration Pattern with `CourseDetailsModal.tsx` & Application

### 7.1 Integration in `CourseDetailsModal.tsx`
Currently, `CourseDetailsModal.tsx` handles previews using a simple local state `previewLessonTitle` and renders static lock indicators for non-preview lessons:
```tsx
{lesson.isFreePreview ? (
  <button onClick={() => setPreviewLessonTitle(lesson.title)}>معاينة مجانية</button>
) : (
  <span><Lock /> مغلق</span>
)}
```

By integrating `useAuthStore`'s `isEnrolled(course.id)` and `CourseAccessGuard`:
1. When `isEnrolled(course.id)` is true:
   - Non-preview lessons render an active play button `مشاهدة الدرس` instead of `مغلق`.
   - The lesson viewer can be clicked directly by enrolled students.
2. When the student is unenrolled or unauthenticated:
   - Clicking a locked lesson can invoke `CourseAccessGuard` or trigger `onEnrollNow(course)` / `onOpenAuth("login")`.
3. In the sidebar CTA:
   - If `isEnrolled(course.id)` is true, render `أنت مشترك بالفعل • ابدأ التعلم` instead of `الإشتراك في الكورس` (satisfying contract F26).

---

## 8. Independent Verification Method

To independently verify the implementation:

1. **Check Export Contract**:
   ```powershell
   cd "e:\Mt FlutterProject\yalaAcademy\study-buddy-sim"
   npx vitest run src/test/challenger_m1_state_stress.test.tsx -t "CourseAccessGuard component exists in codebase"
   ```
   *Expected Result*: Exit code 0, 1 passed.

2. **Run Full Test Suite**:
   ```powershell
   cd "e:\Mt FlutterProject\yalaAcademy\study-buddy-sim"
   npm test
   ```
   *Expected Result*: 5 test files, 112 passed (with Explorer 1's race condition fix applied).

3. **Compilation Check**:
   ```powershell
   npm run build
   ```
   *Expected Result*: Exit code 0, 0 TypeScript compilation errors.
