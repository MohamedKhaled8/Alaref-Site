import { chromium } from 'playwright';

async function test() {
  const browser = await chromium.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const grades = await page.$('#grades');
  if (grades) {
    const box = await grades.boundingBox();
    console.log('Grades box:', box);
    const imgs = await grades.$$eval('img', els => els.map(e => ({ 
      src: e.src, 
      complete: e.complete, 
      naturalWidth: e.naturalWidth, 
      naturalHeight: e.naturalHeight, 
      display: window.getComputedStyle(e).display 
    })));
    console.log('Images inside #grades:', imgs);
    
    const motions = await grades.$$eval('.cursor-pointer', els => els.map(e => ({ 
      opacity: window.getComputedStyle(e).opacity, 
      transform: window.getComputedStyle(e).transform, 
      display: window.getComputedStyle(e).display,
      box: e.getBoundingClientRect()
    })));
    console.log('Motion items styles:', motions);
  } else {
    console.log('#grades NOT FOUND');
  }

  await browser.close();
}

test().catch(console.error);

