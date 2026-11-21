const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

async function run() {
  const PORT = 8092;
  console.log(`Starting preview server on port ${PORT}...`);
  const previewProcess = spawn('npx.cmd', ['vite', 'preview', '--port', String(PORT), '--host', '127.0.0.1'], {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'pipe',
    shell: true
  });

  previewProcess.stdout.on('data', (d) => process.stdout.write(d.toString()));
  previewProcess.stderr.on('data', (d) => process.stderr.write(d.toString()));

  // Wait for server to be up
  let ready = false;
  for (let i = 0; i < 40; i++) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(`http://127.0.0.1:${PORT}/`, (res) => {
          if (res.statusCode === 200) resolve();
          else reject(new Error('Status ' + res.statusCode));
        });
        req.on('error', reject);
        req.setTimeout(1500, () => { req.destroy(); reject(new Error('timeout')); });
      });
      ready = true;
      break;
    } catch (e) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  if (!ready) {
    console.error('Preview server failed to start');
    previewProcess.kill();
    process.exit(1);
  }

  console.log('Preview server is ready! Launching browser...');
  let browser;
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
  } catch (e) {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
  }

  const screenshotsDir = path.resolve(__dirname, '../snapshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  // 1. Desktop 1440px
  const page1440 = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    locale: 'ar-EG'
  });
  await page1440.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'load', timeout: 30000 });
  await page1440.waitForTimeout(2000);
  await page1440.screenshot({ path: path.join(screenshotsDir, 'desktop_1440_fixed.png'), fullPage: false });
  console.log('Captured desktop_1440_fixed.png');

  // Header close-up
  const headerEl = await page1440.$('header');
  if (headerEl) {
    await headerEl.screenshot({ path: path.join(screenshotsDir, 'header_fixed.png') });
    console.log('Captured header_fixed.png');
  }

  // Hero close-up
  const heroEl = await page1440.$('#hero');
  if (heroEl) {
    await heroEl.screenshot({ path: path.join(screenshotsDir, 'hero_fixed.png') });
    console.log('Captured hero_fixed.png');
  }

  // 2. Desktop 1280px
  await page1440.setViewportSize({ width: 1280, height: 800 });
  await page1440.waitForTimeout(1000);
  await page1440.screenshot({ path: path.join(screenshotsDir, 'desktop_1280_fixed.png'), fullPage: false });
  console.log('Captured desktop_1280_fixed.png');

  // 3. Mobile 390px
  await page1440.setViewportSize({ width: 390, height: 844 });
  await page1440.waitForTimeout(1000);
  await page1440.screenshot({ path: path.join(screenshotsDir, 'mobile_390_fixed.png'), fullPage: false });
  console.log('Captured mobile_390_fixed.png');

  // 4. Dark Mode Desktop
  await page1440.setViewportSize({ width: 1440, height: 900 });
  await page1440.evaluate(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme-mode', 'dark');
  });
  await page1440.waitForTimeout(1000);
  await page1440.screenshot({ path: path.join(screenshotsDir, 'dark_1440_fixed.png'), fullPage: false });
  console.log('Captured dark_1440_fixed.png');

  // 5. Dark Mode Mobile
  await page1440.setViewportSize({ width: 390, height: 844 });
  await page1440.waitForTimeout(600);
  await page1440.screenshot({ path: path.join(screenshotsDir, 'dark_mobile_390_fixed.png'), fullPage: false });
  console.log('Captured dark_mobile_390_fixed.png');

  await browser.close();
  previewProcess.kill();
  console.log('All verification snapshots captured successfully!');
  process.exit(0);
}

run().catch((err) => {
  console.error('Error in verification:', err);
  process.exit(1);
});
