# Task Assignment: E2E Test Writer — Requirements-Driven Test Suite Creation

## Mandatory Integrity Warning
DO NOT CHEAT. All test cases must genuinely assert real requirements based on user specifications. DO NOT write dummy tests or empty assertions. A teamwork_auditor will independently verify your work.

## Objective
Design and implement a comprehensive requirements-driven test suite for Al Aref Academy (`study-buddy-sim`) in `e:\Mt FlutterProject\yalaAcademy\study-buddy-sim`.

## Test Methodology (Dual Track):
Derive test cases directly from `ORIGINAL_REQUEST.md` and `PROJECT.md` across the 4 Tiers:
- **Tier 1 - Feature Coverage**: Happy paths for R1 (Auth/JWT), R2 (Video Streaming / URL Security), R3 (Exams, Summaries, Assignments), R4 (Payment / Enrollment).
- **Tier 2 - Boundary & Corner Cases**: Invalid phones, identical student/parent phones, expired JWTs, invalid signatures, non-existent lessons, oversized assignment files (>10MB), invalid file types, invalid coupon codes, 100% discount coupons (`FREEPASS`).
- **Tier 3 - Cross-Feature Interactions**: User logs in -> applies coupon -> completes checkout -> course is enrolled -> accesses lesson room -> takes exam -> submits assignment.
- **Tier 4 - Real-World Application Scenarios**: Multi-stage students (الصف الثالث الإعدادي، الأول الإعدادي، إلخ) completing their educational journey.

## File Ownership:
- `src/test/e2e_requirements.test.ts`
- Write `TEST_READY.md` in `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\orchestrator_1\TEST_READY.md` once tests are written and documented.

## Inputs:
- Original Request: `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\ORIGINAL_REQUEST.md`
- Master Plan: `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\orchestrator_1\PROJECT.md`
- Test Infrastructure: `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\orchestrator_1\TEST_INFRA.md`

## Output:
Produce `handoff.md` in your state folder `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\test_writer_e2e\handoff.md`.
When done, notify parent via `send_message`.


## 2026-11-08T23:50:05Z
You are assigned as E2E Test Writer for Al Aref Academy (`study-buddy-sim`) on the parallel E2E Testing Track.

Read your task dispatch from:
`e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\test_writer_e2e\DISPATCH.md`
and the original request from:
`e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\ORIGINAL_REQUEST.md`

Your Working Directory: `e:\Mt FlutterProject\yalaAcademy\study-buddy-sim`
Your State Directory: `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\test_writer_e2e`

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All test cases must genuinely assert real requirements based on user specifications. DO NOT write dummy tests or empty assertions. A teamwork_auditor will independently verify your work.

Design and write the comprehensive requirements-driven test suite:
- File: `src/test/e2e_requirements.test.ts`
- Cover Tiers 1-4 per `PROJECT.md` and `TEST_INFRA.md`.
- Note: Keep in mind other workers are implementing M1-M4, so structure tests modularly or write helper verification assertions that test interfaces and contract behaviors cleanly.
- Run `npm test` and `npm run build` to verify tests compile and pass or demonstrate expected contract behaviors.
- Write `TEST_READY.md` in `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\orchestrator_1\TEST_READY.md`.
- Write your handoff report in `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\test_writer_e2e\handoff.md`.
When done, notify parent via `send_message`.
