import { User, LoginCredentials, RegisterData, AuthTokens, AuthResponse } from "../types/auth";
import { jwtService, ACCESS_TOKEN_TTL_SECONDS } from "./jwtService";
import { gradeStages } from "../data/mockData";

export const LOCAL_STORAGE_USERS_KEY = "alaref_users_db";
export const LOCAL_STORAGE_DEVICE_KEY = "alaref_device_id";
export const LOCAL_STORAGE_ACCESS_TOKEN_KEY = "alaref_access_token";
export const LOCAL_STORAGE_REFRESH_TOKEN_KEY = "alaref_refresh_token";

interface StoredUserRecord extends User {
  passwordHash: string; // Plain/simple hashed password for mock student database
}

// Pre-seeded students for demo and testing
const SEED_USERS: StoredUserRecord[] = [
  {
    id: "student-ahmed-ali",
    fullName: "أحمد محمد علي",
    studentPhone: "01012345678",
    parentPhone: "01198765432",
    gradeId: "grade-3-prep",
    gradeName: "الصف الثالث الإعدادي",
    role: "student",
    deviceId: "device-demo-ahmed", // Bound to demo device
    avatar: "/assets/avatar_student_1.png",
    enrolledCourseIds: ["course-prep3-summary"],
    createdAt: "2026-01-15T10:00:00.000Z",
    passwordHash: "password123",
  },
  {
    id: "student-mariam-hossam",
    fullName: "مريم حسام مختار",
    studentPhone: "01099887766",
    parentPhone: "01234567890",
    gradeId: "grade-2-prep",
    gradeName: "الصف الثاني الإعدادي",
    role: "student",
    deviceId: "device-demo-mariam",
    avatar: "/assets/avatar_student_2.png",
    enrolledCourseIds: [],
    createdAt: "2026-02-01T12:00:00.000Z",
    passwordHash: "password123",
  },
];

export class AuthService {
  /**
   * Validates Egyptian mobile phone format (010, 011, 012, 015 + 8 digits = 11 digits total).
   */
  public validateEgyptianPhone(phone: string): boolean {
    if (!phone) return false;
    const cleaned = phone.trim();
    const egyptianPhoneRegex = /^01[0125][0-9]{8}$/;
    return egyptianPhoneRegex.test(cleaned);
  }

  /**
   * Enforces the forensic discrepancy rule: Student phone must NOT match Parent phone.
   */
  public validatePhonesDiscrepancy(
    studentPhone: string,
    parentPhone: string
  ): { valid: boolean; error?: string } {
    if (!studentPhone?.trim() || !parentPhone?.trim()) {
      return { valid: false, error: "يرجى إدخال رقم هاتف الطالب ورقم هاتف ولي الأمر." };
    }

    if (studentPhone.trim() === parentPhone.trim()) {
      return {
        valid: false,
        error: "تنبيه: يجب أن يكون رقم ولي الأمر مختلفاً عن رقم هاتف الطالب لضمان تفعيل الحساب واستلام التقارير.",
      };
    }

    if (!this.validateEgyptianPhone(studentPhone)) {
      return {
        valid: false,
        error: "رقم هاتف الطالب غير صالح. يرجى إدخال رقم هاتف مصري صحيح (11 رقماً يبدأ بـ 010 أو 011 أو 012 أو 015).",
      };
    }

    if (!this.validateEgyptianPhone(parentPhone)) {
      return {
        valid: false,
        error: "رقم هاتف ولي الأمر غير صالح. يرجى إدخال رقم هاتف مصري صحيح (11 رقماً يبدأ بـ 010 أو 011 أو 012 أو 015).",
      };
    }

    return { valid: true };
  }

  /**
   * Retrieves or initializes persistent device identifier stored in localStorage.
   */
  public getOrCreateDeviceId(): string {
    if (typeof window === "undefined" || !window.localStorage) {
      return "device_env_node_test";
    }

    let deviceId = localStorage.getItem(LOCAL_STORAGE_DEVICE_KEY);
    if (!deviceId) {
      const randomSuffix = Math.random().toString(36).substring(2, 10);
      deviceId = `dev_${Date.now()}_${randomSuffix}`;
      localStorage.setItem(LOCAL_STORAGE_DEVICE_KEY, deviceId);
    }
    return deviceId;
  }

  /**
   * Loads user registry from localStorage, seeding if not found.
   */
  private getUsersDb(): StoredUserRecord[] {
    if (typeof window === "undefined" || !window.localStorage) {
      return [...SEED_USERS];
    }

    try {
      const data = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
      if (!data) {
        localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(SEED_USERS));
        return [...SEED_USERS];
      }
      return JSON.parse(data) as StoredUserRecord[];
    } catch {
      return [...SEED_USERS];
    }
  }

  /**
   * Saves updated users list to localStorage.
   */
  private saveUsersDb(users: StoredUserRecord[]): void {
    if (typeof window === "undefined" || !window.localStorage) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
    } catch {
      // ignore
    }
  }

  /**
   * Finds grade title by ID.
   */
  private getGradeName(gradeId: string): string {
    const stage = gradeStages.find((g) => g.id === gradeId);
    return stage ? stage.title : "المرحلة الدراسية";
  }

  /**
   * Authenticates student credentials and verifies single-device policy.
   */
  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { studentPhone, password, deviceId } = credentials;

    if (!studentPhone?.trim() || !password?.trim()) {
      throw new Error("يرجى إدخال رقم الهاتف وكلمة المرور.");
    }

    const cleanedPhone = studentPhone.trim();
    if (!this.validateEgyptianPhone(cleanedPhone)) {
      throw new Error("رقم الهاتف غير صالح. يجب أن يتكون من 11 رقماً يبدأ بـ 01.");
    }

    const currentDeviceId = deviceId || this.getOrCreateDeviceId();
    const users = this.getUsersDb();
    const userIndex = users.findIndex((u) => u.studentPhone === cleanedPhone);

    if (userIndex === -1) {
      throw new Error("رقم الهاتف غير مسجل في المنصة. يرجى إنشاء حساب جديد أولاً.");
    }

    const storedUser = users[userIndex];

    // Password verification
    if (storedUser.passwordHash !== password) {
      throw new Error("كلمة المرور غير صحيحة. يرجى التأكد وإعادة المحاولة.");
    }

    // Single-device policy check
    if (storedUser.deviceId && storedUser.deviceId !== currentDeviceId) {
      throw new Error(
        "تم تسجيل هذا الحساب مسبقاً على جهاز آخر. وفقاً لسياسة المنصة، الحساب مسموح له بجهاز واحد فقط (الأجهزة المسموح بها: 1). لإعادة تعيين جهازك يرجى التواصل مع الدعم الفني."
      );
    }

    // If student had no bound device yet, bind to current device
    if (!storedUser.deviceId) {
      storedUser.deviceId = currentDeviceId;
      users[userIndex] = storedUser;
      this.saveUsersDb(users);
    }

    const user: User = {
      id: storedUser.id,
      fullName: storedUser.fullName,
      studentPhone: storedUser.studentPhone,
      parentPhone: storedUser.parentPhone,
      gradeId: storedUser.gradeId,
      gradeName: storedUser.gradeName,
      role: storedUser.role,
      deviceId: storedUser.deviceId,
      avatar: storedUser.avatar,
      enrolledCourseIds: storedUser.enrolledCourseIds || [],
      createdAt: storedUser.createdAt,
    };

    // Mint cryptographic tokens
    const accessToken = await jwtService.signToken(
      {
        sub: user.id,
        name: user.fullName,
        phone: user.studentPhone,
        gradeId: user.gradeId,
        role: user.role,
        deviceId: currentDeviceId,
      },
      ACCESS_TOKEN_TTL_SECONDS
    );

    const refreshToken = await jwtService.createRefreshToken(user.id, currentDeviceId);

    return {
      user,
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: ACCESS_TOKEN_TTL_SECONDS,
      },
    };
  }

  /**
   * Registers a new student account enforcing all business rules.
   */
  public async register(data: RegisterData): Promise<AuthResponse> {
    const { fullName, studentPhone, parentPhone, gradeId, password, deviceId } = data;

    if (!fullName?.trim() || !studentPhone?.trim() || !parentPhone?.trim() || !password) {
      throw new Error("يرجى تعبئة كافة الحقول المطلوبة.");
    }

    // Discrepancy rule & phone validations
    const phoneCheck = this.validatePhonesDiscrepancy(studentPhone, parentPhone);
    if (!phoneCheck.valid) {
      throw new Error(phoneCheck.error || "خطأ في أرقام الهواتف المدخلة.");
    }

    if (password.length < 6) {
      throw new Error("كلمة المرور يجب أن لا تقل عن 6 أحرف أو أرقام.");
    }

    const cleanedStudentPhone = studentPhone.trim();
    const cleanedParentPhone = parentPhone.trim();
    const currentDeviceId = deviceId || this.getOrCreateDeviceId();

    const users = this.getUsersDb();
    if (users.some((u) => u.studentPhone === cleanedStudentPhone)) {
      throw new Error("رقم الهاتف مسجل مسبقاً في المنصة. يمكنك تسجيل الدخول مباشرة.");
    }

    const newUserId = `student_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const gradeName = this.getGradeName(gradeId);

    const newRecord: StoredUserRecord = {
      id: newUserId,
      fullName: fullName.trim(),
      studentPhone: cleanedStudentPhone,
      parentPhone: cleanedParentPhone,
      gradeId,
      gradeName,
      role: "student",
      deviceId: currentDeviceId,
      avatar: "/assets/amr_avatar.png",
      enrolledCourseIds: [],
      createdAt: new Date().toISOString(),
      passwordHash: password,
    };

    users.push(newRecord);
    this.saveUsersDb(users);

    const user: User = {
      id: newRecord.id,
      fullName: newRecord.fullName,
      studentPhone: newRecord.studentPhone,
      parentPhone: newRecord.parentPhone,
      gradeId: newRecord.gradeId,
      gradeName: newRecord.gradeName,
      role: newRecord.role,
      deviceId: newRecord.deviceId,
      avatar: newRecord.avatar,
      enrolledCourseIds: newRecord.enrolledCourseIds,
      createdAt: newRecord.createdAt,
    };

    const accessToken = await jwtService.signToken(
      {
        sub: user.id,
        name: user.fullName,
        phone: user.studentPhone,
        gradeId: user.gradeId,
        role: user.role,
        deviceId: currentDeviceId,
      },
      ACCESS_TOKEN_TTL_SECONDS
    );

    const refreshToken = await jwtService.createRefreshToken(user.id, currentDeviceId);

    return {
      user,
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: ACCESS_TOKEN_TTL_SECONDS,
      },
    };
  }

  /**
   * Refreshes an expired session using a valid refresh token.
   */
  public async refreshSession(refreshTokenStr: string): Promise<AuthResponse> {
    const verification = await jwtService.verifyToken(refreshTokenStr);
    if (!verification.valid || !verification.payload) {
      throw new Error(verification.error || "رمز تجديد الجلسة غير صالح أو منتهي الصلاحية");
    }

    const userId = verification.payload.sub;
    const users = this.getUsersDb();
    const storedUser = users.find((u) => u.id === userId);

    if (!storedUser) {
      throw new Error("المستخدم المرتبط بهذا الرمز لم يعد موجوداً");
    }

    const currentDeviceId = this.getOrCreateDeviceId();
    const user: User = {
      id: storedUser.id,
      fullName: storedUser.fullName,
      studentPhone: storedUser.studentPhone,
      parentPhone: storedUser.parentPhone,
      gradeId: storedUser.gradeId,
      gradeName: storedUser.gradeName,
      role: storedUser.role,
      deviceId: storedUser.deviceId,
      avatar: storedUser.avatar,
      enrolledCourseIds: storedUser.enrolledCourseIds || [],
      createdAt: storedUser.createdAt,
    };

    const newAccessToken = await jwtService.signToken(
      {
        sub: user.id,
        name: user.fullName,
        phone: user.studentPhone,
        gradeId: user.gradeId,
        role: user.role,
        deviceId: currentDeviceId,
      },
      ACCESS_TOKEN_TTL_SECONDS
    );

    const newRefreshToken = await jwtService.createRefreshToken(user.id, currentDeviceId);

    return {
      user,
      tokens: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: ACCESS_TOKEN_TTL_SECONDS,
      },
    };
  }

  /**
   * Enrolls a student in a course and persists into registry.
   */
  public async enrollCourseInDb(userId: string, courseId: string): Promise<User> {
    const users = this.getUsersDb();
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      throw new Error("المستخدم غير موجود");
    }

    const user = users[userIndex];
    if (!user.enrolledCourseIds) {
      user.enrolledCourseIds = [];
    }

    if (!user.enrolledCourseIds.includes(courseId)) {
      user.enrolledCourseIds.push(courseId);
      users[userIndex] = user;
      this.saveUsersDb(users);
    }

    return {
      id: user.id,
      fullName: user.fullName,
      studentPhone: user.studentPhone,
      parentPhone: user.parentPhone,
      gradeId: user.gradeId,
      gradeName: user.gradeName,
      role: user.role,
      deviceId: user.deviceId,
      avatar: user.avatar,
      enrolledCourseIds: user.enrolledCourseIds,
      createdAt: user.createdAt,
    };
  }

  /**
   * Resets device binding for a student (support / testing function).
   */
  public resetDevice(studentPhone: string): boolean {
    const users = this.getUsersDb();
    const userIndex = users.findIndex((u) => u.studentPhone === studentPhone);
    if (userIndex === -1) return false;

    users[userIndex].deviceId = "";
    this.saveUsersDb(users);
    return true;
  }

  /**
   * Retrieves user by id.
   */
  public getUserById(id: string): User | null {
    const users = this.getUsersDb();
    const found = users.find((u) => u.id === id);
    if (!found) return null;
    return {
      id: found.id,
      fullName: found.fullName,
      studentPhone: found.studentPhone,
      parentPhone: found.parentPhone,
      gradeId: found.gradeId,
      gradeName: found.gradeName,
      role: found.role,
      deviceId: found.deviceId,
      avatar: found.avatar,
      enrolledCourseIds: found.enrolledCourseIds || [],
      createdAt: found.createdAt,
    };
  }
}

export const authService = new AuthService();
