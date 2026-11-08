import { chromium } from 'playwright';
import fs from 'fs';

async function main() {
  const browser = await chromium.launch({ 
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' 
  });
  const page = await browser.newPage({ viewport: { width: 1200, height: 1600 } });

  const html = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,700;1,700&family=Aref+Ruqaa+Ink:wght@700&family=Aref+Ruqaa:wght@700&family=Reem+Kufi:wght@700&family=Rakkas&family=Gulzar&family=Marhey:wght@700&family=IBM+Plex+Sans+Arabic:wght@700&display=swap" rel="stylesheet">
  <style>
    body {
      background: #faf9f6;
      font-family: sans-serif;
      padding: 40px;
      direction: rtl;
    }
    .card {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      padding: 24px 32px;
      margin-bottom: 24px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    }
    .title {
      font-size: 13px;
      color: #9ca3af;
      margin-bottom: 12px;
      font-family: sans-serif;
    }
    .gold-tashkeel {
      color: #d97706;
    }
    .brand-black {
      color: #1f2937;
    }

    /* Option 1: Aref Ruqaa Ink */
    .logo-aref-ink {
      font-family: 'Aref Ruqaa Ink', serif;
      font-size: 52px;
      font-weight: 700;
      line-height: 1.2;
      letter-spacing: -1px;
    }

    /* Option 2: Amiri Classical */
    .logo-amiri {
      font-family: 'Amiri', serif;
      font-size: 56px;
      font-weight: 700;
      line-height: 1.2;
    }

    /* Option 3: Rakkas Display */
    .logo-rakkas {
      font-family: 'Rakkas', cursive;
      font-size: 52px;
      line-height: 1.2;
    }

    /* Option 4: Reem Kufi */
    .logo-reem {
      font-family: 'Reem Kufi', sans-serif;
      font-size: 48px;
      font-weight: 700;
      line-height: 1.2;
    }

    /* Option 5: Gulzar Classical Nasta'liq/Thuluth */
    .logo-gulzar {
      font-family: 'Gulzar', serif;
      font-size: 54px;
      line-height: 1.4;
    }

    /* Option 6: Styled Thuluth Lockup with Decorative Flourishes */
    .logo-composite {
      display: inline-flex;
      align-items: baseline;
      gap: 12px;
      font-family: 'Aref Ruqaa Ink', serif;
      font-size: 50px;
    }
    .sub-badge {
      font-family: 'IBM Plex Sans Arabic', sans-serif;
      font-size: 12px;
      color: #6b7280;
      font-weight: 600;
      margin-top: 4px;
    }
  </style>
</head>
<body>

  <div class="card">
    <div class="title">Waleed Mohsen Original Logo for Comparison:</div>
    <img src="file:///E:/Mt%20FlutterProject/yalaAcademy/study-buddy-sim/public/assets/waleed_sample_logo.png" style="height: 60px; width: auto;" />
  </div>

  <div class="card">
    <div class="title">Option 1: Aref Ruqaa Ink (Authentic Ruq'ah with Gold Diacritics)</div>
    <div class="logo-aref-ink brand-black">
      <span>أُسْتَاذِي</span> <span style="color: #ed6140;">عَمْرُو</span> <span>عَارِفْ</span>
    </div>
    <div class="sub-badge">لُغَةُ الضَّادِ لِلْمَرْحَلَتَيْنِ الاِبْتِدَائِيَّةِ وَالإِعْدَادِيَّةِ</div>
  </div>

  <div class="card">
    <div class="title">Option 2: Aref Ruqaa Ink (Charcoal Slate & Gold Diacritics)</div>
    <div class="logo-aref-ink brand-black">
      <span>أُسْتَاذِي</span> <span>عَمْرُو عَارِفْ</span>
    </div>
    <div class="sub-badge">أستاذ اللغة العربية للمرحلتين الابتدائية والإعدادية</div>
  </div>

  <div class="card">
    <div class="title">Option 3: Amiri Classical Calligraphy (Thuluth/Naskh Majesty)</div>
    <div class="logo-amiri brand-black">
      <span>أُسْتَاذِي</span> <span style="color: #ed6140;">عَمْرُو</span> <span>عَارِفْ</span>
    </div>
    <div class="sub-badge">لُغَةُ الضَّادِ • تَأْسِيسٌ وَبَلَاغَةٌ وَنَحْوٌ</div>
  </div>

  <div class="card">
    <div class="title">Option 4: Rakkas (Artistic Calligraphy Swash)</div>
    <div class="logo-rakkas brand-black">
      <span>أُسْتَاذِي</span> <span>عَمْرُو عَارِفْ</span>
    </div>
  </div>

  <div class="card">
    <div class="title">Option 5: Gulzar (Royal Diwani/Nasta'liq)</div>
    <div class="logo-gulzar brand-black">
      <span>أستاذي</span> <span>عمرو عارف</span>
    </div>
  </div>

</body>
</html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle' });
  await new Promise(r => setTimeout(r, 2000));

  const artifactDir = 'C:/Users/Mohamed Khaled/.gemini/antigravity/brain/20ad8002-d9bd-43a5-bcea-ac40b162210b';
  await page.screenshot({ path: `${artifactDir}/logo_options_comparison.png`, fullPage: true });
  console.log('Logo options comparison saved.');

  await browser.close();
}

main().catch(err => console.error(err));

