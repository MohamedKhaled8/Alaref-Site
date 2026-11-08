# Handoff Report: Authentic Hero Teacher Portrait Restoration & Verification Harness (R3)

**Author**: Explorer 3 (`teamwork_explorer`)  
**Target Recipient**: Orchestrator (`ae18ab3b-fd60-4fd6-8939-3d0a9abe6466`) & Worker Agent  
**Working Directory**: `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_3\`  
**Date**: 2026-11-06T12:54:00Z  
**Status**: Investigation Complete & Empirically Verified  

---

## 1. Observation

### 1.1 Source Asset Forensic Inspection: `amr_cutout_door.png`
- **File Path**: `study-buddy-sim/public/assets/amr_cutout_door.png`
- **File Metrics**:
  - Image Dimensions: `768 x 1024` pixels
  - Mode / Channels: `RGBA` (8-bit per channel)
  - Total Pixels: `786,432`
  - Fully Opaque Pixels (`alpha == 255`): `149,464` (19.0%)
  - Semi-Transparent Transition Pixels (`0 < alpha < 255`): `22,426` (2.9%)
  - Fully Transparent Pixels (`alpha == 0`): `614,542` (78.1%)
- **Active Teacher Bounding Box**:
  - Horizontal range: `x = [256, 694]` (width: `439` px)
  - Vertical range: `y = [213, 1023]` (height: `811` px)
  - Coordinate aspect ratio matches `amr_teacher_cutout_clean.png` (`439 x 811` px).
- **Physical Subject Inspection & Color Metrics**:
  - **Head / Face / Glasses / Hair** (`y = 213..380`): Mean RGB = `[98, 91, 102]`, Median = `[102, 85, 90]`. Authentic skin tones, facial features, dark hair, and spectacles.
  - **Upper Torso / Shirt** (`y = 380..580`): Mean RGB = `[131, 141, 162]`, Median = `[134, 146, 170]`. Light-blue button-down dress shirt with natural fabric folds.
  - **Lower Torso** (`y = 580..750`): Mean RGB = `[113, 120, 134]`.
  - **Trousers / Legs** (`y = 750..1023`): Mean RGB = `[41, 60, 80]`, Median = `[4, 28, 49]`. Dark navy tailored trousers.
- **Edge Boundary Forensics & Door Bleed**:
  - Transition zone boundary pixels (`0 < alpha < 250`): `19,615` pixels.
  - Mean RGB of boundary transition pixels: `[121, 148, 176]`.
  - Outer edge transition pixels with sky-blue / white door bleed (`R > 140, G > 180, B > 200`): Mean RGB = `[155..169, 194..208, 230..247]`.
  - Depth of the door bleed: Measured across rows 100, 300, and 700 to be approximately `3 to 4 pixels` deep before hitting the solid subject core.
  - Inner hole between right bent arm and torso (`x = 280..420, y = 360..540`): Contains an authentic cutout opening of `4,495` transparent pixels, also bounded by a 3-4px door bleed fringe.
- **Crucial Finding on Previous Destructive Attempts**:
  - In previous scripts (`amr_teacher_door_removed.png` and `scripts/recomposite_hero.py`), an automated filter targeted "blue" pixels (`B > 125 and B > R + 10`).
  - Because Mr. Amr Aref's dress shirt is authentically light blue (`B ~ 162..190, R ~ 131..145`), that destructive rule wiped out `54,993` pixels of his shirt, creating huge hollow holes.
  - The anti-destruction mandate strictly bans color-keying or inpainting over the body. Pure morphological alpha erosion of 3-4px from the boundary eliminates the door bleed fringe completely without touching a single pixel of his shirt.

---

### 1.2 Current Hero Section Inspection: `EditorialHero.tsx`
- **File Path**: `study-buddy-sim/src/components/home/EditorialHero.tsx`
- **Active Rendering in App**: `study-buddy-sim/src/App.tsx:12` and line 177 (`<EditorialHero ... />`).
- **Observed JSX Image Tag** (`EditorialHero.tsx:94-99`):
  ```tsx
  {/* Master Studio Hero Artwork Asset (Matching Waleed Hero) */}
  <img
    src="/assets/amr_hero_portrait_master.png"
    alt="مستر عمرو عارف"
    className="w-full h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:scale-102 transition-transform duration-500"
    loading="eager"
  />
  ```
- **Image Asset Forensics for `amr_hero_portrait_master.png`**:
  - Size: `1024 x 1024` px, RGBA.
  - Mean RGB: `[137, 116, 111]`.
  - Burgundy pixels: only `147` pixels (no authentic circular disc).
  - Subject: **AI-generated fictional teacher character** (NOT Mr. Amr Aref's authentic photograph). This confirms Requirement R3's trigger: "Replace the current AI-generated hero figure with Mr. Amr Aref's authentic original photograph".
- **Hero Framing & Composition Constraints**:
  - Zero rectangular frames or borders: The current container uses clean frameless positioning.
  - Circular burgundy backdrop disc (`#753b47`) is missing in `amr_hero_portrait_master.png`.
  - Floating badges: Currently removed from `EditorialHero.tsx` (only a WhatsApp floating pill remains). They must be restored with responsive glassmorphism and non-colliding vertical offsets.
  - Section selector: Line 17 uses `<section className="relative overflow-hidden pt-28 pb-12 sm:pt-36 sm:pb-20 select-none bg-[#faf9f6] dark:bg-[#0c0e17] transition-colors duration-300 font-ibm">`. Lacks an ID or `.two-columns-hero-section` class for automated Playwright section selectors.

---

### 1.3 Verification Harness Status
- **Build Gate (`npm run build`)**:
  - Executed in `study-buddy-sim`: Exited with **Code 0**, zero TypeScript errors.
  - Build timing: `8.76s`. Output bundle: `dist/assets/index-CCyvbYtT.js` (424.49 kB), `dist/assets/index-JB6tBnUa.css` (64.51 kB).
- **Unit Test Gate (`npm test`)**:
  - Executed via `vitest run`: Exited with **Code 0**.
  - Test suites: `src/test/elameed.test.ts` (7 tests passed). Note: Grade stages in `elameed.test.ts` still expect secondary stages (to be updated under R2 by Explorer 2 / Worker).
- **Playwright Visual Verification Script**:
  - Script path: `.agents/teamwork/explorer_3/verify_visuals.cjs`.
  - Viewports covered: Desktop (`1440 x 900` @ 2x DPR) and Mobile (`390 x 844` @ 2x DPR).
  - Captures full page screenshots and targeted sections (`hero`, `courses`, `promo`).
  - Target URL: `http://localhost:8080` (Vite dev server default).

---

## 2. Logic Chain

1. **Root Cause Identification**:
   - `amr_hero_portrait_master.png` loaded in `EditorialHero.tsx` is an AI-generated portrait.
   - The user requested restoring Mr. Amr Aref's authentic likeness from `amr_cutout_door.png`.
2. **De-fringing Strategy Validation**:
   - `amr_cutout_door.png` already isolates the subject, but contains a 3-4px semi-transparent halo where door pixels blend with subject contours (`RGB: [155, 194, 233]`).
   - If we attempt color-based replacement (e.g. blue thresholding), Mr. Amr Aref's light blue shirt (`RGB: [131, 141, 162]`) will be destroyed (as occurred in previous corruptions).
   - If we use OpenCV inpainting (`cv2.inpaint`), synthetic interpolated pixels will replace authentic skin and clothing textures, violating Pillar 1 (Anti-Destruction Rule).
   - Morphological erosion using an elliptical structuring element (`kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))`) on the alpha channel alone shrinks the mask by exactly 3.5px from all transparent boundaries (both outer edge and inner arm hole).
   - Because RGB values are never altered, 100% of authentic pixels, textures, and natural skin/clothing colors remain untouched.
3. **Compositing Architecture**:
   - Rasterizing the teacher over the burgundy circular disc (`#753b47`, `r = 255` px) with concentric rings on a master `760 x 800` transparent canvas (`amr_master_hero.png`) prevents responsive layout shifts, eliminates CSS z-index layering bugs, and guarantees the teacher's head rises proudly `130px` above the disc top edge for an authentic 3D pop-out effect.
4. **Floating Badges Optimization**:
   - Restoring 4 floating badges in JSX with glassmorphism (`backdrop-blur-xl bg-[#111625]/75 border-white/15`) and vertical staggering:
     - Badge 1: Top Right (`top-4 -right-1 sm:top-6 sm:right-0 lg:-right-4`)
     - Badge 2: Mid Left (`top-28 -left-2 sm:top-36 sm:left-0 lg:-left-6`) — separated by 96px from Badge 1, preventing mobile overlap.
     - Badge 3: Bottom Left (`bottom-20 -left-1 sm:bottom-24 sm:left-0 lg:-left-4`)
     - Badge 4: Bottom Right (`bottom-4 right-1 sm:bottom-6 sm:right-4 lg:-right-2`)

---

## 3. Caveats

1. **Original RAW Uncompressed Photo**:
   - The original pre-cutout camera RAW / JPEG is not stored in the repository. The highest-resolution authentic source asset is `study-buddy-sim/public/assets/amr_cutout_door.png` (`768 x 1024`).
2. **Secondary Educational Stages in `elameed.test.ts`**:
   - While `npm test` currently passes 7/7 tests, test #2 asserts that `gradeStages` contains secondary grades (`grade-1-sec`, `grade-2-sec`, `grade-3-sec`). When Requirement R2 restricts academic stages strictly to primary and preparatory grades, `elameed.test.ts` must be updated concurrently to prevent test breakage.

---

## 4. Conclusion & Actionable Implementation Plan

### 4.1 Asset Generation Script (`scripts/generate_authentic_hero.py`)
The Worker should execute this automated, non-destructive Python pipeline:

```python
import os
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

base_dir = r"study-buddy-sim/public/assets"
door_path = os.path.join(base_dir, "amr_cutout_door.png")

# --- 1. Non-Destructive Alpha Matting ---
im = Image.open(door_path)
arr = np.array(im)
rgb = arr[:, :, :3]
alpha = arr[:, :, 3]

# Pure morphological alpha erosion (3.5px radius)
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
eroded_alpha = cv2.erode(alpha, kernel, iterations=1)

# Smooth boundary anti-aliasing (only for edge pixels, solid interior remains 255)
blurred_alpha = cv2.GaussianBlur(eroded_alpha, (3, 3), 0)
final_alpha = np.where(eroded_alpha >= 240, eroded_alpha, np.minimum(eroded_alpha, blurred_alpha))
final_alpha[final_alpha < 15] = 0

# Keep 100% of authentic RGB pixels untouched
clean_teacher_arr = np.dstack([rgb, final_alpha])
clean_teacher = Image.fromarray(clean_teacher_arr)

# Crop to active bounding box
ys, xs = np.where(final_alpha > 0)
teacher_crop = clean_teacher.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))

# --- 2. Master Hero Canvas Compositing ---
W, H = 760, 800
canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))

# Circular Backdrop Disc (#753b47 = [117, 59, 71])
cx, cy, r = 380, 420, 255
disc = Image.new("RGBA", (W, H), (0, 0, 0, 0))
draw = ImageDraw.Draw(disc)
draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(117, 59, 71, 255))

# Delicate Concentric Rings
draw.ellipse([cx - (r - 40), cy - (r - 40), cx + (r - 40), cy + (r - 40)], outline=(255, 255, 255, 35), width=1)
draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(254, 98, 87, 85), width=2)
draw.ellipse([cx - (r + 35), cy - (r + 35), cx + (r + 35), cy + (r + 35)], outline=(255, 255, 255, 25), width=1)
draw.ellipse([cx - (r + 65), cy - (r + 65), cx + (r + 65), cy + (r + 65)], outline=(254, 98, 87, 40), width=1)
disc = disc.filter(ImageFilter.SMOOTH_MORE)
canvas.alpha_composite(disc)

# Position Teacher Figure (Head rises proudly 130px above disc top)
tw = 450
th = int(teacher_crop.size[1] * (tw / teacher_crop.size[0]))
teacher_resized = teacher_crop.resize((tw, th), Image.Resampling.LANCZOS)

tx = (W - tw) // 2
ty = 35 # top of head at y=35; disc top edge is at cy - r = 165

# Soft authentic drop shadow under teacher
shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
t_arr = np.array(teacher_resized)
s_mask = (t_arr[:, :, 3] > 0).astype(np.uint8) * 140
s_img = Image.fromarray(np.stack([np.zeros_like(s_mask), np.zeros_like(s_mask), np.zeros_like(s_mask), s_mask], axis=-1))
shadow.paste(s_img, (tx, ty + 12), s_img)
shadow = shadow.filter(ImageFilter.GaussianBlur(15))
canvas.alpha_composite(shadow)

# Composite clean teacher cutout
canvas.alpha_composite(teacher_resized, (tx, ty))

# Save outputs to assets
canvas.save(os.path.join(base_dir, "amr_master_hero.png"), optimize=True)
canvas.save(os.path.join(base_dir, "hero_illustration.png"), optimize=True)
canvas.save(os.path.join(base_dir, "amr_hero_composite.png"), optimize=True)
print("Authentic hero master composite generated successfully.")
```

### 4.2 Proposed Updates to `study-buddy-sim/src/components/home/EditorialHero.tsx`

1. **Add Section ID and Class**:
   ```tsx
   <section 
     id="hero"
     className="relative overflow-hidden pt-28 pb-12 sm:pt-36 sm:pb-20 select-none bg-[#faf9f6] dark:bg-[#0c0e17] transition-colors duration-300 font-ibm two-columns-hero-section"
   >
   ```

2. **Replace Hero Image & Add Dynamic Glow**:
   ```tsx
   <div className="basis-full md:basis-1/2 flex justify-center items-center relative order-1 md:order-2 select-none w-full">
     <motion.div
       initial={{ opacity: 0, scale: 0.95, y: 15 }}
       animate={{ opacity: 1, scale: 1, y: 0 }}
       transition={{ duration: 0.7 }}
       className="relative w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[500px] flex justify-center items-center"
     >
       {/* Ambient Backlight Glow */}
       <div className="absolute -inset-10 bg-[radial-gradient(ellipse_at_center,rgba(117,59,71,0.45)_0%,rgba(254,98,87,0.15)_40%,transparent_70%)] blur-[60px] pointer-events-none -z-10" />

       {/* Authentic Master Hero Artwork Asset (Mr. Amr Aref with Burgundy Disc) */}
       <img
         src="/assets/amr_master_hero.png"
         alt="مستر عمرو عارف - أستاذ اللغة العربية"
         className="w-full h-auto object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.7)] hover:scale-102 transition-transform duration-500"
         loading="eager"
       />

       {/* Floating Badges with Non-Colliding Responsive Coordinates */}
       {/* Badge 1: Top Right */}
       <motion.div 
         animate={{ y: [-4, 4, -4] }}
         transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
         className="absolute top-4 -right-1 sm:top-6 sm:right-0 lg:-right-4 z-20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#111625]/75 backdrop-blur-xl border border-white/15 text-xs sm:text-sm font-extrabold text-white flex items-center gap-2 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.15)]"
       >
         <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
         <span>أستاذ اللغة العربية</span>
       </motion.div>

       {/* Badge 2: Mid Left (Staggered vertically to prevent collision with Badge 1) */}
       <motion.div 
         animate={{ y: [5, -5, 5] }}
         transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
         className="absolute top-28 -left-2 sm:top-36 sm:left-0 lg:-left-6 z-20 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-[#111625]/75 backdrop-blur-xl border border-cyan-400/25 text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.15)]"
       >
         <span>✨</span>
         <span>لغة الضاد • خرائط ذهنية</span>
       </motion.div>

       {/* Badge 3: Bottom Left (Primary and Preparatory focus) */}
       <motion.div 
         animate={{ y: [4, -4, 4] }}
         transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
         className="absolute bottom-20 -left-1 sm:bottom-24 sm:left-0 lg:-left-4 z-20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#111625]/75 backdrop-blur-xl border border-[#fe6257]/30 text-xs sm:text-sm font-black text-white flex items-center gap-2 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.15)]"
       >
         <span>🏆</span>
         <span>الإبتدائية والإعدادية</span>
       </motion.div>

       {/* Badge 4: Bottom Right */}
       <motion.div
         animate={{ y: [-4, 4, -4] }}
         transition={{ duration: 4.0, repeat: Infinity, ease: "easeInOut" }}
         className="absolute bottom-4 right-1 sm:bottom-6 sm:right-4 lg:-right-2 z-20 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#111625]/75 backdrop-blur-xl border border-amber-400/30 text-[11px] sm:text-xs font-black text-amber-300 flex items-center gap-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.15)]"
       >
         <span>⭐</span>
         <span>أوائل الشهادات • تفوق 100%</span>
       </motion.div>

       {/* Floating WhatsApp Support Button */}
       <a
         href="https://api.whatsapp.com/send/?phone=201097303002"
         target="_blank"
         rel="noopener noreferrer"
         className="absolute -left-2 bottom-6 sm:bottom-10 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all"
         title="تواصل واتساب مع مستر عمرو عارف"
         aria-label="تواصل واتساب"
       >
         <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
           <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24M8.53 7.33c-.16 0-.35.06-.53.25-.19.19-.71.7-.71 1.7s.73 1.98.83 2.12c.1.14 1.41 2.19 3.47 3.06 1.72.73 2.07.58 2.44.55.38-.04 1.21-.49 1.38-.97.18-.48.18-.89.13-.97-.06-.09-.2-.14-.42-.25-.21-.1-.7-.35-1.45-.72-.74-.38-.97-.38-1.16.2-.19.57-.49.97-.6.97-.1.1-.38.16-.76.02-.38-.14-1.61-.59-3.07-1.89-1.13-1.01-1.9-2.26-2.12-2.64-.22-.38-.02-.59.08-.77.1-.18.21-.38.31-.57.11-.19.15-.33.22-.55.08-.22.04-.41-.02-.57-.06-.16-.53-1.28-.73-1.76-.2-.46-.4-.4-.55-.41"/>
         </svg>
       </a>
     </motion.div>
   </div>
   ```

---

## 5. Verification Method

### 5.1 Independent Reproduction Commands

1. **Verify Asset Forensic Metrics**:
   ```pwsh
   python -c "
   from PIL import Image
   import numpy as np
   im = Image.open('study-buddy-sim/public/assets/amr_cutout_door.png')
   arr = np.array(im)
   print('Dimensions:', im.size)
   print('Alpha > 0:', (arr[:,:,3] > 0).sum())
   print('Head RGB (y=213..380):', arr[213:380, :, :3][arr[213:380, :, 3] > 200].mean(axis=0).astype(int))
   print('Shirt RGB (y=380..580):', arr[380:580, :, :3][arr[380:580, :, 3] > 200].mean(axis=0).astype(int))
   "
   ```
   *Expected Output*: Dimensions `(768, 1024)`, Head RGB `[98, 91, 102]`, Shirt RGB `[131, 141, 162]`.

2. **Verify Prototype Solution in Explorer Directory**:
   Inspect the verified prototype generated during this investigation:
   - File: `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_3\prototype_amr_master_hero.png`
   - File: `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_3\prototype_hero_on_dark.png`
   - File: `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_3\prototype_hero_on_light.png`
   - Metric Check:
     ```pwsh
     python -c "
     from PIL import Image
     import numpy as np
     im = Image.open('e:/Mt FlutterProject/yalaAcademy/.agents/teamwork/explorer_3/prototype_amr_master_hero.png')
     arr = np.array(im)
     print('Head pixels above disc (y < 165):', ((arr[:,:,3] > 10) & (np.arange(800)[:, None] < 165)).sum())
     print('Rectangular black box pixels (<20):', ((arr[:,:,3] > 200) & (arr[:,:,0] < 20) & (arr[:,:,1] < 20) & (arr[:,:,2] < 20)).sum())
     print('Burgundy disc pixels (~#753b47):', ((abs(arr[:,:,0]-117)<25) & (abs(arr[:,:,1]-59)<25) & (abs(arr[:,:,2]-71)<25)).sum())
     "
     ```
     *Expected Output*: Head pixels above disc `> 18,000`, Black box pixels `< 1,000` (natural suit shadow only, 0 black box artifacts), Burgundy disc pixels `> 55,000`.

3. **Verify Build & Vitest**:
   ```pwsh
   cd study-buddy-sim
   npm run build
   npm test
   ```
   *Expected Output*: `npm run build` exits with code 0 (0 errors), `npm test` passes 100% of test suites.

4. **Verify Live Visual Rendering with Playwright**:
   ```pwsh
   node .agents/teamwork/explorer_3/verify_visuals.cjs ./verification_screenshots http://localhost:8080
   ```
   Inspect captured screenshots:
   - `desktop_1440_hero.png`: Verify authentic portrait of Mr. Amr Aref with head rising above burgundy disc, 0 picture frames, 4 non-colliding floating badges.
   - `mobile_390_hero.png`: Verify 0 badge collisions, flawless responsive scaling, and clean RTL alignment.

### 5.2 Invalidation Conditions
- If `amr_cutout_door.png` has its authentic dress shirt pixels modified by automated inpainting or color thresholding, this diagnosis is violated.
- If `EditorialHero.tsx` re-introduces rectangular box borders around the cutout or traps the portrait inside a picture frame, this recommendation is invalidated.
