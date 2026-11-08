# Al Aref Academy — Master Architecture & Agent Guidelines

> **Autonomous Multi-Agent Directive for Antigravity & AI Assistants**  
> **Workspace**: `e:\Mt FlutterProject\yalaAcademy`  
> **Target Project**: `study-buddy-sim` (منصة مستر عمرو عارف التعليمية)  
> **Benchmark Model**: `https://www.el-ameed.com/`

---

## 1. Core Mandate & Zero-Effort User Experience

The user should **NEVER** need to manually mention dozens of slash commands, skills, or rule files. When the user gives any instruction, the assistant must **automatically**:
1. Understand and classify the user's intent (UI/UX Design, Feature Implementation, Refactoring, Architecture, or Verification).
2. Autonomously route and enforce the corresponding skills, rules, and best practices.
3. Deliver authentic, production-grade output with zero AI clichés and zero destructive filtering.
4. Empirically verify the runtime build, unit tests, and live visual rendering via Playwright before claiming task completion.

---

## 2. Platform Ground Truth & Domain Model

| Property | Value |
|---|---|
| **Platform Name** | منصة مستر عمرو عارف التعليمية (أستاذ اللغة العربية) |
| **Instructor** | مستر عمرو عارف — أستاذ اللغة العربية للإبتدائية والإعدادية |
| **Credential** | نخبة من أفضل معلمي اللغة العربية • تخصص تأسيس وبلاغة ونحو |
| **Primary Color** | Burgundy `#753b47` / `#8d4756` (Hover: `#854351`) |
| **Accent Color** | Coral `#fe6257` / `#e87a71` |
| **Background Tone** | Deep Navy Slate `#111625` / Dark Canvas `#0c101c` |
| **Surface Cards** | `#181a24` / `#1e1f26` with `border: rgba(255, 255, 255, 0.1)` |
| **Support Phone** | `01097303002` (WhatsApp & Calls) |
| **Developer Credit** | `Mada - مدى` (`201010948682`) |
| **Educational Stages** | الصف الثالث الإعدادي، الثاني الإعدادي، الأول الإعدادي، السادس الابتدائي، كورس التأسيس الشامل |

---

## 3. Autonomous Skill & Tool Routing Matrix

Depending on the nature of the request, automatically activate the corresponding skill suite:

```
User Request
    │
    ├──► [Visual / UI / Layout]
    │       └──► Enforce: ui-ux-pro-max + high-end-visual-design + web-design-guidelines + design-system
    │
    ├──► [Component & Code Architecture]
    │       └──► Enforce: vercel-composition-patterns + vercel-react-best-practices + react-bits
    │
    ├──► [Planning, RFC & System Design]
    │       └──► Enforce: egm-brainstorm + egm-draft + egm-review (Elephant-Goldfish Model)
    │
    ├──► [Specs & Lean Execution]
    │       └──► Enforce: openspec + caveman (surgical-patch, lean) + ponytail + headroom + humanizer
    │
    ├──► [Deep Research & Intelligence]
    │       └──► Enforce: academic-research-skills + prompt-engineering-guide + system-prompts-intelligence
    │
    └──► [Testing, Diagnostics & QA]
            └──► Enforce: playwright-cli + vitest + browser-testing-with-devtools
```

---

## 4. Visual Design & Asset Invariants (STRICT)

### 4.1. Hero Section & Character Compositing
- **Zero Picture Frames**: Never trap portrait photos or cutout figures inside rectangular boxes, borders (`border-2`), or picture frames (`rounded-32 overflow-hidden`).
- **Frameless Organic Composition**: The teacher figure sits directly on the page background as a free-floating transparent cutout with soft drop shadow (`drop-shadow-[0_25px_40px_rgba(0,0,0,0.7)]`).
- **Background Disc Geometry**: Centered circular disc in brand burgundy (`#753b47` to `#54252f`) with fine concentric rings and soft ambient backglow. The teacher's head rises proudly above the disc top edge for authentic 3D pop-out depth.
- **Floating Glassmorphic Badges**: Badges float with out-of-phase harmonic animation (`framer-motion`) and safe responsive padding (`backdrop-blur-xl bg-[#111625]/75 border-white/15`).
- **No Background Noise**: Never use noisy dot-matrix patterns (`bg-[radial-gradient(#ffffff_1px...)]`). Keep backgrounds clean, dark, and elegant.

### 4.2. Photography & Cutout Integrity (Absolute Anti-Destruction Rule)
- **Zero Destructive Inpainting**: NEVER run automated OpenCV `inpaint`, color smudging, or blur filters over the teacher's clothing or body.
- **Pristine Pixel Preservation**: 100% of Mr. Amr Aref's original clothing textures, skin tones, and details must remain completely untouched.
- **Clean Alpha Matting**: Background masks must be eroded cleanly (3–4px) to remove any background bleed (e.g. white door edge) without touching the subject.

### 4.3. Course Cards & Thumbnails
- **Professional 16:9 Educational Banners**: Thumbnails must be high-resolution Retina banners (`1440x810`), featuring:
  - Arabic typography (Cairo font).
  - Clear grade title (e.g. الصف الثالث الإعدادي) and subject badge (اللغة العربية).
  - Verified instructor mark (`✓ مستر عمرو عارف`).
  - Dark-theme brand gradient background (`#111625` / `#753b47`).
- **No Raw Cutouts Faded to Black**: Never paste a raw cropped photo on a flat black square for course covers.

### 4.4. Promotional Banners
- **Aspect Ratio Fidelity**: Render `amr_promo_banner.png` with clean object-cover without stretching or double-bordered wrapping frames.
- **Mobile Readability**: On mobile screens (<640px), position CTA strips cleanly below the artwork to prevent occluding the instructor's face.

---

## 5. React & Frontend Engineering Rules

### 5.1. Vercel Performance & React Best Practices
1. **Eliminate Waterfalls**: Start independent async operations concurrently (`Promise.all`).
2. **Hoist Statics**: Move static objects, arrays, and regexes outside component render scopes.
3. **Hardware-Accelerated Motion**: Animate `transform` (`x`, `y`, `scale`) and `opacity` only. Never animate layout properties like `width`, `height`, `margin`, or `padding`.
4. **Clean SVG Wrappers**: Animate wrapping `div` / `motion.div` instead of raw SVG paths for 60fps rendering.

### 5.2. Composition Over Boolean Props
- Avoid monolithic components with dozens of boolean flags (`isModal`, `isHero`, `isCompact`).
- Prefer explicit compound components with shared context (`CourseCard.Thumbnail`, `CourseCard.Body`, `CourseCard.Price`).

---

## 6. Empirical Verification Protocol (No Unchecked Claims)

No task or phase shall be declared complete without passing the 3-step verification gate:

1. **Compilation Gate**: `npm run build` must complete with Exit Code 0 and 0 TypeScript errors.
2. **Unit Test Gate**: `npm test` (`vitest run`) must pass 100% of test suites.
3. **Visual Inspection Gate**: 
   - Execute Playwright to take actual full-page and section screenshots.
   - Inspect the rendered image files to verify:
     - 0 clipped Arabic text (RTL alignment).
     - 0 color smudges or inpainting artifacts on photos.
     - 0 overlapping badges or layout collisions across Desktop (1440px) and Mobile (390px).
   - Only report victory after human-eye pixel inspection confirms quality.

---

## 7. Developer & Maintenance Quick Commands

- **Start Dev Server**: `cd study-buddy-sim && npm run dev` (Runs on `0.0.0.0:8080` + multi-port forwarder on `5173`)
- **Run Unit Tests**: `cd study-buddy-sim && npm test`
- **Build Production**: `cd study-buddy-sim && npm run build`
- **Take Visual Verification Snapshots**: Run Playwright script targeting `http://localhost:8080`.

