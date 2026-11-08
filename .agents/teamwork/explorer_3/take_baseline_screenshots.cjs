const path = require("path");
const fs = require("fs");
const { chromium } = require(path.resolve(__dirname, "../../..", "study-buddy-sim/node_modules/@playwright/test"));

const outputDir = path.join(__dirname, "baseline_screenshots");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function capture() {
  console.log("Launching browser via channel: 'chrome'...");
  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
  });

  const url = "http://localhost:8080";

  // --- 1. Desktop Viewport (1440x900) ---
  console.log("Capturing Desktop 1440px...");
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto(url, { waitUntil: "networkidle" });
  await desktopPage.waitForTimeout(1000); // Allow animations/fonts to settle

  // Full page
  await desktopPage.screenshot({
    path: path.join(outputDir, "desktop_1440_full.png"),
    fullPage: true,
  });
  console.log("Saved desktop_1440_full.png");

  // Hero section
  const heroDesktop = await desktopPage.$(".two-columns-hero-section");
  if (heroDesktop) {
    await heroDesktop.screenshot({
      path: path.join(outputDir, "desktop_1440_hero.png"),
    });
    console.log("Saved desktop_1440_hero.png");
  }

  // Promo Banner section
  const promoDesktop = await desktopPage.$("img[src*='amr_promo_banner']");
  if (promoDesktop) {
    const promoSection = await promoDesktop.evaluateHandle((img) => img.closest("section"));
    if (promoSection && promoSection.asElement()) {
      await promoSection.asElement().screenshot({
        path: path.join(outputDir, "desktop_1440_promo.png"),
      });
      console.log("Saved desktop_1440_promo.png");
    }
  }

  // Courses section
  const coursesDesktop = await desktopPage.$("#courses");
  if (coursesDesktop) {
    await coursesDesktop.screenshot({
      path: path.join(outputDir, "desktop_1440_courses.png"),
    });
    console.log("Saved desktop_1440_courses.png");
  }
  await desktopContext.close();

  // --- 2. Mobile Viewport (390x844) ---
  console.log("Capturing Mobile 390px...");
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(url, { waitUntil: "networkidle" });
  await mobilePage.waitForTimeout(1000);

  // Full page
  await mobilePage.screenshot({
    path: path.join(outputDir, "mobile_390_full.png"),
    fullPage: true,
  });
  console.log("Saved mobile_390_full.png");

  // Hero section
  const heroMobile = await mobilePage.$(".two-columns-hero-section");
  if (heroMobile) {
    await heroMobile.screenshot({
      path: path.join(outputDir, "mobile_390_hero.png"),
    });
    console.log("Saved mobile_390_hero.png");
  }

  // Promo Banner section
  const promoMobile = await mobilePage.$("img[src*='amr_promo_banner']");
  if (promoMobile) {
    const promoSection = await promoMobile.evaluateHandle((img) => img.closest("section"));
    if (promoSection && promoSection.asElement()) {
      await promoSection.asElement().screenshot({
        path: path.join(outputDir, "mobile_390_promo.png"),
      });
      console.log("Saved mobile_390_promo.png");
    }
  }

  // Courses section
  const coursesMobile = await mobilePage.$("#courses");
  if (coursesMobile) {
    await coursesMobile.screenshot({
      path: path.join(outputDir, "mobile_390_courses.png"),
    });
    console.log("Saved mobile_390_courses.png");
  }
  await mobileContext.close();

  await browser.close();
  console.log("All baseline screenshots captured successfully!");
}

capture().catch((err) => {
  console.error("Screenshot capture failed:", err);
  process.exit(1);
});
