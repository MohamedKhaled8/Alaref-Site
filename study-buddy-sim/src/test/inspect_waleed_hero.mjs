import { chromium } from 'playwright';
import fs from 'fs';

async function main() {
  const browser = await chromium.launch({ 
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' 
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://www.waleed-mohsen.com/', { waitUntil: 'networkidle', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));

  const artifactDir = 'C:/Users/Mohamed Khaled/.gemini/antigravity/brain/20ad8002-d9bd-43a5-bcea-ac40b162210b';

  // Take screenshot of hero
  await page.screenshot({ path: `${artifactDir}/waleed_hero_viewport.png`, fullPage: false });

  // Get deep HTML of hero and stats
  const details = await page.evaluate(() => {
    const nav = document.querySelector('nav');
    const hero = document.querySelector('.negative-nav-margin') || document.querySelector('main > div:first-child');
    const stats = hero ? hero.nextElementSibling : null;

    return {
      nav: nav ? {
        classes: nav.className,
        html: nav.outerHTML
      } : null,
      hero: hero ? {
        classes: hero.className,
        html: hero.outerHTML
      } : null,
      stats: stats ? {
        classes: stats.className,
        html: stats.outerHTML
      } : null
    };
  });

  fs.writeFileSync(`${artifactDir}/waleed_hero_inspection.json`, JSON.stringify(details, null, 2), 'utf8');
  console.log('Saved inspection and screenshot.');
  await browser.close();
}

main().catch(err => console.error(err));

