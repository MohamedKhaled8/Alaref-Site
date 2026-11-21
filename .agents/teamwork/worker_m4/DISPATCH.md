## 2026-11-09T01:51:34Z
You are the Payment & Enrollment Worker (teamwork_worker) for Al Aref Academy (`study-buddy-sim`).
Working directory: e:\Mt FlutterProject\yalaAcademy\study-buddy-sim
State folder: e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\worker_m4
Original request path: e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\ORIGINAL_REQUEST.md
Scope document path: e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\orchestrator_1\PROJECT.md
Survey architecture path: e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\teamwork_explorer_survey_3\survey_report.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Objective
Implement Milestone 4: Payment, Checkout & Immediate Access Entitlement (R4, F23-F27) with production quality, clean architecture, SOLID principles, and authentic Arabic RTL visual styling conforming to `AGENTS.md`.

## Deliverables & File Ownership
You exclusively own:
1. `src/types/payment.ts`:
   - `PaymentMethodType`: `"vodafone_cash" | "fawry" | "credit_card" | "voucher"`
   - `CouponCode`: `code`, `discountType: "percentage" | "fixed"`, `discountValue`, `description`, `minOrderValue`, `expiryDate`
   - `OrderInvoice`: `orderId`, `studentId`, `studentName`, `studentPhone`, `courseId`, `courseTitle`, `gradeName`, `originalPrice`, `discountAmount`, `finalPrice`, `paymentMethod`, `transactionReference`, `createdAt`, `status: "completed" | "pending_verification"`
   - `CheckoutPayload`: `courseId`, `paymentMethod`, `phoneNumber?`, `transactionRef?`, `cardNumber?`, `voucherCode?`

2. `src/data/mockCoupons.ts`:
   - `AREF2026`: 20% discount (كود خصم بداية الفصل الدراسي)
   - `AWAL50`: 50 LE fixed discount (خصم ترحيبي للطلاب المتفوقين)
   - `FREEPASS`: 100% scholarship discount (منحة الطالب المتفوق - اشتراك مجاني كامل)
   - `AREF-2026-GOLD`: Center voucher code (كارت شحن السنتر الذهبي)

3. `src/stores/useEnrollmentStore.ts`:
   - Zustand store managing checkout and entitlement:
     - State: `enrolledCourseIds: string[]`, `appliedCoupon: CouponCode | null`, `purchaseHistory: OrderInvoice[]`, `isProcessing: boolean`, `checkoutError: string | null`
     - Actions:
       - `applyCoupon(code: string, originalPrice: number): { success: boolean; message: string; discountAmount: number }`
       - `removeCoupon(): void`
       - `calculateTotals(originalPrice: number): { originalPrice: number; discountAmount: number; finalPrice: number }`
       - `processCheckout(course: CourseItem, user: User, payload: CheckoutPayload): Promise<OrderInvoice>`
       - `isCourseEnrolled(courseId: string): boolean`
       - `enrollFreeCourse(courseId: string, user: User): OrderInvoice`
       - `getOrder(orderId: string): OrderInvoice | undefined`
     - Logic: Immediate access entitlement upon successful checkout (adds `courseId` to `enrolledCourseIds`, syncs with `useAuthStore`'s `user.enrolledCourseIds`, saves order invoice).
     - Persists to `localStorage` under `alaref_enrollments` and `alaref_purchase_history`.

4. Payment UI Components (`src/components/payment/`):
   - `CheckoutModal.tsx`: Master checkout modal with order summary, coupon code input, payment method selector (Vodafone Cash, Fawry, Credit Card, Voucher), transaction reference fields, and "تأكيد الدفع والاشتراك الفوري" button.
   - `OrderSummaryCard.tsx`: Course card summary showing title, grade, price breakdown (original price, discount badge, final total in ج.م).
   - `CouponInput.tsx`: Input with "تطبيق الكوبون" button, green active badge with discount value, clear button, and red error messages for invalid/expired codes.
   - `PaymentMethodTabs.tsx`: Tabbed payment methods:
     - Vodafone Cash / InstaPay: Instructions to transfer to `01097303002`, field to input sender phone number and reference ID.
     - Fawry: Generates 8-digit reference code (e.g. `FAWRY-7842-9103`) with service code 788 instructions.
     - Credit Card: Formatted 16-digit card input, expiry `MM/YY`, 3-digit CVV, holder name.
     - Academy Voucher: 12-character center voucher input (e.g. `AREF-2026-GOLD`).
   - `PaymentSuccessModal.tsx`: Celebration dialog displaying invoice summary, transaction reference ID, and CTA button: "ابدأ التعلم الآن" (opens `LessonRoomModal`).
   - `PurchaseHistoryModal.tsx`: Displays student's past orders and invoices with dates, payment method badges, prices, and status.

5. Dynamic Integration & Wiring:
   - `src/components/courses/CourseCard.tsx`: Check `useEnrollmentStore.getState().isCourseEnrolled(course.id)`. If enrolled, action button updates to "مُشترك بالفعل • ابدأ التعلم", lock icons disappear, and clicking opens `LessonRoomModal` or `CourseDetailsModal`.
   - `src/components/courses/CourseDetailsModal.tsx`:
     - Clicking "الإشتراك في الكورس" opens `CheckoutModal` (replacing the old WhatsApp redirect for automated checkout!).
     - If enrolled, header and sidebar update to "أنت مشترك بالفعل في هذا الكورس • ابدأ المشاهدة" and clicking launches `LessonRoomModal`.
   - `src/components/navigation/UserProfileDropdown.tsx`: Add "سجل المدفوعات والفواتير" action to open `PurchaseHistoryModal`.

6. Hardening Recommendations:
   - In `src/components/summaries/SummaryDownloadButton.tsx`: Ensure clean property mapping:
     `const studentName = user?.fullName || (user as any)?.name || "طالب الأكاديمية";`
     `const studentPhone = user?.studentPhone || (user as any)?.phone || "01097303002";`
     `const studentId = user?.id || "AREF-GUEST";`
     Include `studentId` in the watermark string.
   - In `src/stores/useAssignmentStore.ts`: Explicitly disallow executable extensions (`.exe`, `.sh`, `.bat`, `.cmd`, `.js`, `.html`).

7. Unit Tests (`src/test/paymentEnrollment.test.ts`):
   - Test coupon engine: `AREF2026` (20%), `AWAL50` (50 LE), `FREEPASS` (100% discount / 0 LE total), invalid coupons rejected.
   - Test checkout processing across Vodafone Cash, Fawry, Credit Card, Voucher, and Free Course.
   - Test immediate access entitlement: `isCourseEnrolled` becomes true, enrolledCourseIds updated in both `useEnrollmentStore` and `useAuthStore`.
   - Test persistence in `localStorage`.
   - Test purchase history retrieval.

## Verification
Run tests and build in `study-buddy-sim`:
1. `npm test` — all existing 283 tests PLUS your new payment tests must pass cleanly (exit code 0).
2. `npm run build` — must compile cleanly with exit code 0 and 0 TypeScript errors.
