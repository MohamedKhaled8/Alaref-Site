# Original User Request

## Approved Task Prompt — 2026-11-06T12:38:17Z

Update the Al Aref Academy web application (`study-buddy-sim`) for production by refining the Footer layout and typography, restricting academic stages strictly to primary and preparatory grades, and restoring the authentic portrait of Mr. Amr Aref in the Hero section.

Working directory: e:\Mt FlutterProject\yalaAcademy\study-buddy-sim
Integrity mode: development

## Requirements

### R1. Footer Proportions, Typography & Background
Refine the Footer component in `src/components/layout/Footer.tsx`:
- Reduce overall vertical padding/height to achieve a compact, well-proportioned layout.
- Increase font sizes and navigation element scales so text, links, and contact information are prominent, clear, and easily readable.
- Replace the repeating 3-image calligraphy pattern (`waleed_calligraphy_bg.png`) with a single, subtle non-repeating watermark accent on a clean dark surface.

### R2. Academic Stages Scope Restriction
Update all academic stage representations across the application (`src/data/mockData.ts`, `src/components/home/GradeSelector.tsx`, `src/components/layout/Footer.tsx`, and related filters) strictly to:
- Primary stage: الصف السادس الابتدائي
- Preparatory stage: الصف الأول الإعدادي، الصف الثاني الإعدادي، الصف الثالث الإعدادي
- Comprehensive Foundation Course: كورس التأسيس الشامل للغة العربية
- Completely eliminate all secondary stages (الصف الأول الثانوي، الصف الثاني الثانوي، الصف الثالث الثانوي) from data, filters, navigation, and cards.

### R3. Authentic Hero Teacher Portrait Restoration
Replace the current AI-generated hero figure with Mr. Amr Aref's authentic original photograph:
- Create a clean cutout from `public/assets/amr_cutout_door.png` by cleanly matting the background without cutting into the subject or leaving edge fringing/halos.
- Preserve 100% of authentic facial features, skin tones, expression, and original clothing textures without applying AI inpainting, blurring, color smudging, or face swapping.
- Maintain the organic hero composition (frameless cutout with authentic drop shadow rising cleanly above the brand circular disc, without rectangular borders or frames).

## Verification Resources
- `npm run build` in `study-buddy-sim` to verify zero TypeScript and build errors.
- `npm test` in `study-buddy-sim` to verify passing test suites.
- Visual inspection via Playwright screenshots across desktop (1440px) and mobile (390px) to verify legible footer typography, single background accent, correct Arabic grade titles, and authentic teacher appearance.

## Acceptance Criteria

### Footer Layout & Typography
- [ ] Footer height is compact and visually balanced without excessive empty vertical space.
- [ ] Footer text, category titles, and navigation links have increased, clearly legible font sizes.
- [ ] Calligraphy background appears at most once as a subtle, non-repeating accent (0 instances of repeated 3-image stacking).

### Academic Stages Scope
- [ ] Grade selector, course listings, and footer navigation display only: الصف السادس الابتدائي, الصف الأول الإعدادي, الصف الثاني الإعدادي, الصف الثالث الإعدادي, and كورس التأسيس الشامل.
- [ ] All mentions, filters, and mock data for 1st, 2nd, and 3rd Secondary (الصف الأول/الثاني/الثالث الثانوي) are completely removed.

### Authentic Teacher Imagery
- [ ] Hero section features Mr. Amr Aref's authentic photo derived from `amr_cutout_door.png`.
- [ ] Zero AI face swapping, zero destructive smoothing/inpainting on clothes or face, and zero rectangular picture frames trapping the cutout.

### Empirical Verification
- [ ] `npm run build` exits with code 0 and 0 errors.
- [ ] `npm test` passes 100% of tests.
- [ ] Visual inspection confirms flawless RTL text rendering, non-repeating footer background, and authentic teacher presentation.
