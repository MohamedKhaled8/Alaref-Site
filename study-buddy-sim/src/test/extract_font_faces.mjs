import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ 
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' 
  });
  const page = await browser.newPage();
  
  await page.goto('https://www.waleed-mohsen.com/', { waitUntil: 'networkidle', timeout: 20000 });

  const fontFaces = await page.evaluate(() => {
    const rules = [];
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        for (const rule of Array.from(sheet.cssRules || [])) {
          if (rule instanceof CSSFontFaceRule) {
            rules.push({
              family: rule.style.fontFamily,
              src: rule.style.src
            });
          }
        }
      } catch (e) {}
    }
    return rules;
  });

  console.log('Font faces in Waleed Mohsen:', JSON.stringify(fontFaces, null, 2));
  await browser.close();
}

main().catch(err => console.error(err));

