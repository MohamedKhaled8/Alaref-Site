# Fix Strategy: Asynchronous Race Condition Elimination & State Integrity in `useAuthStore`

**Author**: Explorer 1  
**Target File**: `study-buddy-sim/src/stores/useAuthStore.ts`  
**Milestone**: Milestone 1 Iteration 2  
**Timestamp**: 2026-11-09T00:20:00Z  

---

## 1. Executive Summary & Root Cause Analysis

In Milestone 1 Iteration 1, Challenger 2 identified a critical asynchronous race condition in `src/stores/useAuthStore.ts`. When a user initiates an asynchronous operation (such as `login()` or `register()`) and subsequently invokes `logout()` while the cryptographic signature computation is still in-flight, `logout()` synchronously resets the store to unauthenticated and removes tokens from `localStorage`. However, once the delayed `authService.login()` promise resolves, the completion handler unconditionally commits tokens back to `localStorage` and updates the Zustand store to `isAuthenticated: true`.

This results in:
1. **Ghost / Zombie Authentication**: A user who explicitly clicked "Logout" is silently re-authenticated.
2. **Persistent Storage Pollution**: Expired or unauthorized JWT tokens remain stored in `localStorage`, causing subsequent sessions or page reloads to hydrate as authenticated.
3. **Mismatched State**: In concurrent multi-account login flows, an older, slower login response can clobber a newer, faster login response, or leave `user` in Zustand mismatched with the JWT in `localStorage`.
4. **TDZ & Code Smell**: Line 86 accesses `LOCAL_STORAGE_ACCESS_KEY` before its declaration at line 223, instead of using the imported constant `LOCAL_STORAGE_ACCESS_TOKEN_KEY`.

---

## 2. Anatomical Breakdown of Current Vulnerabilities

### 2.1 Vulnerability 1: In-Flight `login()` vs Synchronous `logout()`
- **Code Location**: `src/stores/useAuthStore.ts:109-139` vs `src/stores/useAuthStore.ts:173-187`
- **Current Flow**:
  ```typescript
  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login({ ...credentials, deviceId }); // Async (10-50ms)

      // BUG: logout() executed during the await above, but execution resumes here unconditionally:
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, response.tokens.accessToken);
        localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY, response.tokens.refreshToken);
      }

      set({
        user: response.user,
        token: response.tokens.accessToken,
        refreshToken: response.tokens.refreshToken,
        deviceId,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return true;
    } catch (err) { ... }
  }
  ```
- **Consequence**: Test `RACE BUG 1` fails with:
  `AssertionError: CRITICAL RACE CONDITION: store became authenticated despite explicit logout: expected true to be false`

### 2.2 Vulnerability 2: In-Flight `register()` vs Synchronous `logout()`
- **Code Location**: `src/stores/useAuthStore.ts:141-171`
- **Current Flow**: Identical to `login()`. Any delayed registration completion writes tokens and authenticates store regardless of whether `logout()` was called in the interim.

### 2.3 Vulnerability 3: In-Flight `initialize()` vs `login()` or `logout()`
- **Code Location**: `src/stores/useAuthStore.ts:19-107`
- **Current Flow**: `initialize()` awaits `jwtService.verifyToken()` and optionally `authService.refreshSession()`. If an active `login()` or `logout()` occurs while `initialize()` is awaiting crypto verification, `initialize()` can overwrite the fresh login session or purge newly saved tokens.

### 2.4 Vulnerability 4: `enrollCourse()` vs `logout()`
- **Code Location**: `src/stores/useAuthStore.ts:189-209`
- **Current Flow**: `enrollCourse()` captures `const { user } = get()`, awaits `enrollCourseInDb()`, and then sets `set({ user: updatedUser })`. If the user logged out while `enrollCourseInDb()` was running, `updatedUser` is set into store state, resurrecting the logged-out user as a zombie.

### 2.5 Vulnerability 5: TDZ Reference Error in `initialize()`
- **Code Location**: `src/stores/useAuthStore.ts:86` and `src/stores/useAuthStore.ts:223`
- **Current Flow**:
  Line 86 calls: `localStorage.removeItem(LOCAL_STORAGE_ACCESS_KEY);`
  Line 223 declares: `const LOCAL_STORAGE_ACCESS_KEY = LOCAL_STORAGE_ACCESS_TOKEN_KEY;`
  `LOCAL_STORAGE_ACCESS_KEY` is referenced before declaration and duplicates the imported `LOCAL_STORAGE_ACCESS_TOKEN_KEY`.

---

## 3. Recommended Fix Architecture: Monotonic Request Epoch Pattern

The most elegant, performant, and bulletproof pattern for this concurrency class is the **Monotonic Request Epoch Pattern** (also known as the *Generational Counter* or *Sequence Ticket* pattern).

### 3.1 Design Principles

1. **Atomic Epoch Incrementation**:
   An integer variable `authEpoch` tracks the current active generation of authentication intent.
   - Any state-invalidating synchronous action (`logout()`) increments `authEpoch++`.
   - Any new asynchronous session-initiating action (`login()`, `register()`, `initialize()`) increments `authEpoch` and captures its local ticket:
     ```typescript
     const epoch = ++authEpoch;
     ```

2. **Strict Storage & State Commit Gate**:
   Before writing any token to `localStorage` and before updating the Zustand store via `set(...)`, the method verifies:
   ```typescript
   if (epoch !== authEpoch) {
     // Intention was superseded or cancelled!
     return true; // or return false / void
   }
   ```
   **Crucial Invariant**: The check occurs **BEFORE** `localStorage.setItem()`, ensuring zero token persistence if the user logged out.

3. **Promise Return Semantics (Compatibility with Tests & Callers)**:
   - In `src/test/challenger_m1_state_stress.test.tsx` line 58:
     ```typescript
     const loginResult = await loginPromise;
     expect(loginResult, "Login should have been successful").toBe(true);
     ```
   - When credentials are valid, the underlying cryptographic authentication succeeded. Returning `true` satisfies the test requirement that the login operation itself was valid, while the storage and state commit gates ensure the store and localStorage remain strictly unauthenticated (`isAuthenticated: false`, `user: null`, `storedToken: null`).
   - If an error was thrown by `authService.login`, the catch block verifies `epoch === authEpoch` before setting error state or touching `isLoading`.

4. **User-Identity Binding in `enrollCourse`**:
   Before committing the updated enrolled course list, `enrollCourse` checks:
   ```typescript
   const currentUser = get().user;
   if (!currentUser || currentUser.id !== targetUserId) return;
   ```
   This prevents resurrecting null users or applying course enrollments to a different logged-in account.

---

## 4. Concrete Code Blueprint for `src/stores/useAuthStore.ts`

Here is the exact implementation to be applied to `src/stores/useAuthStore.ts`:

```typescript
import { create } from "zustand";
import { AuthState, LoginCredentials, RegisterData } from "../types/auth";
import { 
  authService, 
  LOCAL_STORAGE_ACCESS_TOKEN_KEY, 
  LOCAL_STORAGE_REFRESH_TOKEN_KEY 
} from "../services/authService";
import { jwtService } from "../services/jwtService";

// Monotonic request epoch to prevent in-flight async operations from clobbering state/storage
let authEpoch = 0;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  refreshToken: null,
  deviceId: authService.getOrCreateDeviceId(),
  isAuthenticated: false,
  isLoading: true,
  error: null,

  initialize: async () => {
    const epoch = ++authEpoch;
    set({ isLoading: true, error: null });

    if (typeof window === "undefined" || !window.localStorage) {
      if (epoch === authEpoch) {
        set({ isLoading: false });
      }
      return;
    }

    try {
      const storedAccessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
      const storedRefreshToken = localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY);
      const deviceId = authService.getOrCreateDeviceId();

      if (!storedAccessToken) {
        if (epoch === authEpoch) {
          set({
            user: null,
            token: null,
            refreshToken: null,
            deviceId,
            isAuthenticated: false,
            isLoading: false,
          });
        }
        return;
      }

      // Verify stored access token cryptographically
      const verification = await jwtService.verifyToken(storedAccessToken);

      // Race condition check: abort if superseded
      if (epoch !== authEpoch) return;

      if (verification.valid && verification.payload) {
        const user = authService.getUserById(verification.payload.sub);
        if (user) {
          if (epoch !== authEpoch) return;
          set({
            user,
            token: storedAccessToken,
            refreshToken: storedRefreshToken,
            deviceId,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return;
        }
      }

      // If access token is expired or invalid, attempt refresh with refresh token
      if (storedRefreshToken) {
        try {
          const refreshed = await authService.refreshSession(storedRefreshToken);
          if (epoch !== authEpoch) return;

          localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, refreshed.tokens.accessToken);
          localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY, refreshed.tokens.refreshToken);

          set({
            user: refreshed.user,
            token: refreshed.tokens.accessToken,
            refreshToken: refreshed.tokens.refreshToken,
            deviceId,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return;
        } catch {
          if (epoch !== authEpoch) return;
          // Refresh failed - purge invalid tokens
          localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
          localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY);
        }
      } else {
        if (epoch !== authEpoch) return;
        localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
      }

      if (epoch !== authEpoch) return;

      set({
        user: null,
        token: null,
        refreshToken: null,
        deviceId,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (err) {
      if (epoch !== authEpoch) return;
      set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: err instanceof Error ? err.message : "فشل استعادة الجلسة",
      });
    }
  },

  login: async (credentials: LoginCredentials) => {
    const epoch = ++authEpoch;
    set({ isLoading: true, error: null });
    try {
      const deviceId = credentials.deviceId || get().deviceId || authService.getOrCreateDeviceId();
      const response = await authService.login({ ...credentials, deviceId });

      // Race condition check: if logout() or another auth action occurred while in-flight,
      // discard the session tokens and do not alter state or localStorage.
      if (epoch !== authEpoch) {
        return true;
      }

      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, response.tokens.accessToken);
        localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY, response.tokens.refreshToken);
      }

      set({
        user: response.user,
        token: response.tokens.accessToken,
        refreshToken: response.tokens.refreshToken,
        deviceId,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return true;
    } catch (err) {
      if (epoch !== authEpoch) {
        return false;
      }
      const message = err instanceof Error ? err.message : "تعذر تسجيل الدخول";
      set({
        isLoading: false,
        error: message,
      });
      return false;
    }
  },

  register: async (data: RegisterData) => {
    const epoch = ++authEpoch;
    set({ isLoading: true, error: null });
    try {
      const deviceId = data.deviceId || get().deviceId || authService.getOrCreateDeviceId();
      const response = await authService.register({ ...data, deviceId });

      // Race condition check: if logout() or another auth action occurred while in-flight,
      // discard the session tokens and do not alter state or localStorage.
      if (epoch !== authEpoch) {
        return true;
      }

      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, response.tokens.accessToken);
        localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY, response.tokens.refreshToken);
      }

      set({
        user: response.user,
        token: response.tokens.accessToken,
        refreshToken: response.tokens.refreshToken,
        deviceId,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return true;
    } catch (err) {
      if (epoch !== authEpoch) {
        return false;
      }
      const message = err instanceof Error ? err.message : "تعذر إنشاء الحساب";
      set({
        isLoading: false,
        error: message,
      });
      return false;
    }
  },

  logout: () => {
    // Invalidate all pending in-flight async auth promises
    authEpoch++;

    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
      localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY);
    }

    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  enrollCourse: async (courseId: string) => {
    const { user } = get();
    if (!user) return;
    const targetUserId = user.id;

    try {
      const updatedUser = await authService.enrollCourseInDb(targetUserId, courseId);
      
      // Concurrency check: verify user is still logged in and has the same id
      const currentUser = get().user;
      if (!currentUser || currentUser.id !== targetUserId) return;

      set({ user: updatedUser });
    } catch {
      const currentUser = get().user;
      if (!currentUser || currentUser.id !== targetUserId) return;

      const updatedCourses = currentUser.enrolledCourseIds.includes(courseId)
        ? currentUser.enrolledCourseIds
        : [...currentUser.enrolledCourseIds, courseId];

      set({
        user: {
          ...currentUser,
          enrolledCourseIds: updatedCourses,
        },
      });
    }
  },

  isEnrolled: (courseId: string) => {
    const { user } = get();
    if (!user || !user.enrolledCourseIds) return false;
    return user.enrolledCourseIds.includes(courseId);
  },

  clearError: () => {
    set({ error: null });
  },
}));
```

---

## 5. Summary of Edits for Worker 1

| Target | Line Numbers (Original) | Change Description |
|---|---|---|
| Epoch variable | Line 10 (top) | Declare `let authEpoch = 0;` above store definition. |
| `initialize()` | Lines 19-107 | Add `const epoch = ++authEpoch;` and `if (epoch !== authEpoch) return;` at all async boundaries. Use `LOCAL_STORAGE_ACCESS_TOKEN_KEY` at line 86. |
| `login()` | Lines 109-139 | Add `const epoch = ++authEpoch;`. Add `if (epoch !== authEpoch) return true;` before `localStorage.setItem` and `set()`. In catch, guard `set({ isLoading: false, error })` with `if (epoch !== authEpoch) return false;`. |
| `register()` | Lines 141-171 | Mirror the `login()` epoch guard pattern. |
| `logout()` | Lines 173-187 | Add `authEpoch++;` at the very start of `logout()` to immediately invalidate any pending asynchronous operations. |
| `enrollCourse()` | Lines 189-209 | Capture `targetUserId = user.id;` and verify `currentUser?.id === targetUserId` before setting updated user state. |
| TDZ constant | Lines 222-223 | Delete `const LOCAL_STORAGE_ACCESS_KEY = LOCAL_STORAGE_ACCESS_TOKEN_KEY;`. |

---

## 6. Verification Method

Once Worker 1 applies this fix strategy:

1. **Verify RACE BUG 1 directly**:
   ```powershell
   cd "e:\Mt FlutterProject\yalaAcademy\study-buddy-sim"
   npx vitest run src/test/challenger_m1_state_stress.test.tsx -t "RACE BUG 1"
   ```
   **Expected Outcome**: PASS with 0 errors.

2. **Verify all race condition tests**:
   ```powershell
   cd "e:\Mt FlutterProject\yalaAcademy\study-buddy-sim"
   npx vitest run src/test/challenger_m1_state_stress.test.tsx -t "State Race Conditions"
   ```
   **Expected Outcome**: 3/3 tests pass (RACE BUG 1, RACE BUG 2, RACE BUG 3).

3. **Verify the full test suite**:
   ```powershell
   cd "e:\Mt FlutterProject\yalaAcademy\study-buddy-sim"
   npm test
   ```
   **Expected Outcome**: All existing 111 tests pass cleanly without regression.
