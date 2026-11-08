import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });

  const artifactDir = 'C:/Users/Mohamed Khaled/.gemini/antigravity/brain/125872c7-84a9-46cd-8ae6-5b2affccacf9';
  
  // Full page screenshot
  await page.screenshot({ path: `${artifactDir}/live_inspect_full.png`, fullPage: true });

  // Get all sections
  const sections = await page.$$('section');
  for (let i = 0; i < sections.length; i++) {
    await sections[i].screenshot({ path: `${artifactDir}/live_inspect_section_${i}.png` });
  }

  await browser.close();
  console.log(`Captured ${sections.length} sections and full page.`);
}

main().catch(console.error);
