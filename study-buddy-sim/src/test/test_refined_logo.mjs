import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ 
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' 
  });
  const page = await browser.newPage({ viewport: { width: 800, height: 400 } });

  const html = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Aref+Ruqaa+Ink:wght@700&family=Amiri:wght@700&display=swap" rel="stylesheet">
  <style>
    @font-face {
      font-family: 'AminBold';
      src: url('file:///E:/Mt%20FlutterProject/yalaAcademy/study-buddy-sim/public/fonts/Amin-Font-Bold.otf') format('opentype');
    }
    body {
      background: #faf9f6;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      gap: 30px;
    }
    .logo-container {
      display: flex;
      align-items: center;
      gap: 10px;
      direction: rtl;
    }
    .word-ostazi {
      font-family: 'Aref Ruqaa Ink', serif;
      font-size: 42px;
      font-weight: 700;
      color: #111827;
      letter-spacing: -0.5px;
    }
    .word-amr {
      font-family: 'Aref Ruqaa Ink', serif;
      font-size: 42px;
      font-weight: 700;
      color: #ed6140;
      letter-spacing: -0.5px;
    }
    .word-aref {
      font-family: 'Aref Ruqaa Ink', serif;
      font-size: 42px;
      font-weight: 700;
      color: #111827;
      letter-spacing: -0.5px;
    }
    .gold-star {
      color: #d97706;
      font-size: 20px;
      margin-right: 4px;
    }
  </style>
</head>
<body>

  <div class="logo-container">
    <span class="word-ostazi">أُسْتَاذِي</span>
    <span class="word-amr">عَمْرُو</span>
    <span class="word-aref">عَارِفْ</span>
    <span class="gold-star">✦</span>
  </div>

  <div class="logo-container" style="font-family: 'AminBold', sans-serif; font-size: 38px;">
    <span style="color: #111827;">أستاذي</span>
    <span style="color: #ed6140;">عمرو عارف</span>
    <span style="color: #d97706; font-size: 18px;">★</span>
  </div>

</body>
</html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'C:/Users/Mohamed Khaled/.gemini/antigravity/brain/20ad8002-d9bd-43a5-bcea-ac40b162210b/logo_refined_preview.png' });
  console.log('Saved refined preview');
  await browser.close();
}

main().catch(err => console.error(err));

