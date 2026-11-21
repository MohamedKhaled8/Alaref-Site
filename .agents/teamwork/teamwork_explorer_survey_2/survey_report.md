# Survey Report: Protected Video Streaming Engine (R2)
**Platform**: Al Aref Academy (`study-buddy-sim` / منصة مستر عمرو عارف التعليمية)  
**Survey Explorer**: Survey Explorer 2 — Protected Video Streaming Engine (R2)  
**Date**: 2026-11-08  
**Scope**: Media rendering, multi-format playback (MP4, HLS/m3u8), stream security layers, tokenized/signed URLs, in-memory stream obfuscation, forensic watermarking, player UI/UX, and implementation blueprints.

---

## 1. Executive Summary & Baseline Audit

### 1.1 Executive Summary
A comprehensive read-only investigation of the `study-buddy-sim` repository (`e:\Mt FlutterProject\yalaAcademy\study-buddy-sim`) was performed to evaluate the current state of video playback, media rendering, and stream security.

The platform currently provides a rich marketing and course discovery experience with a course details modal, but **has zero functional video playback or media streaming infrastructure**. The current "Free Video Preview" inside `CourseDetailsModal.tsx` is purely a static UI mock consisting of a black `div` with a static Play icon and a simulated watermark string.

To fulfill **Requirement R2 (Protected Video Streaming Engine)** from `ORIGINAL_REQUEST.md`, a complete production-grade video streaming system must be architected. This system must support multi-format playback (HLS `.m3u8` and MP4) and enforce deep stream protection layers (HMAC-SHA256 signed URLs, dynamic in-memory Blob URL/MSE decoupling, moving forensic watermarks with anti-tamper MutationObservers, DevTools inspection deterrence, and single-device stream binding), far beyond superficial UI overlays.

### 1.2 Repository Baseline Status
- **Framework**: React 18.3.1, Vite 5.4.19, TypeScript 5.8.3, Tailwind CSS 3.4.17.
- **UI Tooling**: Radix UI primitives (`@radix-ui/react-slider`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-tooltip`, `@radix-ui/react-dialog`), Lucide React, Framer Motion 12.38.0, Zustand 5.0.12.
- **Current Tests**: Vitest 3.2.7 running in `study-buddy-sim` passes 7/7 tests (`src/test/elameed.test.ts`).
- **Current Build**: `npm run build` compiles with Exit Code 0 and 0 errors, producing 429KB JS and 67KB CSS.
- **Installed Video Libraries**: **NONE**. No `hls.js`, `video.js`, `plyr`, or `react-player` exist in `package.json`.

---

## 2. Current State Analysis: Existing Code & Gaps

### 2.1 Video References in the Codebase
A full code scan across all `.ts` and `.tsx` files revealed only the following references to video:

| File Location | Line Numbers | What Exists Today | Assessment / Gap |
|---|---|---|---|
| `src/data/mockData.ts` | 33–40 | `LessonItem` interface: `type: "video" \| "pdf" \| "quiz"` | Contains NO video source URLs, format flags, resolutions, stream IDs, or notes. |
| `src/data/mockData.ts` | 198–254 | 8 curriculum lessons with `type: "video"` | Only title, type, duration, and `isFreePreview` boolean are defined. |
| `src/components/courses/CourseCard.tsx` | 19–40 | Aspect ratio `aspect-video` with a hover play icon | Purely decorative thumbnail interaction; clicking only opens `CourseDetailsModal`. |
| `src/components/courses/CourseDetailsModal.tsx` | 179–205 | `previewLessonTitle` state block | **Mock static preview**: renders a black box with `<Play className="w-7 h-7" />`, a static text badge, and a static string `"طالب: أحمد محمد • 01012345678 • ID: 10482"`. No `<video>` tag exists. |
| `src/components/courses/CourseDetailsModal.tsx` | 261–274 | Free Preview button vs. Locked badge | If `lesson.isFreePreview` is true, sets preview title; if false, renders `<Lock /> مغلق`. Enrolled students have no way to unlock or play full lessons. |
| `src/App.tsx` | 225–234 | `CourseDetailsModal` mounting | Everything runs in a single page shell; no dedicated `LessonRoomPage` or route for viewing lessons. |

### 2.2 Key Architectural Gaps Identified
1. **No Real Media Player**: No `<video>` element or player component exists anywhere in the codebase.
2. **No Multi-Format Stream Engine**: No support for HLS (`.m3u8`) playback or adaptive bitrate streaming.
3. **No Stream URL Security**: No signed token generation, no expiration verification, no HMAC hashing, and no stream obfuscation.
4. **Superficial Watermark Only**: The watermark in `CourseDetailsModal.tsx` is static text in a mock div; it does not float across the active video viewport, does not bind to the active authenticated student, and has no anti-tamper DOM monitoring.
5. **No Full Lesson Room View**: The application lacks a dedicated lesson viewing workspace (with syllabus navigation, video player, attached PDF summaries, and quizzes).
6. **No Video State Store**: No state tracking for playback progress, completed duration, current resolution, playback speed, or volume persistence.

---

## 3. Multi-Format Video Playback Engine: Evaluation & Architecture

### 3.1 Required Stream Formats
In modern Egyptian and regional ed-tech platforms (such as El-Ameed and Waleed Mohsen), courses feature two primary video delivery formats:
1. **HLS (HTTP Live Streaming - `.m3u8` manifest + `.ts`/`.m4s` segments)**:
   - Essential for production educational videos.
   - Enables adaptive bitrate streaming (auto-switching between 1080p, 720p, 480p, 360p based on student network bandwidth).
   - Segments are requested sequentially; students cannot download the entire 1-hour video file in a single HTTP GET request.
   - Supports segment-level encryption (AES-128) and signed query tokens.
2. **Direct Progressive MP4 / WebM**:
   - Useful for short summary clips, preview teasers, local demo mocks, and fallback environments.
   - Must be wrapped in Blob URLs to prevent static link extraction.

### 3.2 Evaluation of Player Library Options

| Strategy | Bundle Impact | HLS Support | Security & Token Interception | UI / Styling Flexibility | Recommendation |
|---|---|---|---|---|---|
| **Option A: Plyr.js (`plyr-react`)** | ~40 KB gzipped | Requires separate `hls.js` wiring | Moderate (controls wrap DOM `<video>`) | Pre-styled CSS, can fight with Tailwind dark mode | Good reference match (El-Ameed uses Plyr v3.7), but less control over custom canvas watermarks and custom security hooks. |
| **Option B: Video.js (`video.js`)** | ~150 KB+ gzipped | Built-in VHS (VideoJS HTTP Streaming) | Good | Rigid skinning, bulky DOM structure | Overly heavy for a sleek modern React/Tailwind SPA. |
| **Option C: Native React Player + `hls.js` + Radix Primitives (Recommended Enterprise Approach)** | **~70 KB total** (`hls.js` alone) | Full MSE HLS via `hls.js` + Native Safari HLS | **Maximum**: Direct access to `hls.js` loader hooks (`fLoader`, `xhrSetup`) for token injection and segment de-obfuscation. | **100% Native Tailwind**: Full visual harmony with Al Aref design tokens (`#753b47`, `#fe6257`, `#111625`). | **TOP RECOMMENDATION**: High-performance, zero styling fighting, clean compound components, exact control over anti-tampering and watermarks. |

### 3.3 Recommended Player Engine Strategy
We recommend building **`ProtectedVideoPlayer`** as a composable, enterprise React component using:
- **`hls.js`** for HLS streaming across all modern browsers (Chrome, Edge, Firefox, Android), with native `<video>` HLS fallback for iOS/Safari.
- **Native HTML5 Media API** for progressive MP4 and Blob playback.
- **Radix UI Sliders & Dropdowns** for the scrubber, volume control, speed selector, and resolution menu.
- **Lucide Icons** and **Framer Motion** for smooth, professional control transitions.
- A custom fallback simulation mode so the application runs completely error-free both with real stream URLs (e.g. Mux / Akamai HLS test streams) and offline/mock video manifests.

---

## 4. R2 Protected Video Streaming Engine: Deep Protection Architecture

### 4.1 The Threat Model: Beyond Superficial UI Overlays
Superficial protections (such as disabling right-click or setting `pointer-events: none` on the video container) fail immediately:
- A user inspects the DOM and copies the `<video src="...">` attribute.
- A user opens the Network tab and copies the `.mp4` or `.m3u8` request URL.
- A user pastes the URL into VLC, IDM, or `yt-dlp` to download the entire lesson and leak it onto Telegram.
- A user uses OBS or a smartphone camera to record the screen while watching.

To defeat these vectors, the **R2 Protected Video Streaming Engine** implements a **5-Tier Defense-in-Depth Architecture**:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    R2 PROTECTED VIDEO STREAMING ENGINE                       │
├──────────────────────────────────────────────────────────────────────────────┤
│  [Tier 1: Cryptographic Tokenized & Signed URL Generator]                    │
│   • HMAC-SHA256 signature combining lessonId + studentId + exp + nonce       │
│   • Short-lived rolling expiration (15-min TTL with heartbeat refresh)       │
│   • URL: /stream/v1/lessons/{id}/manifest.m3u8?token=...&exp=...&sig=...     │
├──────────────────────────────────────────────────────────────────────────────┤
│  [Tier 2: Stream Source Obfuscation & In-Memory Media Decoupling]           │
│   • MP4: Dynamic Blob URL generation (URL.createObjectURL(blob))             │
│   • HLS: MediaSource Extensions (MSE) via hls.js (blob:http://.../mse-...)   │
│   • Real CDN origin is NEVER exposed in the DOM <video src> attribute        │
│   • Network interception: custom hls.js loader injects auth session headers  │
├──────────────────────────────────────────────────────────────────────────────┤
│  [Tier 3: Dynamic Forensic Watermark Engine]                                 │
│   • Real-time moving watermark canvas: Student Name + Phone + ID + SessionIP │
│   • Unpredictable 2D coordinate oscillation every 10-15s (anti-crop)         │
│   • MutationObserver anti-tamper guard: halts playback if watermark hidden   │
├──────────────────────────────────────────────────────────────────────────────┤
│  [Tier 4: Anti-Inspection & DevTools Guard]                                  │
│   • DevTools detection via high-frequency debugger timing probes             │
│   • Blurs video canvas and pauses stream immediately upon inspector opening  │
│   • Suppresses F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, PrintScreen          │
├──────────────────────────────────────────────────────────────────────────────┤
│  [Tier 5: Single-Device Session Lock & Concurrent Stream Throttling]         │
│   • Stream tokens bound to student's hardware device ID                      │
│   • Heartbeat ping checks active stream concurrency (max 1 stream / student) │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Deep Dive: Tier 1 — Tokenized & Signed URL Architecture
1. **Token Generation (`VideoSecurityService.generateSignedStreamToken`)**:
   - The client never queries static CDN media URLs.
   - When a student initiates lesson playback, the client calls:
     ```typescript
     const tokenPayload = {
       lessonId: "les-202",
       studentId: currentStudent.id,
       deviceId: currentStudent.deviceId,
       expiresAt: Math.floor(Date.now() / 1000) + (15 * 60), // 15 minutes TTL
       nonce: crypto.randomUUID(),
     };
     ```
   - An HMAC-SHA256 signature is calculated:
     $$\text{Signature} = \text{HMAC-SHA256}(\text{lessonId} + ":" + \text{studentId} + ":" + \text{expiresAt} + ":" + \text{nonce}, \text{SECRET\_KEY})$$
   - The tokenized stream URL is formed:
     `/api/stream/lessons/les-202/master.m3u8?token=${base64Url(tokenPayload)}&sig=${signature}`

2. **Validation Engine (`VideoSecurityService.validateStreamToken`)**:
   - Checks if `Date.now() / 1000 > tokenPayload.expiresAt`. If expired $\rightarrow$ rejects with `403 TOKEN_EXPIRED`.
   - Recomputes HMAC-SHA256 signature and verifies constant-time equality. If mismatch $\rightarrow$ rejects with `403 INVALID_SIGNATURE`.
   - Confirms `tokenPayload.deviceId === activeStudent.deviceId`. If mismatch $\rightarrow$ rejects with `403 DEVICE_MISMATCH`.
   - Confirms student holds active entitlement (free preview or purchased course). If not enrolled $\rightarrow$ rejects with `403 UNENROLLED_ACCESS`.

3. **Rolling Token Refresh**:
   - The video player tracks the remaining token TTL.
   - 3 minutes before expiration, the player silently issues a background refresh request to obtain a renewed token without interrupting playback.

### 4.3 Deep Dive: Tier 2 — Stream Source Obfuscation & In-Memory Media Decoupling
1. **Dynamic Blob URL Generation for MP4 / Fallback Media**:
   - Instead of setting `<video src="https://storage.cdn.com/lesson_4k.mp4">`:
     ```typescript
     // 1. Fetch chunks in memory with auth headers
     const response = await fetch(signedStreamUrl, {
       headers: {
         'Authorization': `Bearer ${jwtToken}`,
         'X-Stream-Token': streamToken,
       }
     });
     const buffer = await response.arrayBuffer();
     // 2. Wrap into memory Blob
     const blob = new Blob([buffer], { type: 'video/mp4' });
     const memoryBlobUrl = URL.createObjectURL(blob);
     // 3. Assign ephemeral blob URL to DOM
     videoElement.src = memoryBlobUrl;
     ```
   - **Why this completely prevents direct link theft**:
     - `blob:http://localhost:8080/6e99b0c2-...` is an internal memory address existing *only* within the current browser process and JavaScript heap.
     - If a user copies this URL and opens it in another tab, another browser, curl, VLC, or IDM, it returns `404 / File Not Found`.
     - The true remote streaming URL is never present in the HTML DOM.
     - When the lesson changes or player unmounts, `URL.revokeObjectURL(memoryBlobUrl)` reclaims the memory and destroys the URL pointer.

2. **MediaSource Extensions (MSE) for HLS Streaming**:
   - When playing HLS via `hls.js`, `hls.js` automatically binds a browser `MediaSource` to the `<video>` element.
   - The DOM `<video src>` displays `blob:http://localhost:8080/mediasource-...`.
   - The custom `hls.js` loader intercepts every `.ts` segment request:
     ```typescript
     class SecureHlsLoader extends Hls.DefaultConfig.loader {
       load(context, config, callbacks) {
         // Append dynamic session token and prevent external hotlinking
         context.url = appendTokenToSegment(context.url, activeSessionToken);
         super.load(context, config, callbacks);
       }
     }
     ```
   - Segments are decoded into in-memory `SourceBuffer` objects; no full video file exists on disk or in the DOM.

### 4.4 Deep Dive: Tier 3 — Forensic Dynamic Watermark Overlay
Even the strongest cryptographic DRM cannot prevent someone from pointing a smartphone camera or HDMI capture device at the monitor. Egyptian educational platforms solve this through **forensic watermarking**:

1. **Watermark Data Payload**:
   - Student Full Name: e.g. `ملك محمود عبدالحليم`
   - Student Phone: e.g. `01098765432`
   - Student ID: e.g. `ID: 10482`
   - Live Session IP & Timestamp: e.g. `156.204.x.x • 2026-11-09 01:45`
2. **Dynamic Motion & Opacity Oscillation**:
   - The watermark is rendered as an absolutely positioned overlay with `pointer-events-none select-none z-30`.
   - A timer triggers every 12 seconds, calculating randomized coordinates $(x, y)$ within the video viewport bounds ($10\% \le x \le 80\%$, $10\% \le y \le 80\%$).
   - Framer Motion smoothly transitions the watermark to the new position over 1.5 seconds.
   - Opacity oscillates between $0.25$ and $0.60$ to avoid blocking lesson blackboard text while guaranteeing forensic clarity if recorded.
3. **Anti-Tampering MutationObserver**:
   - Attackers often attempt to use DevTools element inspector to add `display: none` or delete the watermark element.
   - An active `MutationObserver` watches the video player container for child-list and attribute mutations.
   - If the watermark element is removed, hidden (`display: none`, `visibility: hidden`), or its opacity reduced to 0:
     ```typescript
     observer = new MutationObserver((mutations) => {
       const watermarkEl = container.querySelector('[data-watermark="forensic"]');
       if (!watermarkEl || getComputedStyle(watermarkEl).display === 'none' || getComputedStyle(watermarkEl).opacity === '0') {
         // Immediate security response
         videoRef.current?.pause();
         setIsTampered(true);
       }
     });
     ```
   - The player instantly blacks out and displays: "تنبيه أمني: تم رصد محاولة التلاعب بالعلامة المائية. تم إيقاف المشغل لحماية المحتوى."

### 4.5 Deep Dive: Tier 4 — DevTools Inspection & Screen Capture Deterrence
- **Timing Probe**: Uses `performance.now()` deltas around `debugger` evaluation to detect if developer tools are open.
- **Dimensional Probe**: Checks discrepancies between `window.outerWidth - window.innerWidth` and `window.outerHeight - window.innerHeight` exceeding standard browser chrome.
- **Action upon Detection**:
  1. Instantly pause video playback.
  2. Apply CSS backdrop blur (`backdrop-blur-xl bg-black/95`) over the video canvas.
  3. Show security modal: "تنبيه أمني: تم رصد فتح أدوات الفحص والمطورين. يُرجى إغلاق أدوات الفحص لمتابعة مشاهدة الدرس."
- **Keyboard Shortcut Trapping**:
  - Intercepts and blocks `F12`, `Ctrl+Shift+I`, `Ctrl+Shift+J`, `Ctrl+Shift+C`, `Ctrl+U`, and `PrintScreen`.
  - Context menu suppression (`contextmenu` event `preventDefault()`).

### 4.6 Deep Dive: Tier 5 — Single-Device Lock & Stream Concurrency
- Tokens contain the registered `deviceId`.
- An active playback heartbeat pings `VideoSecurityService.heartbeat({ studentId, lessonId, deviceId })` every 30 seconds.
- If another stream is launched under the same student credentials on another device, the heartbeat returns `CONCURRENT_STREAM_DETECTED`, pausing playback with an alert.

---

## 5. Video Player UI / UX Design & Platform Specification

### 5.1 Visual Style & Al Aref Academy Branding
The player UI strictly follows the **Al Aref Master Architecture Guidelines (`AGENTS.md`)**:
- **Canvas & Container**: Dark slate canvas `#0c101c` / Deep Navy `#111625` with soft ambient glow.
- **Primary Brand Color**: Burgundy `#753b47` / `#8d4756` (Hover: `#854351`).
- **Accent Brand Color**: Coral `#fe6257` / `#e87a71`.
- **RTL Arabic Alignment**: All controls, timers, tooltips, and menus are aligned right-to-left.
- **Arabic Typography**: Cairo & Almarai fonts with clear Arabic numeral formatting.
- **Frameless Organic Presentation**: Crisp 16:9 aspect ratio (`aspect-video`), rounded-24 border radius, subtle border (`border border-white/10`), zero jarring clutters.

### 5.2 Control Suite & Interactions

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ [Top Bar]  ◄ ملخص الحصة الثانية كاد واخواتها      [1080p • محمي]   [✕ إغلاق]│
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                                                                              │
│                 [ طـالب: مـلك محـمود • 01098765432 • ID: 10482 ]            │
│                              (علامة مائية متحركة)                            │
│                                                                              │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│ [Scrubber] ═════════════════════●────────────────────────────────────────────│
│            05:32 / 40:00        ▲ [قاعدة كاد وأخواتها 05:30]                 │
├──────────────────────────────────────────────────────────────────────────────┤
│ [Bottom Bar]                                                                 │
│   (RTL) [▶ تشغيل]  [+10 ث]  [-10 ث]  [🔊 80%]  05:32 / 40:00                 │
│                                              [1x سرعة]  [1080p جودة]  [⛶ ملء]│
└──────────────────────────────────────────────────────────────────────────────┘
```

1. **Scrubber Progress Bar**:
   - Double-layered track: Played progress (gradient `#753b47` $\rightarrow$ `#fe6257`), buffered track (`rgba(255,255,255,0.2)`), background track (`rgba(255,255,255,0.1)`).
   - Hover preview tooltip showing the hovered time (`05:30`).
   - Interactive timestamped note markers pinned along the track. Clicking a marker seeks directly to that concept.
2. **Playback Speed Switcher**:
   - Speeds: `0.5x`, `0.75x`, `1x (عادي)`, `1.25x`, `1.5x`, `1.75x`, `2x`.
   - Selection persists in `localStorage` (`alaref_playback_speed`).
3. **Quality & Resolution Switcher**:
   - For HLS: Displays available stream levels: `تلقائي (Auto)`, `1080p (FHD)`, `720p (HD)`, `480p (SD)`, `360p`.
   - Shows active resolution badge on the top utility bar.
4. **Quick Seek (10s Forward / 10s Backward)**:
   - Dedicated buttons with smooth rotation animations.
   - Keyboard shortcuts: Left Arrow (forward 10s in RTL), Right Arrow (backward 10s in RTL), Space (Play/Pause), M (Mute), F (Fullscreen).
5. **Volume Control**:
   - Horizontal slider expanding on hover.
   - Clicking speaker toggles mute/unmute; volume level persists in `localStorage`.
6. **Mobile Landscape Auto-Orientation**:
   - When viewing on mobile screens ($\le 768px$), tapping fullscreen calls `screen.orientation.lock("landscape")` (with graceful fallback where unsupported).
   - Touch controls feature generous 44px tap targets.
7. **Controls Inactivity Auto-Hide**:
   - Controls bar smoothly fades out after 3 seconds of cursor inactivity during playback and reappears on mouse move or touch.

---

## 6. Gap Analysis & Required New Components

To implement R2 following SOLID principles and clean separation of concerns, the following files, contracts, and services must be constructed:

### 6.1 Data Contracts & Types (`src/types/video.ts`)
```typescript
export type VideoFormat = "hls" | "mp4" | "blob";

export interface VideoQualityLevel {
  id: string; // "auto" | "1080p" | "720p" | "480p" | "360p"
  label: string; // "تلقائي (Auto)" | "1080p (عالية جداً)" | ...
  height?: number;
  bitrate?: number;
  url?: string;
}

export interface TimestampedNote {
  id: string;
  timeSeconds: number;
  title: string;
  description?: string;
  isTeacherNote?: boolean;
}

export interface VideoSourceManifest {
  lessonId: string;
  title: string;
  courseTitle: string;
  gradeName: string;
  durationMinutes: number;
  format: VideoFormat;
  streamUrl: string; // Tokenized stream URL
  qualities: VideoQualityLevel[];
  poster?: string;
  notes?: TimestampedNote[];
  isFreePreview: boolean;
}

export interface SignedStreamToken {
  token: string;
  streamUrl: string;
  format: VideoFormat;
  expiresAt: number;
  nonce: string;
  watermark: {
    studentName: string;
    studentPhone: string;
    studentId: string;
    sessionIp: string;
  };
}
```

### 6.2 Security Services (`src/services/videoSecurityService.ts`)
- `VideoSecurityService.requestSignedStream(lessonId: string, student?: StudentProfile)`:
  - Generates or requests the time-limited HMAC-SHA256 token.
  - Builds the signed manifest with resolution ladders and forensic watermark metadata.
- `VideoSecurityService.createObfuscatedBlobUrl(directUrl: string, token: string)`:
  - Fetches progressive video chunks in memory and generates an ephemeral `blob:` URL.
  - Revokes existing blob URLs to prevent memory bloat.
- `VideoSecurityService.verifyToken(token: string)`:
  - Cryptographically verifies the signature, nonce, and expiration.
- `VideoSecurityService.sendHeartbeat(sessionToken: string)`:
  - Pings server/state for single-device stream concurrency validation.

### 6.3 Player State Management (`src/stores/useVideoPlayerStore.ts`)
A dedicated Zustand store tracking:
- `isPlaying: boolean`, `currentTime: number`, `duration: number`, `buffered: number`
- `volume: number`, `isMuted: boolean`, `playbackRate: number`
- `currentQuality: string`, `availableQualities: VideoQualityLevel[]`
- `isFullscreen: boolean`, `controlsVisible: boolean`
- `isDevToolsBlocked: boolean`, `isWatermarkTampered: boolean`
- Actions: `play()`, `pause()`, `seek(time)`, `setVolume(vol)`, `setQuality(q)`, `setSpeed(speed)`, `toggleFullscreen()`

### 6.4 UI Components (`src/components/video/`)
1. **`ProtectedVideoPlayer.tsx`**:
   - Master container hosting `<video>`, HLS engine attachment, and overlay coordination.
2. **`VideoControlsBar.tsx`**:
   - Bottom floating glassmorphic bar with play, seek, timer, volume, speed, quality, and fullscreen buttons.
3. **`VideoTimelineScrubber.tsx`**:
   - Precision slider with buffered track, played gradient, hover bubble, and timestamped note markers.
4. **`DynamicForensicWatermark.tsx`**:
   - Oscillating canvas/DOM badge displaying authenticated student credentials with MutationObserver tamper detection.
5. **`DevToolsSecurityGuard.tsx`**:
   - Background monitor detecting DevTools inspection; triggers video pause and security shield modal.
6. **`QualitySelectorMenu.tsx` & `SpeedSelectorMenu.tsx`**:
   - Radix dropdown menus for selecting stream quality and playback speed.
7. **`TimestampedNotesDrawer.tsx`**:
   - Interactive list of teacher bookmarks and key lecture topics.

### 6.5 Lesson Room Workspace (`src/components/lessons/LessonRoomModal.tsx`)
- A dedicated, immersive lesson viewer modal/page containing:
  - Main column: `ProtectedVideoPlayer`, lesson title, teacher credentials, and lesson description.
  - Left column (RTL): Unit syllabus accordion allowing students to navigate between lectures, download attached PDF summaries, and take lesson quizzes.
  - Tabbed footer: Attached summaries (PDFs), timestamped lecture notes, and student questions.

---

## 7. Concrete Implementation Roadmap for R2

| Step | Objective | Files Created / Modified | Deliverables |
|---|---|---|---|
| **Step 1** | **Contracts & Types** | `src/types/video.ts` | Define `VideoSourceManifest`, `VideoQualityLevel`, `TimestampedNote`, and `SignedStreamToken`. |
| **Step 2** | **Security & Signing Engine** | `src/services/videoSecurityService.ts` | HMAC-SHA256 token generator, expiration validator, in-memory Blob URL decrypter, and mock stream manifests. |
| **Step 3** | **Player State Store** | `src/stores/useVideoPlayerStore.ts` | Zustand store managing playback time, buffering, quality levels, volume, speed, and security alerts. |
| **Step 4** | **Forensic Watermark & DevTools Guard** | `src/components/video/DynamicForensicWatermark.tsx`, `src/components/video/DevToolsSecurityGuard.tsx` | Moving watermark overlay with MutationObserver; anti-inspection keyboard and debugger guards. |
| **Step 5** | **Custom Player Controls & Scrubber** | `src/components/video/VideoControlsBar.tsx`, `src/components/video/VideoTimelineScrubber.tsx`, `QualitySelectorMenu.tsx`, `SpeedSelectorMenu.tsx` | Glassmorphic RTL controls bar with Radix dropdowns, speed switcher, resolution selector, and hover preview. |
| **Step 6** | **Core Video Player Container** | `src/components/video/ProtectedVideoPlayer.tsx` | Multi-format engine supporting HLS (`.m3u8` via `hls.js` / native) and MP4/Blob, combining all controls and security layers. |
| **Step 7** | **Curriculum & Lesson Room Integration** | `src/components/lessons/LessonRoomModal.tsx`, `src/components/courses/CourseDetailsModal.tsx`, `src/App.tsx` | Replace mock preview in `CourseDetailsModal`; integrate full `LessonRoomModal` with lesson playlist and PDF downloads. |
| **Step 8** | **Sample Stream Manifests & Test Data** | `src/data/mockData.ts` | Enrich `LessonItem` with stream manifests (both HLS test streams and MP4 test streams). |
| **Step 9** | **Testing & Verification** | `src/test/videoStreaming.test.ts` | Unit tests for token signing, expiration, format detection, quality switching, and watermark integrity. |

---

## 8. Test Strategy & Verification Plan

### 8.1 Compilation & Build Gate
- `npm run build` in `study-buddy-sim` must complete with **Exit Code 0** and **0 errors**.

### 8.2 Unit & Integration Tests (`vitest run`)
Write `src/test/videoStreaming.test.ts` to verify:
1. **Token Generation & HMAC Validation**: Verifies that tokens generated with secret keys validate successfully, and any altered character in payload or signature fails validation.
2. **Token Expiration**: Verifies that an expired timestamp fails validation and triggers the expected error code.
3. **Format Detection**: Verifies that `.m3u8` initiates HLS configuration and `.mp4` initiates direct/blob configuration.
4. **Dynamic Watermark Data Construction**: Verifies that student name, student phone, and student ID are correctly formatted and bound to the watermark payload.
5. **Quality Ladder Resolution**: Verifies that quality choices (`1080p`, `720p`, `480p`, `auto`) properly configure the player stream level.
6. **DevTools Guard Trigger**: Verifies that the guard callback triggers pause when an inspection condition is detected.

### 8.3 Playwright Visual & Interactive Inspection Gate
Run Playwright verification script targeting Desktop (1440px) and Mobile (390px):
1. **Free Preview Playback**: Click "معاينة مجانية" on a free lesson $\rightarrow$ verify `ProtectedVideoPlayer` launches smoothly.
2. **Controls Verification**: Test Play/Pause, 10s seek forward, 10s seek backward, speed change to 1.5x, quality dropdown selection.
3. **Forensic Watermark Presence**: Verify the moving watermark badge is visible, contains student credentials, and floats with proper opacity.
4. **Mobile Responsive Inspection**: Verify controls scale down cleanly on mobile (390px) without overlapping badges or clipped RTL Arabic text.
5. **Anti-Leak Integrity**: Verify DOM inspect confirms `<video>` source is an obfuscated Blob URL or MSE stream rather than an unauthenticated static CDN URL.

---
*Report prepared by Survey Explorer 2 — Protected Video Streaming Engine (R2)*
