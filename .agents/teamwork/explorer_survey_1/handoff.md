# Handoff Report — Explorer Survey 1: Public Reconnaissance & Route Mapping

**Target Platform**: [El-Ameed Educational Platform](https://www.el-ameed.com/) (منصة محمد العميد - عميد اللغة العربية)  
**Investigating Agent**: `teamwork_explorer` (Survey 1)  
**Parent Agent**: `9f7543cb-05cd-43f1-b2ae-ac96f1c228f9`  
**Report Date**: 2026-11-03T14:05:00Z  
**Integrity Mode**: Strict Read-Only Reconnaissance  

---

## 1. Observation

All findings in this section are directly observed from the live production web target at `https://www.el-ameed.com/` using HTTP header inspection, DOM examination, curl requests, and client script analysis. Every finding is labeled strictly as `VERIFIED`, `INFERRED`, or `NOT OBSERVABLE`.

### 1.1 Infrastructure, Server Headers & Platform Identity
- **Server Response Headers** `[VERIFIED]`:
  - `Server: cloudflare`
  - `x-turbo-charged-by: LiteSpeed`
  - `X-Powered-By: PHP/8.5.12`
  - `platform: hostinger`, `panel: hpanel`
  - `Cache-Control: no-cache, private`
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
  - `Set-Cookie: XSRF-TOKEN=...` (Base64 JSON with `iv`, `value`, `mac`)
  - `Set-Cookie: mohamedel3amed_session=...` (Laravel encrypted session cookie)
  - `Set-Cookie: user_locale=...`
- **Application Framework & CMS** `[VERIFIED]`:
  - Architecture: Customized Rocket LMS (Universal LMS Laravel codebase) adapted and hosted by "Mada - مدى" (`https://api.whatsapp.com/send/?phone=201010948682`).
  - Asset Pipeline: Laravel Mix (`/mix-manifest.json?v=4`).
  - Templating: Laravel Blade (`<meta name="csrf-token" content="...">`, `_token` hidden inputs).
  - Versioned Asset Bundles: `?v=1792649360` stamped across all CSS/JS bundles.

### 1.2 Observable Route Inventory & Access Boundaries
| Route Path | Type | HTTP Status | Auth Requirement | Status Label | Key Observable Elements |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/` | Page | `200 OK` | Public | `VERIFIED` | Top navbar, Hero with Typed.js, App store badges, 4 Stage cards, 12-course swiper, footer, cart drawer, mobile floating navbar. |
| `/classes` | Page / AJAX | `200 OK` | Public | `VERIFIED` | Course catalog, live search (350ms debounce), 4 quick switches (upcoming, free, discount, downloadable), Select2 sort, left accordion filters (grades, types, prices, teachers, ratings), 3-col grid/list cards, AJAX pagination. |
| `/categories/{slug}` | Page | `200 OK` | Public | `VERIFIED` | `/categories/الصف-الثالث-الاعدادي`, `/categories/الصف-الاول-الثانوي`, `/categories/الصف-الثاني-الثانوي`, `/categories/الصف-الثالث-الثانوي`. Pre-filtered catalog matching `/classes`. |
| `/course/{slug}` | Page | `200 OK` | Public | `VERIFIED` | Course details hero, cover image, breadcrumbs, student/lecture counts, 4 tabs (About, Content, Comments, Reviews), chapters accordion, lesson cards, quiz preview cards, instructor card, buy/enroll sidebar. |
| `/course/{slug}/free` | Action | `302 Found` -> `/login` | Restricted | `VERIFIED` | Free course instant enrollment endpoint; unauthenticated requests are redirected immediately to `/login`. |
| `/leaderboard` | Page | `200 OK` | Public | `VERIFIED` | Top student ranking podium (#1 Gold, #2 Silver, #3 Bronze crowns), stage filter pills, student avatars, course counts, point tallies. |
| `/leaderboard?category_id={id}` | Page | `200 OK` | Public | `VERIFIED` | Filtered leaderboard per grade (`647`, `648`, `649`, `650`). |
| `/login` | Page | `200 OK` | Public | `VERIFIED` | Phone number auth form, country code picker, password input, show/hide toggle, single device enforcement alert ("الأجهزة المسموح بها: 1"), `resolveDeviceId()` script. |
| `/register` | Page | `200 OK` | Public | `VERIFIED` | Registration form: `mobile`, `country_code`, `parent_mobile` (with distinctness validation), `full_name`, `category_id`, `password`, `password_confirmation`, Cloudflare Turnstile captcha, Google OAuth (`/google`), benefit slider. |
| `/forget-password` | Page | `200 OK` | Public | `VERIFIED` | Password recovery via mobile phone number (`name="mobile"`, `type="mobile"`). |
| `/users/{slug}/profile` | Page | `200 OK` | Public | `VERIFIED` | Instructor & student public profiles (`/users/mstr-mhmd-alaamyd-0tljw/profile`, `/users/mrym-hsam-mkhtar-hsn-nfvy2/profile`): avatar, verified badge, followers/following, "عضو منذ ...", About/Courses/Products tabs. |
| `/cart` | Page | `302 Found` -> `/login` | Restricted | `VERIFIED` / `NOT OBSERVABLE` | Shopping cart checkout page; unauthenticated access redirects to `/login`. Internal checkout steps not observable without valid credentials. |
| `/cart/store` | Action | POST | Public / Session | `VERIFIED` | Add to cart form endpoint (`item_id`, `item_name="webinar_id"`). |
| `/locale` | Action | POST | Public | `VERIFIED` | Language switcher (`locale="ar"`). |
| `/panel` | Dashboard | `302 Found` -> `/login` | Restricted | `VERIFIED` / `NOT OBSERVABLE` | Student / Instructor control panel root. All subroutes (`/panel/webinars`, `/panel/quizzes`, `/panel/financial`, etc.) require authentication. |
| `/courseLearningUrl/video-note/*` | API | JSON | Restricted | `INFERRED` | Video notes list and form endpoints referenced in `video_player_helpers.min.js`. |
| `/users/search` | API | JSON | Public | `VERIFIED` | Dynamic Select2 instructor search endpoint (`data-api-path="/users/search"`, `data-item-column-name="full_name"`, `data-option="just_teachers"`). |

### 1.3 Navigation Hierarchy & Header/Footer Inventory
- **Top Utility Bar (`.theme-header-1__top-navbar`)** `[VERIFIED]`:
  - Contact hotline: `01097303002` (with phone SVG icon).
  - Theme mode toggle: `.js-theme-color-toggle` (switches between light, dark, and auto modes via `localStorage.getItem('theme-mode')`).
  - Language dropdown: `.js-language-select` (form action `/locale`, method POST).
  - Auth quick links: "تسجيل الدخول" (`/login`), "انشاء حساب" (`/register`).
- **Sticky Main Header (`#themeHeaderSticky`, `.theme-header-1__main`)** `[VERIFIED]`:
  - Brand Logo: Dual SVG/WebP logos (`/store/1/logo-color.webp` for light mode, `/store/1/logo-white.webp` for dark mode).
  - Grade Selection Dropdown ("الصفوف الدراسية"):
    - الصف الثالث الاعدادي (`/categories/الصف-الثالث-الاعدادي`, icon: `/store/1/default_images/categories_icons/PREP3.webp`)
    - الصف الاول الثانوي (`/categories/الصف-الاول-الثانوي`, icon: `/store/1/default_images/categories_icons/1st copy.webp`)
    - الصف الثاني الثانوي (`/categories/الصف-الثاني-الثانوي`, icon: `/store/1/default_images/categories_icons/2nd copy.webp`)
    - الصف الثالث الثانوي (`/categories/الصف-الثالث-الثانوي`, icon: `/store/1/default_images/categories_icons/3rd copy.webp`)
  - Primary Navigation Links:
    - "الرئيسية" (`/`)
    - "عرض المحتوى" (`/classes`)
    - "لوحة الشرف" (`/leaderboard`)
  - CTA Button: "سجل الأن" (`/register`) styled with graduation cap SVG and 3D flip text effect (`.btn-flip-effect`).
- **Mobile Floating Bottom Navigation Bar (`.navbar-b`)** `[VERIFIED]`:
  - Active only on viewports `<= 991px`.
  - Floating pill container (`border-radius: 20px`, glassmorphic shadow, `z-index: 9999`).
  - 3 primary tabs:
    - "انشاء حساب" (`/register` with Boxicons `bx-user-plus`).
    - Elevated circular centerpiece "الرئيسية" (`/` with `plus-btn active`, Boxicons `bx-home`).
    - "تسجيل دخول" (`/login` with Boxicons `bx-user`).
  - Interactive behavior: Automatically hides on scroll down (`translate3d(-50%, 120px, 0)`), reappears on scroll up, and completely hides when mobile soft keyboard is opened (`body.is-keyboard-open`).
- **Footer Section (`.theme-footer-card`)** `[VERIFIED]`:
  - Centered brand logo.
  - Hotline: `tel:01097303002`.
  - Copyright: "جميع الحقوق محفوظة © 2026 منصة محمد العميد".
  - Developer Credit: "برمجة وتطوير Mada - مدى" linking to WhatsApp `https://api.whatsapp.com/send/?phone=201010948682`.
  - Social Channels:
    - YouTube: `https://youtube.com/@elameed?si=q9Hlx8w3mXHSYFbA`
    - TikTok: `https://www.tiktok.com/@elameedmuhammedtarek?_r=1&_t=ZS-98ZiAWFhqjw`
    - WhatsApp Support: `https://api.whatsapp.com/send/?phone=201097303002`

### 1.4 Content Inventory & Structure
- **Educational Grades & Course Counts** `[VERIFIED]`:
  - الصف الثالث الاعدادي (`category_id: 647`): 3 courses.
  - الصف الاول الثانوي (`category_id: 648`): 3 courses.
  - الصف الثاني الثانوي (`category_id: 649`): 3 courses.
  - الصف الثالث الثانوي (`category_id: 650`): 3 courses.
  - Total catalog size: 12 courses.
- **Course Packaging Archetypes** `[VERIFIED]`:
  Across each grade, the platform standardizes exactly 3 course offerings:
  1. **ملخصات الحصص** (Lesson Summaries & Video Reviews): Video lectures + attached PDFs + practice problem walk-throughs.
  2. **اختبارات اسبوعية وشهرية** (Weekly & Monthly Exams): Timed quizzes with automated scoring.
  3. **حصص مدفوعة لطلاب الاونلاين** (Paid Core Curriculum Lessons): Premium subscription units.
- **Curriculum & Lesson Decomposition (from course `ملخصات-الحصص-4`)** `[VERIFIED]`:
  - Curriculum summary indicator: "يحتوي هذا الكورس 1 وحدات، 8 دروساً، و 0 ساعة من المواد."
  - Chapter: `ملخصات الحصص` (`#collapseChapter194`).
  - Observed Lesson Items:
    1. ملخص الحصة الاولي كان واخواتها وحل تدريبات نحو وادي وقصة (`#collapseFiles200` - Locked, disabled button triggering `not-login-toast`).
    2. ملخص الحصة الثانية ٣ ثانوي كاد واخواتهاوالبلاغة والنصوص (`#collapseFiles202` - Free preview, active `.js-play-video` button).
    3. الحصة الرابعة لا النافية للجنس (`#collapseFiles210` - Free preview).
    4. الحصة الخامسة احكام المبتدا والخبر وحل بلاغة ونصوص (`#collapseFiles214` - Free preview).
    5. الحصة السابعة اسم الفاعل وقراءة متحررة (`#collapseFiles218` - Free preview).
    6. الحصة الثامنة صيغ المبالغة وحل قصة وتعبير (`#collapseFiles221` - Free preview).
- **Exam & Assessment Parameters (from course `اختبارات-اسبوعية-وشهرية-4`)** `[VERIFIED]`:
  - Quiz title: "اختبار الحصة الاولى" (`#collapseQuiz62`).
  - Question count: `الأسئلة: 10`.
  - Duration: `المدة: 10 دقائق`.
  - Passing mark: `درجة النجاح: 5/10`.
  - Total grade: `الدرجة الكلية: 10`.
  - Attempt limit: `المحاولات: 0/1` (1 single attempt allowed).
  - Action button: "بدء الاختبار" (disabled with class `not-login-toast` for guests).
- **Video Player Architecture & Streaming Details** `[VERIFIED]`:
  - Player Engine: `Plyr.js` (`/assets/vendors/plyr.io/plyr.min.js`, `/assets/vendors/plyr.io/plyr.min.css`).
  - Helper Controller: `/assets/design_1/js/parts/video_player_helpers.min.js`.
  - Stream Adapters:
    - `youtube_direct`: Extracted direct streams via yt-dlp backend with custom `<video class="plyr-io-video ytdlp-player">`.
    - `vimeo`: Embed URL rewriting (`player.vimeo.com/video/{id}`).
    - Native MP4 / HLS streams.
  - Interactive Controls: Play/pause, 10s rewind, 10s fast-forward, progress scrubber, volume, speed selector (`0.5x, 0.75x, 1x, 1.25x, 1.5x, 1.75x, 2x`), AirPlay, fullscreen.
  - Quality Overlay Badge (`.plyr__quality-badge.badge`): Live badge displaying 1080p, 720p, 480p, 360p, 240p, Auto.
  - Dynamic Anti-Piracy Watermark (`window.initMovingWatermark`) `[VERIFIED]`:
    - Floating, fading element overlaying video surface.
    - Watermark payload: student full name, user avatar, and student ID (`ID: {authUserId}`).
    - Repositions dynamically across quadrants to deter screen recording and account credential sharing.
  - Timestamped Video Notes (`window.initPlyrVideoNotes`) `[VERIFIED]`:
    - Pin markers (`.plyr-video-note-marker`) inserted onto progress bar.
    - Notes popup modal via `courseLearningUrl + "/video-note/get-form"`.
    - Distinguishes teacher annotations (`is_teacher`) from student notes.
  - Mobile Landscape Lock `[VERIFIED]`: On play under `<= 991px`, automatically calls `screen.orientation.lock("landscape")` and triggers native fullscreen.

### 1.5 Security, Protection & Anti-Inspection Suite
- **Disable-Devtool Active Interceptor** `[VERIFIED]`:
  - Script: `/assets/default/vendors/disable-devtool.min.js?v=1792649360`.
  - Keystroke Interception:
    - F12 (Windows/Mac/Linux).
    - Inspect combos: `Ctrl+Shift+I`, `Ctrl+Shift+J`, `Ctrl+Shift+C`, `Ctrl+Shift+E`, `Ctrl+Shift+K`, `Cmd+Option+I/J/C/K/E/Z`.
    - Source/Save/Print shortcuts: `Ctrl+U`, `Cmd+U`, `Ctrl+S`, `Cmd+S`, `Ctrl+P`, `Cmd+P`.
    - Action: Immediately executes `window.location.replace('about:blank')` upon detection.
  - Whitelist: Form input fields allow standard editing keys (`Ctrl+A`, `Ctrl+C`, `Ctrl+V`).
- **Context Menu Interception & Security Warning Modal** `[VERIFIED]`:
  - Right-click (`contextmenu`) is prevented site-wide on non-input elements.
  - Triggers `#security-warning-modal` (`.security-modal-overlay`):
    - Title: "محتاج حاجة نقدر نساعدك 🤔 ؟"
    - Body: "تقدر تتواصل معانا اذا في حاجة بتدور عليها نقدر نساعدك فيها، أو إذا لاحظت أي مشكلة في المنصة، فريق الدعم الفني جاهز لمساعدتك في أسرع وقت."
    - Direct WhatsApp CTA: "تواصل مع الدعم" (`https://api.whatsapp.com/send/?phone=201097303002`).
    - Dismiss link: "مفيش ، اقفل".
- **Single Device Hardware Lock System** `[VERIFIED]`:
  - Banner on Login & Register: "الأجهزة المسموح بها: 1" (`.js-device-limit-alert`).
  - Device Identification Routine (`resolveDeviceId()`):
    1. Checks native bridge: `window.MadaaDeviceBridge.getDeviceId()`.
    2. Fallback: Reads cookie `X-Device-ID`.
    3. Populates hidden form input `<input type="hidden" name="device_id" id="login_device_id_field">`.
    4. Sets 1-year persistent cookie `X-Device-ID={id}; path=/; max-age=31536000; SameSite=Lax`.
- **App Store & Secure Environment Detection** `[VERIFIED]`:
  - Script checks `navigator.userAgent.indexOf('MadaaSecureBrowser') !== -1`.
  - Checks iOS WebClip standalone mode (`window.navigator.standalone === true` or cookie `MADAA-IOS-`).
  - Automatically hides app download badges when already running within the dedicated app/secure browser.

---

## 2. Logic Chain

1. **Platform Origin & Customization**:
   - *Observation*: Assets follow `/assets/design_1/`, `/assets/default/vendors/`, and `/mix-manifest.json`. Session cookies are `mohamedel3amed_session`. Footer credits "برمجة وتطوير Mada - مدى".
   - *Deduction*: The site is built on Rocket LMS (a popular PHP/Laravel LMS product), customized extensively by Egyptian ed-tech agency "Mada".

2. **Strict Single Device Policy**:
   - *Observation*: Prominent alert "الأجهزة المسموح بها: 1", hidden `device_id` input on login/register, device bridge script `window.MadaaDeviceBridge`, and persistent cookie `X-Device-ID`.
   - *Deduction*: Egyptian secondary education platforms face rampant account sharing. The platform binds student enrollment to a single hardware device ID; logging in from a second device requires administrator reset or revokes previous session.

3. **Parent Phone Discrepancy Requirement**:
   - *Observation*: Registration form requires `mobile` and `parent_mobile`, displaying warning "تنبيه: يجب أن يكون رقم ولي الأمر مختلفاً عن رقم هاتف الطالب", with client-side error container `.js-parent-mobile-same-error`.
   - *Deduction*: Automated SMS/WhatsApp notifications and exam score reports are dispatched to parents. Requiring a distinct parent number prevents students from entering their own number twice to hide attendance or grades.

4. **Public Catalog vs. Gated Content**:
   - *Observation*: Course descriptions, syllabus chapter titles, lesson names, and exam parameters (10 questions, 10 min) are completely visible to guests. However, clicking "تشغيل" on non-free lessons shows `not-login-toast`, clicking "الإشتراك في الكورس" (`/course/{slug}/free`) triggers `302 Found` -> `/login`, and clicking `/cart` or `/panel` triggers `302 Found` -> `/login`.
   - *Deduction*: Public SEO and marketing funnel are wide open; course discovery and trust-building curriculum previews require no account. Full multimedia streams, testing interfaces, and transaction checkpoints are strictly gated behind authentication.

5. **Video Delivery & Anti-Piracy Architecture**:
   - *Observation*: Inclusion of Plyr.js, moving dynamic watermark (`initMovingWatermark`) displaying student name and database ID, yt-dlp direct stream parsing, and landscape lock on mobile.
   - *Deduction*: Egyptian tutors experience content leaks to Telegram. The platform mitigates this by burning the student's identity into a moving floating watermark during playback, identifying any student who records their screen.

---

## 3. Caveats

1. **Restricted Authenticated Portals** `[NOT OBSERVABLE]`:
   - `/panel/*` (Student Dashboard, My Courses, Active Quizzes, Financial Wallet, Certificates, Support Tickets) requires active session credentials. Under strict read-only constraints, no account was registered.
   - `/cart` and payment gateway integration (e.g. Fawry, Vodafone Cash, Paymob, or Meeza) were not exercised with live payment data.
2. **Video Stream Token Expiration** `[INFERRED]`:
   - Free preview videos play via client-side player initialization. Backend stream URL expiration (signed HLS or time-limited tokens) could not be verified without authenticated stream playback.
3. **Database Schema Internal Field Naming** `[INFERRED]`:
   - Database tables are inferred based on Rocket LMS standards and observed form parameters (`webinar_id`, `category_id`, `chapter_id`, `quiz_id`, `device_id`). Exact migration files cannot be inspected directly without server-side filesystem access.

---

## 4. Conclusion

The reconnaissance of `https://www.el-ameed.com/` establishes an exact, production-proven blueprint for an Egyptian high school educational platform:

### Summary of Platform Archetype
- **Target Audience**: Egyptian Thanaweya Amma (3rd Prep, 1st Sec, 2nd Sec, 3rd Sec) Arabic Language students.
- **Core Product Model**: Free foundational video summaries + Paid comprehensive lecture packages + Timed weekly/monthly assessment quizzes.
- **Visual Foundation**: Modern, responsive, Arabic-first RTL design utilizing `Cairo` font, clean rounded cards (`border-radius: 24px-32px`), dual light/dark mode, and mobile-optimized floating pill navigation.
- **Security Triad**:
  1. Anti-Inspection / DevTools suppression (`DisableDevtool`).
  2. Single Device Login lock (`device_id`).
  3. Dynamic moving watermark on video player with student ID to prevent leaks.
- **Parental Integration**: Mandatory distinct parent mobile number at registration.

### Comprehensive Observable Route Map
```text
https://www.el-ameed.com/
│
├── Public Pages & Catalog
│   ├── / (Homepage: Hero, Badges, Stages, Courses Swiper, Footer, Floating Navbar)
│   ├── /classes (Complete Course Catalog: Filters, Search, Sort, Grid/List)
│   ├── /categories/الصف-الثالث-الاعدادي (Grade 3 Prep Catalog)
│   ├── /categories/الصف-الاول-الثانوي (Grade 1 Secondary Catalog)
│   ├── /categories/الصف-الثاني-الثانوي (Grade 2 Secondary Catalog)
│   ├── /categories/الصف-الثالث-الثانوي (Grade 3 Secondary Catalog)
│   ├── /course/{course-slug} (Course Overview, Syllabus, Free Previews, Specs)
│   ├── /leaderboard (Top Student Rankings, Stage Filter Pills, Podium)
│   └── /users/{user-slug}/profile (Instructor / Student Public Profiles)
│
├── Authentication & Identity
│   ├── /login (Mobile + Password Auth, Device Lock)
│   ├── /register (Student + Parent Mobile, Grade Select, Turnstile Captcha)
│   ├── /forget-password (SMS/Mobile Recovery)
│   └── /google (Google OAuth Redirect)
│
├── Interactive Actions & AJAX APIs
│   ├── /locale (POST: Language switcher)
│   ├── /users/search (GET: Search teachers for filter)
│   └── /cart/store (POST: Add course to cart)
│
└── Restricted Routes (Gated behind Auth - 302 Redirect to /login)
    ├── /course/{slug}/free (Instant Free Course Enrollment)
    ├── /cart (Checkout & Order Review)
    └── /panel/* (Student Learning Portal, Active Quizzes, Dashboard)
```

---

## 5. Verification Method

To independently verify all findings in this report, execute the following reproduction steps:

1. **Verify Server Platform & Headers**:
   ```bash
   curl -I https://www.el-ameed.com/
   # Observe: x-powered-by: PHP/8.5.12, LiteSpeed, cloudflare, and XSRF-TOKEN cookie.
   ```
2. **Verify Anti-DevTools & Security Interception**:
   ```bash
   curl -s https://www.el-ameed.com/ | grep -E "disable-devtool|showSecurityModal|redirectToBlank"
   # Observe: Verbatim inclusion of disable-devtool.min.js and shortcut traps for F12, Ctrl+Shift+I.
   ```
3. **Verify Single Device Login Enforcement**:
   ```bash
   curl -s https://www.el-ameed.com/login | grep -E "device_id|MadaaDeviceBridge|الأجهزة المسموح بها"
   # Observe: resolveDeviceId() routine, X-Device-ID cookie logic, and "الأجهزة المسموح بها: 1".
   ```
4. **Verify Parent Phone Requirement & Validation**:
   ```bash
   curl -s https://www.el-ameed.com/register | grep -E "parent_mobile|js-parent-mobile-same-error"
   # Observe: Parent phone field and verbatim error message "رقم ولي الأمر لا يمكن أن يكون نفس رقم هاتف الطالب".
   ```
5. **Verify Quiz & Assessment Parameters**:
   ```bash
   curl -s "https://www.el-ameed.com/course/%D8%A7%D8%AE%D8%AA%D8%A8%D8%A7%D8%B1%D8%A7%D8%AA-%D8%A7%D8%B3%D8%A8%D9%88%D8%B9%D9%8A%D8%A9-%D9%88%D8%B4%D9%87%D8%B1%D9%8A%D8%A9-4" | grep -A 2 -B 2 "الأسئلة"
   # Observe: 10 questions, 10 minutes duration, 5/10 passing mark, 0/1 attempt limit.
   ```
6. **Verify Gated Boundaries (Cart, Free Enrollment, Panel)**:
   ```bash
   curl -I https://www.el-ameed.com/cart
   curl -I "https://www.el-ameed.com/course/%D9%85%D9%84%D8%AE%D8%B5%D8%A7%D8%AA-%D8%A7%D9%84%D8%AD%D8%B5%D8%B5-4/free"
   curl -I https://www.el-ameed.com/panel
   # Observe: All return HTTP 302 Found redirecting to Location: https://www.el-ameed.com/login.
   ```
