import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ 
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' 
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });

  const metrics = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    const teacherImg = document.querySelector('section img');
    const bentoCards = document.querySelectorAll('div[class*=\"rounded-24\"]');
    const leaderboard = document.querySelector('#leaderboard');

    return {
      title: document.title,
      h1Text: h1?.innerText.replace(/\n/g, ' '),
      teacherImgSrc: teacherImg?.src,
      teacherImgVisible: teacherImg ? teacherImg.offsetWidth > 100 && teacherImg.offsetHeight > 100 : false,
      bentoCount: bentoCards.length,
      hasLeaderboard: !!leaderboard,
      leaderboardStudentCount: leaderboard?.querySelectorAll('.grid-cols-\\[70px_1fr_90px_90px_90px_90px_110px\\]').length || 0
    };
  });

  console.log(JSON.stringify(metrics, null, 2));
  await browser.close();
}

main().catch(err => console.error(err));

