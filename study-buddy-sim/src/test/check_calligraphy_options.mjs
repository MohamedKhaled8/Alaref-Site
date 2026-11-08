import { chromium } from 'playwright';
import fs from 'fs';

async function main() {
  const browser = await chromium.launch({ 
    headless: true, 
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' 
  });
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  
  await page.goto('https://freecalligraphygenerator.com/', { waitUntil: 'networkidle', timeout: 25000 });

  const fontOptions = await page.evaluate(() => {
    const selects = Array.from(document.querySelectorAll('select.acg-select'));
    return selects.map(s => Array.from(s.options).map(o => ({ value: o.value, text: o.text })));
  });
  console.log('Font options:', JSON.stringify(fontOptions, null, 2));

  // Type text: أستاذي عمرو عارف
  const textarea = await page.$('textarea.acg-textarea');
  if (textarea) {
    await textarea.fill('أستاذي عمرو عارف');
    await page.waitForTimeout(1500);

    // Look for canvas or svg or output element
    const output = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      const svg = document.querySelector('.acg-preview svg, .acg-canvas svg');
      return {
        hasCanvas: !!canvas,
        canvasWidth: canvas?.width,
        canvasHeight: canvas?.height,
        hasSvg: !!svg
      };
    });
    console.log('Output preview:', output);

    // Take screenshot of preview area
    await page.screenshot({ path: 'C:/Users/Mohamed Khaled/.gemini/antigravity/brain/20ad8002-d9bd-43a5-bcea-ac40b162210b/calligraphy_gen_test.png' });
  }

  await browser.close();
}

main().catch(err => console.error(err));

