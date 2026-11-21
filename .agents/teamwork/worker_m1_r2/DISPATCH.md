# Task Assignment: Worker M1 Iteration 2 — Remediation of Race Condition & CourseAccessGuard

## Mandatory Integrity Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Objective
Apply the exact surgical remediation designed by Explorers 1, 2, and 3 to fix the two defects identified by Challenger 2 in `study-buddy-sim`:
1. Fix asynchronous race conditions in `src/stores/useAuthStore.ts` using the Monotonic Request Epoch pattern.
2. Implement `src/components/auth/CourseAccessGuard.tsx` and re-export it in `src/components/auth/ProtectedRoute.tsx`.
3. Verify that all 16 tests in `src/test/challenger_m1_state_stress.test.tsx` pass cleanly, and run the full test suite (`npm test`) and production build (`npm run build`).

## File Ownership & Tasks:
1. **`src/stores/useAuthStore.ts`**:
   - Apply the Monotonic Request Epoch fix detailed in `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_m1_r2_1\fix_strategy.md`.
   - Ensure an in-flight `login()`, `register()`, or `initialize()` does NOT set state or write tokens to `localStorage` if `logout()` occurred.
   - Clean up line 86 to use `LOCAL_STORAGE_ACCESS_TOKEN_KEY` and remove duplicate line 223.
2. **`src/components/auth/CourseAccessGuard.tsx`**:
   - Create the component using the complete drop-in implementation provided in `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_m1_r2_2\fix_strategy.md`.
3. **`src/components/auth/ProtectedRoute.tsx`**:
   - Re-export `CourseAccessGuard` (`export { CourseAccessGuard } from "./CourseAccessGuard";`).
4. **Verification**:
   - Run `npx vitest run src/test/challenger_m1_state_stress.test.tsx` (all 16 tests must pass).
   - Run `npm test` (all test suites must pass 100%).
   - Run `npm run build` (must complete with Exit Code 0 and 0 errors).

## Inputs:
- Original Request: `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\ORIGINAL_REQUEST.md`
- Master Plan: `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\orchestrator_1\PROJECT.md`
- Challenger 2 Handoff: `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\challenger_m1_2\handoff.md`
- Explorer 1 Fix Strategy: `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_m1_r2_1\fix_strategy.md`
- Explorer 2 Fix Strategy: `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_m1_r2_2\fix_strategy.md`
- Explorer 3 QA Strategy: `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_m1_r2_3\fix_strategy.md`

## Output:
Produce `handoff.md` in `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\worker_m1_r2\handoff.md`.
Notify parent via `send_message`.


## 2026-11-09T00:21:14Z
You are assigned as Worker M1 Iteration 2 for Al Aref Academy (`study-buddy-sim`).

Read your task dispatch from:
`e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\worker_m1_r2\DISPATCH.md`
and the original request from:
`e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\ORIGINAL_REQUEST.md`

Your Working Directory: `e:\Mt FlutterProject\yalaAcademy\study-buddy-sim`
Your State Directory: `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\worker_m1_r2`

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Follow the exact surgical instructions in `DISPATCH.md`:
1. Apply the Monotonic Request Epoch race condition fix to `src/stores/useAuthStore.ts` using `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_m1_r2_1\fix_strategy.md`.
2. Create `src/components/auth/CourseAccessGuard.tsx` using `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_m1_r2_2\fix_strategy.md`.
3. Re-export `CourseAccessGuard` in `src/components/auth/ProtectedRoute.tsx`.
4. Run `npx vitest run src/test/challenger_m1_state_stress.test.tsx` and ensure all 16 tests pass.
5. Run full test suite (`npm test`) and production build (`npm run build`).

Write your handoff report to `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\worker_m1_r2\handoff.md`.
Notify parent via `send_message`.
