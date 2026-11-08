export interface TeacherProfile {
  name: string;
  title: string;
  credential: string;
  bio: string;
  avatar: string;
  heroIllustration: string;
  experienceYears: number;
  studentsCount: number;
  successRate: number;
  phoneSupport: string;
  whatsappSupport: string;
  youtubeUrl: string;
  tiktokUrl: string;
  developerCredit: string;
  developerPhone: string;
}

export interface GradeStage {
  id: string;
  categoryId: number; // Category IDs (644, 645, 646, 647, 643)
  title: string;
  subtitle: string;
  level: "ابتدائي" | "إعدادي" | "تأسيس";
  courseCount: number;
  badge: string;
  badgeImage: string;
  bannerImage?: string;
  colorScheme: string;
  iconName: string;
}

export interface LessonItem {
  id: string;
  title: string;
  type: "video" | "pdf" | "quiz";
  durationMinutes?: number;
  isFreePreview: boolean;
  isCompleted?: boolean;
}

export interface CurriculumUnit {
  id: string;
  unitNumber: number;
  title: string;
  description: string;
  lessonsCount: number;
  lessons: LessonItem[];
}

export interface CourseItem {
  id: string;
  slug: string;
  title: string;
  gradeId: string;
  gradeName: string;
  archetype: "curriculum" | "summary" | "exam-bank";
  archetypeLabel: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  isFree: boolean;
  studentCount: number;
  lecturesCount: number;
  durationHours: number;
  durationText: string;
  rating: number;
  reviewsCount: number;
  isFeatured: boolean;
  thumbnail: string;
  badgeText?: string;
  units: CurriculumUnit[];
  quizCount: number;
  examRules: {
    questionsCount: number;
    durationMinutes: number;
    passScore: number;
    maxAttempts: number;
  };
}

export interface HonorStudent {
  id: string;
  rank: number;
  name: string;
  username?: string;
  grade: string;
  score: number;
  points: number;
  governorate: string;
  badge: "gold" | "silver" | "bronze" | "honorable";
  avatar: string;
  completedCourses: number;
  purchasedCourses?: number;
  completedLessons?: number;
  passedExams?: number;
  passedAssignments?: number;
  stageCategoryId?: number;
}

// 1. Master Teacher Profile - Mr. Amr Aref (Verified from user assets & banner)
export const teacherProfile: TeacherProfile = {
  name: "مستر عمرو عارف",
  title: "أستاذ اللغة العربية للمرحلتين الابتدائية والإعدادية",
  credential: "نخبة من أفضل معلمي اللغة العربية - تخصص تأسيس وتفوق الشهادة الإعدادية والمرحلة الابتدائية",
  bio: "أستاذ اللغة العربية، خبرة متميزة في تبسيط قواعد النحو والصرف، البلاغة، النصوص الأدبية، والقصة، بأسلوب علمي مبتكر يضمن الدرجة النهائية وتأسيس الطالب لغوياً وفكرياً.",
  avatar: "/assets/amr_avatar.png",
  heroIllustration: "/assets/amr_hero.png",
  experienceYears: 12,
  studentsCount: 38500,
  successRate: 99.4,
  phoneSupport: "01097303002",
  whatsappSupport: "201097303002",
  youtubeUrl: "https://youtube.com/@elameed?si=q9Hlx8w3mXHSYFbA",
  tiktokUrl: "https://www.tiktok.com/@elameedmuhammedtarek?_r=1&_t=ZS-98ZiAWFhqjw",
  developerCredit: "Mada - مدى",
  developerPhone: "201010948682",
};

// 2. Strict Primary, Preparatory & Foundation Stages (644, 645, 646, 647, 643)
export const gradeStages: GradeStage[] = [
  {
    id: "grade-6-prim",
    categoryId: 644,
    title: "الصف السادس الابتدائي",
    subtitle: "3 دورات",
    level: "ابتدائي",
    courseCount: 3,
    badge: "6th PRIMARY",
    badgeImage: "/assets/prim_6.webp",
    bannerImage: "/assets/prim_6.webp",
    colorScheme: "from-red-500/20 to-rose-700/10 border-red-500/30",
    iconName: "BookOpen"
  },
  {
    id: "grade-1-prep",
    categoryId: 645,
    title: "الصف الأول الإعدادي",
    subtitle: "3 دورات",
    level: "إعدادي",
    courseCount: 3,
    badge: "1st PREPARATORY",
    badgeImage: "/assets/prep_1.webp",
    bannerImage: "/assets/prep_1.webp",
    colorScheme: "from-amber-500/20 to-yellow-700/10 border-amber-500/30",
    iconName: "Award"
  },
  {
    id: "grade-2-prep",
    categoryId: 646,
    title: "الصف الثاني الإعدادي",
    subtitle: "3 دورات",
    level: "إعدادي",
    courseCount: 3,
    badge: "2nd PREPARATORY",
    badgeImage: "/assets/prep_2.webp",
    bannerImage: "/assets/prep_2.webp",
    colorScheme: "from-blue-500/20 to-indigo-700/10 border-blue-500/30",
    iconName: "GraduationCap"
  },
  {
    id: "grade-3-prep",
    categoryId: 647,
    title: "الصف الثالث الإعدادي",
    subtitle: "3 دورات",
    level: "إعدادي",
    courseCount: 3,
    badge: "3rd PREPARATORY",
    badgeImage: "/assets/prep_3.webp",
    bannerImage: "/assets/prep_3.webp",
    colorScheme: "from-teal-500/20 to-teal-700/10 border-teal-500/30",
    iconName: "Crown"
  },
  {
    id: "grade-taasis",
    categoryId: 643,
    title: "كورس التأسيس الشامل",
    subtitle: "3 دورات",
    level: "تأسيس",
    courseCount: 3,
    badge: "FOUNDATION",
    badgeImage: "/assets/amr_avatar.png",
    bannerImage: "/assets/thumb_taasis.png",
    colorScheme: "from-amber-500/20 to-orange-700/10 border-amber-500/30",
    iconName: "Sparkles"
  }
];

// 3. Real Curriculum Lessons for El-Ameed Course (Verified in Section 6.2 of REA report)
const elAmeedCurriculumUnits: CurriculumUnit[] = [
  {
    id: "chapter-194",
    unitNumber: 1,
    title: "ملخصات الحصص (8 الأجزاء)",
    description: "يحتوي هذا الكورس 1 وحدات، 8 دروساً، و 0 ساعة من المواد.",
    lessonsCount: 8,
    lessons: [
      { 
        id: "les-200", 
        title: "ملخص الحصة الاولي كان واخواتها وحل تدريبات نحو وادي وقصة", 
        type: "video", 
        durationMinutes: 35, 
        isFreePreview: false 
      },
      { 
        id: "les-202", 
        title: "ملخص الحصة الثانية كاد واخواتها والبلاغة والنصوص", 
        type: "video", 
        durationMinutes: 40, 
        isFreePreview: true 
      },
      { 
        id: "les-205", 
        title: "الحصة الثالثة البلاغة التعبيرية والمجاز المرسل وسر الجمال", 
        type: "video", 
        durationMinutes: 45, 
        isFreePreview: false 
      },
      { 
        id: "les-210", 
        title: "الحصة الرابعة لا النافية للجنس وحالات إعراب اسمها", 
        type: "video", 
        durationMinutes: 38, 
        isFreePreview: true 
      },
      { 
        id: "les-214", 
        title: "الحصة الخامسة احكام المبتدا والخبر وحل بلاغة ونصوص", 
        type: "video", 
        durationMinutes: 50, 
        isFreePreview: true 
      },
      { 
        id: "les-216", 
        title: "الحصة السادسة قراءة متحررة وفنيات التعامل مع الفكرة الرئيسة", 
        type: "video", 
        durationMinutes: 42, 
        isFreePreview: false 
      },
      { 
        id: "les-218", 
        title: "الحصة السابعة اسم الفاعل وقراءة متحررة وحل تدريبات", 
        type: "video", 
        durationMinutes: 48, 
        isFreePreview: true 
      },
      { 
        id: "les-221", 
        title: "الحصة الثامنة صيغ المبالغة وحل قصة وتعبير", 
        type: "video", 
        durationMinutes: 52, 
        isFreePreview: true 
      },
      { 
        id: "quiz-62", 
        title: "اختبار الحصة الاولى (10 أسئلة - 10 دقائق - درجة النجاح 5/10)", 
        type: "quiz", 
        durationMinutes: 10, 
        isFreePreview: false 
      }
    ]
  }
];

// 4. Exact 15 Courses Matrix across 5 Stages (3 Archetypes per Stage: summary, exam-bank, curriculum)
export const coursesList: CourseItem[] = [
  // --- الصف السادس الابتدائي (Grade 6 Primary) ---
  {
    id: "course-prim6-summary",
    slug: "ملخصات-الحصص-السادس-الابتدائي",
    title: "ملخصات الحصص السادس الابتدائي",
    gradeId: "grade-6-prim",
    gradeName: "الصف السادس الابتدائي",
    archetype: "summary",
    archetypeLabel: "ملخصات الحصص",
    description: "ملخصات مبسطة وتأسيسية لدروس النحو والإملاء والنصوص لطلاب الصف السادس الابتدائي.",
    longDescription: "كورس ملخصات الحصص لطلاب الصف السادس الابتدائي مع مستر عمرو عارف، لتبسيط القواعد النحوية والإملائية وحل تدريبات تفاعلية.",
    price: 0,
    isFree: true,
    studentCount: 140,
    lecturesCount: 8,
    durationHours: 2.0,
    durationText: "2:00 ساعات",
    rating: 4.95,
    reviewsCount: 36,
    isFeatured: true,
    thumbnail: "/assets/thumb_prim6.png",
    badgeText: "مجاني",
    units: elAmeedCurriculumUnits,
    quizCount: 1,
    examRules: {
      questionsCount: 10,
      durationMinutes: 10,
      passScore: 5,
      maxAttempts: 1
    }
  },
  {
    id: "course-prim6-exams",
    slug: "اختبارات-اسبوعية-وشهرية-السادس-الابتدائي",
    title: "اختبارات اسبوعية وشهرية السادس الابتدائي",
    gradeId: "grade-6-prim",
    gradeName: "الصف السادس الابتدائي",
    archetype: "exam-bank",
    archetypeLabel: "اختبارات اسبوعية وشهرية",
    description: "بنك تدريبات ونماذج امتحانات تفاعلية للشهادة الابتدائية مع التقييم الفوري.",
    longDescription: "تدريبات أسبوعية وامتحانات شهرية لطلاب الصف السادس الابتدائي وفق أحدث مواصفات الورقة الامتحانية مع مستر عمرو عارف.",
    price: 90,
    originalPrice: 130,
    isFree: false,
    studentCount: 210,
    lecturesCount: 10,
    durationHours: 3.5,
    durationText: "3:30 ساعات",
    rating: 4.9,
    reviewsCount: 28,
    isFeatured: false,
    thumbnail: "/assets/thumb_prim6.png",
    units: elAmeedCurriculumUnits,
    quizCount: 8,
    examRules: {
      questionsCount: 10,
      durationMinutes: 10,
      passScore: 5,
      maxAttempts: 1
    }
  },
  {
    id: "course-prim6-online",
    slug: "حصص-مدفوعة-لطلاب-الاونلاين-السادس-الابتدائي",
    title: "شرح منهج اللغة العربية السادس الابتدائي",
    gradeId: "grade-6-prim",
    gradeName: "الصف السادس الابتدائي",
    archetype: "curriculum",
    archetypeLabel: "شرح المنهج الشامل",
    description: "شرح تفصيلي لكامل فروع اللغة العربية للصف السادس الابتدائي مع حل تدريبات وتطبيقات عملية.",
    longDescription: "المنهج الكامل للغة العربية للصف السادس الابتدائي مع مستر عمرو عارف، شرح مفصل لكل درس مع خرائط ذهنية وحل تدريبات الكتب.",
    price: 150,
    isFree: false,
    studentCount: 430,
    lecturesCount: 18,
    durationHours: 18.0,
    durationText: "18:00 ساعة",
    rating: 4.96,
    reviewsCount: 52,
    isFeatured: false,
    thumbnail: "/assets/thumb_prim6.png",
    units: elAmeedCurriculumUnits,
    quizCount: 6,
    examRules: {
      questionsCount: 10,
      durationMinutes: 10,
      passScore: 5,
      maxAttempts: 1
    }
  },

  // --- الصف الأول الإعدادي (Grade 1 Prep) ---
  {
    id: "course-prep1-summary",
    slug: "ملخصات-الحصص-الاول-الاعدادي",
    title: "ملخصات الحصص الأول الإعدادي",
    gradeId: "grade-1-prep",
    gradeName: "الصف الأول الإعدادي",
    archetype: "summary",
    archetypeLabel: "ملخصات الحصص",
    description: "ملخصات مركزة لدروس النحو والقراءة والنصوص لطلاب الصف الأول الإعدادي.",
    longDescription: "ملخصات شاملة لمنهج اللغة العربية للصف الأول الإعدادي مع مستر عمرو عارف، تلخيص همزة القطع وألف الوصل وأنواع الخبر والضمائر.",
    price: 0,
    isFree: true,
    studentCount: 125,
    lecturesCount: 8,
    durationHours: 2.0,
    durationText: "2:00 ساعات",
    rating: 4.93,
    reviewsCount: 42,
    isFeatured: true,
    thumbnail: "/assets/thumb_prep1.png",
    badgeText: "مجاني",
    units: elAmeedCurriculumUnits,
    quizCount: 1,
    examRules: {
      questionsCount: 10,
      durationMinutes: 10,
      passScore: 5,
      maxAttempts: 1
    }
  },
  {
    id: "course-prep1-exams",
    slug: "اختبارات-اسبوعية-وشهرية-الاول-الاعدادي",
    title: "اختبارات اسبوعية وشهرية الأول الإعدادي",
    gradeId: "grade-1-prep",
    gradeName: "الصف الأول الإعدادي",
    archetype: "exam-bank",
    archetypeLabel: "اختبارات اسبوعية وشهرية",
    description: "نماذج اختبارات شاملة مع تصحيح إلكتروني وتدريب مكثف على أسئلة الامتحان.",
    longDescription: "سلسلة اختبارات دورية لطلاب الصف الأول الإعدادي تقيس نواتج التعلم وتدرب الطلاب على أسئلة الامتحانات مع مستر عمرو عارف.",
    price: 100,
    originalPrice: 140,
    isFree: false,
    studentCount: 260,
    lecturesCount: 10,
    durationHours: 3.5,
    durationText: "3:30 ساعات",
    rating: 4.88,
    reviewsCount: 31,
    isFeatured: false,
    thumbnail: "/assets/thumb_prep1.png",
    units: elAmeedCurriculumUnits,
    quizCount: 8,
    examRules: {
      questionsCount: 10,
      durationMinutes: 10,
      passScore: 5,
      maxAttempts: 1
    }
  },
  {
    id: "course-prep1-online",
    slug: "حصص-مدفوعة-لطلاب-الاونلاين-الاول-الاعدادي",
    title: "شرح منهج اللغة العربية الأول الإعدادي",
    gradeId: "grade-1-prep",
    gradeName: "الصف الأول الإعدادي",
    archetype: "curriculum",
    archetypeLabel: "شرح المنهج الشامل",
    description: "كورس الشرح الوافي لمنهج الصف الأول الإعدادي: نحو، قراءة متحررة، نصوص، وقصة عقبة بن نافع.",
    longDescription: "الشرح المتكامل للمنهج مع مستر عمرو عارف، شرح مبسط لكل الفروع مع واجبات تفاعلية ومتابعة أسبوعية.",
    price: 160,
    isFree: false,
    studentCount: 510,
    lecturesCount: 20,
    durationHours: 20.0,
    durationText: "20:00 ساعة",
    rating: 4.96,
    reviewsCount: 64,
    isFeatured: false,
    thumbnail: "/assets/thumb_prep1.png",
    units: elAmeedCurriculumUnits,
    quizCount: 6,
    examRules: {
      questionsCount: 10,
      durationMinutes: 10,
      passScore: 5,
      maxAttempts: 1
    }
  },

  // --- الصف الثاني الإعدادي (Grade 2 Prep) ---
  {
    id: "course-prep2-summary",
    slug: "ملخصات-الحصص-الثاني-الاعدادي",
    title: "ملخصات الحصص الثاني الإعدادي",
    gradeId: "grade-2-prep",
    gradeName: "الصف الثاني الإعدادي",
    archetype: "summary",
    archetypeLabel: "ملخصات الحصص",
    description: "كبسولات نحوية وبلاغية لدروس المعرب والمبني والنعت والعطف والتوكيد والحال.",
    longDescription: "تلخيص شامل ومكثف لأهم قواعد الصف الثاني الإعدادي مع مستر عمرو عارف، لضمان الفهم السريع والتطبيق المباشر.",
    price: 0,
    isFree: true,
    studentCount: 135,
    lecturesCount: 8,
    durationHours: 2.0,
    durationText: "2:00 ساعات",
    rating: 4.94,
    reviewsCount: 38,
    isFeatured: true,
    thumbnail: "/assets/thumb_prep2.png",
    badgeText: "مجاني",
    units: elAmeedCurriculumUnits,
    quizCount: 1,
    examRules: {
      questionsCount: 10,
      durationMinutes: 10,
      passScore: 5,
      maxAttempts: 1
    }
  },
  {
    id: "course-prep2-exams",
    slug: "اختبارات-اسبوعية-وشهرية-الثاني-الاعدادي",
    title: "اختبارات اسبوعية وشهرية الثاني الإعدادي",
    gradeId: "grade-2-prep",
    gradeName: "الصف الثاني الإعدادي",
    archetype: "exam-bank",
    archetypeLabel: "اختبارات اسبوعية وشهرية",
    description: "بنك اختبارات تدريبية شاملة لقياس مستوى الطالب مع نماذج إجابة نموذجية.",
    longDescription: "امتحانات تفاعلية منتظمة لطلاب الصف الثاني الإعدادي تغطي كل أجزاء المنهج بإشراف مستر عمرو عارف.",
    price: 100,
    originalPrice: 150,
    isFree: false,
    studentCount: 275,
    lecturesCount: 10,
    durationHours: 3.5,
    durationText: "3:30 ساعات",
    rating: 4.89,
    reviewsCount: 35,
    isFeatured: false,
    thumbnail: "/assets/thumb_prep2.png",
    units: elAmeedCurriculumUnits,
    quizCount: 8,
    examRules: {
      questionsCount: 10,
      durationMinutes: 10,
      passScore: 5,
      maxAttempts: 1
    }
  },
  {
    id: "course-prep2-online",
    slug: "حصص-مدفوعة-لطلاب-الاونلاين-الثاني-الاعدادي",
    title: "شرح منهج اللغة العربية الثاني الإعدادي",
    gradeId: "grade-2-prep",
    gradeName: "الصف الثاني الإعدادي",
    archetype: "curriculum",
    archetypeLabel: "شرح المنهج الشامل",
    description: "شرح تفصيلي وتطبيقات مكثفة على النحو والنصوص والقراءة وقصة كفاح شعب مصر.",
    longDescription: "كورس الشرح الشامل لمنهج الصف الثاني الإعدادي مع مستر عمرو عارف، تفكيك نصوص وقواعد النحو وحل تدريبات مكثفة.",
    price: 170,
    isFree: false,
    studentCount: 540,
    lecturesCount: 20,
    durationHours: 21.0,
    durationText: "21:00 ساعة",
    rating: 4.97,
    reviewsCount: 68,
    isFeatured: false,
    thumbnail: "/assets/thumb_prep2.png",
    units: elAmeedCurriculumUnits,
    quizCount: 6,
    examRules: {
      questionsCount: 10,
      durationMinutes: 10,
      passScore: 5,
      maxAttempts: 1
    }
  },

  // --- الصف الثالث الإعدادي (Grade 3 Prep) ---
  {
    id: "course-prep3-summary",
    slug: "ملخصات-الحصص-الثالث-الاعدادي",
    title: "ملخصات الحصص الثالث الإعدادي",
    gradeId: "grade-3-prep",
    gradeName: "الصف الثالث الإعدادي",
    archetype: "summary",
    archetypeLabel: "ملخصات الحصص",
    description: "ملخصات الشهادة الإعدادية: المنادى، البدل، المدح والذم، الممنوع من الصرف وفنيات القراءة والقصة.",
    longDescription: "كبسولات ذهبية لطلاب الشهادة الإعدادية تجمع قواعد النحو المقررة بطريقة ميسرة ومباشرة تضمن الحصول على الدرجة النهائية مع مستر عمرو عارف.",
    price: 0,
    isFree: true,
    studentCount: 190,
    lecturesCount: 8,
    durationHours: 2.0,
    durationText: "2:00 ساعات",
    rating: 4.98,
    reviewsCount: 55,
    isFeatured: true,
    thumbnail: "/assets/thumb_prep3.png",
    badgeText: "مجاني",
    units: elAmeedCurriculumUnits,
    quizCount: 1,
    examRules: {
      questionsCount: 10,
      durationMinutes: 10,
      passScore: 5,
      maxAttempts: 1
    }
  },
  {
    id: "course-prep3-exams",
    slug: "اختبارات-اسبوعية-وشهرية-الثالث-الاعدادي",
    title: "اختبارات اسبوعية وشهرية الثالث الإعدادي",
    gradeId: "grade-3-prep",
    gradeName: "الصف الثالث الإعدادي",
    archetype: "exam-bank",
    archetypeLabel: "اختبارات اسبوعية وشهرية",
    description: "امتحانات المحافظات السابقة ونماذج التوجيه العام لطلاب الشهادة الإعدادية.",
    longDescription: "تدريب مكثف على أسئلة امتحانات الشهادة الإعدادية في كافة محافظات مصر، مع نموذج إجابة تفصيلي لكل اختبار بإشراف مستر عمرو عارف.",
    price: 110,
    originalPrice: 160,
    isFree: false,
    studentCount: 380,
    lecturesCount: 12,
    durationHours: 4.0,
    durationText: "4:00 ساعات",
    rating: 4.95,
    reviewsCount: 45,
    isFeatured: false,
    thumbnail: "/assets/thumb_prep3.png",
    units: elAmeedCurriculumUnits,
    quizCount: 8,
    examRules: {
      questionsCount: 10,
      durationMinutes: 10,
      passScore: 5,
      maxAttempts: 1
    }
  },
  {
    id: "course-prep3-online",
    slug: "حصص-مدفوعة-لطلاب-الاونلاين-الثالث-الاعدادي",
    title: "حصص مدفوعة لطلاب الاونلاين الثالث الإعدادي",
    gradeId: "grade-3-prep",
    gradeName: "الصف الثالث الإعدادي",
    archetype: "curriculum",
    archetypeLabel: "شرح المنهج الشامل",
    description: "كورس الشرح الشامل لطلاب الشهادة الإعدادية: نحو، قراءة، نصوص، وقصة طموح جارية.",
    longDescription: "منهج الشهادة الإعدادية كاملاً بالتفصيل مع مستر عمرو عارف، يشمل حل كل تدريبات كتاب الوزارة والكتب الخارجية.",
    price: 180,
    isFree: false,
    studentCount: 680,
    lecturesCount: 22,
    durationHours: 24.0,
    durationText: "24:00 ساعة",
    rating: 4.99,
    reviewsCount: 89,
    isFeatured: false,
    thumbnail: "/assets/thumb_prep3.png",
    units: elAmeedCurriculumUnits,
    quizCount: 6,
    examRules: {
      questionsCount: 10,
      durationMinutes: 10,
      passScore: 5,
      maxAttempts: 1
    }
  },

  // --- كورس التأسيس الشامل (Comprehensive Foundation Course) ---
  {
    id: "course-taasis-summary",
    slug: "ملخصات-كورس-التاسيس-الشامل",
    title: "ملخصات كورس التأسيس الشامل",
    gradeId: "grade-taasis",
    gradeName: "كورس التأسيس الشامل",
    archetype: "summary",
    archetypeLabel: "ملخصات الحصص",
    description: "خرائط ذهنية وقواعد تأسيسية سريعة في الإعراب والبلاغة والإملاء لجميع المراحل.",
    longDescription: "ملخصات تأسيسية مكثفة مع مستر عمرو عارف تلخص قواعد النحو والإملاء من الصفر حتى الإتقان التام.",
    price: 0,
    isFree: true,
    studentCount: 260,
    lecturesCount: 8,
    durationHours: 2.5,
    durationText: "2:30 ساعات",
    rating: 4.99,
    reviewsCount: 60,
    isFeatured: true,
    thumbnail: "/assets/thumb_taasis.png",
    badgeText: "مجاني",
    units: elAmeedCurriculumUnits,
    quizCount: 1,
    examRules: {
      questionsCount: 10,
      durationMinutes: 10,
      passScore: 5,
      maxAttempts: 1
    }
  },
  {
    id: "course-taasis-exams",
    slug: "اختبارات-كورس-التاسيس-الشامل",
    title: "اختبارات كورس التأسيس الشامل",
    gradeId: "grade-taasis",
    gradeName: "كورس التأسيس الشامل",
    archetype: "exam-bank",
    archetypeLabel: "اختبارات اسبوعية وشهرية",
    description: "تطبيقات وتدريبات عملية متدرجة لقياس مستوى التأسيس والإتقان اللغوي.",
    longDescription: "بنك أسئلة متكامل لتقييم فهم القواعد النحوية والإملائية مع تصحيح فوري وتحليل نقاط الضعف مع مستر عمرو عارف.",
    price: 120,
    originalPrice: 180,
    isFree: false,
    studentCount: 310,
    lecturesCount: 12,
    durationHours: 4.0,
    durationText: "4:00 ساعات",
    rating: 4.92,
    reviewsCount: 40,
    isFeatured: false,
    thumbnail: "/assets/thumb_taasis.png",
    units: elAmeedCurriculumUnits,
    quizCount: 8,
    examRules: {
      questionsCount: 10,
      durationMinutes: 10,
      passScore: 5,
      maxAttempts: 1
    }
  },
  {
    id: "course-taasis-online",
    slug: "كورس-التاسيس-الشامل-في-النحو-والبلاغة",
    title: "كورس التأسيس الشامل في النحو والبلاغة",
    gradeId: "grade-taasis",
    gradeName: "كورس التأسيس الشامل",
    archetype: "curriculum",
    archetypeLabel: "شرح المنهج الشامل",
    description: "دورة التأسيس المتكاملة من الصفر: نحو، إملاء، بلاغة، وفنيات التعبير والحل الاحترافي.",
    longDescription: "الكورس الأقوى في مصر للتأسيس في اللغة العربية مع مستر عمرو عارف، يبدأ من الصفر وصولاً إلى أعلى مستويات الإعراب والبلاغة.",
    price: 200,
    isFree: false,
    studentCount: 750,
    lecturesCount: 25,
    durationHours: 28.0,
    durationText: "28:00 ساعة",
    rating: 5.0,
    reviewsCount: 112,
    isFeatured: false,
    thumbnail: "/assets/thumb_taasis.png",
    units: elAmeedCurriculumUnits,
    quizCount: 8,
    examRules: {
      questionsCount: 10,
      durationMinutes: 10,
      passScore: 5,
      maxAttempts: 1
    }
  }
];

// 5. Verified Honor Students for Leaderboard (Extracted 1:1 from live El-Ameed Leaderboard)
export const honorStudentsList: HonorStudent[] = [
  {
    id: "stud-1",
    rank: 1,
    name: "ملك محمود عبدالحليم محمد",
    username: "@mlk-mhmod-aabdalhlym-mhmd-gondd",
    grade: "الصف الثالث الاعدادي",
    score: 99.6,
    points: 48,
    governorate: "القاهرة",
    badge: "gold",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    completedCourses: 3,
    purchasedCourses: 3,
    completedLessons: 3,
    passedExams: 1,
    passedAssignments: 0,
    stageCategoryId: 647,
  },
  {
    id: "stud-2",
    rank: 2,
    name: "مريم حسام مختار حسن",
    username: "@mrym-hsam-mkhtar-hsn-nfvy2",
    grade: "الصف الثالث الاعدادي",
    score: 99.4,
    points: 45,
    governorate: "الجيزة",
    badge: "silver",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80",
    completedCourses: 3,
    purchasedCourses: 3,
    completedLessons: 7,
    passedExams: 1,
    passedAssignments: 0,
    stageCategoryId: 647,
  },
  {
    id: "stud-3",
    rank: 3,
    name: "مريم شاكر شيحه عبدالعزيز",
    username: "@mrym-shakr-shyhh-aabdalaazyz-rvrt5",
    grade: "الصف الثاني الاعدادي",
    score: 99.1,
    points: 45,
    governorate: "الإسكندرية",
    badge: "bronze",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
    completedCourses: 3,
    purchasedCourses: 3,
    completedLessons: 7,
    passedExams: 1,
    passedAssignments: 0,
    stageCategoryId: 646,
  },
  {
    id: "stud-4",
    rank: 4,
    name: "ايمان هاني شاكر",
    username: "@ayman-hany-shakr-p2wuv",
    grade: "الصف الاول الاعدادي",
    score: 98.8,
    points: 43,
    governorate: "الدقهلية",
    badge: "honorable",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80",
    completedCourses: 3,
    purchasedCourses: 3,
    completedLessons: 2,
    passedExams: 1,
    passedAssignments: 0,
    stageCategoryId: 645,
  },
  {
    id: "stud-5",
    rank: 5,
    name: "Eman Abdruhman",
    username: "@eman-abdruhman-y89bm",
    grade: "الصف الثالث الاعدادي",
    score: 98.6,
    points: 43,
    governorate: "الشرقية",
    badge: "honorable",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&auto=format&fit=crop&q=80",
    completedCourses: 3,
    purchasedCourses: 3,
    completedLessons: 7,
    passedExams: 1,
    passedAssignments: 0,
    stageCategoryId: 647,
  },
  {
    id: "stud-6",
    rank: 6,
    name: "Yassin Yasser Mamdouh",
    username: "@yassin-yasser-mamdouh-lgs8d",
    grade: "الصف الاول الاعدادي",
    score: 98.5,
    points: 43,
    governorate: "المنوفية",
    badge: "honorable",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    completedCourses: 3,
    purchasedCourses: 3,
    completedLessons: 7,
    passedExams: 1,
    passedAssignments: 0,
    stageCategoryId: 645,
  },
  {
    id: "stud-7",
    rank: 7,
    name: "Malak Mohamed",
    username: "@malak-mohamed-k8hqb",
    grade: "الصف الثاني الاعدادي",
    score: 98.2,
    points: 37,
    governorate: "القليوبية",
    badge: "honorable",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    completedCourses: 3,
    purchasedCourses: 3,
    completedLessons: 4,
    passedExams: 1,
    passedAssignments: 0,
    stageCategoryId: 646,
  },
  {
    id: "stud-8",
    rank: 8,
    name: "رغد ناصر يوسف",
    username: "@rghd-nasr-yosf-d4t18",
    grade: "الصف السادس الابتدائي",
    score: 98.0,
    points: 35,
    governorate: "الغربية",
    badge: "honorable",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80",
    completedCourses: 3,
    purchasedCourses: 3,
    completedLessons: 3,
    passedExams: 1,
    passedAssignments: 0,
    stageCategoryId: 644,
  },
  {
    id: "stud-9",
    rank: 9,
    name: "نور احمد فاروق محمود",
    username: "@nor-ahmd-farok-mhmod-anezp",
    grade: "الصف الثالث الاعدادي",
    score: 97.9,
    points: 35,
    governorate: "بني سويف",
    badge: "honorable",
    avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&auto=format&fit=crop&q=80",
    completedCourses: 3,
    purchasedCourses: 3,
    completedLessons: 4,
    passedExams: 1,
    passedAssignments: 0,
    stageCategoryId: 647,
  },
  {
    id: "stud-10",
    rank: 10,
    name: "آيه محمد",
    username: "@ayh-mhmd-3riq5",
    grade: "الصف السادس الابتدائي",
    score: 97.7,
    points: 35,
    governorate: "الإسماعيلية",
    badge: "honorable",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80",
    completedCourses: 3,
    purchasedCourses: 3,
    completedLessons: 4,
    passedExams: 1,
    passedAssignments: 0,
    stageCategoryId: 644,
  },
  {
    id: "stud-11",
    rank: 11,
    name: "Jana Mahmoud Muhammad Moussa",
    username: "@jana-mahmoud-mohamed-moussa-4p0vz",
    grade: "الصف الاول الاعدادي",
    score: 97.5,
    points: 32,
    governorate: "السويس",
    badge: "honorable",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80",
    completedCourses: 3,
    purchasedCourses: 3,
    completedLessons: 1,
    passedExams: 1,
    passedAssignments: 0,
    stageCategoryId: 645,
  },
  {
    id: "stud-12",
    rank: 12,
    name: "أحمد كريم منصور",
    username: "@ahmed-kareem-moussa-2b9px",
    grade: "الصف الثاني الاعدادي",
    score: 97.2,
    points: 31,
    governorate: "الفيوم",
    badge: "honorable",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    completedCourses: 3,
    purchasedCourses: 3,
    completedLessons: 2,
    passedExams: 1,
    passedAssignments: 0,
    stageCategoryId: 646,
  }
];
