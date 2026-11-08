import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ 
    headless: true, 
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' 
  });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://arabiccalligraphymaker.com/', { waitUntil: 'networkidle', timeout: 20000 });
    console.log('Title:', await page.title());
    const fonts = await page.evaluate(() => {
      const selects = Array.from(document.querySelectorAll('select'));
      return selects.map(s => Array.from(s.options).map(o => o.text));
    });
    console.log('Fonts:', fonts);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await browser.close();
  }
}

main().catch(err => console.error(err));

