/**
 * Reusable Visual Verification Script using Playwright
 * Usage:
 *   node verify_visuals.cjs [outputDir] [url]
 * Example:
 *   node verify_visuals.cjs ./verification_screenshots http://localhost:8080
 */

const path = require("path");
const fs = require("fs");
const { chromium } = require(path.resolve(__dirname, "../../..", "study-buddy-sim/node_modules/@playwright/test"));

const outputDir = process.argv[2] 
  ? path.resolve(process.cwd(), process.argv[2])
  : path.join(__dirname, "verification_screenshots");

const targetUrl = process.argv[3] || "http://localhost:8080";

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function capture() {
  console.log(`[Playwright] Target URL: ${targetUrl}`);
  console.log(`[Playwright] Output Directory: ${outputDir}`);
  console.log("[Playwright] Launching Chrome channel...");

  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
  });

  // 1. Desktop 1440px
  console.log("[Playwright] Capturing Desktop 1440px...");
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto(targetUrl, { waitUntil: "networkidle" });
  await desktopPage.waitForTimeout(1000);

  await desktopPage.screenshot({
    path: path.join(outputDir, "desktop_1440_full.png"),
    fullPage: true,
  });

  const heroDesktop = await desktopPage.$(".two-columns-hero-section");
  if (heroDesktop) {
    await heroDesktop.screenshot({
      path: path.join(outputDir, "desktop_1440_hero.png"),
    });
  }

  const promoDesktop = await desktopPage.$("img[src*='amr_promo_banner']");
  if (promoDesktop) {
    const promoSection = await promoDesktop.evaluateHandle((img) => img.closest("section"));
    if (promoSection && promoSection.asElement()) {
      await promoSection.asElement().screenshot({
        path: path.join(outputDir, "desktop_1440_promo.png"),
      });
    }
  }

  const coursesDesktop = await desktopPage.$("#courses");
  if (coursesDesktop) {
    await coursesDesktop.screenshot({
      path: path.join(outputDir, "desktop_1440_courses.png"),
    });
  }
  await desktopContext.close();

  // 2. Mobile 390px
  console.log("[Playwright] Capturing Mobile 390px...");
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(targetUrl, { waitUntil: "networkidle" });
  await mobilePage.waitForTimeout(1000);

  await mobilePage.screenshot({
    path: path.join(outputDir, "mobile_390_full.png"),
    fullPage: true,
  });

  const heroMobile = await mobilePage.$(".two-columns-hero-section");
  if (heroMobile) {
    await heroMobile.screenshot({
      path: path.join(outputDir, "mobile_390_hero.png"),
    });
  }

  const promoMobile = await mobilePage.$("img[src*='amr_promo_banner']");
  if (promoMobile) {
    const promoSection = await promoMobile.evaluateHandle((img) => img.closest("section"));
    if (promoSection && promoSection.asElement()) {
      await promoSection.asElement().screenshot({
        path: path.join(outputDir, "mobile_390_promo.png"),
      });
    }
  }

  const coursesMobile = await mobilePage.$("#courses");
  if (coursesMobile) {
    await coursesMobile.screenshot({
      path: path.join(outputDir, "mobile_390_courses.png"),
    });
  }
  await mobileContext.close();

  await browser.close();
  console.log("[Playwright] All screenshots captured successfully!");
}

capture().catch((err) => {
  console.error("[Playwright] Capture failed:", err);
  process.exit(1);
});
