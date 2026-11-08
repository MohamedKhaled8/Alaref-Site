const path = require("path");
const fs = require("fs");
const { chromium } = require(path.resolve(__dirname, "../study-buddy-sim/node_modules/playwright"));

async function verifyFooterDOM() {
  console.log("=== PLAYWRIGHT DOM & CSS WATERMARK VERIFICATION ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log("Navigating to http://localhost:8080...");
  await page.goto("http://localhost:8080", { waitUntil: "networkidle" });

  // Locate the footer
  const footer = page.locator("footer");
  await footer.waitFor({ state: "visible", timeout: 10000 });
  console.log("Footer located in DOM.");

  // Evaluate all elements inside footer with backgroundImage matching waleed_calligraphy_bg
  const watermarkInfo = await page.evaluate(() => {
    const footerEl = document.querySelector("footer");
    if (!footerEl) return { found: 0, elements: [] };

    const allDescendants = footerEl.querySelectorAll("*");
    const matched = [];

    for (const el of allDescendants) {
      const computed = window.getComputedStyle(el);
      const bgImg = computed.backgroundImage || "";
      const inlineStyle = el.getAttribute("style") || "";

      if (bgImg.includes("waleed_calligraphy_bg.png") || inlineStyle.includes("waleed_calligraphy_bg.png")) {
        matched.push({
          tagName: el.tagName,
          className: el.className,
          backgroundImage: bgImg,
          backgroundRepeat: computed.backgroundRepeat,
          backgroundSize: computed.backgroundSize,
          backgroundPosition: computed.backgroundPosition,
          opacity: computed.opacity,
          mixBlendMode: computed.mixBlendMode,
          clientWidth: el.clientWidth,
          clientHeight: el.clientHeight,
        });
      }
    }

    return {
      totalFound: matched.length,
      elements: matched,
    };
  });

  console.log(`\nWatermark Elements Found: ${watermarkInfo.totalFound}`);
  watermarkInfo.elements.forEach((info, idx) => {
    console.log(`Element #${idx + 1}:`);
    console.log(`  Tag: ${info.tagName}`);
    console.log(`  Class: ${info.className}`);
    console.log(`  backgroundImage: ${info.backgroundImage}`);
    console.log(`  backgroundRepeat: ${info.backgroundRepeat}`);
    console.log(`  backgroundSize: ${info.backgroundSize}`);
    console.log(`  opacity: ${info.opacity}`);
    console.log(`  mixBlendMode: ${info.mixBlendMode}`);
    console.log(`  Dimensions: ${info.clientWidth}x${info.clientHeight}`);
  });

  // Verify assertions
  if (watermarkInfo.totalFound !== 1) {
    console.error(`[FAIL] Expected exactly 1 watermark element, found ${watermarkInfo.totalFound}`);
    process.exit(1);
  }
  console.log("[PASS] Exactly 1 calligraphy watermark element exists in the Footer DOM (0 repeats).");

  const elem = watermarkInfo.elements[0];
  if (elem.backgroundRepeat !== "no-repeat") {
    console.error(`[FAIL] Expected backgroundRepeat to be 'no-repeat', got '${elem.backgroundRepeat}'`);
    process.exit(1);
  }
  console.log("[PASS] backgroundRepeat strictly evaluates to 'no-repeat'.");

  // Take screenshot of footer
  const outputDir = path.resolve(__dirname, "../verification_screenshots");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const screenshotPath = path.join(outputDir, "empirical_challenger_footer.png");
  await footer.screenshot({ path: screenshotPath });
  console.log(`Saved empirical verification screenshot to: ${screenshotPath}`);

  await browser.close();
  console.log("\n=== PLAYWRIGHT DOM & CSS WATERMARK VERIFICATION: ALL PASSED ===");
}

verifyFooterDOM().catch((err) => {
  console.error("Verification error:", err);
  process.exit(1);
});
