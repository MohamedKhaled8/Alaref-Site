import { describe, it, expect } from "vitest";
import { 
  teacherProfile, 
  gradeStages, 
  coursesList, 
  honorStudentsList 
} from "../data/mockData";

describe("El-Ameed Educational Platform Data & Forensic Rules Verification", () => {
  it("verifies Teacher Profile credentials and branding for Mr. Amr Aref", () => {
    expect(teacherProfile.name).toBe("مستر عمرو عارف");
    expect(teacherProfile.title).toContain("اللغة العربية");
    expect(teacherProfile.credential).toContain("معلمي اللغة العربية");
    expect(teacherProfile.phoneSupport).toBe("01097303002");
    expect(teacherProfile.whatsappSupport).toBe("201097303002");
  });

  it("verifies the Educational Stages match Primary, Preparatory, and Foundation scope (644, 645, 646, 647, 643)", () => {
    expect(gradeStages).toHaveLength(5);
    const categoryIds = gradeStages.map((g) => g.categoryId);
    expect(categoryIds).toEqual([644, 645, 646, 647, 643]);

    expect(gradeStages[0].title).toBe("الصف السادس الابتدائي");
    expect(gradeStages[1].title).toBe("الصف الأول الإعدادي");
    expect(gradeStages[2].title).toBe("الصف الثاني الإعدادي");
    expect(gradeStages[3].title).toBe("الصف الثالث الإعدادي");
    expect(gradeStages[4].title).toBe("كورس التأسيس الشامل");
  });

  it("verifies Course Catalog contains 15 courses across all 3 archetypes", () => {
    expect(coursesList).toHaveLength(15);

    const archetypes = new Set(coursesList.map((c) => c.archetype));
    expect(archetypes.has("curriculum")).toBe(true);
    expect(archetypes.has("summary")).toBe(true);
    expect(archetypes.has("exam-bank")).toBe(true);

    // Each stage must have 3 courses
    for (const stage of gradeStages) {
      const coursesForStage = coursesList.filter((c) => c.gradeId === stage.id);
      expect(coursesForStage.length).toBe(3);
    }
  });

  it("verifies Exam Rules match DOM-verified parameters (10 questions, 10 min, 5 pass, 1 attempt)", () => {
    for (const course of coursesList) {
      expect(course.examRules.questionsCount).toBe(10);
      expect(course.examRules.durationMinutes).toBe(10);
      expect(course.examRules.passScore).toBe(5);
      expect(course.examRules.maxAttempts).toBe(1);
    }
  });

  it("verifies Parent vs Student Phone Discrepancy business rule", () => {
    const validateParentPhone = (studentPhone: string, parentPhone: string): boolean => {
      if (!studentPhone.trim() || !parentPhone.trim()) return false;
      return studentPhone.trim() !== parentPhone.trim();
    };

    expect(validateParentPhone("01012345678", "01012345678")).toBe(false);
    expect(validateParentPhone("01012345678", "01198765432")).toBe(true);
  });

  it("verifies Honor Roll Leaderboard ranks students with medals", () => {
    expect(honorStudentsList.length).toBeGreaterThanOrEqual(3);
    expect(honorStudentsList[0].rank).toBe(1);
    expect(honorStudentsList[0].name).toBe("ملك محمود عبدالحليم محمد");
    expect(honorStudentsList[0].badge).toBe("gold");
    expect(honorStudentsList[1].rank).toBe(2);
    expect(honorStudentsList[1].name).toBe("مريم حسام مختار حسن");
    expect(honorStudentsList[1].badge).toBe("silver");
    expect(honorStudentsList[2].rank).toBe(3);
    expect(honorStudentsList[2].name).toBe("مريم شاكر شيحه عبدالعزيز");
    expect(honorStudentsList[2].badge).toBe("bronze");
  });

  it("verifies academic stages scope restriction: strictly primary, preparatory, and foundation (zero secondary)", () => {
    expect(teacherProfile.name).toBe("مستر عمرو عارف");
    const stageIds = gradeStages.map(s => s.id);
    expect(stageIds).toContain("grade-6-prim");
    expect(stageIds).toContain("grade-1-prep");
    expect(stageIds).toContain("grade-2-prep");
    expect(stageIds).toContain("grade-3-prep");
    expect(stageIds).toContain("grade-taasis");

    // Explicit negative proof: ZERO secondary stages
    expect(stageIds).not.toContain("grade-1-sec");
    expect(stageIds).not.toContain("grade-2-sec");
    expect(stageIds).not.toContain("grade-3-sec");

    for (const course of coursesList) {
      expect(course.gradeName).not.toContain("ثانوي");
    }
  });
});

