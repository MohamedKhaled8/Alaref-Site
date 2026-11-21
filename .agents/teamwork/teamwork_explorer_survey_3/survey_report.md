# Survey Report: Educational Modules (R3) & Payment/Enrollment (R4)
**Project**: Al Aref Academy (`study-buddy-sim`)  
**Workspace**: `e:\Mt FlutterProject\yalaAcademy\study-buddy-sim`  
**Inspector**: Teamwork Survey Explorer 3  
**Date**: 2026-11-08T23:45:00Z  

---

## 1. Executive Summary & High-Level Assessment

Al Aref Academy is built on React 18, Vite 5, Tailwind CSS, Radix UI primitives, Lucide icons, and Framer Motion. The visual design and branding are aligned with Mr. Amr Aref (أستاذ اللغة العربية) and benchmarked against `el-ameed.com`.

### Current State Summary:
- **Catalog & Structure**: 15 courses across 5 academic stages (الصف السادس الابتدائي، الأول الإعدادي، الثاني الإعدادي، الثالث الإعدادي، كورس التأسيس الشامل) with 3 archetypes per stage (`summary`, `exam-bank`, `curriculum`).
- **Course Modal**: Displays course header, 4 tabs (المحتوى، عن الكورس، التعليقات، التقييمات), curriculum units accordion, and purchase sidebar.
- **Verification Baseline**: Vitest test suite passes cleanly (`7 passed / 7 tests`), and `npm run build` succeeds with zero errors (build time: ~17.7s).

### Critical Gaps Identified for R3 & R4:
1. **Interactive Exams/Quizzes (R3)**:
   - While `quiz-62` exists as a lesson type and `CourseItem.examRules` specifies `{ questionsCount: 10, durationMinutes: 10, passScore: 5, maxAttempts: 1 }`, there are **zero question data models**, no question banks, no exam player UI, no countdown timer, no question navigation, no grading logic, no instant results modal, and no attempt history.
2. **Lesson Summaries (R3)**:
   - While `LessonItem.type` includes `"pdf"`, there are **zero PDF lessons** in the active mock data, no document viewer, no access control guards, and no secure download workflow with anti-piracy watermarking.
3. **Assignments & File Uploads (R3)**:
   - There are **no assignment models or lessons**, no submission form, no drag-and-drop file upload zone, no MIME/file size validation, and no teacher feedback or grading loop.
4. **Checkout, Payment & Immediate Enrollment (R4)**:
   - When a student clicks "الإشتراك في الكورس", the app currently opens `WhatsAppSupportModal` with a pre-filled WhatsApp message. There is **no automated checkout workflow**, no cart/purchase drawer, no support for Egyptian payment methods (Fawry, Vodafone Cash / E-Wallets, Credit Cards, or Center Vouchers), no coupon engine, no payment confirmation/receipt screen, and no persistent access entitlement in client state.
5. **State Management (R5 Integration)**:
   - `zustand` (`^5.0.12`) is installed in `package.json` but completely unused. All state currently lives as loose `useState` inside `App.tsx` and `CourseDetailsModal.tsx`.

---

## 2. Current Codebase Audit

### 2.1 File Map & Responsibilities

| File Path | Role & Content | R3/R4 Status & Gaps |
|---|---|---|
| `src/data/mockData.ts` | Master data: teacher profile, 5 grade stages, 15 courses, 1 shared curriculum (`elAmeedCurriculumUnits`), 12 honor students | Only 1 quiz item stub (`quiz-62`), 0 question data, 0 PDF items, 0 assignment items, 0 payment/coupon data. |
| `src/components/courses/CourseDetailsModal.tsx` | Full-screen modal for course overview, curriculum accordion, free video preview simulation, and purchase sidebar | Clicking quizzes does nothing; PDFs have no viewer; "Enroll Now" calls `onEnrollNow` which forwards to WhatsApp. |
| `src/components/courses/CourseCard.tsx` | Grid card for course display on home/catalog | Button says "الإشتراك في الكورس !" or "ابدأ المشاهدة الآن" (free). Does not reflect student enrolled status dynamically. |
| `src/components/home/FeaturedCourses.tsx` | Suggested courses carousel and grade filter tabs | Delegates details and enrollment to `App.tsx`. |
| `src/App.tsx` | Main page coordinator, handles modal states, theme, and dummy auth | `handleEnrollCourse` routes to WhatsApp for paid courses. No enrollment state store or persistent user courses. |
| `src/test/elameed.test.ts` | Vitest test suite checking data integrity, teacher credentials, stages, and phone rules | 7 tests pass. Needs expansion for quiz grading, file upload validation, coupon math, and access entitlement. |

### 2.2 Deep Dive into Existing Types (`src/data/mockData.ts`)

```typescript
// Existing in mockData.ts
export interface LessonItem {
  id: string;
  title: string;
  type: "video" | "pdf" | "quiz"; // Missing "assignment"
  durationMinutes?: number;
  isFreePreview: boolean;
  isCompleted?: boolean;
}

export interface CurriculumUnit {
  id: string;
  unitNumber: number;
  title: string;
  description: string;
  lessonsCount: number;
  lessons: LessonItem[];
}

export interface CourseItem {
  id: string;
  slug: string;
  title: string;
  gradeId: string;
  gradeName: string;
  archetype: "curriculum" | "summary" | "exam-bank";
  archetypeLabel: string;
  price: number;
  isFree: boolean;
  units: CurriculumUnit[];
  quizCount: number;
  examRules: {
    questionsCount: number;
    durationMinutes: number;
    passScore: number;
    maxAttempts: number;
  };
}
```

---

## 3. Interactive Student Exams & Quizzes Engine (R3)

### 3.1 Domain Model Specification

```typescript
export type QuestionType = "mcq" | "true_false" | "short_text";

export interface ExamQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  passage?: string; // e.g. قطعة النحو أو النص الأدبي أو بيت الشعر
  options?: string[]; // for MCQ (4 options)
  correctAnswer: string | number; // index or boolean string or canonical text
  explanation: string; // تعليل مستر عمرو عارف النحوي أو البلاغي
  points: number;
  category: "نحو" | "بلاغة" | "نصوص" | "قراءة" | "قصة" | "إملاء";
}

export interface ExamData {
  id: string;
  lessonId: string;
  courseId: string;
  title: string;
  instructions: string;
  durationMinutes: number;
  passScore: number;
  maxAttempts: number;
  questions: ExamQuestion[];
}

export interface StudentExamAttempt {
  attemptId: string;
  examId: string;
  studentId: string;
  timestamp: string;
  durationSecondsSpent: number;
  answers: Record<string, string | number>; // questionId -> studentAnswer
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  feedbackText: string;
}
```

### 3.2 Arabic Question Banks Matrix
Questions should span core curricula for Mr. Amr Aref's specializations:
- **نحو (Grammar)**: كان وأخواتها، كاد وأخواتها، لا النافية للجنس، أنواع الخبر، همزة القطع وألف الوصل، بناء الفعل للمجهول ونائب الفاعل، المنادى، البدل، الممنوع من الصرف.
- **بلاغة (Rhetoric)**: التشبيه (مجمل، بليغ، تمثيلي)، الاستعارة (مكنية، تصريحية)، الكناية وسر جمالها، المحسنات البديعية (طباق، جناس، سجع، مقابلة).
- **قراءة متحررة وفهم مقروء (Reading Comprehension)**: استخراج الفكرة الرئيسة، العلاقات الضمنية (تعليل، نتيجة، تفصيل بعد إجمال).
- **نصوص أدبية وشعر (Literature)**: مواطن الجمال، الدلالات الإيحائية للألفاظ، المعنى السياقي.

### 3.3 Interactive Exam Player Lifecycle

```
[Start Screen Modal]
   │
   ▼
[Live Exam Player] 
   ├──► Countdown Timer (with <2 min visual alert & auto-submit on 00:00)
   ├──► Top Progress Bar (e.g. السؤال 3 من 10 • تم الإجابة 2/10)
   ├──► Question Display (Passage Box, Question Prompt, Option Badges)
   ├──► Bottom Navigation (السابق / التالي / إنهاء الاختبار)
   └──► Side Question Grid Drawer (Answered, Current, Flagged, Unanswered)
   │
   ▼ Submit
[Grading Engine (Instant Evaluation)]
   │
   ▼
[Exam Result & Celebration Modal]
   ├──► Confetti Animation (Framer Motion)
   ├──► Score Ring (e.g. 9/10 - 90% - ناجح بتفوق)
   ├──► Time Taken
   ├──► Action Buttons: "مراجعة الإجابات بالتفصيل" / "إعادة الاختبار" (if attempts remain)
   │
   ▼ Review
[Detailed Answer Review Mode]
   ├──► Color Coding: Green for correct, Red for student incorrect
   ├──► Correct Answer indicator
   └──► Educational Explanation Box (توضيح المعلم النحوي والبلاغي)
```

---

## 4. Lesson Summaries & Document System (R3)

### 4.1 Domain Model Specification

```typescript
export interface LessonSummaryItem {
  id: string;
  lessonId: string;
  courseId: string;
  title: string;
  summaryType: "mindmap" | "cheat_sheet" | "full_notes";
  totalPages: number;
  fileSizeText: string;
  pdfUrl: string;
  isFreePreview: boolean;
  keyPoints: string[];
  vocabularyTable?: Array<{ word: string; meaning: string; opposite?: string }>;
  grammarRules?: Array<{ rule: string; example: string; parsing: string }>;
}
```

### 4.2 Document Viewer Component Architecture
- **Interactive Formatted Card**:
  - Displays structured study points, collapsible rule boxes, mind-map diagram cards, and vocabulary cards.
- **Embedded Document/PDF Viewer**:
  - Built-in embedded viewer with zoom controls (`+`, `-`, reset), full-screen toggle, and page jumper.
  - Access guard: If the summary is locked and the user has not purchased the course, a dark frosted glass overlay appears with a lock icon and button: `"اشترك في الكورس لفتح كامل المذكرات والملخصات"`.

### 4.3 Secure Download Workflow with Dynamic Watermark
- Click `"تحميل المذكرة (PDF)"`:
  - Validates user entitlement via `useEnrollmentStore`.
  - Simulates dynamic watermark insertion:
    `"مرخص للطالب: [اسم الطالب] • هاتف: [رقم الهاتف] • منصة مستر عمرو عارف • كود التحقق: AREF-[ID]"`
  - Initiates download with progress bar toast and confirmation.

---

## 5. Assignments & Student Homework Upload Engine (R3)

### 5.1 Domain Model Specification

```typescript
export interface AssignmentItem {
  id: string;
  lessonId: string;
  courseId: string;
  title: string;
  dueDate: string;
  maxScore: number;
  instructions: string;
  passagePrompt: string; // قطعة الواجب المطلوب إعرابها وحلها
  allowedFileTypes: string[]; // ["pdf", "docx", "doc", "jpg", "png", "webp"]
  maxFileSizeMB: number; // 10
}

export interface AssignmentSubmission {
  submissionId: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  status: "pending" | "submitted" | "graded";
  fileName: string;
  fileSize: number;
  fileUrl: string;
  studentNotes?: string;
  score?: number;
  teacherFeedback?: string;
  gradedAt?: string;
}
```

### 5.2 Upload Engine & Validation Rules
- **Drag-and-Drop Dropzone**:
  - Interactive border glow (`border-dashed border-2 border-[#753b47] hover:border-[#fe6257]`).
  - Active drag state feedback.
- **Strict Client-Side Validation**:
  - **MIME Check**: Only accepts `application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`, `application/msword`, `image/jpeg`, `image/png`, `image/webp`. Rejects unsupported files with Arabic error: `"نوع الملف غير مدعوم. يرجى رفع ملف بصيغة PDF أو Word أو صورة."`.
  - **File Size Check**: Max `10 * 1024 * 1024` bytes (10MB). Rejects oversized files with: `"حجم الملف كبير جداً. الحد الأقصى المسموح به هو 10 ميجابايت."`.
- **Upload Simulation**:
  - Real-time progress bar (0% -> 35% -> 70% -> 100%) with cancel button.
  - Shows uploaded file chip with file icon, file name, formatted size (`2.3 MB`), and delete button.
- **Submission Feedback Loop**:
  - Shows submission status: `"تم التسليم بنجاح • في انتظار التصحيح"`.
  - Pre-populated mock submissions demonstrate graded state: Score `19/20`, Teacher comment: `"أحسنت يا بطل! إعراب دقيق لقواعد النحو، اهتم فقط بضبط علامات الترقيم في التعبير."`.

---

## 6. Checkout, Payment & Immediate Enrollment Engine (R4)

### 6.1 Domain Model Specification

```typescript
export type PaymentMethodType = "vodafone_cash" | "fawry" | "credit_card" | "voucher";

export interface CouponCode {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  description: string;
  minOrderValue?: number;
  expiryDate: string;
}

export interface OrderInvoice {
  orderId: string;
  studentId: string;
  studentName: string;
  studentPhone: string;
  courseId: string;
  courseTitle: string;
  gradeName: string;
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
  paymentMethod: PaymentMethodType;
  transactionReference: string;
  createdAt: string;
  status: "completed" | "pending_verification";
}
```

### 6.2 Pre-Configured Coupon Codes

| Code | Type | Value | Arabic Description |
|---|---|---|---|
| `AREF2026` | Percentage | 20% | كود خصم بداية الفصل الدراسي (خصم 20%) |
| `AWAL50` | Fixed | 50 ج.م | خصم ترحيبي للطلاب المتفوقين (50 ج.م) |
| `FREEPASS` | Percentage | 100% | منحة الطالب المتفوق (اشتراك مجاني كامل 100%) |

### 6.3 Local Egyptian Payment Gateways Flow

#### 1. فودافون كاش / محافظ إلكترونية (Vodafone Cash / InstaPay / E-Wallets)
- **Instructions**:
  - تحويل المبلغ المطلوب إلى رقم محفظة المنصة المعتمد: `01097303002`.
  - إدخال رقم المحفظة المحول منها (11 رقم يبدأ بـ 010 أو 011 أو 012 أو 015).
  - إدخال الرقم المرجعي للتحويل أو إرفاق لقطة شاشة إشعار التحويل.
- **Verification**: Simulates instant transaction matching and confirms enrollment.

#### 2. فوري باي (Fawry Pay)
- **Instructions**:
  - يولد النظام رقم دفع فوري مكون من 8 أرقام (مثال: `FAWRY-7842-9103`).
  - صلاحية الكود 48 ساعة.
  - إرشادات الدفع: `"توجه لأي ماكينة فوري واطلب سداد كود الخدمة (788) برقم الكود المرجعي"`.
- **Action**: Immediate simulated verification for demo mode.

#### 3. بطاقة بنكية (فيزا / ماستركارد / ميزة)
- **Inputs**:
  - رقم البطاقة (16 رقم مع تنسيق تلقائي `XXXX XXXX XXXX XXXX`).
  - تاريخ الانتهاء (`MM/YY`).
  - رمز الأمان `CVV` (3 أرقام).
  - اسم حامل البطاقة.
- **Security UX**: شارات أمان 256-bit SSL و 3D-Secure.

#### 4. كود السنتر / كارت شحن المنصة (Academy Voucher)
- **Inputs**:
  - إدخال كود الكارت المكون من 12 رمزاً (مثال: `AREF-2026-GOLD`).
  - التحقق الفوري وتفعيل الكورس دون أي رسوم إضافية.

### 6.4 Immediate Access Entitlement & State Persistence
- Upon payment confirmation:
  1. `enrolledCourses` state is updated with `course.id`.
  2. Order invoice is added to `purchaseHistory`.
  3. Persistent storage updates (`localStorage` sync).
  4. Course details modal instantly updates:
     - Badge shows `"مشترك في هذا الكورس"`.
     - Lock icons on all lectures, quizzes, summaries, and assignments disappear.
     - Content becomes fully playable and interactive.
  5. Course Card updates:
     - Action button turns to `"مُشترك بالفعل • ابدأ التعلم"`.

---

## 7. Unified State Management Architecture (Zustand Stores)

To satisfy **R5 (Architecture, State Management & System Design)**, all global domain logic should be encapsulated in decoupled, typed Zustand stores with persistence:

```
src/stores/
├── useAuthStore.ts        (Student session, JWT token, user profile)
├── useEnrollmentStore.ts  (Enrolled courses list, purchases, invoices, coupons)
├── useExamStore.ts        (Active exam session, answers, timer, attempts, history)
└── useAssignmentStore.ts  (Assignments catalog, student submissions, feedback)
```

### 7.1 `useEnrollmentStore.ts` Contract
```typescript
interface EnrollmentStore {
  enrolledCourseIds: string[];
  purchaseHistory: OrderInvoice[];
  appliedCoupon: CouponCode | null;
  
  // Actions
  isEnrolled: (courseId: string) => boolean;
  enrollCourse: (courseId: string, invoice: OrderInvoice) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  calculateDiscount: (originalPrice: number) => { discount: number; finalPrice: number };
}
```

### 7.2 `useExamStore.ts` Contract
```typescript
interface ExamStore {
  activeExam: ExamData | null;
  currentQuestionIndex: number;
  answers: Record<string, string | number>;
  flaggedQuestions: string[];
  timeRemainingSeconds: number;
  isExamSubmitted: boolean;
  attempts: Record<string, StudentExamAttempt[]>; // examId -> attempts

  // Actions
  startExam: (exam: ExamData) => void;
  selectAnswer: (questionId: string, answer: string | number) => void;
  toggleFlagQuestion: (questionId: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  jumpToQuestion: (index: number) => void;
  decrementTimer: () => void;
  submitExam: () => StudentExamAttempt;
  resetExam: () => void;
}
```

### 7.3 `useAssignmentStore.ts` Contract
```typescript
interface AssignmentStore {
  assignments: AssignmentItem[];
  submissions: Record<string, AssignmentSubmission>; // assignmentId -> submission

  // Actions
  getAssignment: (assignmentId: string) => AssignmentItem | undefined;
  getSubmission: (assignmentId: string) => AssignmentSubmission | undefined;
  submitAssignment: (submission: Omit<AssignmentSubmission, "submissionId" | "submittedAt" | "status">) => void;
}
```

---

## 8. Component Hierarchy & File Layout Blueprint

```
src/
├── components/
│   ├── exams/
│   │   ├── ExamPlayerModal.tsx       (Master container for active quiz/exam)
│   │   ├── ExamTimer.tsx             (Countdown timer with visual alert)
│   │   ├── ExamQuestionView.tsx      (Renders passage, question, MCQ/TF options)
│   │   ├── ExamNavigationGrid.tsx    (Drawer/strip of question numbers with states)
│   │   ├── ExamResultModal.tsx       (Celebratory score card & pass/fail)
│   │   └── ExamReviewModal.tsx       (Detailed breakdown with teacher explanation)
│   │
│   ├── summaries/
│   │   ├── SummaryViewerModal.tsx    (Interactive summary display & embedded viewer)
│   │   └── SummaryDownloadButton.tsx (Secure download button with watermark generator)
│   │
│   ├── assignments/
│   │   ├── AssignmentModal.tsx       (Assignment details, prompt & submission)
│   │   ├── FileUploadDropzone.tsx    (Drag-and-drop with MIME & size validation)
│   │   └── AssignmentFeedbackCard.tsx(Shows submission status, grade & feedback)
│   │
│   ├── payment/
│   │   ├── CheckoutModal.tsx         (Master checkout dialog)
│   │   ├── OrderSummaryCard.tsx      (Course details, pricing breakdown)
│   │   ├── CouponInput.tsx           (Coupon validation & application)
│   │   ├── PaymentMethodTabs.tsx     (Vodafone Cash, Fawry, Card, Voucher)
│   │   └── PaymentSuccessModal.tsx   (Receipt display & direct access CTA)
│   │
│   └── courses/
│       ├── CourseDetailsModal.tsx    (Integration point for quizzes, summaries, buy)
│       └── CourseCard.tsx            (Integration point for enrolled status)
│
├── data/
│   ├── mockData.ts                   (Course list & profile)
│   ├── mockExams.ts                  (Rich Arabic question banks per stage/unit)
│   ├── mockSummaries.ts              (Summary documents & study notes)
│   ├── mockAssignments.ts            (Homework prompts & pre-graded submissions)
│   └── mockCoupons.ts                (Discount coupon catalog)
│
└── stores/
    ├── useEnrollmentStore.ts
    ├── useExamStore.ts
    └── useAssignmentStore.ts
```

---

## 9. Integration Flow with Existing Code

### 9.1 `CourseDetailsModal.tsx` Integration:
1. In the Curriculum accordion (`unit.lessons`):
   - When a lesson has `type === "quiz"`: clicking opens `ExamPlayerModal`.
   - When a lesson has `type === "pdf"`: clicking opens `SummaryViewerModal`.
   - When a lesson has `type === "assignment"`: clicking opens `AssignmentModal`.
   - If the course is not enrolled and the lesson is not `isFreePreview`, clicking prompts `CheckoutModal`.
2. In the Purchase Sidebar:
   - "الإشتراك في الكورس" button calls `onEnrollNow(course)`.
   - Instead of opening WhatsApp, `onEnrollNow` checks authentication and opens `CheckoutModal`.
   - If the student is already enrolled (`isEnrolled(course.id)`), the button label displays `"أنت مشترك بالفعل"` and scrolls directly to the curriculum content.

### 9.2 `CourseCard.tsx` Integration:
- Injects `isEnrolled(course.id)`.
- If enrolled, primary action button displays `"مُشترك بالفعل • ابدأ المشاهدة"` in emerald/burgundy, opening the course modal with all content unlocked.

---

## 10. Empirical Verification Plan

### 10.1 Vitest Unit Tests Specification (`src/test/r3_r4_modules.test.ts`):
1. **Quiz Grading Engine**:
   - Verify calculation of score for 100% correct, 50% correct, and 0% correct.
   - Verify pass/fail threshold against `passScore: 5`.
   - Verify `maxAttempts` enforcement.
2. **File Upload Validation**:
   - Verify rejection of disallowed MIME types (`.exe`, `.zip`, `.mp3`).
   - Verify rejection of files exceeding 10MB.
   - Verify acceptance of valid files (`application/pdf`, `image/png`, `.docx`).
3. **Coupon Code Math**:
   - Verify percentage discount calculation (`AREF2026` -> 20% off).
   - Verify fixed discount calculation (`AWAL50` -> 50 LE off).
   - Verify 100% free discount (`FREEPASS` -> 0 LE final price).
4. **Immediate Access Entitlement**:
   - Verify adding a course ID to `enrolledCourseIds` immediately sets `isEnrolled(id)` to `true`.
   - Verify persistence in storage across sessions.

### 10.2 Playwright Visual & Functional Verification:
- **Desktop (1440px)** and **Mobile (390px)**:
  - Open `CourseDetailsModal` -> click on Quiz -> verify Exam start screen, questions, timer, submission, and result modal.
  - Open Checkout -> apply coupon `AREF2026` -> verify price drops by 20% -> select Vodafone Cash / Fawry -> confirm payment -> verify success receipt -> verify course becomes immediately unlocked.
  - Open Assignment -> test drag-and-drop file upload with invalid and valid files -> submit -> verify submission status card.
  - Confirm 0 clipped Arabic RTL text, 0 layout collisions, and smooth responsive interaction.
