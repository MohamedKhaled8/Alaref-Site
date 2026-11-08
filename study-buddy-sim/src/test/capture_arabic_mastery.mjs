import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ 
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' 
  });

  const artifactDir = 'C:/Users/Mohamed Khaled/.gemini/antigravity/brain/20ad8002-d9bd-43a5-bcea-ac40b162210b';

  // 1. Desktop 1440px Viewport
  const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  await desktopPage.goto('http://localhost:8080', { waitUntil: 'networkidle', timeout: 25000 });
  await new Promise(r => setTimeout(r, 2000));
  await desktopPage.screenshot({ path: `${artifactDir}/final_arabic_mastery_desktop.png`, fullPage: false });
  console.log('Desktop 1440px viewport captured.');

  // Also full page desktop
  await desktopPage.screenshot({ path: `${artifactDir}/final_arabic_mastery_full.png`, fullPage: true });
  console.log('Desktop full page captured.');

  // Footer section screenshot
  const footerEl = await desktopPage.$('footer');
  if (footerEl) {
    await footerEl.screenshot({ path: `${artifactDir}/final_arabic_mastery_footer.png` });
    console.log('Footer element captured.');
  }

  // Grade cards section screenshot
  const gradesEl = await desktopPage.$('#grades');
  if (gradesEl) {
    await gradesEl.screenshot({ path: `${artifactDir}/final_arabic_mastery_grades.png` });
    console.log('GradeSelector element captured.');
  }

  // Toggle Dark Mode and capture dark view
  const themeToggle = await desktopPage.$('button[aria-label*="المظهر"], button[title*="الوضع"], button[title*="المظهر"], header button:has(svg)');
  // Let's also trigger dark mode via page evaluation
  await desktopPage.evaluate(() => {
    document.documentElement.classList.add('dark');
  });
  await new Promise(r => setTimeout(r, 600));
  await desktopPage.screenshot({ path: `${artifactDir}/final_arabic_mastery_dark.png`, fullPage: false });
  console.log('Desktop dark mode captured.');
  
  // Revert dark mode for consistency
  await desktopPage.evaluate(() => {
    document.documentElement.classList.remove('dark');
  });

  // 2. Mobile 390px Viewport
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  await mobilePage.goto('http://localhost:8080', { waitUntil: 'networkidle', timeout: 25000 });
  await new Promise(r => setTimeout(r, 2000));
  await mobilePage.screenshot({ path: `${artifactDir}/final_arabic_mastery_mobile.png`, fullPage: false });
  console.log('Mobile 390px viewport captured.');

  await browser.close();
}

main().catch(err => console.error(err));

