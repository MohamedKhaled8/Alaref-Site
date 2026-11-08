## 2026-11-06T12:41:28Z
You are Explorer 3 (teamwork_explorer).
Your working directory is: e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_3\
The original request file path is: e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\ORIGINAL_REQUEST.md
You MUST read e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\ORIGINAL_REQUEST.md before starting work.

Your task:
Investigate Requirement R3: Authentic Hero Teacher Portrait Restoration & Verification Harness.
1. Inspect the source asset: `study-buddy-sim/public/assets/amr_cutout_door.png`.
   - Analyze image dimensions, channels, background content (door edge, background matting), contrast, and edges.
   - Formulate a precise, non-destructive image processing pipeline using Python (Pillow, OpenCV, NumPy) to cleanly matte the background (eroding door bleed/white edge 3-4px cleanly) without cutting into the subject or creating halos.
   - Emphasize STRICT PRESERVATION: 100% of Mr. Amr Aref's authentic facial features, skin tones, expression, clothing textures; ZERO AI face swapping, ZERO OpenCV inpainting or blur smudging on the body/clothing.
2. Inspect current hero composition in `study-buddy-sim/src/components/home/EditorialHero.tsx`:
   - Check how `amr_master_hero.png` or hero images are loaded and styled.
   - Verify the organic hero composition: frameless cutout with soft drop shadow (`drop-shadow-[0_25px_40px_rgba(0,0,0,0.7)]`), teacher's head rising cleanly above the burgundy circular disc (#753b47), 0 rectangular picture frames or box borders.
   - Check floating badges positioning and glassmorphism styling.
3. Inspect Verification Harness:
   - Check build and test commands in `study-buddy-sim`: `npm run build`, `npm test` (`vitest`).
   - Check Playwright visual verification script (`verify_visuals.cjs` or equivalent in repo) for desktop (1440px) and mobile (390px) snapshots.
4. Formulate the concrete implementation and verification plan.
5. Produce a comprehensive report and write it to:
   `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_3\handoff.md`
6. Update your `progress.md` with liveness timestamps.
7. When done, use send_message to report completion to the orchestrator.
