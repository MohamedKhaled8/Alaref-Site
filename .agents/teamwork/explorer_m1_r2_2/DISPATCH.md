# Task Assignment: Explorer 2 — M1 Iteration 2: CourseAccessGuard Design

## 2026-11-09T00:15:16Z
You are assigned as Explorer 2 for Milestone 1 Iteration 2 in Al Aref Academy (`study-buddy-sim`).

Read your task dispatch from:
`e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_m1_r2_2\DISPATCH.md`
and the original request from:
`e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\ORIGINAL_REQUEST.md`

Your Working Directory: `e:\Mt FlutterProject\yalaAcademy\study-buddy-sim`
Your State Directory: `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_m1_r2_2`

Design `CourseAccessGuard.tsx` (F5 contract) in `src/components/auth/CourseAccessGuard.tsx` to resolve Challenger 2's defect finding. Define its props, entitlement verification logic (`course.isFree`, `isEnrolled(courseId)`), and responsive UI states.
Write your report to `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_m1_r2_2\fix_strategy.md` and write `handoff.md`.
Notify parent via `send_message`.

## Context
Milestone 1 Gate resulted in FAIL due to Challenger 2's empirical rejection:
2. Missing Deliverable: `CourseAccessGuard` (contract F5 in PROJECT.md) was omitted from `src/components/auth/` and `ProtectedRoute` was left unreferenced.
Test failure: `src/test/challenger_m1_state_stress.test.tsx` -> "CourseAccessGuard component exists in codebase (F5 contract check)".

## Objective
Design `src/components/auth/CourseAccessGuard.tsx`:
1. Check `course.isFree`, `isAuthenticated`, and `isEnrolled(courseId)`.
2. Fallback UI: If unauthenticated, prompt `AuthModal` or render locked banner with login CTA.
   If authenticated but unenrolled, render enrollment prompt with direct checkout action.
3. Integration: Seamless coordination with `CourseDetailsModal.tsx` and curriculum lessons.

## Inputs:
- Original Request: `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\ORIGINAL_REQUEST.md`
- Master Plan: `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\orchestrator_1\PROJECT.md`
- Gate Status: `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\orchestrator_1\GATE_STATUS.md`
- Challenger 2 Handoff: `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\challenger_m1_2\handoff.md`

## Output:
Produce fix strategy report in `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_m1_r2_2\fix_strategy.md` and `handoff.md`.
Notify parent via `send_message`.
