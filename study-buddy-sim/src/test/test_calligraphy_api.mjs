import { chromium } from 'playwright';
import fs from 'fs';

async function main() {
  const browser = await chromium.launch({ 
    headless: true, 
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' 
  });
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to freecalligraphygenerator.com...');
    await page.goto('https://freecalligraphygenerator.com/', { waitUntil: 'networkidle', timeout: 20000 });
    
    // Check page title and inputs
    const title = await page.title();
    console.log('Title:', title);

    // Look for text input
    const inputs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('input, textarea, select')).map(el => ({
        tag: el.tagName,
        type: el.type,
        placeholder: el.placeholder,
        id: el.id,
        name: el.name,
        className: el.className
      }));
    });
    console.log('Inputs found:', inputs);

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await browser.close();
  }
}

main().catch(err => console.error(err));

