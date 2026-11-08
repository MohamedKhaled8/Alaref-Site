import React, { useState, useEffect } from "react";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { MobileBottomNav } from "./components/layout/MobileBottomNav";
import { EditorialHero } from "./components/home/EditorialHero";
import { HeroStatsRibbon } from "./components/home/HeroStatsRibbon";
import { GradeSelector } from "./components/home/GradeSelector";
import { FeaturedCourses } from "./components/home/FeaturedCourses";
import { HonorRollPreview } from "./components/home/HonorRollPreview";
import { CourseDetailsModal } from "./components/courses/CourseDetailsModal";
import { AuthModal } from "./components/auth/AuthModal";
import { WhatsAppSupportModal } from "./components/common/WhatsAppSupportModal";
import { LeaderboardModal } from "./components/leaderboard/LeaderboardModal";
import { CourseItem } from "./data/mockData";
import { Sparkles, X } from "lucide-react";
import { useLenisScroll } from "./hooks/useLenisScroll";

export default function App() {
  const lenisRef = useLenisScroll();
  const [isDark, setIsDark] = useState(false); // Default clean light theme matching Waleed Mohsen
  const [activeSection, setActiveSection] = useState("home");
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);

  // Modals state
  const [selectedCourseForDetails, setSelectedCourseForDetails] = useState<CourseItem | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<"login" | "register">("login");
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
  const [whatsappReason, setWhatsappReason] = useState("استفسار عام عن منصة أستاذي عمرو عارف");
  const [leaderboardModalOpen, setLeaderboardModalOpen] = useState(false);

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loggedInStudent, setLoggedInStudent] = useState<string | null>(null);

  // Initialize theme from localStorage
  useEffect(() => {
    const isDarkStored = localStorage.getItem("theme-mode");
    if (isDarkStored === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme-mode", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme-mode", "light");
      }
      return next;
    });
  };

  // Right-click interceptor
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setWhatsappReason("طلب مساعدة سريعة (الدعم الفني)");
      setWhatsappModalOpen(true);
    };

    window.addEventListener("contextmenu", handleContextMenu);
    return () => window.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  // Pause smooth scrolling when modals are active
  useEffect(() => {
    const isModalActive = authModalOpen || whatsappModalOpen || leaderboardModalOpen || !!selectedCourseForDetails;
    if (isModalActive) {
      lenisRef.current?.stop();
    } else {
      lenisRef.current?.start();
    }
  }, [authModalOpen, whatsappModalOpen, leaderboardModalOpen, selectedCourseForDetails]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleOpenAuth = (mode: "login" | "register") => {
    setAuthInitialMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (name: string) => {
    setLoggedInStudent(name);
    showToast(`مرحباً بك يا ${name} في منصة أستاذي عمرو عارف! تم تسجيل الدخول بنجاح.`);
  };

  const handleEnrollCourse = (course: CourseItem) => {
    if (course.isFree) {
      setSelectedCourseForDetails(course);
      showToast(`تم فتح المحتوى المجاني لكورس: ${course.title}`);
    } else {
      if (!loggedInStudent) {
        handleOpenAuth("login");
        showToast("يرجى تسجيل الدخول أو إنشاء حساب للاشتراك في الكورس.");
      } else {
        setWhatsappReason(`تفعيل كود اشتراك كورس: ${course.title} (سعر: ${course.price} ج.م)`);
        setWhatsappModalOpen(true);
      }
    }
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (sectionId === "grades") {
      const el = document.getElementById("grades");
      el?.scrollIntoView({ behavior: "smooth" });
    } else if (sectionId === "courses") {
      const el = document.getElementById("courses");
      el?.scrollIntoView({ behavior: "smooth" });
    } else if (sectionId === "leaderboard") {
      setLeaderboardModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-gray-900 dark:bg-[#0c0e17] dark:text-white transition-colors duration-300 flex flex-col font-almarai selection:bg-[#ed6140]/20 selection:text-[#ed6140]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 max-w-md w-[90%] p-4 rounded-20 bg-white dark:bg-[#1a1e2d] border-2 border-[#ed6140] shadow-2xl flex items-center justify-between gap-3 text-xs sm:text-sm animate-in slide-in-from-top-6 duration-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#ed6140] shrink-0" />
            <span className="font-bold text-gray-900 dark:text-white">{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Header (Top Utility Bar + Sticky Main Header overlapping hero) */}
      <Header
        isDark={isDark}
        toggleTheme={toggleTheme}
        onOpenAuth={handleOpenAuth}
        onNavigate={handleNavigate}
        onSelectGrade={(gradeId) => {
          setSelectedGrade(gradeId);
          handleNavigate("courses");
        }}
      />

      {/* 2. Main Page Content */}
      <main className="flex-1">
        {/* 2.1 Hero Section with Framer/21st.dev Style & Arabic Calligraphy */}
        <EditorialHero
          onExploreGrades={() => handleNavigate("grades")}
          onExploreCourses={() => {
            handleNavigate("courses");
            setSelectedGrade(null);
          }}
          onOpenAuth={handleOpenAuth}
        />

        {/* 2.2 21st.dev Interactive Bento Stats Ribbon */}
        <HeroStatsRibbon />

        {/* 2.3 Featured Courses & Classes Banner (Exact Waleed Mohsen Flow - Image 4) */}
        <FeaturedCourses
          selectedGrade={selectedGrade}
          onSelectGrade={(gradeId) => setSelectedGrade(gradeId)}
          onOpenDetails={(course) => setSelectedCourseForDetails(course)}
          onEnrollNow={handleEnrollCourse}
        />

        {/* 2.4 Educational Grades (.trending-categories-section) */}
        <GradeSelector
          selectedGrade={selectedGrade}
          onSelectGrade={(gradeId) => {
            setSelectedGrade(gradeId);
            handleNavigate("courses");
          }}
          onViewAllCourses={() => {
            setSelectedGrade(null);
            handleNavigate("courses");
          }}
        />

        {/* 2.5 Honor Roll & Top Student Podium (.leaderboard) */}
        <HonorRollPreview
          onViewFullLeaderboard={() => setLeaderboardModalOpen(true)}
        />
      </main>

      {/* 3. Theme Footer Card (.theme-footer-card) */}
      <Footer
        onNavigate={handleNavigate}
        onSelectGrade={(gradeId) => {
          setSelectedGrade(gradeId);
          handleNavigate("courses");
        }}
        onOpenWhatsApp={() => {
          setWhatsappReason("استفسار مباشر من الموقع");
          setWhatsappModalOpen(true);
        }}
      />

      {/* 4. Mobile Floating Bottom Bar (.navbar-b) */}
      <MobileBottomNav
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenAuth={handleOpenAuth}
      />

      {/* Modals & Dialogs */}
      <CourseDetailsModal
        course={selectedCourseForDetails}
        onClose={() => setSelectedCourseForDetails(null)}
        onEnrollNow={handleEnrollCourse}
        onOpenWhatsApp={() => {
          setWhatsappReason(`استفسار عن كورس: ${selectedCourseForDetails?.title}`);
          setWhatsappModalOpen(true);
        }}
      />

      <AuthModal
        isOpen={authModalOpen}
        initialMode={authInitialMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      <WhatsAppSupportModal
        isOpen={whatsappModalOpen}
        onClose={() => setWhatsappModalOpen(false)}
        reason={whatsappReason}
      />

      <LeaderboardModal
        isOpen={leaderboardModalOpen}
        onClose={() => setLeaderboardModalOpen(false)}
      />

    </div>
  );
}
