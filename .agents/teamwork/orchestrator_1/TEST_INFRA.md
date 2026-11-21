# E2E Test Infra: Al Aref Academy (`study-buddy-sim`)

## Test Philosophy
- Requirement-driven, opaque-box, derived strictly from `ORIGINAL_REQUEST.md` and user-facing specifications.
- Dual testing methodology: Category-Partition + Boundary Value Analysis + Pairwise Combinatorial + Real-World Application Workloads + Playwright Visual/Interactive Testing.

## Feature Inventory Coverage (29 Features)
- Tier 1: ≥5 test cases per feature covering happy paths in isolation.
- Tier 2: ≥5 boundary & corner case test cases (e.g. invalid phones, phone collision, expired JWTs, 10.01MB uploads, invalid MIME, 0 LE coupons, DevTools tampering).
- Tier 3: Pairwise combinations (e.g. Login -> Enroll with Coupon -> Stream Video -> Download Summary -> Submit Assignment).
- Tier 4: Real-world Egyptian student workflow scenarios (Primary 6, Prep 1, Prep 2, Prep 3 students navigating lessons, taking exams, checking out via Vodafone Cash / Fawry).
- Tier 5: Adversarial coverage hardening (crypto signature tampering, concurrent playback lock, mutation observer bypass prevention).

## Test Runner Architecture
- Vitest (`npm test` in `study-buddy-sim`): Unit, store, service, and component integration tests.
- Vite Build (`npm run build` in `study-buddy-sim`): TypeScript compiler & asset bundling validation.
- Playwright: Visual inspection gate across Desktop (1440px) and Mobile (390px) viewports verifying zero clipped RTL Arabic text and responsive UI.
