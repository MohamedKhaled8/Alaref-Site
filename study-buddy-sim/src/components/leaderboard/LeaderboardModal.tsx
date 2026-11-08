import React, { useState } from "react";
import { 
  X, 
  Trophy, 
  Search, 
  BookOpen, 
  Medal, 
  Award, 
  GraduationCap
} from "lucide-react";
import { honorStudentsList, HonorStudent } from "../../data/mockData";

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchStudent, setSearchStudent] = useState<string>("");

  if (!isOpen) return null;

  const stagePills = [
    { id: "all", title: "جميع المراحل", icon: Trophy },
    { id: "prep3", categoryId: 647, title: "الصف الثالث الاعدادي", icon: GraduationCap },
    { id: "prep2", categoryId: 646, title: "الصف الثاني الاعدادي", icon: BookOpen },
    { id: "prep1", categoryId: 645, title: "الصف الاول الاعدادي", icon: Award },
    { id: "prim6", categoryId: 644, title: "الصف السادس الابتدائي", icon: Medal },
  ];

  const filteredStudents = honorStudentsList.filter((student) => {
    if (activeFilter !== "all") {
      const stage = stagePills.find((p) => p.id === activeFilter);
      if (stage && stage.categoryId) {
        if (student.stageCategoryId !== stage.categoryId && !student.grade.includes(stage.title)) {
          return false;
        }
      }
    }
    if (searchStudent.trim()) {
      return (
        student.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
        student.governorate.toLowerCase().includes(searchStudent.toLowerCase()) ||
        (student.username && student.username.toLowerCase().includes(searchStudent.toLowerCase()))
      );
    }
    return true;
  });

  const top1 = filteredStudents[0] || honorStudentsList[0];
  const top2 = filteredStudents[1] || honorStudentsList[1];
  const top3 = filteredStudents[2] || honorStudentsList[2];

  const remainingStudents = filteredStudents.length > 3 
    ? filteredStudents.slice(3) 
    : (filteredStudents.length > 0 ? filteredStudents : honorStudentsList.slice(3));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-5xl max-h-[94vh] flex flex-col rounded-28 bg-[#13141b] border border-white/10 shadow-2xl overflow-hidden text-right my-auto">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-16 bg-[var(--primary)] text-white flex items-center justify-center shadow-md">
              <Trophy className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="font-black text-lg sm:text-xl text-white">
                لوحة الصدارة للطلاب المتفوقين
              </h3>
              <p className="text-xs text-white/50">
                منصة مستر عمرو عارف • أستاذ اللغة العربية
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-14 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8">
          
          {/* Stage Filter Buttons & Search */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {stagePills.map((pill) => {
                const Icon = pill.icon;
                const isActive = activeFilter === pill.id;
                return (
                  <button
                    key={pill.id}
                    onClick={() => setActiveFilter(pill.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-[var(--primary)] text-white shadow-md border border-white/20"
                        : "bg-white/5 text-white/70 hover:text-white border border-white/10"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{pill.title}</span>
                  </button>
                );
              })}
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="ابحث باسم الطالب أو المحافظة..."
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                className="w-full h-11 pr-11 pl-4 rounded-14 bg-white/5 border border-white/10 text-white placeholder-white/40 text-xs sm:text-sm focus:outline-none focus:border-[var(--primary)] transition-all text-right"
              />
              <Search className="w-4 h-4 text-white/40 absolute right-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Top 3 Spotlight Podium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end max-w-4xl mx-auto pt-8">
            
            {/* Rank 2 (Silver) */}
            <div className="order-2 md:order-1 flex flex-col items-center text-center">
              <div className="relative w-full rounded-24 bg-[#181a24] border-2 border-slate-400/40 p-5 pt-10 shadow-lg">
                <div className="absolute -top-6 inset-x-0 flex justify-center z-10 pointer-events-none">
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L15 8L22 9L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9L9 8L12 2Z" fill="url(#silverGrad_modal)" stroke="#A0A0A0" strokeWidth="1"/>
                    <defs>
                      <linearGradient id="silverGrad_modal" x1="12" y1="2" x2="12" y2="21" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#E0E0E0"/>
                        <stop offset="50%" stopColor="#F5F5F5"/>
                        <stop offset="100%" stopColor="#9E9E9E"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <img src={top2.avatar} alt={top2.name} className="w-full h-full rounded-full object-cover border-4 border-slate-300" />
                  <div className="absolute -bottom-2 inset-x-0 flex justify-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-400 text-slate-950">#2 الترتيب</span>
                  </div>
                </div>
                <h4 className="font-bold text-sm text-white mb-1">{top2.name}</h4>
                <p className="text-[11px] text-white/50 font-mono mb-3" dir="ltr">{top2.username || `@user-${top2.id}`}</p>
                
                <div className="grid grid-cols-4 gap-1 p-2 rounded-12 bg-white/5 text-center text-[10px] text-white/70 mb-3">
                  <div><div>كورسات</div><div className="font-bold text-white">{top2.purchasedCourses || 3}</div></div>
                  <div><div>دروس</div><div className="font-bold text-white">{top2.completedLessons || 7}</div></div>
                  <div><div>اختبارات</div><div className="font-bold text-white">{top2.passedExams || 1}</div></div>
                  <div><div>واجبات</div><div className="font-bold text-white">{top2.passedAssignments || 0}</div></div>
                </div>
                <div className="text-xs font-black text-slate-300">{top2.points} نقطة</div>
              </div>
            </div>

            {/* Rank 1 (Gold) */}
            <div className="order-1 md:order-2 flex flex-col items-center text-center -translate-y-3">
              <div className="relative w-full rounded-24 bg-gradient-to-b from-[#242634] to-[#181a24] border-2 border-amber-400 p-6 pt-12 shadow-2xl">
                <div className="absolute -top-8 inset-x-0 flex justify-center z-10 pointer-events-none">
                  <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L15 8L22 9L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9L9 8L12 2Z" fill="url(#goldGrad_modal)" stroke="#DAA520" strokeWidth="1"/>
                    <defs>
                      <linearGradient id="goldGrad_modal" x1="12" y1="2" x2="12" y2="21" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#FFE259"/>
                        <stop offset="100%" stopColor="#FFA751"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="relative w-24 h-24 mx-auto mb-3">
                  <img src={top1.avatar} alt={top1.name} className="w-full h-full rounded-full object-cover border-4 border-amber-400" />
                  <div className="absolute -bottom-2 inset-x-0 flex justify-center">
                    <span className="px-3 py-0.5 rounded-full text-xs font-black bg-amber-400 text-black">#1 الترتيب</span>
                  </div>
                </div>
                <h4 className="font-black text-base text-white mb-1">{top1.name}</h4>
                <p className="text-[11px] text-amber-300/80 font-mono mb-3" dir="ltr">{top1.username || `@user-${top1.id}`}</p>
                
                <div className="grid grid-cols-4 gap-1 p-2 rounded-12 bg-amber-400/10 text-center text-[10px] text-amber-200/80 mb-3">
                  <div><div>كورسات</div><div className="font-bold text-amber-300">{top1.purchasedCourses || 3}</div></div>
                  <div><div>دروس</div><div className="font-bold text-amber-300">{top1.completedLessons || 3}</div></div>
                  <div><div>اختبارات</div><div className="font-bold text-amber-300">{top1.passedExams || 1}</div></div>
                  <div><div>واجبات</div><div className="font-bold text-amber-300">{top1.passedAssignments || 0}</div></div>
                </div>
                <div className="text-sm font-black text-amber-300">{top1.points} نقطة</div>
              </div>
            </div>

            {/* Rank 3 (Bronze) */}
            <div className="order-3 flex flex-col items-center text-center">
              <div className="relative w-full rounded-24 bg-[#181a24] border-2 border-amber-800/40 p-5 pt-10 shadow-lg">
                <div className="absolute -top-6 inset-x-0 flex justify-center z-10 pointer-events-none">
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L15 8L22 9L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9L9 8L12 2Z" fill="url(#bronzeGrad_modal)" stroke="#A0522D" strokeWidth="1"/>
                    <defs>
                      <linearGradient id="bronzeGrad_modal" x1="12" y1="2" x2="12" y2="21" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#E5A97C"/>
                        <stop offset="50%" stopColor="#F1C2A2"/>
                        <stop offset="100%" stopColor="#A75A28"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <img src={top3.avatar} alt={top3.name} className="w-full h-full rounded-full object-cover border-4 border-amber-800/60" />
                  <div className="absolute -bottom-2 inset-x-0 flex justify-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-800 text-amber-100">#3 الترتيب</span>
                  </div>
                </div>
                <h4 className="font-bold text-sm text-white mb-1">{top3.name}</h4>
                <p className="text-[11px] text-white/50 font-mono mb-3" dir="ltr">{top3.username || `@user-${top3.id}`}</p>
                
                <div className="grid grid-cols-4 gap-1 p-2 rounded-12 bg-white/5 text-center text-[10px] text-white/70 mb-3">
                  <div><div>كورسات</div><div className="font-bold text-white">{top3.purchasedCourses || 3}</div></div>
                  <div><div>دروس</div><div className="font-bold text-white">{top3.completedLessons || 7}</div></div>
                  <div><div>اختبارات</div><div className="font-bold text-white">{top3.passedExams || 1}</div></div>
                  <div><div>واجبات</div><div className="font-bold text-white">{top3.passedAssignments || 0}</div></div>
                </div>
                <div className="text-xs font-black text-amber-300">{top3.points} نقطة</div>
              </div>
            </div>

          </div>

          {/* Ranked Table */}
          <div className="rounded-24 bg-[#181922] border border-white/10 p-5">
            <h4 className="font-black text-base text-white mb-4">ترتيب باقي الطلاب ({remainingStudents.length})</h4>
            <div className="overflow-x-auto">
              <div className="min-w-[650px] space-y-2">
                <div className="grid grid-cols-[60px_1fr_80px_80px_80px_80px_100px] px-3 py-2 rounded-10 bg-white/5 text-white/60 text-xs font-bold text-center">
                  <span className="text-right">الترتيب</span>
                  <span className="text-right">الطالب</span>
                  <span>الكورسات</span>
                  <span>الدروس</span>
                  <span>الاختبارات</span>
                  <span>الواجبات</span>
                  <span>مجموع النقاط</span>
                </div>
                {remainingStudents.map((st) => (
                  <div
                    key={st.id}
                    className="grid grid-cols-[60px_1fr_80px_80px_80px_80px_100px] px-3 py-3 rounded-12 bg-white/5 hover:bg-white/10 text-center items-center text-xs"
                  >
                    <span className="text-right font-black text-[var(--accent)] font-mono">#{st.rank}</span>
                    <div className="flex items-center gap-2.5 text-right">
                      <img src={st.avatar} alt={st.name} className="w-8 h-8 rounded-full object-cover border border-white/10" />
                      <div className="min-w-0">
                        <div className="font-bold text-white truncate">{st.name}</div>
                        <div className="text-[10px] text-white/40 font-mono truncate" dir="ltr">{st.username}</div>
                      </div>
                    </div>
                    <span className="font-bold text-white/90">{st.purchasedCourses || 3}</span>
                    <span className="font-bold text-white/90">{st.completedLessons || 2}</span>
                    <span className="font-bold text-white/90">{st.passedExams || 1}</span>
                    <span className="font-bold text-white/90">{st.passedAssignments || 0}</span>
                    <span className="font-black text-[var(--accent)]">{st.points} نقطة</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
