import { AssignmentItem, AssignmentSubmission } from "../types/educational";

/**
 * Al Aref Academy - Master Homework & Assignments Bank
 * Pedagogically structured by Mr. Amr Aref (أستاذ اللغة العربية)
 * Sentence parsing drills (إعراب جمل), rhetorical analyses, and essay questions.
 */

export const mockAssignments: AssignmentItem[] = [
  // 1. Assignment for les-200 (كان وأخواتها وأنواع الخبر)
  {
    id: "assign-200",
    lessonId: "les-200",
    courseId: "course-prep1-summary",
    title: "واجب الحصة الأولى: إعراب قطعة كان وأخواتها وتحديد صور الخبر",
    dueDate: "2026-11-20T23:59:59Z",
    maxScore: 20,
    instructions:
      "قم بحل الأسئلة التطبيقية وإعراب الكلمات المحددة في كراسة الواجب بخط واضح ومرتب، ثم التقط صورة واضحة أو ارفع ملف PDF عبر المنصة. يرجى توضيح موقع الإعراب والعلامة وسببها.",
    passagePrompt:
      "«ظلَّ الجنديُّ المصريُّ واقفاً على الحدودِ ساهراً، وما برحَ يُدافعُ عن ترابِ وطنهِ بكلِّ شجاعةٍ وإقدام. فليتَ كلَّ مواطنٍ يُدركُ أنَّ السلامَ يحميهِ الأقوياء، وأنَّ التضحيةَ سبيلُ العزةِ والكرامة». \n\nالمطلوب:\n1. أعرب الكلمات التي تحتها خط إعراباً تفصيلياً: (الجنديُّ - واقفاً - ترابِ - الأقوياء).\n2. استخرج فعلين ناسخين وبيّن نوع خبر كلٍّ منهما.\n3. بيّن نوع الصورة البيانية في: «يحميه الأقوياء» وسر جمالها.",
    allowedFileTypes: ["pdf", "docx", "doc", "jpg", "png", "webp"],
    maxFileSizeMB: 10,
  },

  // 2. Assignment for les-202 (كاد وأخواتها والبلاغة)
  {
    id: "assign-202",
    lessonId: "les-202",
    courseId: "course-prep1-summary",
    title: "تطبيقات النحو والبلاغة: كاد وأخواتها وسر جمال الصور البيانية",
    dueDate: "2026-11-22T23:59:59Z",
    maxScore: 20,
    instructions:
      "حل التدريبات النحوية والبلاغية بدقة، مع كتابة جدول مقارنة لأحكام اقتران خبر كاد بأن المصدرية.",
    passagePrompt:
      "«أوشك الصبحُ أن يتنفسَ بنوره، وشرعَ العمالُ ينثرون بذورَ الأمل في حقولِ الإنتاج، فعسى اللهُ أن يفيضَ بالخيراتِ على بلادنا الحبيبة». \n\nالمطلوب:\n1. استخرج أفعال المقاربة والرجاء والشروع من العبارة مبيناً حكم اقتران خبر كل فعل بأن.\n2. أعرب: «الصبحُ» و«العمالُ» إعراباً تاماً.\n3. وضح نوع التشبيه أو الاستعارة في «يتنفس الصبح» موضحاً سر جمالها.",
    allowedFileTypes: ["pdf", "docx", "doc", "jpg", "png", "webp"],
    maxFileSizeMB: 10,
  },

  // 3. Assignment for Prep 3 (المنادى والبدل وأسلوب المدح)
  {
    id: "assign-prep3",
    lessonId: "les-prep3-monada",
    courseId: "course-prep3-online",
    title: "التكليف الأسبوعي للشهادة الإعدادية: المنادى والبدل ونعم وبئس",
    dueDate: "2026-11-25T23:59:59Z",
    maxScore: 20,
    instructions:
      "تكليف تطبيقي يحاكي تماماً النمط الوزاري لامتحان اللغة العربية للشهادة الإعدادية. مدة التصحيح ومراجعة مستر عمرو عارف أقل من 24 ساعة.",
    passagePrompt:
      "«يا أبناءَ النيل، حافظوا على قطرةِ الماء؛ فنعمَ ثروةً ماءُ النيلِ الخالد، وبئسَ سلوكاً تلويثُ البيئةِ وإهدارُ مواردها. وطنكم مصرُ أمانةٌ في أعناقكم». \n\nالمطلوب:\n1. استخرج منادى وبيّن نوعه وحكمه الإعرابي.\n2. استخرج أسلوب مدح وحدد المخصوص بالمدح واذكر وجهين لإعرابه.\n3. استخرج بدلاً واذكر نوعه.\n4. أعرب كلمة «ثروةً» وكلمة «أمانةٌ».",
    allowedFileTypes: ["pdf", "docx", "doc", "jpg", "png", "webp"],
    maxFileSizeMB: 10,
  },
];

/**
 * Pre-graded sample submissions to demonstrate the grading loop & feedback display
 */
export const initialMockSubmissions: Record<string, AssignmentSubmission> = {
  // Pre-graded submission for assign-200
  "assign-200": {
    submissionId: "sub-200-sample",
    assignmentId: "assign-200",
    studentId: "student-101",
    studentName: "أحمد محمود كمال",
    submittedAt: "2026-11-08T18:30:00Z",
    status: "graded",
    fileName: "wajeb_kan_wa_akhawatoha_ahmed.pdf",
    fileSize: 2450000, // ~2.45 MB
    fileUrl: "/uploads/assignments/wajeb_kan_sample.pdf",
    studentNotes: "مرفق حل قطعة الإعراب واستخراج الأفعال الناسخة وسر جمال الاستعارة كما تم شرحه في المحاضرة.",
    score: 19,
    teacherFeedback:
      "أحسنت يا بطل! إعراب دقيق ومتقن لقواعد كان وأخواتها، وتحديدك لخبر الجملة الفعلية ممتاز جداً. فقط انتبه لضبط حركة حرف الروي في الشاهد البلاغي لتنال الدرجة النهائية 20/20. استمر في هذا التفوق!",
    gradedAt: "2026-11-09T00:15:00Z",
  },
};

/**
 * Helper to fetch assignment by lesson ID or assignment ID
 */
export const getAssignmentByLessonId = (
  lessonId: string
): AssignmentItem | undefined => {
  return (
    mockAssignments.find(
      (a) => a.lessonId === lessonId || a.id === lessonId
    ) || mockAssignments[0]
  );
};

export const getAssignmentById = (id: string): AssignmentItem | undefined => {
  return mockAssignments.find((a) => a.id === id);
};
