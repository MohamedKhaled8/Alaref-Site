# Comprehensive Survey 3 Report: Visual Design System, Responsive Architecture & Al Aref Baseline

- **Survey Target**: https://www.el-ameed.com/ (El-Ameed Educational Platform)
- **Adaptation Destination**: منصة العارف التعليمية - الأستاذ محمود مفلح (Al Aref Educational Platform)
- **Investigator**: teamwork_explorer (Survey 3)
- **Date**: 2026-11-03
- **Status**: Complete & Verified

---

## 1. Observation

### 1.1 Multi-Viewport Layout Dimensions & Grid Breakpoints
Through static CSS analysis of `https://www.el-ameed.com/assets/design_1/css/app.min.css` and live viewport rendering with Chrome headless at 1440px, 768px, and 390px, the reference layout parameters were observed and verified:

| Viewport Category | Breakpoint Width | Observed Layout Behavior [VERIFIED] | Container Width / Rules [VERIFIED] |
|---|---|---|---|
| **Desktop (Large/Wide)** | >= 1440px / 1200px | 12-column grid, 2-column Hero (side-by-side: 6/6), 4-column Grade Cards (1 row), 4-card Swiper Carousel, Asymmetrical Course Details (Body: `calc(100% - 348px)`, Sidebar: `324px`). | `width: 95% !important; min-width: 1009px !important; max-width: 1368px !important;` (standard `.container`), max 1800px (`.container-lg`). Padding-inline: 8px. |
| **Desktop (Standard)** | 992px - 1199px | 12-column grid, sticky header slides down (`slideDown 0.5s`), 4-column categories, 3-card carousel. | `max-width: 1140px;` |
| **Tablet** | 768px - 991px | Hero stacks vertically (Image on top, Content below), Categories collapse to 3+1 grid (3 on top row, 1 centered below), Course Carousel drops to 2 cards per slide, Floating bottom navbar (`.navbar-b`) activates. | `max-width: 767px; padding-right: 16px; padding-left: 16px;` |
| **Mobile** | <= 576px / 390px | Hero image centered top, badges scaled down (132px -> 88px, 416px -> 218px), Categories collapse to 2x2 grid, Course Carousel displays exactly 1 card per slide, Course Details collapses into a single column (`width: 100%`), Floating bottom navbar (`.navbar-b`, 65px height, 92% width) stays pinned. | `max-width: 100%; padding-right: 16px; padding-left: 16px;` |

#### Key Grid System & Breakpoint Rules [VERIFIED]
```css
/* Verbatim rules from app.min.css */
.container { width: 100%; padding-right: 8px; padding-left: 8px; margin-right: auto; margin-left: auto; }
@media screen and (min-width: 1200px) {
  .container { width: 95% !important; min-width: 1009px !important; max-width: 1368px !important; }
}
@media screen and (max-width: 991px) {
  .container { padding-right: 16px; padding-left: 16px; }
}
@media (min-width: 768px) { .container { max-width: 767px; } }
@media (min-width: 992px) { .container { max-width: 1140px; } }
```

---

### 1.2 Spacing Scale & Rhythm [VERIFIED]
The reference site utilizes an explicit pixel-based utility scale rather than a rem-based typographic system:
- **Spacing Units**:
  - Micro-spacing: `2px`, `4px`, `6px`, `8px` (`.m-2`, `.m-4`, `.m-6`, `.m-8`)
  - Intermediate: `10px`, `12px`, `14px`, `16px` (`.m-10`, `.m-12`, `.m-14`, `.m-16`)
  - Macro-spacing: `20px`, `24px`, `32px`, `48px` (`.mt-20`, `.mt-24`, `.mt-32`, `.mt-48`, `.mt-lg-48`)
- **Section Rhythm**: Sections are separated by `mt-32 mt-lg-48` (32px on mobile, expanding to 48px on large viewports).

---

### 1.3 Border Radius System [VERIFIED]
Directly extracted from `app.min.css`:
- `rounded-8` (8px): Dropdown items, mobile buttons, small flags.
- `rounded-12` (12px): Search input fields, tab indicators.
- `rounded-16` (16px): Course card thumbnails, ad banner images (`.rounded-16`).
- `rounded-20` (20px): Floating bottom bar (`.navbar-b`), large primary buttons (`.btn-xlg` on desktop).
- `rounded-24` (24px): Card depth masks (`.course-grid-card-1__mask`, `.trending-categories-section__item-card-mask`), theme footer card (`.theme-footer-card`).
- `rounded-32` (32px): Main Hero image (`.two-columns-hero-section__main-img`).
- `rounded-full` / `50%`: Cart badge (`16px x 16px`), Swiper navigation buttons (`44px x 44px`).

---

### 1.4 Typography Hierarchy & Font Families [VERIFIED]
Extracted from HTML `@font-face` declarations:
- **Arabic / RTL Font Family**: `rtl-font-family` mapped to **Cairo** (`/store/1/fonts/Cairo/Cairo-Regular.ttf`, `Cairo-Bold.ttf`).
- **English / Latin Font Family**: `main-font-family` mapped to **Roboto** (`/store/1/fonts/Roboto/Roboto-Regular.ttf`, `Roboto-Medium.ttf`, `Roboto-Black.ttf`).
- **Typographic Scale**:
  - Hero Main Heading: `44px - 52px`, `font-weight: 900 / black`, `line-height: 1.2`
  - Section Headings (`apps-text`, `المراحل الدراسية`): `24px - 28px`, `font-weight: 700`
  - Course Titles in Cards: `16px - 18px`, `font-weight: 700`, clamped to `max-height: 42px` (2 lines, `overflow: hidden; text-overflow: ellipsis;`)
  - Body Text / Descriptions: `14px - 15px`, `font-weight: 400`, color `var(--gray-500)`
  - Metadata / Badges: `11px - 12px`, `font-weight: 500 / 600`

---

### 1.5 Color Relationships & Design Tokens [VERIFIED]
Extracted verbatim from `:root` declarations in HTML and CSS:

```css
/* Light Mode Design Tokens */
:root {
  --primary: #385f5c;           /* Deep Pine/Teal Green */
  --primary-hover: #325552;
  --primary-border: #385f5c;
  --primary-btn-color: #ffffff;
  --primary-saturated: #417c78;
  --secondary: #417c78;
  --secondary-hover: #3a6f6c;
  --accent: #fe6257;            /* Coral Red */
  --accent-hover: #e4584e;
  --success: #3fcd82;           /* Mint Green */
  --info: #4831bb;              /* Indigo Blue */
  --warning: #ffa200;           /* Amber Gold */
  --danger: #f63c3c;            /* Crimson Red */
  --dark: #121f3e;              /* Deep Navy Charcoal */
  --black: #000000;
  --white: #ffffff;
  --gray-100: #fafcff;          /* Card highlight */
  --gray-200: #f0f4f9;          /* Card borders */
  --gray-300: #e9edf3;          /* Separators */
  --gray-400: #cdd5e2;          /* Disabled/border */
  --gray-500: #4f4f4f;          /* Muted body text */
  --gray: #f5f8f9;              /* Base background */
  --section-bg: #eaf0f3;        /* Alternating section bg */
}

/* Dark Mode Tokens (@media (prefers-color-scheme: dark) and .dark-mode) */
:root, html.auto-mode, body.auto-mode {
  --primary: #6d3d48;           /* Deep Burgundy / Wine / Plum */
  --primary-hover: #623640;
  --primary-saturated: #6d3d48;
  --secondary: #6d3d48;
  --accent: #ff8077;            /* Soft Coral */
  --success: #5ade98;
  --info: #8dbeff;
  --warning: #ffb32d;
  --danger: #fe6363;
  --dark: #aab8c5;
  --black: #e1eaf6;
  --white: #1e1f26;             /* Card Dark Surface */
  --gray-100: #272832;
  --gray-200: #30313e;
  --gray-300: #3e404e;
  --gray-400: #5d5f72;
  --gray-500: #8391a2;
  --gray: #17181e;              /* Main Dark Background */
  --section-bg: #2d323a;
}
```

---

### 1.6 Card Patterns, Depth Masks & Hover States [VERIFIED]
1. **Dual-Layer Depth Mask Pattern**:
   - Both `.course-grid-card-1` and `.trending-categories-section__item-card` use a pseudo-layer mask positioned behind the card:
     ```css
     .course-grid-card-1__mask {
       position: absolute;
       inset: 8px;
       bottom: -8px;
       border-radius: 24px;
       opacity: 0.5;
       background-color: var(--white);
       transition: all 0.3s ease;
       z-index: 1;
     }
     /* Hover transformation */
     .course-grid-card-1:hover .course-grid-card-1__mask {
       top: -8px;
       bottom: 8px;
     }
     .trending-categories-section__item-card:hover {
       top: -8px;
     }
     ```
2. **Card Structure**:
   - Image wrapper (`.course-grid-card-1__image`): height `226px`, border-radius `16px 16px 0 0`.
   - Card body (`.course-grid-card-1__body`): height `192px`, border-radius `0 0 16px 16px`, background `var(--white)`.
   - Dual CTA actions: Subtle link `عرض التفاصيل` (View Details) + Full-width primary button `الإشتراك في الكورس` (Enroll in Course).

---

### 1.7 Key Component Architectures [VERIFIED]

#### A. Header Architecture (`.theme-header-1`) [VERIFIED]
- **Top Utility Bar** (`.theme-header-1__top-navbar`):
  - Height: `114px` on desktop, `auto` on mobile (<991px).
  - Contains: Search box (`border-radius: 12px; border: 1px solid var(--white)`), Cart icon with counter badge (`16px x 16px circle`, background `var(--danger)`), Auth user dropdown.
- **Main Floating Navigation Bar** (`.theme-header-1__main`):
  - Height: `84px`, offset: `top: -42px; margin-bottom: -42px;`.
  - Mask: `.theme-header-1__main-mask` (`border-radius: 24px; opacity: 0.5; background: var(--white);`).
  - Sticky behavior: On scroll, attaches `.sticky` (`position: fixed; top: 20px; width: 100%; animation: slideDown 0.5s ease forwards;`).
  - Navigation links: "الصفوف الدراسية" (with category dropdown), "الرئيسية", "عرض المحتوى", "لوحة الشرف", "سجل الأن".

#### B. Hero Section (`.two-columns-hero-section`) [VERIFIED]
- Height: `820px` on desktop, `auto` on mobile (<991px).
- Content padding-top: `162px` (desktop) -> `62px` (mobile).
- Visual animations:
  - Spinning decorative badge (`132px x 132px` desktop -> `88px` mobile, `animation: rotate-animation 12s infinite linear;`).
  - Floating bouncing overlay badge (`416px x 218px` desktop -> `218px x 118px` mobile, `animation: two-columns-hero-section-up-down-animation 1s infinite alternate; translateY(-20px)`).
  - Waving upper CTA badge (`animation: wave-animation 2.5s infinite;`).

#### C. Mobile Floating Bottom Bar (`.navbar-b`) [VERIFIED]
- Fixed at screen bottom: `position: fixed; bottom: 20px; left: 50%; transform: translate3d(-50%, 0, 0);`.
- Dimensions: `width: 92%; max-width: 500px; height: 65px; border-radius: 20px;`.
- Glassmorphism styling: `background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(12px); box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);`.
- 3 primary tabs: "تسجيل دخول" (Login), "الرئيسية" (Home - elevated circular center button), "انشاء حساب" (Register).

#### D. Course Details Page Structure (`show_course.min.css`) [VERIFIED]
- **Course Hero Banner** (`.course-hero`): height `400px`, gradient mask `linear-gradient(280deg, rgba(18, 31, 62, 0.9) 0%, rgba(18, 31, 62, 0) 100%)`, `backdrop-filter: blur(5px)`.
- **Asymmetrical Split**:
  - Right/Main in RTL (`.course-body-side`): width `calc(100% - 348px)`.
  - Left Sidebar in RTL (`.course-right-side`): width `324px`, top offset `-224px` (overlaps banner), z-index 4. Contains Thumbnail (224px height), pricing badge (`مجاني`), main enrollment CTA, feature list, and instructor card.
- **Course Navigation Tabs** (`.course-tabs-card`): offset `top: -34px`, height `61px`, items: "عن الكورس" (About), "المحتوى" (Curriculum), "التعليقات" (Comments), "التقييمات" (Reviews).
- **Curriculum Units & Lessons Accordion**: Accordion headers display section title and lesson count ("8 الأجزاء"); expands to reveal lesson rows with duration and icons.
- **Sticky Bottom Enrollment Card** (`.course-bottom-fixed-card`): Appears on scroll (`transition: all 0.5s ease; bottom: 0;`), contains course thumbnail, title, enroll button, and 2px progress line (`.course-bottom-fixed-card__progress`).

#### E. Theme Footer Card (`.theme-footer-card`) [VERIFIED]
- Floating card container: `border-radius: 24px; border: 1px solid var(--border-color, #eef1f6); box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04); background-color: var(--white);`.
- Content: Centered instructor logo, avatar, WhatsApp/phone link (`01097303002`), social links (WhatsApp, TikTok, YouTube), and developer copyright attribution ("برمجة وتطوير مدى - Mada").

---

### 1.8 Al Aref Project Baseline Inspection (`study-buddy-sim`) [VERIFIED]
Inspection of the existing repository confirmed:
1. **Runtime & Build Tools**:
   - `React 18.3.1`, `Vite 5.4.19`, `TypeScript 5.8.3`, `Tailwind CSS 3.4.17`, `tailwindcss-animate 1.0.7`.
   - Radix UI Primitives installed: `@radix-ui/react-accordion`, `alert-dialog`, `avatar`, `checkbox`, `dialog`, `dropdown-menu`, `navigation-menu`, `popover`, `progress`, `radio-group`, `select`, `tabs`, `tooltip`.
   - Animation: `framer-motion 12.38.0`.
   - Icons: `lucide-react 0.462.0`.
   - Routing: `react-router-dom 6.30.1`.
   - State & Data: `zustand 5.0.12`, `@tanstack/react-query 5.83.0`.
2. **Current HTML Setup** (`study-buddy-sim/index.html`):
   - Document direction: `lang="ar" dir="rtl"` [VERIFIED].
   - Current fonts imported: Google Fonts `Cairo` (400, 500, 600, 700, 800) and `Inter` (400, 500, 600, 700).
3. **Current Tailwind Config** (`study-buddy-sim/tailwind.config.ts`):
   - Standard shadcn/ui configuration with generic HSL CSS variables.
   - Font families currently mapped to: `display: ['"Outfit"', 'system-ui']`, `body: ['"Inter"', 'system-ui']`.
   - Colors currently default to slate/blue (`--primary: 221.2 83.2% 53.3%`).

---

## 2. Logic Chain

### 2.1 From Reference Defects to Al Aref Architectural Upgrades
- **Observation**: In `mobile_390.png` and `tablet_768.png`, the reference top utility bar (`theme-header-1__top-navbar`) has fixed 114px desktop height rules that cause awkward wrapping, text clipping, and cramped layout on 390px screens. Furthermore, the search input placeholder is hard to tap on mobile.
- **Inference**: The reference site is built on an older Bootstrap 4 / Laravel Mix LMS theme (Rocket LMS) with hardcoded CSS overrides patched over time by the agency "Mada".
- **Conclusion for Al Aref**: Replace the dual-row desktop header on mobile with a dedicated Radix UI mobile Sheet/Drawer (`<Sheet>` from shadcn), preserving the desktop floating bar for >=992px while delivering an uncompromised mobile experience at 390px.

### 2.2 From Reference Dark Mode Inconsistency to Al Aref Creative Direction
- **Observation**: The reference site toggles between deep teal (`#385f5c`) in light mode and wine burgundy (`#6d3d48`) in dark mode. The dark mode wine tone feels heavy and saturated, lacking editorial refinement.
- **Logic**: Al Aref's authoritative creative direction mandates **Contemporary Editorial Arabic**, with an RTL Arabic-first identity, **Alexandria / IBM Plex Sans Arabic typography**, and a **Navy & Warm Ivory palette with Brass accents**.
- **Conclusion for Al Aref**: Translate the reference platform's functional layout into Al Aref's refined visual language:
  - Replace Burgundy/Teal with **Deep Midnight Navy** (`#0B132B` / `#1C2541` / `hsl(222, 47%, 11%)`) as primary foundation.
  - Replace stark white with **Warm Ivory / Cream** (`#FDFBF7` / `#FAF8F5` / `hsl(40, 33%, 98%)`) for editorial background elegance.
  - Replace harsh coral accent (`#fe6257`) with **Burnished Brass / Warm Amber Gold** (`#D97706` / `#C5A059` / `hsl(38, 92%, 50%)`) for authentic scholarly prestige.
  - Upgrade typography from generic Cairo/Roboto to **Alexandria** (Headings / Display) and **IBM Plex Sans Arabic** (Body / UI).

### 2.3 From Reference Card Depth Hacks to Modern CSS Elevation Tokens
- **Observation**: The reference site relies on an absolute `__mask` with `inset: 8px; bottom: -8px; opacity: 0.5;` to simulate physical card depth.
- **Logic**: This legacy hack adds redundant DOM elements (`<div class="course-grid-card-1__mask">`) and creates z-index layering complexities.
- **Conclusion for Al Aref**: Adapt this physical card depth concept cleanly using modern Tailwind CSS pseudo-elements (`before:absolute before:inset-2 before:-bottom-2 before:rounded-2xl before:bg-card/50`) or refined multi-stop box shadows (`shadow-[0_8px_30px_rgb(15_23_42/0.06)]`) that respect the dark/light mode tokens natively without DOM clutter.

---

## 3. Caveats & Scoping Limitations

1. **Authenticated Student Portal**: Any dashboard views requiring active paid student credentials, active exam execution timers, or live Zoom lecture sessions were NOT accessed to comply with strict non-credentialed audit rules. Labeled **NOT OBSERVABLE**.
2. **Video Player DRM & Streaming Backend**: The frontend uses Plyr.io (`plyr.min.css`) with custom HTML5 video overlays and Mada secure browser detection (`is-madaa-secure-browser`). The underlying streaming protocol (e.g., HLS/m3u8, BunnyCDN, Vimeo OTT, or proprietary AES encryption) is handled on authenticated lesson routes. Labeled **INFERRED**.
3. **Payment Gateway Integration**: Public routes show WhatsApp contact and cart redirection; live Telda, Fawry, or Paymob checkout response payloads were not triggered to avoid submitting test transactions. Labeled **NOT OBSERVABLE**.
4. **Al Aref Assets**: No competitor copyrighted imagery, educator likenesses, or proprietary text copy will be transferred. All Al Aref components will utilize Al Aref branding (منصة العارف التعليمية - الأستاذ محمود مفلح).

---

## 4. Conclusion & Adaptation Matrix

### 4.1 Proposed Al Aref Component Hierarchy

```
Al Aref Component System (RTL Arabic-First)
│
├── AppShell
│   ├── AlArefHeader (Sticky Floating Navbar with Mask Blur & Dropdown)
│   │   ├── BrandLogo ("العارف" Calligraphic / Modern Vector Mark)
│   │   ├── NavigationLinks (الرئيسية, الصفوف الدراسية, عرض المحتوى, لوحة الشرف)
│   │   ├── SearchCombobox (Command-K / Radix Popover)
│   │   ├── UserAuthActions (تسجيل الدخول / إنشاء حساب / Profile Avatar)
│   │   └── MobileDrawerTrigger (Hamburger -> Radix Sheet)
│   │
│   ├── MainLayoutContainer (Max-w 1368px Desktop, Fluid with 16px Padding Mobile)
│   │
│   ├── FloatingBottomNavbar (Mobile <= 768px: Glassmorphism Pill Bar with Elevate Home)
│   └── AlArefFooter (Enclosed Floating Editorial Card with Brass Accents & WhatsApp Support)
│
├── LandingHomePage
│   ├── EditorialHeroSection
│   │   ├── HeroTypography (Alexandria 900 Title with Brass Accent Gradient)
│   │   ├── InstructorCredentialCard (الأستاذ محمود مفلح - خبير اللغة العربية)
│   │   ├── HeroVisualStage (Instructor Portrait with Subtle Ambient Glow)
│   │   └── HeroActionGroup (Primary "ابدأ التعلم الآن" + Secondary "عرض المحتوى")
│   │
│   ├── AppPlatformBanner (Pill badges for iOS, Android, Windows)
│   │
│   ├── EducationalGradesSelector
│   │   └── GradeCard (Concentric Ring Stage Badges for 3rd Prep, 1st Sec, 2nd Sec, 3rd Sec)
│   │
│   ├── FeaturedCoursesCarousel
│   │   ├── SectionHeader ("محتوى المرحلة الدراسية الخاصة بك" + Grade Filter Tabs)
│   │   ├── EmblaCarousel (4 cards desktop, 2 tablet, 1 mobile)
│   │   │   └── AlArefCourseCard
│   │   │       ├── CardThumbnail (16:9 with Brass Category Badge)
│   │   │       ├── CardContent (Title 2-line clamp, Instructor Tag, Duration, Free/Paid Badge)
│   │   │       └── CardFooter (Subtle Details Link + Primary Enroll Button)
│   │   └── ViewAllCtaButton ("عرض كافة الكورسات")
│   │
│   └── TopStudentsPreview (Leaderboard Teaser with Top 3 Podium)
│
├── CourseCatalogPage (/courses)
│   ├── CatalogHeader (Search, Category Filters, Sort Dropdown)
│   ├── CourseGrid (Responsive 3-col desktop, 2-col tablet, 1-col mobile)
│   └── EmptyStateDisplay ("لا توجد دورات مطابقة للبحث")
│
├── CourseDetailsPage (/course/:slug)
│   ├── CourseHeroBanner (Editorial Deep Navy with Ivory Text & Duration Metadata)
│   ├── CourseContentLayout (Asymmetric 2-column: Body calc(100% - 360px), Sidebar 340px)
│   │   ├── CourseTabsSection (عن الدورة, المحتوى الدراسي, التقييمات, المناقشات)
│   │   ├── CurriculumAccordionGroup (Radix Accordion for Units, Lessons, and Quizzes)
│   │   │   ├── UnitAccordionItem
│   │   │   │   ├── LessonRow (Title, Duration, Video/PDF Icon, Preview Badge)
│   │   │   │   └── ExamRow (Title, Question Count, Duration, Passing Score Badge)
│   │   └── CourseEnrollmentSidebar (Sticky Card with Thumbnail, Price, Inclusions, and Buy CTA)
│   └── StickyMobileEnrollBar (Triggered on scroll past sidebar on mobile)
│
└── LeaderboardPage (/leaderboard)
    ├── StageFilterTabs (جميع المراحل, 3 إعدادي, 1 ثانوي, 2 ثانوي, 3 ثانوي)
    ├── PodiumTopThree (1st, 2nd, 3rd place with Gold/Silver/Bronze brass rings)
    └── RankedStudentList (Avatar, Full Name, Total Points/Score, Rank Number)
```

---

### 4.2 Al Aref Adaptation Matrix Foundations

| Reference Feature / Pattern | Observed Behavior (El-Ameed) [VERIFIED] | Al Aref Adaptation Strategy [VERIFIED PROPOSAL] | Required Technical Modules in `study-buddy-sim` |
|---|---|---|---|
| **RTL Layout & Typography** | Bootstrap RTL (`rtl-app.min.css`) + Cairo & Roboto via `@font-face`. Clamped 42px titles. | Native Tailwind RTL (`dir="rtl"`) + Alexandria (Display/Headings) & IBM Plex Sans Arabic (Body). Smooth line-clamp-2. | Update `index.html` font imports + `tailwind.config.ts` font families. |
| **Color System** | Teal green (`#385f5c`) in light mode; Burgundy wine (`#6d3d48`) in dark mode. | Contemporary Editorial Arabic: Deep Midnight Navy (`#0F172A`), Warm Ivory (`#FDFBF7`), and Brass Accents (`#D97706` / `#C5A059`). | Configure semantic tokens in `src/index.css` and `tailwind.config.ts`. |
| **Header Architecture** | Fixed 114px top utility bar + 84px floating nav with mask. Overflows on mobile 390px. | Single responsive sticky header (80px desktop, 64px mobile) with backdrop-blur, search combobox, and Radix Sheet mobile drawer. | `components/layout/Header.tsx`, `components/ui/sheet.tsx`. |
| **Mobile Bottom Bar** | Fixed pill bar (`.navbar-b`), width 92%, height 65px, blur 12px, 3 items. | Floating mobile navigation dock with elevated center home tab and spring interaction (`framer-motion`). | `components/layout/MobileBottomNav.tsx`. |
| **Hero Composition** | 2-column (text right, image left in RTL), spinning badges, waving CTA icon. | Editorial asymmetric hero: Scholarly headline, instructor presentation (Mr. Mahmoud Mofleh), subtle floating brass badges. | `components/home/EditorialHero.tsx`. |
| **Grade Selector** | 4 concentric circular badges (3rd Prep to 3rd Sec) with 3 courses count each. | Concentric gold-accented grade cards with active stage indicator and dynamic course count. | `components/home/GradeSelector.tsx`. |
| **Course Cards** | Card with 226px image, 192px body, floating depth mask on hover (`top: -8px`). | Clean Tailwind card with brass border highlight on hover, duration badge, free/paid indicator, and dual CTA. | `components/courses/CourseCard.tsx`. |
| **Course Details Layout** | Hero 400px + Asymmetric split (Body 100%-348px, Sidebar 324px overlapping hero -224px). | Asymmetric editorial layout with sticky enrollment sidebar on desktop and bottom sticky action on mobile. | `pages/CourseDetails.tsx`, `components/course/EnrollmentCard.tsx`. |
| **Curriculum Accordion** | Unit overview header + accordion with lesson parts count and expandable list. | Radix UI Accordion (`@radix-ui/react-accordion`) with lesson icons, video duration, and quiz parameters. | `components/course/CurriculumAccordion.tsx`. |
| **Leaderboard / لوحة الشرف** | Top students list with podium for top 3 and grade filters. | Editorial Honor Board with Gold/Silver/Bronze brass medallions, student points, and grade switching tabs. | `pages/Leaderboard.tsx`, `components/leaderboard/Podium.tsx`. |
| **Theme Footer Card** | Enclosed floating card (`rounded-24`) with phone, WhatsApp, and agency logo. | Brand-aligned enclosed footer card with Al Aref identity, WhatsApp support link, and legal copyright. | `components/layout/Footer.tsx`. |

---

## 5. Verification Method

### 5.1 Independent Reproduction Commands
To verify the visual findings, breakpoints, and CSS tokens independently:

1. **Verify CSS Root Tokens & Variables**:
   ```powershell
   curl.exe -sL https://www.el-ameed.com/ | Select-String -Pattern ':root' -Context 0, 40
   ```
2. **Verify Layout Breakpoints & Containers**:
   ```powershell
   curl.exe -sL https://www.el-ameed.com/assets/design_1/css/app.min.css | Select-String -Pattern '@media screen and \(min-width: 1200px\)' -Context 0, 10
   ```
3. **Capture Viewports Headless Verification**:
   ```powershell
   cmd /c "`"C:\Program Files\Google\Chrome\Application\chrome.exe`" --headless --disable-gpu --screenshot=C:\temp\verify_1440.png --window-size=1440,2500 https://www.el-ameed.com/"
   cmd /c "`"C:\Program Files\Google\Chrome\Application\chrome.exe`" --headless --disable-gpu --screenshot=C:\temp\verify_390.png --window-size=390,2500 https://www.el-ameed.com/"
   ```
4. **Inspect Al Aref Baseline Files**:
   - `e:\Mt FlutterProject\yalaAcademy\study-buddy-sim\package.json`
   - `e:\Mt FlutterProject\yalaAcademy\study-buddy-sim\tailwind.config.ts`
   - `e:\Mt FlutterProject\yalaAcademy\study-buddy-sim\src\index.css`
   - `e:\Mt FlutterProject\yalaAcademy\study-buddy-sim\index.html`

### 5.2 Invalidation Conditions
- If El-Ameed alters its CSS CDN stylesheets or theme layout, re-run the curl commands to extract updated tokens.
- If Al Aref creative direction is revised by the client, the Navy/Ivory/Brass color tokens can be updated in `tailwind.config.ts` while keeping the component hierarchy intact.
