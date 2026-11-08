# BRIEFING — 2026-11-03T14:01:00Z

## Mission
Conduct a comprehensive, evidence-based public reconnaissance of https://www.el-ameed.com/, mapping route structures, navigation hierarchies, content inventory, interaction models, and public vs restricted boundaries.

## 🔒 My Identity
- Archetype: explorer
- Roles: public reconnaissance, route mapping, interaction mapping, content inventory
- Working directory: e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_survey_1\
- Original parent: 9f7543cb-05cd-43f1-b2ae-ac96f1c228f9
- Milestone: Survey 1 - Public Reconnaissance & Route Mapping

## 🔒 Key Constraints
- Read-only investigation — do NOT implement
- Do NOT create accounts, submit real user/payment data, or attempt to bypass login or paywalls
- Strictly label all findings: VERIFIED, INFERRED, or NOT OBSERVABLE
- Do NOT modify any project files outside working directory (e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_survey_1\)

## Current Parent
- Conversation ID: 9f7543cb-05cd-43f1-b2ae-ac96f1c228f9
- Updated: 2026-11-03T14:01:00Z

## Investigation State
- **Explored paths**:
  - `https://www.el-ameed.com/` (Homepage)
  - `https://www.el-ameed.com/classes` (Course Catalog & Filters)
  - `https://www.el-ameed.com/categories/الصف-الثالث-الثانوي` (Category Listing)
  - `https://www.el-ameed.com/course/ملخصات-الحصص-4` (Course Details - Lessons)
  - `https://www.el-ameed.com/course/اختبارات-اسبوعية-وشهرية-4` (Course Details - Quizzes)
  - `https://www.el-ameed.com/course/ملخصات-الحصص-4/free` (Free Enrollment Action)
  - `https://www.el-ameed.com/leaderboard` (Leaderboard & Stage Pills)
  - `https://www.el-ameed.com/login` (Authentication & Single Device Lock)
  - `https://www.el-ameed.com/register` (Registration & Parent Phone Validation)
  - `https://www.el-ameed.com/forget-password` (Password Recovery)
  - `https://www.el-ameed.com/users/{slug}/profile` (Instructor & Student Public Profiles)
  - `https://www.el-ameed.com/cart` (Cart Route - Verified Restricted)
  - `https://www.el-ameed.com/panel` (Student Dashboard - Verified Restricted)
- **Key findings**:
  - Platform Engine: Customized Rocket LMS (Laravel 10/11 + Blade + Laravel Mix + LiteSpeed + Cloudflare) engineered by "Mada - مدى".
  - Security & Anti-Cheating: `disable-devtool.min.js`, DevTools keystroke blocking (F12, Ctrl+Shift+I/J/C, Ctrl+U), right-click custom modal trigger, Single Device Enforcement (`device_id` via `MadaaDeviceBridge` / `X-Device-ID`), moving watermark on video canvas (`userName`, `avatarUrl`, `ID: {authUserId}`).
  - Video Player: Plyr.js with YouTube Direct (ytdlp stream) and MP4/Vimeo fallback, 0.5x-2x speed, video notes at time offsets, mobile fullscreen landscape lock.
  - Assessment Rules: 10 questions, 10 min duration, 5/10 passing mark, 1 attempt limit.
  - Registration Rules: Separate parent mobile number required with real-time discrepancy validation, Turnstile captcha, grade selector.
  - Visual Foundation: Cairo font for RTL Arabic, primary `#385f5c`, dark `#121f3e`, accent `#fe6257`.
- **Unexplored areas**: None in public scope. All restricted areas documented as RESTRICTED / NOT OBSERVABLE.

## Key Decisions Made
- Fully documented all 18 survey aspects with VERIFIED / INFERRED / NOT OBSERVABLE labels.
- Preserved complete evidence strings, DOM selectors, asset paths, and response codes.

## Artifact Index
- DISPATCH.md — Dispatch log
- BRIEFING.md — Persistent context & state
- progress.md — Liveness heartbeat & active tasks
- handoff.md — Final comprehensive reconnaissance report
