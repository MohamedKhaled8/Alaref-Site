# Project: Al Aref Academy Production Refinements

## Architecture
- **Objective**: Execute production refinements on Al Aref Academy (`study-buddy-sim`):
  1. **R1: Footer Layout & Typography Refinement**: Compact vertical padding, increased font sizes (motto, headings, links, support), 44px WCAG-compliant touch targets, and replace the 3-image repeating pattern with a single subtle non-repeating calligraphy watermark accent on `#111625`.
  2. **R2: Academic Stages Scope Restriction**: Restrict academic stages strictly to Primary 6 (`grade-6-prim`), Prep 1 (`grade-1-prep`), Prep 2 (`grade-2-prep`), Prep 3 (`grade-3-prep`), and Comprehensive Foundation Course (`grade-taasis`). Completely eliminate all secondary stages (`grade-1-sec`, `grade-2-sec`, `grade-3-sec`) from data, UI filters, navigation, and tests. Symmetrically provide 15 courses (3 per stage across summary, exam-bank, curriculum) with authentic Retina 1440x810 banners.
  3. **R3: Authentic Hero Teacher Portrait Restoration**: Generate `amr_master_hero.png` using non-destructive 3.5px alpha erosion on `amr_cutout_door.png` preserving 100% authentic pixels (zero AI face swap, zero OpenCV body inpainting/smudging), composited on `#753b47` burgundy circular disc with concentric rings and 130px head pop-out. Stagger 4 glassmorphic floating badges in `EditorialHero.tsx` to eliminate mobile collisions.
  4. **Empirical Verification**: Zero build errors (`npm run build`), 100% passing tests (`npm test` in `study-buddy-sim`), and Playwright visual screenshot verification across Desktop (1440px) and Mobile (390px).

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Single Watermark Background Accent | Replace repeating 3-image pattern with single non-repeating `waleed_calligraphy_bg.png` (`bg-no-repeat bg-contain opacity-[0.045]`) | M1 | explorer_1 |
| 2 | Footer Vertical Compacting | Reduce padding and gaps (`pt-10 pb-8`, `space-y-7`, `pb-5`, `pt-5`) to reduce height to ~475px desktop / ~970px mobile | M1 | explorer_1 |
| 3 | Footer Typography Scaling | Scale motto to 14-16px, headings to 18px, links to 14-16px (36px hit target), and support sub-labels | M1 | explorer_1 |
| 4 | Footer Touch Targets (WCAG 44px) | Upgrade social media buttons to `w-11 h-11` (44px) and contact buttons to `px-6 py-3` | M1 | explorer_1 |
| 5 | Strict 5 Academic Stages in Data | Update `GradeStage.level` union to `"ابتدائي" \| "إعدادي" \| "تأسيس"`; define Prim 6, Prep 1, Prep 2, Prep 3, and Taasis in `mockData.ts` | M2 | explorer_2 |
| 6 | Total Secondary Stages Elimination | Delete `grade-1-sec`, `grade-2-sec`, `grade-3-sec` and all 9 secondary courses; clean up lesson `les-202` | M2 | explorer_2 |
| 7 | Symmetrical 15 Course Catalog | Provide 3 courses per stage using existing 1440x810 Retina banners (`thumb_prim6`, `thumb_prep1-3`, `thumb_taasis`) | M2 | explorer_2 |
| 8 | GradeSelector 5-Column Grid | Update `GradeSelector.tsx` grid to `xl:grid-cols-5` for clean 1-row presentation on 1440px desktop | M2 | explorer_2 |
| 9 | FeaturedCourses Grade Filtering | Destructure `selectedGrade`, filter courses when selected, reset index on switch, and fix `gradeTitle` -> `gradeName` bug | M2 | explorer_2 |
| 10 | AuthModal & Footer Grade Alignment | Update `AuthModal.tsx` default grade; connect Footer Foundation link to `onSelectGrade("grade-taasis")` | M2 | explorer_2 |
| 11 | Non-Destructive Hero Teacher Matting | Apply 3.5px morphological alpha erosion on `amr_cutout_door.png` to remove door bleed while preserving 100% authentic pixels | M3 | explorer_3 |
| 12 | Frameless Organic Hero Composite | Composite teacher over `#753b47` burgundy disc with concentric rings (head 130px above disc) on 760x800 canvas | M3 | explorer_3 |
| 13 | Responsive Staggered Glass Badges | Restore 4 non-colliding floating glassmorphism badges (`bg-[#111625]/75 backdrop-blur-xl border-white/15`) in `EditorialHero.tsx` | M3 | explorer_3 |
| 14 | Unit Test Suite Adaptation | Update `elameed.test.ts` to assert 5 stages (`644, 645, 646, 647, 643`), 15 courses, and negative assertions against secondary stages | M4 | explorer_2 |
| 15 | Build & Playwright Visual Verification | Validate `npm run build` exits 0, `npm test` passes 7/7, and Playwright captures 1440px/390px visual proof | M4 | explorer_3 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M0 | Comprehensive Survey | 3 parallel explorers for Footer, Academic Stages, and Hero Portrait/QA | none | DONE |
| M1 | Footer Refinements | Single watermark accent, compact padding, scaled typography & 44px targets | M0 | IN_PROGRESS |
| M2 | Academic Stages Restriction | 5 stages in data, 15 courses, eliminate secondary, GradeSelector & FeaturedCourses fixes | M0 | IN_PROGRESS |
| M3 | Authentic Hero Restoration | Non-destructive matting, master hero composite generation, staggered hero badges | M0 | IN_PROGRESS |
| M4 | Verification & Audit Gate | `npm run build`, `npm test` (adapted suite), Playwright visual screenshots & forensic audit | M1, M2, M3 | PLANNED |

## Code Layout & Write Boundaries
- Component: `study-buddy-sim/src/components/layout/Footer.tsx` (M1, M2)
- Component: `study-buddy-sim/src/components/home/GradeSelector.tsx` (M2)
- Component: `study-buddy-sim/src/components/home/FeaturedCourses.tsx` (M2)
- Component: `study-buddy-sim/src/components/auth/AuthModal.tsx` (M2)
- Data & Types: `study-buddy-sim/src/data/mockData.ts` (M2)
- Test Suite: `study-buddy-sim/src/test/elameed.test.ts` (M2, M4)
- Component: `study-buddy-sim/src/components/home/EditorialHero.tsx` (M3)
- Assets: `study-buddy-sim/public/assets/amr_master_hero.png`, `hero_illustration.png`, `amr_hero_composite.png` (M3)
- Scripts: `scripts/generate_authentic_hero.py` (M3)
- Visual Tool: `.agents/teamwork/explorer_3/verify_visuals.cjs` (M4)
- Verification Output: `.agents/teamwork/verification_screenshots/` (M4)
