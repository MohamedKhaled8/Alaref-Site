import fs from 'fs';
import https from 'https';
import path from 'path';

const assetsToDownload = [
  {
    url: 'https://www.waleed-mohsen.com/static/media/bg-star.ded6d80ba8e5f7be67af.png',
    dest: 'study-buddy-sim/public/assets/waleed_calligraphy_bg.png'
  },
  {
    url: 'https://www.waleed-mohsen.com/static/media/textDecore.cd9e389367b85ba3f471.png',
    dest: 'study-buddy-sim/public/assets/waleed_text_decore.png'
  },
  {
    url: 'https://www.waleed-mohsen.com/static/media/arrowsIcon.8589287a7599165772d40e680d7df19a.svg',
    dest: 'study-buddy-sim/public/assets/waleed_arrow.svg'
  },
  {
    url: 'https://www.waleed-mohsen.com/static/media/logolight.45767f56a28401ba291a.png',
    dest: 'study-buddy-sim/public/assets/waleed_sample_logo.png'
  }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${url} -> ${dest}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      console.error(`Error downloading ${url}:`, err.message);
      reject(err);
    });
  });
}

async function run() {
  for (const item of assetsToDownload) {
    try {
      await download(item.url, item.dest);
    } catch (e) {
      console.error(e);
    }
  }
}

run();

