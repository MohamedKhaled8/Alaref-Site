# Handoff Report: Survey Explorer 2 — Protected Video Streaming Engine (R2)

## 1. Observation
1. **Package Dependencies (`study-buddy-sim/package.json`)**:
   - Lines 15–67 list dependencies: `@radix-ui/react-slider`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-tooltip`, `framer-motion` (v12.38.0), `lucide-react` (v0.462.0), `react` (v18.3.1), `zustand` (v5.0.12).
   - Zero video player or streaming dependencies are installed (no `hls.js`, `video.js`, `plyr`, or `react-player`).
2. **Existing Lesson Data Structure (`study-buddy-sim/src/data/mockData.ts`)**:
   - Lines 33–40 define `LessonItem`:
     ```typescript
     export interface LessonItem {
       id: string;
       title: string;
       type: "video" | "pdf" | "quiz";
       durationMinutes?: number;
       isFreePreview: boolean;
       isCompleted?: boolean;
     }
     ```
   - No streaming source URLs, format flags, resolutions, stream IDs, or notes exist in `LessonItem`.
   - Lines 198–254 list 8 lessons with `type: "video"`, but without media source parameters.
3. **Existing Video Preview in UI (`study-buddy-sim/src/components/courses/CourseDetailsModal.tsx`)**:
   - Lines 179–205 render a mock static preview:
     ```tsx
     <div className="aspect-video bg-[#0b0c10] rounded-12 flex items-center justify-center relative overflow-hidden">
       {/* Dynamic Moving Watermark (Forensic Rule from REA Report) */}
       <div className="absolute top-1/4 right-1/4 px-2.5 py-1 rounded bg-black/60 text-[10px] font-mono text-white/60 border border-white/10 pointer-events-none select-none animate-float-badge">
         طالب: أحمد محمد • 01012345678 • ID: 10482
       </div>
       <div className="text-center space-y-3 p-4">
         <div className="w-16 h-16 rounded-full bg-[#753b47] flex items-center justify-center mx-auto shadow-2xl hover:scale-110 transition-transform cursor-pointer">
           <Play className="w-7 h-7 text-white fill-white ml-1" />
         </div>
         <h4 className="text-sm font-bold text-white max-w-md">{previewLessonTitle}</h4>
         <span className="text-[11px] text-white/50 block">جودة العرض: 1080p • سيرفر سريع وخاص</span>
       </div>
     </div>
     ```
   - Verbatim observation: There is no HTML5 `<video>` tag, no media player instance, no stream controller, no playback controls, no format switching, and no URL tokenization.
4. **Build & Test Baseline**:
   - Running `npm test` (`vitest run`) in `study-buddy-sim`:
     `✓ src/test/elameed.test.ts (7 tests) 24ms` — 100% tests pass.
   - Running `npm run build` in `study-buddy-sim`:
     `✓ built in 14.71s` with Exit Code 0 and 0 errors, outputting `dist/index.html` (1.25 kB), `dist/assets/index-nwFz0yLG.css` (67.66 kB), `dist/assets/index-DjobUvGc.js` (429.10 kB).
5. **Reference Platform Reverse-Engineering Findings (`docs/reference-analysis/REPORT.md`)**:
   - Lines 377–394 document El-Ameed's video architecture:
     Plyr.js v3.7+, HLS and MP4 streams, 10s seek buttons, speed selector (0.5x–2x), resolution selector (1080p–240p), dynamic floating watermark (`window.initMovingWatermark`) with opacity oscillation (0.3 to 0.7) and random repositioning every 10–15s showing student name, phone, and ID, timestamped video notes (`window.initPlyrVideoNotes`), and mobile landscape auto-lock (`screen.orientation.lock("landscape")`).

## 2. Logic Chain
1. From Observation 1 and 3, `study-buddy-sim` currently possesses only a static visual placeholder for video preview without any functional media playback or streaming controller.
2. From Observation 1, the project already has Radix UI primitives (`@radix-ui/react-slider`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-tooltip`), Zustand, and Framer Motion. This makes building a custom high-performance, accessible, brand-aligned React video player component straightforward without pulling in heavyweight, rigid external players like Video.js.
3. From Observation 5 and the user requirements in `ORIGINAL_REQUEST.md`, Requirement R2 mandates multi-format video playback (MP4 and HLS) with deep security layers beyond superficial overlays (tokenized/signed links and stream source obfuscation preventing direct link theft).
4. To defeat link theft beyond superficial overlays, a 5-tier architecture is required:
   - **Tier 1 (Tokenized/Signed URLs)**: HMAC-SHA256 signature combining `lessonId`, `studentId`, `deviceId`, `exp` (15-min rolling TTL), and `nonce`.
   - **Tier 2 (In-Memory Media Decoupling)**: MP4 uses dynamic `blob:` URLs (`URL.createObjectURL(blob)`), which are non-shareable in-memory addresses; HLS uses `hls.js` MediaSource Extensions (MSE) with custom chunk loaders, completely removing any direct CDN URLs from the DOM `<video src>` attribute.
   - **Tier 3 (Forensic Watermarking)**: Dynamic floating overlay displaying authenticated student name, phone number, and ID with randomized 2D coordinate oscillation and an active `MutationObserver` that pauses playback if the watermark DOM is tampered with or hidden.
   - **Tier 4 (DevTools Guard)**: Real-time inspection probe that pauses playback and blurs the canvas when DevTools is opened, plus suppression of shortcut keys (F12, Ctrl+Shift+I, etc.).
   - **Tier 5 (Single-Device Concurrency Lock)**: Heartbeat ping that prevents concurrent playback on multiple devices under the same student account.
5. From Observation 2, `LessonItem` and mock courses must be extended with video manifest contracts supporting both HLS `.m3u8` streams and MP4 streams, with timestamped lecture notes and quality levels.
6. A comprehensive, actionable survey report has been generated at `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\teamwork_explorer_survey_2\survey_report.md` detailing the entire blueprint.

## 3. Caveats
- Current authentication (AuthModal) operates with mock student state; the forensic watermark and token generator currently bind to the active mock student profile (`ملك محمود عبدالحليم` or logged-in student) or a fallback guest preview payload until Explorer 1 / Auth implementation provides the finalized JWT store.
- Browser MediaSource Extensions (MSE) are universally supported on modern desktop browsers and Android, but iOS Safari does not support MSE for HLS; on iOS Safari, native HLS playback (`video.src = signedHlsUrl`) must be used as the standard fallback.
- Read-only survey mode: No project source files in `study-buddy-sim` were modified during this investigation.

## 4. Conclusion
The repository has a stable, passing build baseline but completely lacks video streaming and security infrastructure. Implementing R2 requires:
1. Installing or loading `hls.js` for adaptive bitrate HLS streaming.
2. Creating `src/types/video.ts` for manifest, quality, and token contracts.
3. Creating `src/services/videoSecurityService.ts` for HMAC token signing, validation, and in-memory blob streaming.
4. Creating `src/stores/useVideoPlayerStore.ts` for unified player state management.
5. Creating UI components under `src/components/video/` (`ProtectedVideoPlayer`, `VideoControlsBar`, `VideoTimelineScrubber`, `DynamicForensicWatermark`, `DevToolsSecurityGuard`, `QualitySelectorMenu`, `SpeedSelectorMenu`).
6. Integrating `ProtectedVideoPlayer` into `CourseDetailsModal` and introducing a dedicated `LessonRoomModal` workspace with syllabus navigation and PDF resources.
7. Adding comprehensive Vitest unit tests in `src/test/videoStreaming.test.ts`.

All architecture specifications, sequence flows, data contracts, and implementation steps are fully documented in `survey_report.md`.

## 5. Verification Method
To verify this investigation:
1. **Inspect Survey Report**:
   Read `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\teamwork_explorer_survey_2\survey_report.md`.
2. **Inspect Code Files**:
   - `study-buddy-sim/package.json`: Confirm zero video packages.
   - `study-buddy-sim/src/data/mockData.ts` (lines 33-40): Confirm `LessonItem` has no video stream parameters.
   - `study-buddy-sim/src/components/courses/CourseDetailsModal.tsx` (lines 179-205): Confirm preview is a static mock `div`.
3. **Verify Baseline Execution**:
   - `cd study-buddy-sim && npm test` $\rightarrow$ Expect Exit Code 0, 7 passed tests.
   - `cd study-buddy-sim && npm run build` $\rightarrow$ Expect Exit Code 0, 0 compilation errors.
