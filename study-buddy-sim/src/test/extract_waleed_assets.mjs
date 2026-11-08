import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function main() {
  const browser = await chromium.launch({ 
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' 
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  const downloadedAssets = [];
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('.png') || url.includes('.svg') || url.includes('.webp')) {
      downloadedAssets.push(url);
    }
  });

  await page.goto('https://www.waleed-mohsen.com/', { waitUntil: 'networkidle', timeout: 30000 });

  const pageAssets = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img')).map(i => ({ src: i.src, alt: i.alt, className: i.className }));
    const svgs = Array.from(document.querySelectorAll('svg')).map(s => ({ html: s.outerHTML.slice(0, 500) }));
    
    // Background images on sections
    const allEls = Array.from(document.querySelectorAll('*'));
    const bgImages = allEls.map(el => {
      const bg = window.getComputedStyle(el).backgroundImage;
      return bg && bg !== 'none' ? { el: el.className, bg } : null;
    }).filter(Boolean);

    // Font faces loaded
    const fonts = Array.from(document.fonts).map(f => ({ family: f.family, status: f.status }));

    return { imgs, bgImages, fonts };
  });

  fs.writeFileSync('C:/Users/Mohamed Khaled/.gemini/antigravity/brain/20ad8002-d9bd-43a5-bcea-ac40b162210b/waleed_deep_assets.json', JSON.stringify({ pageAssets, downloadedAssets }, null, 2));
  console.log('Deep assets saved.');

  await browser.close();
}

main().catch(err => console.error(err));

