# Project: Al Aref Academy (`study-buddy-sim`)

## 1. Architecture & System Overview

Al Aref Academy is an educational platform for Mr. Amr Aref (أستاذ اللغة العربية) benchmarked against `el-ameed.com`.
The architecture consists of a decoupled React 18 + Vite frontend with TypeScript, Tailwind CSS, Radix UI, Framer Motion, and Zustand v5 state management stores.

### Core Architectural Layers:
1. **Presentation Layer (`src/components/`)**:
   - `auth/`: Login/Register dialogs, route guards, user profile menu.
   - `video/`: Multi-format player (HLS + MP4), timeline scrubber, controls bar, moving forensic watermark, DevTools guard.
   - `exams/`: Interactive exam player, countdown timer, question view, question navigation grid, result modal, answer review modal.
   - `summaries/`: Document viewer, secure PDF download button with dynamic watermark generator.
   - `assignments/`: Homework viewer, drag-and-drop dropzone with MIME & 10MB size validation, submission status & feedback card.
   - `payment/`: Checkout modal, order summary, coupon input, Egyptian payment tabs (Vodafone Cash/InstaPay, Fawry, Card, Voucher), receipt modal.
   - `courses/`: Course card, course details modal, curriculum accordion.
   - `lessons/`: Dedicated `LessonRoomModal` linking video, syllabus, summaries, and quizzes.
2. **State Management Layer (`src/stores/`)**:
   - `useAuthStore`: Student session, JWT tokens, device fingerprint, profile, hydration.
   - `useVideoPlayerStore`: Playback time, buffering, resolution, speed, volume, fullscreen, security alerts.
   - `useExamStore`: Active quiz/exam, answers, flagged questions, timer, grading, attempts history.
   - `useAssignmentStore`: Assignments catalog, student submissions, file metadata, grading feedback.
   - `useEnrollmentStore`: Enrolled course IDs, purchase history, active coupons, discount calculator.
3. **Services & Security Layer (`src/services/`)**:
   - `jwtService`: Web Crypto HMAC-SHA256 JWT creation, signing, parsing, and expiration validation.
   - `authService`: Local user database, phone formatting, phone discrepancy validation (`studentPhone !== parentPhone`), single-device lock.
   - `videoSecurityService`: HMAC-SHA256 signed stream URL generator, ephemeral Blob URL generator, token expiry validator, concurrency heartbeat.
4. **Data Models Layer (`src/data/` & `src/types/`)**:
   - Master data in `mockData.ts` enriched with full curriculum media parameters.
   - Separate mock files for exams (`mockExams.ts`), summaries (`mockSummaries.ts`), assignments (`mockAssignments.ts`), and coupons (`mockCoupons.ts`).

---

## 2. Feature Inventory

Every feature surveyed is cataloged below with strict milestone assignment:

| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F1 | Student Registration | Full registration with Egyptian phone validation, parent phone check (`studentPhone !== parentPhone`), grade selection, password confirm | M1 | Survey 1 |
| F2 | Student Login | Credentials login with phone and password, error handling, session loading | M1 | Survey 1 |
| F3 | JWT Issuance & Verification | Standards-compliant JWT token minting with HMAC-SHA256 signature, expiry, and payload claims | M1 | Survey 1 |
| F4 | Session Lifecycle & Persistence | Storing tokens in localStorage, auto-hydration on app start, silent token refresh | M1 | Survey 1 |
| F5 | Route Protection Guards | `ProtectedRoute` & `CourseAccessGuard` intercepting unauthorized navigation with login redirect | M1 | Survey 1 |
| F6 | User Profile Header Integration | Replacing static header auth buttons with dynamic user avatar, grade, and logout menu | M1 | Survey 1 |
| F7 | Single-Device Binding | Device fingerprint generation and enforcement of single active device policy | M1 | Survey 1 |
| F8 | Branding Cleanup | Sanitizing remaining "محمد العميد" copy in `WhatsAppSupportModal.tsx` to "مستر عمرو عارف" | M1 | Survey 1 |
| F9 | Multi-Format Video Engine | Composable player supporting HLS (`.m3u8` via `hls.js`) and progressive MP4/Blob | M2 | Survey 2 |
| F10 | Cryptographic Tokenized Stream URLs | HMAC-SHA256 signed stream URLs with 15-min rolling TTL and student binding | M2 | Survey 2 |
| F11 | In-Memory Media Decoupling | Ephemeral dynamic Blob URLs and MSE stream buffers preventing raw URL exposure in DOM | M2 | Survey 2 |
| F12 | Dynamic Forensic Watermark | Animated floating overlay with student name/phone/ID, 2D oscillation, and MutationObserver anti-tamper | M2 | Survey 2 |
| F13 | DevTools Inspection Guard | Real-time debugger timing probe pausing video and blurring screen if DevTools are opened | M2 | Survey 2 |
| F14 | Interactive Player Controls | Glassmorphic controls, timeline scrubber with hover preview, 10s seek, speed & resolution menus | M2 | Survey 2 |
| F15 | Dedicated Lesson Room Modal | Full lesson viewing experience (`LessonRoomModal`) integrating video, playlist, and materials | M2 | Survey 2 |
| F16 | Interactive Arabic Question Banks | Comprehensive question banks across Grammar (نحو), Rhetoric (بلاغة), and Literature for 5 stages | M3 | Survey 3 |
| F17 | Exam Player & Countdown Timer | Active exam player with auto-submit countdown timer, progress bar, and question navigation grid | M3 | Survey 3 |
| F18 | Exam Grading & Review Engine | Instant score calculation, pass/fail evaluation, confetti celebration modal, and detailed explanation review | M3 | Survey 3 |
| F19 | Lesson Summaries & Document System | Interactive summary viewer and secure PDF download workflow with dynamic student watermark | M3 | Survey 3 |
| F20 | Student Assignments Portal | Homework prompts with instructions and passage parsing requirements | M3 | Survey 3 |
| F21 | Drag-and-Drop File Upload Zone | File upload with strict MIME verification and 10MB size limit check | M3 | Survey 3 |
| F22 | Assignment Feedback & Grading Loop | Display of submission status, teacher score (e.g. 19/20), and pedagogical feedback | M3 | Survey 3 |
| F23 | Egyptian Multi-Method Checkout Modal | Dedicated checkout dialog supporting Vodafone Cash/InstaPay, Fawry, Credit Cards, and Academy Vouchers | M4 | Survey 3 |
| F24 | Coupon Code Engine | Discount validation engine supporting percentage (`AREF2026`), fixed (`AWAL50`), and 100% free (`FREEPASS`) | M4 | Survey 3 |
| F25 | Immediate Access Entitlement | Instant update of enrolled courses in state upon payment, unlocking course lessons, quizzes, and summaries | M4 | Survey 3 |
| F26 | Dynamic Course Card & Modal State | Course cards and modals reflect enrolled state ("مُشترك بالفعل • ابدأ التعلم"), removing lock icons | M4 | Survey 3 |
| F27 | Purchase History & Invoices | Tracking and viewing completed orders and transaction reference IDs | M4 | Survey 3 |
| F28 | Full E2E & Visual Verification Gate | 100% test pass on Vitest, clean build, and Playwright verification across Desktop (1440px) and Mobile (390px) | M5 | Survey 1,2,3 |
| F29 | Adversarial Coverage Hardening | Edge cases, token tampering, anti-tamper resilience, concurrency stress tests | M5 | Survey 1,2,3 |

---

## 3. Milestones Decomposition

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Authentication & JWT Security Infrastructure | R1 & F1-F8: Types, `jwtService`, `authService`, `useAuthStore`, `AuthModal`, `ProtectedRoute`, `UserProfileDropdown`, `CourseAccessGuard`, branding cleanup | none | DONE |
| M2 | Protected Video Streaming Engine & Lesson Room | R2 & F9-F15: Types, `videoSecurityService`, `useVideoPlayerStore`, `ProtectedVideoPlayer`, `VideoControlsBar`, `DynamicForensicWatermark`, `DevToolsSecurityGuard`, `LessonRoomModal` | M1 | DONE |
| M3 | Educational Modules: Exams, Summaries & Assignments | R3 & F16-F22: Types, mock data banks, `useExamStore`, `useAssignmentStore`, `ExamPlayerModal`, `ExamTimer`, `ExamResultModal`, `ExamReviewModal`, `SummaryViewerModal`, `FileUploadDropzone` | M1 | DONE |
| M4 | Payment, Checkout & Immediate Access Entitlement | R4 & F23-F27: Types, `useEnrollmentStore`, `CheckoutModal`, `CouponInput`, `PaymentMethodTabs`, `PaymentSuccessModal`, dynamic enrollment unlocking in `CourseCard` & `CourseDetailsModal` | M1, M2, M3 | DONE |
| M5 | Final Dual-Track E2E Integration & Adversarial Verification | R5 & F28-F29: Full E2E test suite (Tiers 1-4), Playwright responsive visual testing (Desktop 1440px / Mobile 390px), adversarial hardening (Tier 5), Forensic Audit | M1, M2, M3, M4 | IN_PROGRESS |

---

## 4. Interface Contracts

### 4.1 Auth ↔ App & Other Modules (`src/types/auth.ts`)
```typescript
export interface User {
  id: string;
  fullName: string;
  studentPhone: string;
  parentPhone: string;
  gradeId: string;
  gradeName: string;
  role: "student" | "admin";
  deviceId: string;
  enrolledCourseIds: string[];
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (phone: string, pass: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  isEnrolled: (courseId: string) => boolean;
  enrollCourse: (courseId: string) => void;
}
```

### 4.2 Video ↔ Auth & Enrollment (`src/types/video.ts`)
```typescript
export interface SignedStreamRequest {
  lessonId: string;
  studentId: string;
  deviceId: string;
}

export interface SignedStreamResponse {
  token: string;
  streamUrl: string; // obfuscated or signed URL
  format: "hls" | "mp4" | "blob";
  expiresAt: number;
  watermark: {
    studentName: string;
    studentPhone: string;
    studentId: string;
    sessionIp: string;
  };
}
```

### 4.3 Exams & Assignments ↔ State (`src/types/educational.ts`)
```typescript
export interface ExamSubmissionResult {
  attemptId: string;
  examId: string;
  studentId: string;
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  timeSpentSeconds: number;
}

export interface AssignmentSubmissionContract {
  assignmentId: string;
  studentId: string;
  studentName: string;
  fileName: string;
  fileSize: number;
  fileBlobUrl: string;
  notes?: string;
}
```

### 4.4 Payment ↔ Enrollment (`src/types/payment.ts`)
```typescript
export interface CheckoutPayload {
  courseId: string;
  couponCode?: string;
  paymentMethod: "vodafone_cash" | "fawry" | "credit_card" | "voucher";
  paymentDetails: Record<string, string>;
}

export interface CheckoutResult {
  success: boolean;
  orderId: string;
  transactionReference: string;
  enrolledCourseId: string;
  message: string;
}
```

---

## 5. Code Layout & File Boundaries

```
study-buddy-sim/src/
├── types/
│   ├── auth.ts                   # Auth, JWT, user models
│   ├── video.ts                  # Video formats, manifests, tokens
│   ├── educational.ts            # Exams, questions, summaries, assignments
│   └── payment.ts                # Checkout, payment methods, coupons, orders
├── services/
│   ├── jwtService.ts             # Web Crypto HMAC-SHA256 JWT engine
│   ├── authService.ts            # User registry, phone validation, credentials check
│   └── videoSecurityService.ts   # Stream tokens, blob generator, anti-tamper monitor
├── stores/
│   ├── useAuthStore.ts           # Zustand auth store
│   ├── useVideoPlayerStore.ts    # Zustand video player state
│   ├── useExamStore.ts           # Zustand interactive exam session
│   ├── useAssignmentStore.ts     # Zustand homework submission store
│   └── useEnrollmentStore.ts     # Zustand enrollment and checkout store
├── data/
│   ├── mockData.ts               # Existing master data updated with media parameters
│   ├── mockExams.ts              # Rich Arabic question banks for 5 stages
│   ├── mockSummaries.ts          # Summaries documents & key points
│   ├── mockAssignments.ts        # Homework prompts and graded feedback
│   └── mockCoupons.ts            # Discount coupon catalog
├── components/
│   ├── auth/
│   │   ├── AuthModal.tsx         # Real validation, JWT integration, loading states
│   │   ├── ProtectedRoute.tsx    # Route and view protection wrapper
│   │   └── UserProfileDropdown.tsx # Student avatar, info, enrolled courses, logout
│   ├── video/
│   │   ├── ProtectedVideoPlayer.tsx # Multi-format player with security layers
│   │   ├── VideoControlsBar.tsx     # Custom glassmorphic controls
│   │   ├── VideoTimelineScrubber.tsx # Custom scrubber with hover bubble & notes
│   │   ├── DynamicForensicWatermark.tsx # Moving watermark with anti-tamper
│   │   ├── DevToolsSecurityGuard.tsx # Anti-inspection & debugger detection
│   │   ├── QualitySelectorMenu.tsx  # HLS resolution switcher
│   │   └── SpeedSelectorMenu.tsx    # Playback speed switcher
│   ├── exams/
│   │   ├── ExamPlayerModal.tsx      # Exam player dialog
│   │   ├── ExamTimer.tsx            # Countdown timer with alert
│   │   ├── ExamQuestionView.tsx     # Question prompt and option selection
│   │   ├── ExamNavigationGrid.tsx   # Question navigation grid
│   │   ├── ExamResultModal.tsx      # Pass/fail result & celebration
│   │   └── ExamReviewModal.tsx      # Detailed review with explanations
│   ├── summaries/
│   │   ├── SummaryViewerModal.tsx   # PDF/Document viewer
│   │   └── SummaryDownloadButton.tsx # Secure download with student watermark
│   ├── assignments/
│   │   ├── AssignmentModal.tsx      # Homework details and submission
│   │   ├── FileUploadDropzone.tsx   # Drag-and-drop with MIME/size check
│   │   └── AssignmentFeedbackCard.tsx # Graded status & teacher feedback
│   ├── payment/
│   │   ├── CheckoutModal.tsx        # Checkout dialog
│   │   ├── OrderSummaryCard.tsx     # Order breakdown & pricing
│   │   ├── CouponInput.tsx          # Coupon code validation
│   │   ├── PaymentMethodTabs.tsx    # Vodafone Cash, Fawry, Card, Voucher
│   │   └── PaymentSuccessModal.tsx  # Receipt display & direct access CTA
│   ├── lessons/
│   │   └── LessonRoomModal.tsx      # Full lesson workspace with video & syllabus
│   ├── courses/
│   │   ├── CourseDetailsModal.tsx   # Integrated with enrollment, video, exams, summaries
│   │   └── CourseCard.tsx           # Reflects enrolled status
│   └── layout/
│       ├── Header.tsx               # Updated with UserProfileDropdown
│       └── MobileBottomNav.tsx      # Updated with authenticated state
```
