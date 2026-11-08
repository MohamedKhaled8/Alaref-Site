Complete the Al Aref Academy web application (`study-buddy-sim`) for production by implementing Authentication (Login/Register) with JWT security, interactive Exams, protected multi-format Video Streaming with URL security layers, Summaries, Assignments with file uploading, and Payment flow, applying clean code, SOLID principles, and robust state management.

Working directory: e:\Mt FlutterProject\yalaAcademy\study-buddy-sim
Integrity mode: development

## Requirements

### R1. Authentication & JWT Security
Implement full user authentication (Login and Registration) with secure JWT token handling, session lifecycle management, and protected routes/content across the platform.

### R2. Protected Video Streaming Engine
Deliver video lesson playback supporting multiple video formats (such as MP4 and HLS) with security layers applied to the underlying video streaming links and endpoints to prevent unauthorized direct URL access, beyond superficial UI overlays.

### R3. Educational Modules (Exams, Summaries & Assignments)
Implement interactive student exams/quizzes with evaluation, downloadable lesson summaries, and assignment submission workflows including file uploads.

### R4. Payment & Course Enrollment
Implement a complete checkout and payment workflow for purchasing courses and lessons, granting student access upon successful payment.

### R5. Architecture, State Management & System Design
Structure all newly added systems adhering to clean code, SOLID principles, modular architecture, and robust state management, delivering realistic, production-ready, and responsive UI coordination.

## Verification Resources
- Build compilation check: `npm run build` in `study-buddy-sim`
- Unit and integration tests: `npm test` in `study-buddy-sim`
- Visual and functional verification via Playwright across desktop (1440px) and mobile (390px) viewports

## Acceptance Criteria

### Authentication & Authorization
- [ ] Users can register new accounts and log in with credentials.
- [ ] JWT tokens are issued, verified, stored securely, and used to guard protected routes and API calls.
- [ ] Unauthenticated users are redirected to login when attempting to access restricted courses or user dashboards.

### Video Playback & URL Protection
- [ ] Video player successfully loads and plays multiple video formats without errors.
- [ ] Video streaming URLs have deep protection layers (tokenized/signed links or obfuscated stream sources) preventing direct link theft and unauthorized playback.

### Exams, Summaries & Assignments
- [ ] Students can take exams/quizzes, submit answers, and receive graded scores or completion statuses.
- [ ] Lesson summaries are accessible and downloadable.
- [ ] Assignments allow students to submit work, including file uploads with validation.

### Payment & Access Entitlement
- [ ] Users can select a course, proceed through checkout, complete the payment process, and immediately receive enrolled access.

### System Architecture & Build Verification
- [ ] Code follows SOLID principles and clean separation of concerns across state management, data services, and UI components.
- [ ] `npm run build` executes in `study-buddy-sim` with exit code 0 and zero TypeScript or compilation errors.
- [ ] `npm test` passes 100% of test suites cleanly.
- [ ] Playwright visual inspection confirms responsive rendering without layout collisions, overlapping elements, or clipped RTL Arabic text.