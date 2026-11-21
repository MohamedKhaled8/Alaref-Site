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

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  deviceId: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  enrollCourse: (courseId: string) => void;
  isEnrolled: (courseId: string) => boolean;
  clearError: () => void;
}
