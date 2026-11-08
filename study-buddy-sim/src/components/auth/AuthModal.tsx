import React, { useState } from "react";
import { 
  X, 
  Smartphone, 
  Lock, 
  User, 
  ShieldAlert, 
  ArrowLeft,
  GraduationCap
} from "lucide-react";
import { gradeStages } from "../../data/mockData";

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: "login" | "register";
  onClose: () => void;
  onSuccess: (studentName: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = "login",
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  
  // Login fields
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register fields
  const [fullName, setFullName] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [selectedGradeId, setSelectedGradeId] = useState(gradeStages[0]?.id || "grade-6-prim");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Error state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginPhone.trim() || !loginPassword.trim()) {
      setErrorMessage("يرجى إدخال رقم الهاتف وكلمة المرور.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess("طالب مسجل");
      onClose();
    }, 600);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || !studentPhone.trim() || !parentPhone.trim() || !registerPassword) {
      setErrorMessage("يرجى تعبئة كافة الحقول المطلوبة.");
      return;
    }

    // Exact Verified Rule from El-Ameed: Parent phone must be different from student phone
    if (studentPhone.trim() === parentPhone.trim()) {
      setErrorMessage("تنبيه: يجب أن يكون رقم ولي الأمر مختلفاً عن رقم هاتف الطالب لضمان تفعيل الحساب واستلام التقارير.");
      return;
    }

    if (registerPassword.length < 6) {
      setErrorMessage("كلمة المرور يجب أن لا تقل عن 6 أحرف أو أرقام.");
      return;
    }

    if (registerPassword !== confirmPassword) {
      setErrorMessage("كلمتا المرور غير متطابقتين.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess(fullName);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-lg rounded-24 bg-[#14151c] border border-white/10 shadow-2xl overflow-hidden text-right my-auto">
        
        {/* Top Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <img
              src="/assets/site_logo.png"
              alt="منصة مستر عمرو عارف"
              className="h-9 w-auto object-contain"
            />
            <div>
              <h3 className="font-black text-sm sm:text-base text-white">
                {mode === "login" ? "تسجيل الدخول إلى حسابك" : "إنشاء حساب طالب جديد"}
              </h3>
              <p className="text-[11px] text-white/50">
                منصة مستر عمرو عارف • أستاذ اللغة العربية
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-12 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1.5 bg-black/40 border-b border-white/10 text-xs font-bold">
          <button
            onClick={() => {
              setMode("login");
              setErrorMessage(null);
            }}
            className={`py-2.5 rounded-12 transition-all ${
              mode === "login"
                ? "bg-[#753b47] text-white shadow-md font-black"
                : "text-white/60 hover:text-white"
            }`}
          >
            تسجيل الدخول
          </button>

          <button
            onClick={() => {
              setMode("register");
              setErrorMessage(null);
            }}
            className={`py-2.5 rounded-12 transition-all ${
              mode === "register"
                ? "bg-[#753b47] text-white shadow-md font-black"
                : "text-white/60 hover:text-white"
            }`}
          >
            حساب جديد
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-5">
          
          {/* Single-Device Policy Alert Box (.js-device-limit-alert) */}
          <div className="p-3.5 rounded-16 bg-[#753b47]/15 border border-[#753b47]/30 flex items-start gap-3 text-xs leading-relaxed">
            <ShieldAlert className="w-4 h-4 text-[#fe6257] shrink-0 mt-0.5" />
            <div className="text-white/80">
              <strong className="text-white block font-bold mb-0.5">
                الأجهزة المسموح بها: 1
              </strong>
              يرتبط الحساب بجهاز واحد فقط لحماية حسابك من الإغلاق التلقائي. لإعادة تعيين جهازك يرجى التواصل مع الدعم الفني.
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 rounded-12 bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-bold">
              {errorMessage}
            </div>
          )}

          {/* Form Content */}
          {mode === "login" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white mb-1.5">
                  رقم الهاتف (مسجل به الحساب)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="010XXXXXXXX"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    dir="ltr"
                    className="w-full pr-10 pl-4 py-3 rounded-12 text-sm bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#753b47] focus:outline-none text-left font-mono"
                    required
                  />
                  <Smartphone className="w-4 h-4 text-white/40 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1.5">
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    dir="ltr"
                    className="w-full pr-10 pl-4 py-3 rounded-12 text-sm bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#753b47] focus:outline-none text-left"
                    required
                  />
                  <Lock className="w-4 h-4 text-white/40 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-12 font-black text-sm text-white bg-[#753b47] hover:bg-[#854351] transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>جاري تسجيل الدخول...</span>
                ) : (
                  <>
                    <span>تسجيل الدخول</span>
                    <ArrowLeft className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white mb-1.5">
                  اسم الطالب رباعي
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="مثال: أحمد محمد علي حسن"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pr-10 pl-4 py-2.5 rounded-12 text-sm bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#753b47] focus:outline-none"
                    required
                  />
                  <User className="w-4 h-4 text-white/40 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-white mb-1.5">
                    رقم هاتف الطالب
                  </label>
                  <input
                    type="tel"
                    placeholder="010XXXXXXXX"
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    dir="ltr"
                    className="w-full px-3 py-2.5 rounded-12 text-sm bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#753b47] focus:outline-none text-left font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white mb-1.5">
                    رقم هاتف ولي الأمر
                  </label>
                  <input
                    type="tel"
                    placeholder="011XXXXXXXX"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    dir="ltr"
                    className="w-full px-3 py-2.5 rounded-12 text-sm bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#753b47] focus:outline-none text-left font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1.5">
                  المرحلة الدراسية
                </label>
                <select
                  value={selectedGradeId}
                  onChange={(e) => setSelectedGradeId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-12 text-sm bg-[#1a1c24] border border-white/10 text-white focus:border-[#753b47] focus:outline-none"
                >
                  {gradeStages.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.title} ({g.badge})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-white mb-1.5">
                    كلمة المرور
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    dir="ltr"
                    className="w-full px-3 py-2.5 rounded-12 text-sm bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#753b47] focus:outline-none text-left"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white mb-1.5">
                    تأكيد كلمة المرور
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    dir="ltr"
                    className="w-full px-3 py-2.5 rounded-12 text-sm bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#753b47] focus:outline-none text-left"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-12 font-black text-sm text-white bg-[#753b47] hover:bg-[#854351] transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>جاري إنشاء الحساب...</span>
                ) : (
                  <>
                    <GraduationCap className="w-4 h-4" />
                    <span>إنشاء حساب والبدء فوراً</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
