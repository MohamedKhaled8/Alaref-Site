import { chromium } from 'playwright';
import fs from 'fs';

async function main() {
  console.log('Launching browser to reverse-engineer https://www.waleed-mohsen.com/...');
  const browser = await chromium.launch({ 
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' 
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 3500 } });
  
  await page.goto('https://www.waleed-mohsen.com/', { waitUntil: 'networkidle', timeout: 35000 });
  await new Promise(r => setTimeout(r, 2000));

  const artifactDir = 'C:/Users/Mohamed Khaled/.gemini/antigravity/brain/20ad8002-d9bd-43a5-bcea-ac40b162210b';
  await page.screenshot({ path: `${artifactDir}/waleed_mohsen_full.png`, fullPage: true });
  console.log('Full screenshot captured.');

  const structure = await page.evaluate(() => {
    function getCss(el) {
      if (!el) return {};
      const cs = window.getComputedStyle(el);
      return {
        bg: cs.backgroundColor,
        color: cs.color,
        font: cs.fontFamily,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        border: cs.border,
        radius: cs.borderRadius,
        padding: cs.padding,
        shadow: cs.boxShadow
      };
    }

    const header = document.querySelector('header') || document.querySelector('nav') || document.querySelector('.navbar');
    const sections = Array.from(document.querySelectorAll('section, main > div, div[class*="hero"], div[class*="Hero"]')).slice(0, 10).map((s, idx) => ({
      index: idx,
      className: s.className,
      id: s.id,
      textPreview: s.innerText.slice(0, 150).replace(/\s+/g, ' '),
      styles: getCss(s)
    }));

    const images = Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      alt: img.alt,
      w: img.naturalWidth || img.width,
      h: img.naturalHeight || img.height,
      class: img.className
    })).filter(i => i.w > 40);

    const buttons = Array.from(document.querySelectorAll('button, a')).filter(b => {
      const t = b.innerText.trim();
      return t && t.length < 30;
    }).slice(0, 20).map(b => ({
      text: b.innerText.trim(),
      styles: getCss(b)
    }));

    return {
      bodyBg: window.getComputedStyle(document.body).backgroundColor,
      header: {
        text: header ? header.innerText.replace(/\s+/g, ' ') : '',
        styles: getCss(header)
      },
      sections,
      images,
      buttons
    };
  });

  fs.writeFileSync(`${artifactDir}/waleed_structure.json`, JSON.stringify(structure, null, 2), 'utf8');
  console.log('Structure saved to JSON!');
  await browser.close();
}

main().catch(err => console.error(err));

