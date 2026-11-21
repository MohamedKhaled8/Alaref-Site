# BRIEFING — 2026-11-09T00:20:30Z

## Mission
Design `CourseAccessGuard.tsx` (F5 contract) in `src/components/auth/CourseAccessGuard.tsx` to resolve Challenger 2's defect finding, defining props, entitlement verification logic (`course.isFree`, `isEnrolled(courseId)`), and responsive UI states.

## 🔒 My Identity
- Archetype: explorer
- Roles: explorer, investigator, system architect
- Working directory: e:\Mt FlutterProject\yalaAcademy\study-buddy-sim
- State folder: e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_m1_r2_2
- Original parent: dcfa26c2-877d-4235-8be0-f54d1cc8afb2
- Milestone: M1 Iteration 2 (Authentication & Route Protection Guards)

## 🔒 Key Constraints
- Read-only investigation — do NOT modify project source code directly
- Propose exact specification, code implementation, and integration strategy in state folder (`fix_strategy.md` and `handoff.md`)
- Ensure compliance with Challenger 2 test checks (including `require("../components/auth/ProtectedRoute").CourseAccessGuard`)
- Follow Al Aref Academy UI/UX guidelines (Pillar 1 & 2: frameless organic composition, no artificial frames, Cairo/Almarai fonts, brand colors #753b47, #fe6257, #111625, dark mode, responsive 390px/1440px)

## Current Parent
- Conversation ID: dcfa26c2-877d-4235-8be0-f54d1cc8afb2
- Updated: 2026-11-09T00:20:30Z

## Investigation State
- **Explored paths**:
  - `src/test/challenger_m1_state_stress.test.tsx` (line 302-311: verified Challenger 2 test requiring `require("../components/auth/ProtectedRoute").CourseAccessGuard`)
  - `src/components/auth/ProtectedRoute.tsx` (existing protected route structure)
  - `src/components/courses/CourseDetailsModal.tsx` (curriculum units, lessons, preview states, enrollment CTA)
  - `src/components/courses/CourseCard.tsx` (card states)
  - `src/stores/useAuthStore.ts` (`isEnrolled`, `enrollCourse`, `user`, `isAuthenticated`, `isLoading`)
  - `src/types/auth.ts` (`User`, `AuthState`)
  - `src/data/mockData.ts` (`CourseItem`, `CurriculumUnit`, `LessonItem`)
- **Key findings**:
  - Challenger 2 explicitly checks: `const authExports = Object.keys(require("../components/auth/ProtectedRoute")); exists = authExports.includes("CourseAccessGuard");`
  - Vitest execution confirms 110 passed and 2 failed, isolating `CourseAccessGuard` omission and the login/logout race condition.
  - `CourseAccessGuard` must support 3 distinct variants (`card`, `banner`, `compact`), 4 entitlement logic tiers (loading, free preview, unauthenticated login CTA, unenrolled purchase CTA), and custom fallback renderers.
  - Re-exporting `CourseAccessGuard` in `ProtectedRoute.tsx` guarantees instant pass of Challenger 2's empirical test suite while maintaining clean modular separation in `src/components/auth/CourseAccessGuard.tsx`.
- **Unexplored areas**:
  - None within M1 scope. Full integration path mapped for M2 (`LessonRoomModal.tsx`).

## Key Decisions Made
- Designed comprehensive `CourseAccessGuardProps` interface supporting `courseId`, `course`, `isFree`, `isFreePreview`, `variant`, `onRequireAuth`, `onRequireEnroll`, and `fallback` render functions.
- Formulated the exact complete TypeScript implementation in `fix_strategy.md`.
- Specified the re-export in `src/components/auth/ProtectedRoute.tsx`.
- Designed integration patterns for `CourseDetailsModal.tsx` and future M2/M3 modules.

## Artifact Index
- `fix_strategy.md` — Complete architecture design, props, verification logic, responsive UI, integration pattern, and exact code drop-in.
- `handoff.md` — 5-component handoff report.
- `progress.md` — Liveness heartbeat.
