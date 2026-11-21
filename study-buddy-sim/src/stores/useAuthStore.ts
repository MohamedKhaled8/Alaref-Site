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

      const userCourses = currentUser.enrolledCourseIds || [];
      const updatedCourses = userCourses.includes(courseId)
        ? userCourses
        : [...userCourses, courseId];

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
