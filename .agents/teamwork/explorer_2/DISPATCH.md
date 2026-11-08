## 2026-11-06T12:41:20Z
You are Explorer 2 (teamwork_explorer).
Your working directory is: e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_2\
The original request file path is: e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\ORIGINAL_REQUEST.md
You MUST read e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\ORIGINAL_REQUEST.md before starting work.

Your task:
Investigate Requirement R2: Academic Stages Scope Restriction across the application.
1. Inspect `study-buddy-sim/src/data/mockData.ts`:
   - Enumerate all stages, courses, stage IDs, grade titles, and course arrays.
   - Identify every place secondary stages (الصف الأول الثانوي، الصف الثاني الثانوي، الصف الثالث الثانوي) exist and need removal.
   - Verify representation of:
     * Primary: الصف السادس الابتدائي
     * Preparatory: الصف الأول الإعدادي، الصف الثاني الإعدادي، الصف الثالث الإعدادي
     * Comprehensive Foundation Course: كورس التأسيس الشامل للغة العربية
2. Inspect `study-buddy-sim/src/components/home/GradeSelector.tsx`:
   - Check stage filters, tabs, active grade states, and how courses are filtered.
3. Inspect `study-buddy-sim/src/components/layout/Footer.tsx`:
   - Check navigation links to grade stages.
4. Inspect other components like `CourseCard.tsx`, `CourseDetailsModal.tsx`, `Hero`, navigation bars, and filters.
5. Inspect test suites (`study-buddy-sim/src/test/elameed.test.ts` and any others):
   - Check existing assertions on course counts (e.g., 12 courses, stage IDs 647, 648, 649, 650, etc.).
   - Determine how tests must be adapted so they pass 100% with the new strict primary + preparatory + foundation course scope.
6. Recommend a complete data schema, course mapping, and UI cleanup plan.
7. Produce a comprehensive report and write it to:
   `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_2\handoff.md`
8. Update your `progress.md` with liveness timestamps.
9. When done, use send_message to report completion to the orchestrator.
