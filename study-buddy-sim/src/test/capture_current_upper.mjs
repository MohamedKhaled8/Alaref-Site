import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ 
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' 
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1800 } });
  await page.goto('http://localhost:8080', { waitUntil: 'networkidle', timeout: 20000 });
  await new Promise(r => setTimeout(r, 1000));

  const artifactDir = 'C:/Users/Mohamed Khaled/.gemini/antigravity/brain/20ad8002-d9bd-43a5-bcea-ac40b162210b';
  await page.screenshot({ path: `${artifactDir}/current_upper_half_check.png`, fullPage: false });
  console.log('Upper half screenshot captured.');
  await browser.close();
}

main().catch(err => console.error(err));

