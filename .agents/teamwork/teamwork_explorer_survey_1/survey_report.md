# Comprehensive Architecture & Authentication (R1) Survey Report
**Project**: Al Aref Academy (`study-buddy-sim`) — منصة مستر عمرو عارف التعليمية  
**Investigator**: Survey Explorer 1  
**Timestamp**: 2026-11-08T23:48:00Z  
**Target Repository**: `e:\Mt FlutterProject\yalaAcademy\study-buddy-sim`

---

## 1. Executive Summary & Forensic Findings

A comprehensive static inspection was conducted on `study-buddy-sim` at `e:\Mt FlutterProject\yalaAcademy\study-buddy-sim`. 

### Key Highlights
1. **Application Foundation**: Built with **React 18.3.1**, **Vite 5.4.19**, **TypeScript 5.8.3**, **Tailwind CSS 3.4.17**, **Framer Motion 12.38.0**, and **Zustand 5.0.12** (already installed in `package.json`).
2. **Current Architecture Mode**: The application is currently structured as a rich, animated single-page marketing landing page in `src/App.tsx`, driving views through modal overlays (`AuthModal`, `CourseDetailsModal`, `LeaderboardModal`, `WhatsAppSupportModal`) and smooth scroll anchors. `react-router-dom` (v6.30.1) is installed in `package.json` but not yet wired to define persistent application routes.
3. **Current Authentication State (R1 Audit)**:
   - A high-fidelity visual modal exists in `src/components/auth/AuthModal.tsx`.
   - Forms include Egyptian phone formatting, password confirmation, stage selection, and the forensic rule enforcing `studentPhone !== parentPhone`.
   - **Crucial Gap**: Authentication is entirely simulated in transient local component state with `setTimeout` (`src/components/auth/AuthModal.tsx` lines 56-61 and 89-94).
   - There are **no JWT tokens**, **no cryptographic signing/verification**, **no persistent storage**, **no session lifecycle**, **no user store**, and **no route guards**.
   - `src/App.tsx` only stores a transient string `loggedInStudent: string | null`, which is wiped on browser refresh.
   - `src/components/layout/Header.tsx` always shows "تسجيل الدخول" and "حساب جديد" buttons regardless of login state.
4. **Branding & Forensic Cleanliness**: The platform represents **مستر عمرو عارف** (أستاذ اللغة العربية للإبتدائية والإعدادية), with stages strictly restricted to Primary 6, Prep 1, Prep 2, Prep 3, and Comprehensive Foundation (644, 645, 646, 647, 643). An isolated copy anomaly was discovered in `WhatsAppSupportModal.tsx` (lines 19, 34, 51) still referencing the benchmark name "محمد العميد", which should be sanitized during implementation.

---

## 2. Core Environment & Configuration Audit

| Configuration | File | Key Settings & Dependencies |
|---|---|---|
| **Bundler & Dev Server** | `vite.config.ts` | Host: `0.0.0.0`, Port: `8080` (strictPort: true), alias `@` -> `./src`, SWC React plugin, React/TanStack Query deduplication. |
| **Package Dependencies** | `package.json` | React 18.3.1, `zustand` 5.0.12, `react-router-dom` 6.30.1, `zod` 3.25.76, `react-hook-form` 7.61.1, `@tanstack/react-query` 5.83.0, Radix UI suite, `framer-motion` 12.38.0, `lucide-react` 0.462.0, `sonner` 1.7.4. |
| **TypeScript** | `tsconfig.app.json` | Target: `ES2020`, Module: `ESNext`, Resolution: `bundler`, paths: `{"@/*": ["./src/*"]}`, `skipLibCheck: true`. |
| **Testing Suite** | `vitest.config.ts` | Vitest 3.2.4 with jsdom environment, globals: true, setup: `./src/test/setup.ts`, include: `src/**/*.{test,spec}.{ts,tsx}`. |
| **E2E / QA** | `playwright.config.ts` | Playwright test 1.57.0 with Lovable agent integration. |
| **Styling & Fonts** | `tailwind.config.ts`, `src/index.css` | Custom fonts (`IBM Plex Sans Arabic`, `Almarai`, `Cairo`, `Amin`, `Somar`), brand colors (`--primary: #ed6140`, secondary amber, deep dark backgrounds `#0c0e17` / `#161926`, ivory light mode `#faf9f6`). |

---

## 3. Full Directory Tree & Codebase Map

```
study-buddy-sim/
├── index.html                           # RTL Arabic HTML root (IBM Plex Sans Arabic, Almarai, Cairo)
├── package.json                         # Dependencies (React, Zustand, React-Router-DOM, Zod, Vitest)
├── vite.config.ts                       # Port 8080, SWC, @ alias
├── vitest.config.ts                     # jsdom, globals, setupFiles
├── playwright.config.ts                 # Playwright test config
├── tailwind.config.ts                   # Tailwind tokens & font families
├── tsconfig.json                        # TS project references
├── tsconfig.app.json                    # TS compiler options
├── public/
│   ├── assets/                          # Avatars, banners, badge images (prim_6, prep_1, prep_2, prep_3)
│   └── fonts/                           # Amin, Somar, VIPHALA, FSAlbert font files
└── src/
    ├── main.tsx                         # Entry point (React.StrictMode -> App)
    ├── App.tsx                          # Core Application orchestrator (landing + modal states)
    ├── index.css                        # CSS variables, fonts, Lenis smooth scrolling rules
    ├── vite-env.d.ts                    # Vite client types
    ├── components/
    │   ├── auth/
    │   │   └── AuthModal.tsx            # Current visual login/register modal dialog
    │   ├── common/
    │   │   ├── AmrArefCalligraphyLogo.tsx  # Master calligraphy brand logo
    │   │   ├── ShinyText.tsx            # Shimmer text effect
    │   │   ├── SpotlightCard.tsx        # Interactive mouse-follow glow card
    │   │   ├── WaleedThemeToggle.tsx    # Light/Dark mode switcher
    │   │   └── WhatsAppSupportModal.tsx # WhatsApp support modal with prefilled message
    │   ├── courses/
    │   │   ├── CourseCard.tsx           # 16:9 retina course card component
    │   │   └── CourseDetailsModal.tsx   # Course syllabus, lectures accordion, and buy sidebar
    │   ├── home/
    │   │   ├── AppsBanner.tsx           # iOS / Android / Windows app download banners
    │   │   ├── EditorialHero.tsx        # Hero section with teacher portrait and calligraphy
    │   │   ├── FeaturedCourses.tsx      # Carousel slider for featured courses
    │   │   ├── GradeSelector.tsx        # 4-stage landscape cards selector
    │   │   ├── HeroStatsRibbon.tsx      # Dual bento cards (400K+, 360K+) and quote
    │   │   ├── HonorRollPreview.tsx     # Top 3 student podium and ranked honor roll
    │   │   └── PromoBanner.tsx          # Master promotional banner
    │   ├── layout/
    │   │   ├── Footer.tsx               # 4-column footer with contact and grade links
    │   │   ├── Header.tsx               # Sticky header with grade dropdown, search, auth buttons
    │   │   └── MobileBottomNav.tsx      # Mobile floating navigation bar (register, home, login)
    │   └── leaderboard/
    │       └── LeaderboardModal.tsx     # Full leaderboard modal dialog with stage filters
    ├── data/
    │   └── mockData.ts                  # Master models: teacherProfile, gradeStages, coursesList (15 courses), honorStudentsList
    ├── hooks/
    │   └── useLenisScroll.ts            # Smooth momentum scrolling via Lenis
    ├── lib/
    │   └── utils.ts                     # clsx + twMerge helper
    └── test/
        ├── elameed.test.ts              # Forensic domain rules verification suite (7 passing tests)
        ├── setup.ts                     # @testing-library/jest-dom setup
        └── *.mjs                        # Verification and forensic capture scripts
```

---

## 4. Architecture & Component Deep Dive

### 4.1. Layout & Navigation Flow
- **`src/components/layout/Header.tsx`**:
  - Sticky glassmorphic navbar with `AmrArefCalligraphyLogo`, `WaleedThemeToggle`, grade navigation dropdown, and search trigger.
  - Auth Buttons (lines 214-229): Outline button for `تسجيل الدخول` and solid button for `حساب جديد`.
  - **Issue**: Props only accept `onOpenAuth: (mode: "login" | "register") => void`. It has no knowledge of current user authentication, student name, or profile menu.
- **`src/components/layout/MobileBottomNav.tsx`**:
  - Floating pill on mobile viewports (<1024px) with three triggers: "انشاء حساب" (UserPlus), "الرئيسية" (Home), and "تسجيل دخول" (User).
  - Also lacks dynamic state to reflect authenticated status (e.g. changing to "كورساتي" / "حسابي").
- **`src/components/layout/Footer.tsx`**:
  - High contrast 4-column layout with direct hotline `01097303002`, WhatsApp triggers, stage navigation, and developer credit (`Mada - مدى`).

### 4.2. Home Page & Course Showcase
- **`src/App.tsx`**:
  - Holds single-page state: `isDark`, `activeSection`, `selectedGrade`, and 4 modal states (`selectedCourseForDetails`, `authModalOpen`, `whatsappModalOpen`, `leaderboardModalOpen`).
  - Auth state is currently `const [loggedInStudent, setLoggedInStudent] = useState<string | null>(null);`.
  - In `handleEnrollCourse` (lines 101-114):
    ```ts
    if (course.isFree) {
      setSelectedCourseForDetails(course);
      showToast(`تم فتح المحتوى المجاني لكورس: ${course.title}`);
    } else {
      if (!loggedInStudent) {
        handleOpenAuth("login");
        showToast("يرجى تسجيل الدخول أو إنشاء حساب للاشتراك في الكورس.");
      } else {
        setWhatsappReason(`تفعيل كود اشتراك كورس: ${course.title} (سعر: ${course.price} ج.م)`);
        setWhatsappModalOpen(true);
      }
    }
    ```
- **`src/components/courses/CourseDetailsModal.tsx`**:
  - Contains 4 tabs: "المحتوى" (curriculum accordion), "عن الكورس", "التعليقات", "التقييمات".
  - Sidebar contains course pricing, enroll CTA, specifications, and teacher profile.
  - Video preview simulation: clicking "معاينة مجانية" opens an aspect-ratio container with an animated watermark (`طالب: أحمد محمد • 01012345678 • ID: 10482`).

---

## 5. Current State of Authentication (Deep Forensic Audit)

### 5.1. `AuthModal.tsx` Source Inspection

```tsx
// src/components/auth/AuthModal.tsx (lines 46-61)
const handleLoginSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  setErrorMessage(null);

  if (!loginPhone.trim() || !loginPassword.trim()) {
    setErrorMessage("يرجى إدخال رقم الهاتف وكلمة المرور.");
    return;
  }

  setIsSubmitting(true);
  setTimeout(() => {
    setIsSubmitting(false);
    onSuccess("طالب مسجل"); // Hardcoded fake success
    onClose();
  }, 600);
};
```

And registration:
```tsx
// src/components/auth/AuthModal.tsx (lines 63-94)
const handleRegisterSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  setErrorMessage(null);

  if (!fullName.trim() || !studentPhone.trim() || !parentPhone.trim() || !registerPassword) {
    setErrorMessage("يرجى تعبئة كافة الحقول المطلوبة.");
    return;
  }

  // Exact Verified Rule from El-Ameed: Parent phone must be different from student phone
  if (studentPhone.trim() === parentPhone.trim()) {
    setErrorMessage("تنبيه: يجب أن يكون رقم ولي الأمر مختلفاً عن رقم هاتف الطالب لضمان تفعيل الحساب واستلام التقارير.");
    return;
  }

  if (registerPassword.length < 6) {
    setErrorMessage("كلمة المرور يجب أن لا تقل عن 6 أحرف أو أرقام.");
    return;
  }

  if (registerPassword !== confirmPassword) {
    setErrorMessage("كلمتا المرور غير متطابقتين.");
    return;
  }

  setIsSubmitting(true);
  setTimeout(() => {
    setIsSubmitting(false);
    onSuccess(fullName); // Hardcoded fake success
    onClose();
  }, 600);
};
```

### 5.2. Missing Authentication & Security Layers
1. **No User Identity Object**: No user ID, email/phone, grade assignment, enrolled courses, or registered device fingerprint.
2. **No JWT Issuance or Decoding**: No JSON Web Token is minted, signed, or validated.
3. **No Session Storage**: Tokens are neither stored in `localStorage`, `sessionStorage`, nor cookies. Refreshing the browser instantly terminates the session.
4. **No Route Guards or Middleware**: There is no router boundary or route protection component to intercept navigation to protected content (e.g. exams, paid lessons, assignments, student dashboard).
5. **No Token Expiration / Refresh Loop**: Without a token with an `exp` claim, session renewal and automatic logout on token expiry cannot function.
6. **No Device Binding Enforcement**: The UI displays the alert `"الأجهزة المسموح بها: 1"` (Single-Device Policy), but has zero backend or local logic checking or binding the device identifier.

---

## 6. Requirement Analysis & Architecture Specification for R1

To satisfy the acceptance criteria in `ORIGINAL_REQUEST.md`:
> - Users can register new accounts and log in with credentials.
> - JWT tokens are issued, verified, stored securely, and used to guard protected routes and API calls.
> - Unauthenticated users are redirected to login when attempting to access restricted courses or user dashboards.

The following architectural components must be introduced adhering to clean code and SOLID principles:

### 6.1. Domain Models & Type Contracts (`src/types/auth.ts`)

```ts
export type UserRole = "student" | "admin" | "instructor";

export interface User {
  id: string;
  fullName: string;
  studentPhone: string;
  parentPhone: string;
  gradeId: string;
  gradeName: string;
  role: UserRole;
  deviceId: string;
  avatar?: string;
  enrolledCourseIds: string[];
  createdAt: string;
}

export interface JWTPayload {
  sub: string;             // User ID
  name: string;            // Full Name
  phone: string;           // Student Phone
  gradeId: string;         // Enrolled Grade
  role: UserRole;          // User role
  deviceId: string;        // Bound hardware/browser identifier
  iat: number;             // Issued-At timestamp (seconds)
  exp: number;             // Expiration timestamp (seconds)
  iss: string;             // Issuer: "alaref-academy"
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;       // in seconds (e.g. 900 for 15m)
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface LoginCredentials {
  studentPhone: string;
  password: string;
  deviceId?: string;
}

export interface RegisterData {
  fullName: string;
  studentPhone: string;
  parentPhone: string;
  gradeId: string;
  password: string;
  deviceId?: string;
}
```

### 6.2. JWT Token Engine & Cryptographic Layer (`src/services/jwtService.ts`)

To avoid external bloated dependencies while achieving standards-compliant JWT handling:
- **Encoding & Signing**: Standard JWT structure (`base64Url(header).base64Url(payload).signature`).
- **Signature Algorithm**: HMAC-SHA256 implemented using standard `window.crypto.subtle` (or isomorphic Web Crypto).
- **Validation**:
  1. Verify token structure (3 segments separated by dots).
  2. Verify signature integrity using HMAC-SHA256 secret.
  3. Validate expiration: `Date.now() / 1000 < payload.exp`.
  4. Validate issuer (`alaref-academy`).
  5. Validate bound `deviceId` against client device ID.
- **Refresh Mechanism**: Issue a companion Refresh Token (e.g. 7-day expiry) used by `refreshSession()` to issue fresh access tokens without requiring the student to re-enter credentials.

### 6.3. Centralized Mock / Real Auth Service (`src/services/authService.ts`)
- Manages an in-memory/localStorage user registry initialized with default demo students.
- **Pre-seeded Accounts**:
  - Student 1: Phone `01012345678`, Parent Phone `01198765432`, Password `password123`, Name `أحمد محمد علي`, Grade `grade-3-prep`, Enrolled in `course-prep3-summary`.
  - Student 2: Phone `01099887766`, Parent Phone `01234567890`, Password `password123`, Name `مريم حسام مختار`, Grade `grade-2-prep`.
- **Validation Rules**:
  - Egyptian phone format: regex `^01[0125][0-9]{8}$`.
  - Discrepancy rule: `studentPhone !== parentPhone` (throws domain error if identical).
  - Single-device rule: Checks if user's registered `deviceId` matches incoming `deviceId`. If mismatched, returns device conflict error with support instructions.
  - Password hashing simulation / validation (minimum 6 characters).

### 6.4. State Management with Zustand (`src/stores/useAuthStore.ts`)
Zustand is already in `package.json` (v5.0.12). The store will manage reactive auth state:
- **State**:
  - `user: User | null`
  - `token: string | null`
  - `refreshToken: string | null`
  - `isAuthenticated: boolean`
  - `isLoading: boolean`
  - `error: string | null`
  - `deviceId: string`
- **Actions**:
  - `initialize(): Promise<void>` (hydrates from `localStorage`, validates JWT, refreshes if near expiry)
  - `login(credentials: LoginCredentials): Promise<void>`
  - `register(data: RegisterData): Promise<void>`
  - `logout(): void`
  - `enrollCourse(courseId: string): void`
  - `isEnrolled(courseId: string): boolean`
  - `clearError(): void`

### 6.5. Route Protection & Guards
Since `react-router-dom` is installed, route protection should be decoupled and modular:
1. **`ProtectedRoute`**:
   - Checks `isAuthenticated`.
   - If loading, displays a branded spinner / skeleton.
   - If not authenticated, redirects to `/login` or triggers `openAuthModal` while preserving `returnUrl` in router state.
2. **`CourseAccessGuard`**:
   - Checks both `isAuthenticated` and `user.enrolledCourseIds.includes(courseId)` (or `course.isFree`).
   - If not enrolled, redirects to `/checkout/:courseId` or course overview modal.
3. **`GuestRoute`**:
   - For `/login` or `/register` pages, redirects authenticated users to `/` or `/dashboard`.

---

## 7. Code Layout, Integration Points & Risks

### 7.1. File Boundaries & Proposed Additions

```
src/
├── types/
│   └── auth.ts                      # (NEW) Auth interfaces & JWT contracts
├── services/
│   ├── authService.ts               # (NEW) Local user DB, phone validation, login/register logic
│   └── jwtService.ts                # (NEW) Web Crypto HMAC-SHA256 JWT generation/verification
├── stores/
│   └── useAuthStore.ts              # (NEW) Zustand authentication store
├── components/
│   ├── auth/
│   │   ├── AuthModal.tsx            # (UPDATE) Wire to useAuthStore with real validation & loading
│   │   ├── ProtectedRoute.tsx       # (NEW) Router guard component
│   │   └── UserProfileDropdown.tsx  # (NEW) Avatar, student grade, enrolled courses & logout button
│   └── layout/
│       ├── Header.tsx               # (UPDATE) Render UserProfileDropdown when isAuthenticated
│       └── MobileBottomNav.tsx      # (UPDATE) Render active student profile icon when isAuthenticated
```

### 7.2. Potential Pitfalls & Mitigations

| Risk / Pitfall | Impact | Forensic Mitigation |
|---|---|---|
| **Modal vs Router Coexistence** | Users expect deep links (`/courses/:id`, `/exam/:id`, `/login`) while the existing landing page uses modal dialogs. | Provide both URL-based routing (via `react-router-dom`) and query-parameter / state-driven modal triggers. If navigated to `/login`, `AuthModal` opens automatically or dedicated route renders. |
| **XSS & Storage Token Security** | Storing JWTs in `localStorage` can be vulnerable to script injection. | 1. Never store sensitive credentials (passwords) in JWT payload.<br>2. Sign tokens with cryptographic HMAC.<br>3. Enforce client-side expiration validation.<br>4. Sanitize all user inputs before rendering. |
| **Device Identifier Volatility** | If `deviceId` generates a new UUID on every browser session, users will constantly be locked out. | Persist a unique device fingerprint in `localStorage` under `alaref_device_id`. Generate once, reuse across sessions. |
| **Strict Mode Double Invocation** | React 18 StrictMode calls `useEffect` twice in development, which might trigger duplicate refresh token requests. | Use an in-flight promise memoization or abort controller in `initializeAuth()`. |
| **Residual Brand Strings** | `WhatsAppSupportModal.tsx` contains text referencing "مستر محمد العميد". | Replace all occurrences with `teacherProfile.name` ("مستر عمرو عارف") and dynamic props. |

---

## 8. Verification Strategy & Acceptance Checklist

To guarantee zero regression and confirm full acceptance:

1. **Compilation Gate**:
   - `npm run build` exits with code 0 and 0 TypeScript compilation errors.
2. **Unit & Integration Test Gate**:
   - Create comprehensive unit test suite `src/test/auth.test.ts` testing:
     - Egyptian phone number validation.
     - Student phone vs Parent phone discrepancy rule.
     - Password validation and matching.
     - JWT creation, decoding, signature check, and expiration handling.
     - Single-device mismatch rejection.
     - Login and registration flows updating Zustand store and `localStorage`.
     - Course enrollment entitlement check.
   - Run `npm test` (`vitest run`) ensuring 100% of test suites pass cleanly.
3. **Visual & Interactive Inspection Gate**:
   - Verify Header shows user profile badge and logout when logged in.
   - Verify Mobile bottom bar reflects authenticated state.
   - Verify protected action (clicking paid course enroll or exam) prompts login modal if unauthenticated.
   - Verify RTL Arabic alignment, Cairo/Almarai typography, and zero layout collision across 1440px desktop and 390px mobile viewports.
