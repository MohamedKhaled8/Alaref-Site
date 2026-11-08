import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ 
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' 
  });
  const page = await browser.newPage({ viewport: { width: 1200, height: 1800 } });

  const html = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Aref+Ruqaa+Ink:wght@700&family=Amiri:wght@700&family=Gulzar&family=Rakkas&display=swap" rel="stylesheet">
  <style>
    @font-face {
      font-family: 'AminBold';
      src: url('file:///E:/Mt%20FlutterProject/yalaAcademy/study-buddy-sim/public/fonts/Amin-Font-Bold.otf') format('opentype');
    }
    @font-face {
      font-family: 'VIPHALA';
      src: url('file:///E:/Mt%20FlutterProject/yalaAcademy/study-buddy-sim/public/fonts/VIPHALA.otf') format('opentype');
    }
    @font-face {
      font-family: 'SomarBold';
      src: url('file:///E:/Mt%20FlutterProject/yalaAcademy/study-buddy-sim/public/fonts/Somar-Bold.otf') format('opentype');
    }

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
    .logo-img {
      height: 60px;
    }
    .waleed-comparison {
      border: 2px dashed #f59e0b;
      background: #fffbeb;
    }
  </style>
</head>
<body>

  <div class="card waleed-comparison">
    <div class="title">Waleed Mohsen Original Logo (Benchmark):</div>
    <img src="file:///E:/Mt%20FlutterProject/yalaAcademy/study-buddy-sim/public/assets/waleed_sample_logo.png" style="height: 60px;" />
  </div>

  <div class="card">
    <div class="title">Option A: VIPHALA (from Waleed Mohsen's server!)</div>
    <div style="font-family: 'VIPHALA', sans-serif; font-size: 48px; color: #111827;">
      أستاذي عمرو عارف
    </div>
  </div>

  <div class="card">
    <div class="title">Option B: Amin Bold (from Waleed Mohsen's server!)</div>
    <div style="font-family: 'AminBold', sans-serif; font-size: 44px; color: #111827;">
      أستاذي <span style="color: #ed6140;">عمرو عارف</span>
    </div>
  </div>

  <div class="card">
    <div class="title">Option C: Somar Bold (from Waleed Mohsen's server!)</div>
    <div style="font-family: 'SomarBold', sans-serif; font-size: 44px; color: #111827;">
      أستاذي عمرو عارف
    </div>
  </div>

  <div class="card">
    <div class="title">Option D: Aref Ruqaa Ink (Classic Calligraphy)</div>
    <div style="font-family: 'Aref Ruqaa Ink', serif; font-size: 50px; color: #111827;">
      أُسْتَاذِي <span style="color: #ed6140;">عَمْرُو</span> عَارِفْ
    </div>
  </div>

  <div class="card">
    <div class="title">Option E: Composite Calligraphy Lockup with Gold Tashkeel (Like Waleed)</div>
    <div style="display: flex; align-items: center; gap: 12px;">
      <span style="font-family: 'Aref Ruqaa Ink', serif; font-size: 46px; color: #111827;">أُسْتَاذِي</span>
      <span style="font-family: 'VIPHALA', sans-serif; font-size: 42px; color: #ed6140;">عَمْرُو عَارِف</span>
      <span style="font-size: 24px; color: #d97706;">✦</span>
    </div>
  </div>

</body>
</html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle' });
  await new Promise(r => setTimeout(r, 2000));

  const artifactDir = 'C:/Users/Mohamed Khaled/.gemini/antigravity/brain/20ad8002-d9bd-43a5-bcea-ac40b162210b';
  await page.screenshot({ path: `${artifactDir}/local_font_options.png`, fullPage: true });
  console.log('Saved local font options.');

  await browser.close();
}

main().catch(err => console.error(err));

