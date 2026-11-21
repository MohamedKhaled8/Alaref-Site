# Task Assignment: Explorer 1 — M1 Iteration 2: Race Condition Analysis & Fix Strategy

## Context
Milestone 1 Gate resulted in FAIL due to Challenger 2's empirical rejection:
1. Critical Race Condition in `useAuthStore.ts`: in-flight `login()` overriding synchronous `logout()`, leaving `useAuthStore` in `isAuthenticated: true` and restoring tokens into `localStorage`.
Test failure: `src/test/challenger_m1_state_stress.test.tsx` -> "RACE BUG 1: in-flight successful login followed immediately by logout leaves store authenticated".

## Objective
Analyze `src/stores/useAuthStore.ts` and formulate a comprehensive, robust fix strategy:
1. Cancellation / Request Epoch mechanism to guarantee that any `logout()` or state reset invalidates all pending/in-flight `login()`, `register()`, and `refreshSession()` promises.
2. Ensure tokens are never written to `localStorage` if the active intent is unauthenticated.
3. Clean up TDZ / constant naming in `useAuthStore.ts`.

## Inputs:
- Original Request: `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\ORIGINAL_REQUEST.md`
- Master Plan: `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\orchestrator_1\PROJECT.md`
- Gate Status: `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\orchestrator_1\GATE_STATUS.md`
- Challenger 2 Handoff: `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\challenger_m1_2\handoff.md`

## Output:
Produce fix strategy report in `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_m1_r2_1\fix_strategy.md` and `handoff.md`.
Notify parent via `send_message`.


## 2026-11-09T00:15:06Z
You are assigned as Explorer 1 for Milestone 1 Iteration 2 in Al Aref Academy (`study-buddy-sim`).

Read your task dispatch from:
`e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_m1_r2_1\DISPATCH.md`
and the original request from:
`e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\ORIGINAL_REQUEST.md`

Your Working Directory: `e:\Mt FlutterProject\yalaAcademy\study-buddy-sim`
Your State Directory: `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_m1_r2_1`

Analyze the race condition in `useAuthStore.ts` identified by Challenger 2 (`challenger_m1_2/handoff.md`). Recommend a concrete, elegant fix strategy (e.g. request epoch / cancellation check) that ensures in-flight logins cannot clobber logouts or write tokens to localStorage.
Write your report to `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_m1_r2_1\fix_strategy.md` and write `handoff.md`.
Notify parent via `send_message`.
