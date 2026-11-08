import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ 
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' 
  });

  const artifactDir = 'C:/Users/Mohamed Khaled/.gemini/antigravity/brain/20ad8002-d9bd-43a5-bcea-ac40b162210b';

  // 1. Desktop 1440px
  const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  await desktopPage.goto('http://localhost:8080', { waitUntil: 'networkidle', timeout: 20000 });
  await new Promise(r => setTimeout(r, 1500));
  await desktopPage.screenshot({ path: `${artifactDir}/final_waleed_desktop.png`, fullPage: false });
  console.log('Desktop 1440px screenshot captured.');

  // Also full page desktop
  await desktopPage.screenshot({ path: `${artifactDir}/final_waleed_desktop_full.png`, fullPage: true });
  console.log('Desktop full page captured.');

  // 2. Mobile 390px
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  await mobilePage.goto('http://localhost:8080', { waitUntil: 'networkidle', timeout: 20000 });
  await new Promise(r => setTimeout(r, 1500));
  await mobilePage.screenshot({ path: `${artifactDir}/final_waleed_mobile.png`, fullPage: false });
  console.log('Mobile 390px screenshot captured.');

  await browser.close();
}

main().catch(err => console.error(err));

