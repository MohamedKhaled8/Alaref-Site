const path = require("path");
const fs = require("fs");
const { chromium } = require(path.resolve(__dirname, "../study-buddy-sim/node_modules/playwright"));

async function verifyHeroVisual() {
  console.log("=== PLAYWRIGHT HERO SECTION VISUAL VERIFICATION ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });

  const outputDir = path.resolve(__dirname, "../verification_screenshots");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 1. Desktop 1440px
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto("http://localhost:8080", { waitUntil: "networkidle" });

  const heroSection = desktopPage.locator("#hero");
  await heroSection.waitFor({ state: "visible", timeout: 10000 });
  console.log("Hero section located on desktop.");

  const heroImg = heroSection.locator('img[src*="amr_master_hero.png"]');
  const imgCount = await heroImg.count();
  console.log(`Hero image elements found: ${imgCount}`);
  if (imgCount < 1) {
    console.error("[FAIL] amr_master_hero.png not found in hero section!");
    process.exit(1);
  }

  // Check 4 badges in Hero
  const badges = heroSection.locator(".backdrop-blur-xl");
  const badgeCount = await badges.count();
  console.log(`Hero floating glassmorphism badges count: ${badgeCount}`);
  if (badgeCount !== 4) {
    console.error(`[FAIL] Expected 4 floating badges, found ${badgeCount}`);
    process.exit(1);
  }

  // Check badge bounding boxes for collisions
  const boxes = [];
  for (let i = 0; i < badgeCount; i++) {
    const box = await badges.nth(i).boundingBox();
    const text = (await badges.nth(i).textContent()).trim().replace(/\s+/g, " ");
    boxes.push({ index: i + 1, text, ...box });
    console.log(`Badge #${i + 1}: "${text}" -> [x:${box.x.toFixed(1)}, y:${box.y.toFixed(1)}, w:${box.width.toFixed(1)}, h:${box.height.toFixed(1)}]`);
  }

  // Collision check
  let hasCollision = false;
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const b1 = boxes[i];
      const b2 = boxes[j];
      const overlapX = Math.max(0, Math.min(b1.x + b1.width, b2.x + b2.width) - Math.max(b1.x, b2.x));
      const overlapY = Math.max(0, Math.min(b1.y + b1.height, b2.y + b2.height) - Math.max(b1.y, b2.y));
      if (overlapX > 0 && overlapY > 0) {
        console.error(`[COLLISION] Badge #${b1.index} overlaps with Badge #${b2.index}`);
        hasCollision = true;
      }
    }
  }

  if (hasCollision) {
    console.error("[FAIL] Badge collision detected!");
    process.exit(1);
  }
  console.log("[PASS] Exactly 4 floating badges with 0 bounding-box collisions.");

  await heroSection.screenshot({ path: path.join(outputDir, "empirical_challenger_hero_desktop.png") });
  console.log("Desktop hero screenshot saved.");
  await desktopContext.close();

  // 2. Mobile 390px
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto("http://localhost:8080", { waitUntil: "networkidle" });
  const mobileHero = mobilePage.locator("#hero");
  await mobileHero.waitFor({ state: "visible", timeout: 10000 });
  await mobileHero.screenshot({ path: path.join(outputDir, "empirical_challenger_hero_mobile.png") });
  console.log("Mobile hero screenshot saved.");
  await mobileContext.close();

  await browser.close();
  console.log("=== PLAYWRIGHT HERO SECTION VISUAL VERIFICATION: PASSED ===");
}

verifyHeroVisual().catch(err => {
  console.error("Hero visual error:", err);
  process.exit(1);
});
