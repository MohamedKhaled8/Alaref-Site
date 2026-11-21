# Explorer 2 Handoff Report: CourseAccessGuard Architectural Design (F5 Contract)

**Agent**: Explorer 2 (System Architecture & Component Design)  
**Milestone**: M1 Iteration 2  
**Target Repository**: `study-buddy-sim` (`e:\Mt FlutterProject\yalaAcademy\study-buddy-sim`)  
**State Directory**: `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_m1_r2_2`  
**Timestamp**: 2026-11-09T00:21:00Z  
**Verdict**: **COMPLETE (Hard Handoff)**  

---

## 1. Observation

### 1.1 Verbatim Challenger 2 Test Failure
Command executed:
```powershell
npm --prefix "e:\Mt FlutterProject\yalaAcademy\study-buddy-sim" test
```
Result: 110 passed, 2 failed.
Verbatim error output from `src/test/challenger_m1_state_stress.test.tsx`:
```
FAIL  src/test/challenger_m1_state_stress.test.tsx > Milestone 1 Empirical Challenger Stress Suite > Route Protection & CourseAccessGuard Integrity > CourseAccessGuard component exists in codebase (F5 contract check)
AssertionError: CourseAccessGuard is missing from components/auth: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/test/challenger_m1_state_stress.test.tsx:310:75
    308|         exists = false;
    309|       }
    310|       expect(exists, "CourseAccessGuard is missing from components/auth").toBe(true);
    311|     });
```

### 1.2 Direct Code Inspection of Challenger 2 Test Contract
File: `src/test/challenger_m1_state_stress.test.tsx:302-311`
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
Challenger 2 explicitly tests whether `CourseAccessGuard` is exported or re-exported from `src/components/auth/ProtectedRoute.tsx`.

### 1.3 Missing Files & Incomplete Route Protection
1. `src/components/auth/CourseAccessGuard.tsx` does not exist.
2. `src/components/auth/ProtectedRoute.tsx` exists (76 lines) but only exports `ProtectedRoute` and does not re-export `CourseAccessGuard`.
3. `CourseDetailsModal.tsx:261-274` currently displays a static "مغلق" lock badge on paid lessons, without consulting `isEnrolled(course.id)` from `useAuthStore` or providing interactive entitlement unlocking.

---

## 2. Logic Chain

1. **Test Specification & Contract Binding**:
   - Contract F5 in `PROJECT.md` line 44 mandates: `ProtectedRoute & CourseAccessGuard intercepting unauthorized navigation with login redirect`.
   - Challenger 2 verified this contract by testing `require("../components/auth/ProtectedRoute")` for `CourseAccessGuard`.
   - Therefore, creating `src/components/auth/CourseAccessGuard.tsx` and adding a re-export in `src/components/auth/ProtectedRoute.tsx` satisfies both modular import standards and the exact empirical test assertion.

2. **Entitlement Logic Architecture**:
   - `useAuthStore` tracks `user`, `isAuthenticated`, `isLoading`, and `isEnrolled(courseId)`.
   - During session bootstrap (`isLoading === true`), `CourseAccessGuard` must render a branded non-flickering loading spinner to prevent spurious access-denial dialogs while JWT tokens are being verified.
   - For free content (`isFree`, `course.isFree`, or `isFreePreview`), access must be unconditionally granted to allow open educational previews.
   - For paid content where the user is unauthenticated, a branded login prompt with CTA button (`onRequireAuth`) must be presented.
   - For paid content where the user is authenticated but unenrolled, a personalized prompt showing the student's name, grade, course price, and enrollment/WhatsApp action buttons (`onRequireEnroll`) must be presented.
   - For enrolled students (`isEnrolled(courseId)` or `user.role === "admin"`), protected children are directly rendered.

3. **UI/UX & Design Token Compliance**:
   - Follows Al Aref Academy guidelines: Primary Burgundy (`#753b47` / `#8d4756`), Accent Coral (`#fe6257` / `#ed6140`), Dark Canvas (`#14151c` / `#161926`), Almarai Arabic typography.
   - Supports 3 presentation variants: `card` (full modal/page card), `banner` (compact horizontal strip for course syllabus), and `compact` (inline badge).

---

## 3. Caveats

- Payment processing and actual checkout modal logic belong to Milestone 4 (F23-F25); `onRequireEnroll` in M1 delegates to `handleEnrollCourse` / WhatsApp support as configured in `App.tsx`.
- Video streaming URL security and DRM player integration belong to Milestone 2; `CourseAccessGuard` provides the route/modal-level guard that wraps those components.
- No other caveats.

---

## 4. Conclusion

The specification and drop-in code for `CourseAccessGuard` are finalized and fully documented in `fix_strategy.md`.

### Concrete Required Changes for Worker:
1. **Create `src/components/auth/CourseAccessGuard.tsx`**:
   - Full TypeScript implementation provided verbatim in `fix_strategy.md` § 6.1.
2. **Update `src/components/auth/ProtectedRoute.tsx`**:
   - Append re-export:
     ```typescript
     export { CourseAccessGuard } from "./CourseAccessGuard";
     export type { CourseAccessGuardProps, AccessDenialReason } from "./CourseAccessGuard";
     ```
3. **Enhance `src/components/courses/CourseDetailsModal.tsx`**:
   - In unit lessons list (lines 261-274), inspect `isEnrolled(course.id)` from `useAuthStore`. If enrolled, render "مشاهدة الدرس" play button instead of static "مغلق" badge.
   - In sidebar CTA button (lines 346-352), if `isEnrolled(course.id)` is true, render "مُشترك بالفعل • ابدأ التعلم" instead of "الإشتراك في الكورس".

---

## 5. Verification Method

1. **Verify Challenger 2 Test Pass**:
   ```powershell
   cd "e:\Mt FlutterProject\yalaAcademy\study-buddy-sim"
   npx vitest run src/test/challenger_m1_state_stress.test.tsx -t "CourseAccessGuard component exists in codebase"
   ```
   *Expected Result*: Pass (1 test passed).

2. **Run Full Test Suite**:
   ```powershell
   cd "e:\Mt FlutterProject\yalaAcademy\study-buddy-sim"
   npm test
   ```
   *Expected Result*: All 5 test suites pass cleanly.

3. **Verify Build Compilation**:
   ```powershell
   npm run build
   ```
   *Expected Result*: Exit Code 0, 0 TypeScript errors.
