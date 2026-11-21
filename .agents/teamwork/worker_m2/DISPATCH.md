# Task Assignment: Worker M2 — Milestone 2: Protected Video Streaming Engine & Lesson Room

## Mandatory Integrity Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Objective
Implement Requirement R2 (Protected Video Streaming Engine & Lesson Room) in `study-buddy-sim` (`e:\Mt FlutterProject\yalaAcademy\study-buddy-sim`) adhering to the architecture formulated by Survey Explorer 2.

## Key Deliverables & File Ownership:
1. **`src/types/video.ts`**:
   - `VideoFormat` ("hls" | "mp4" | "blob"), `VideoQualityLevel`, `TimestampedNote`, `VideoSourceManifest`, `SignedStreamToken`, `StreamSecurityViolation`.
2. **`src/services/videoSecurityService.ts`**:
   - Cryptographic token generation using Web Crypto HMAC-SHA256 (`lessonId`, `studentId`, `deviceId`, `expiresAt` with 15-min rolling TTL, `nonce`).
   - Token validation engine verifying signature, TTL, deviceId, and student access.
   - Dynamic in-memory Blob URL decrypter & generator (`URL.createObjectURL(blob)`) and automatic memory cleanup via `URL.revokeObjectURL`.
   - Single-device stream concurrency heartbeat tracking (`sendHeartbeat`).
   - Mock stream manifest generator providing working HLS test streams (e.g. standard HLS test streams like Akamai/Mux) and MP4 test streams.
3. **`src/stores/useVideoPlayerStore.ts`**:
   - Zustand store managing: `isPlaying`, `currentTime`, `duration`, `buffered`, `volume`, `isMuted`, `playbackRate`, `currentQuality`, `availableQualities`, `isFullscreen`, `controlsVisible`, `isDevToolsBlocked`, `isWatermarkTampered`, active timestamped notes.
   - Actions: `play()`, `pause()`, `togglePlay()`, `seek(time)`, `setVolume(vol)`, `toggleMute()`, `setSpeed(speed)`, `setQuality(q)`, `setSecurityAlert()`.
4. **`src/components/video/`**:
   - `ProtectedVideoPlayer.tsx`: Master video component supporting HLS (via `hls.js` if available or native Safari HLS) and progressive MP4/Blob URLs. Renders within dark canvas (`#0c101c` / `#111625`), 16:9 aspect ratio, rounded corners, brand border.
   - `VideoControlsBar.tsx`: Glassmorphic bottom bar with play/pause, +/-10s seek, current time / duration formatting, volume slider, speed dropdown, resolution dropdown, and fullscreen toggle.
   - `VideoTimelineScrubber.tsx`: Dual-track scrubber showing buffered progress, played gradient, hover tooltip time bubble, and timestamped note markers.
   - `DynamicForensicWatermark.tsx`: Floating canvas/badge with student full name, phone number, and ID that smoothly oscillates across random 2D coordinates every 12 seconds. Includes active `MutationObserver` that halts playback immediately if the watermark element is hidden or deleted.
   - `DevToolsSecurityGuard.tsx`: Active inspection detector using `performance.now()` debugger timing probe. Pauses video and applies blur overlay with security warning if DevTools are opened. Traps inspection shortcuts (`F12`, `Ctrl+Shift+I`, `Ctrl+Shift+J`, `Ctrl+U`, `contextmenu`).
   - `QualitySelectorMenu.tsx` & `SpeedSelectorMenu.tsx`: Radix dropdown menus for quality and playback rate.
5. **`src/components/lessons/LessonRoomModal.tsx`**:
   - Immersive dedicated workspace modal displaying:
     - Header: Lesson title, teacher badge (مستر عمرو عارف), course title.
     - Center: `ProtectedVideoPlayer`.
     - Left (RTL): Course curriculum accordion allowing students to navigate between lectures, view completed checkmarks, access PDF summaries, and launch lesson exams.
     - Footer: Attached lesson summaries, interactive timestamped lecture notes, and questions tab.
     - Guarded by `CourseAccessGuard`: locks full lesson playback if unauthenticated or unenrolled, while allowing free preview lessons.
6. **Integration in `CourseDetailsModal.tsx`**:
   - Clicking "ابدأ المشاهدة الآن" or clicking any video lesson in the syllabus opens `LessonRoomModal` with the selected lesson active.
7. **Verification & Testing (`src/test/videoStreaming.test.ts`)**:
   - Test HMAC-SHA256 signed stream token generation & verification.
   - Test 15-minute expiration rejection.
   - Test token signature tampering rejection.
   - Test in-memory Blob URL generation and format detection.
   - Test dynamic watermark data construction and single-device concurrency checks.
   - Ensure `npm test` and `npm run build` pass with 100% clean exit codes.

## Inputs:
- Original Request: `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\ORIGINAL_REQUEST.md`
- Master Plan: `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\orchestrator_1\PROJECT.md`
- Explorer 2 Survey Report: `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\teamwork_explorer_survey_2\survey_report.md`

## Output:
Produce `handoff.md` in `e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\worker_m2\handoff.md`.
Notify parent via `send_message`.

## 2026-11-09T00:42:56Z
You are assigned as Worker M2 for Al Aref Academy (`study-buddy-sim`) to implement Milestone 2: Protected Video Streaming Engine & Lesson Room.

