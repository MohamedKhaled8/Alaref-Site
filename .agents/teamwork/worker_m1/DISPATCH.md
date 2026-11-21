# Task Assignment: Worker 1 — Milestone 1: Authentication & JWT Security Infrastructure

## Mandatory Integrity Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Objective
Implement Requirement R1 (Authentication & JWT Security) in `study-buddy-sim` (`e:\Mt FlutterProject\yalaAcademy\study-buddy-sim`).

## Key Tasks & Requirements:
1. **Domain Types & Contracts (`src/types/auth.ts`)**:
   - `User`, `JWTPayload`, `AuthTokens`, `LoginCredentials`, `RegisterData`, `AuthState`.
2. **JWT Security Engine (`src/services/jwtService.ts`)**:
   - Standards-compliant JWT token generation, HMAC-SHA256 signing via Web Crypto (`window.crypto.subtle`), payload decoding, expiration check (`exp`), issuer check (`alaref-academy`), and signature verification.
3. **Authentication Service (`src/services/authService.ts`)**:
   - Local student registry with pre-seeded test accounts (e.g. `01012345678` / `password123`, `01099887766` / `password123`).
   - Egyptian phone validation (`^01[0125][0-9]{8}$`).
   - Domain rule check: `studentPhone !== parentPhone` (reject with Arabic warning if identical).
   - Single-device policy check: verify/bind `deviceId` generated and persisted in localStorage (`alaref_device_id`).
   - Session tokens generation (`accessToken` 15-min TTL, `refreshToken` 7-day TTL).
4. **Zustand State Store (`src/stores/useAuthStore.ts`)**:
   - Manage `user`, `token`, `refreshToken`, `isAuthenticated`, `isLoading`, `error`.
   - Actions: `initialize()` (hydrates from localStorage and validates token), `login()`, `register()`, `logout()`, `enrollCourse()`, `isEnrolled()`.
5. **UI & Layout Integration**:
   - Update `src/components/auth/AuthModal.tsx` to bind directly to `useAuthStore` with real validation, loading states, and error alerts.
   - Create `src/components/auth/UserProfileDropdown.tsx` (avatar, student name, grade badge, enrolled courses count, logout button).
   - Update `src/components/layout/Header.tsx` to display `UserProfileDropdown` when `isAuthenticated` is true, replacing the static login/register buttons.
   - Update `src/components/layout/MobileBottomNav.tsx` to reflect logged-in state.
   - Create `src/components/auth/ProtectedRoute.tsx` route guard.
   - Update `src/App.tsx` to initialize `useAuthStore` and integrate auth actions.
   - Sanitize copy in `src/components/common/WhatsAppSupportModal.tsx` to replace any mentions of "محمد العميد" with "مستر عمرو عارف".
6. **Testing & Verification**:
   - Create `src/test/auth.test.ts` covering Egyptian phone formatting, phone discrepancy validation, JWT creation/signature verification/expiration, login, registration, and store persistence.
   - Run `npm test` and `npm run build` to confirm exit code 0 and 100% test pass.

## Inputs:
- Original Request: `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\ORIGINAL_REQUEST.md`
- Master Plan: `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\orchestrator_1\PROJECT.md`
- Survey Findings: `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\teamwork_explorer_survey_1\survey_report.md`

## Output:
Produce `handoff.md` in your state folder `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\worker_m1\handoff.md` detailing all changes made and test results.
When done, notify parent via `send_message`.
