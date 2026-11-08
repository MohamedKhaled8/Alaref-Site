import fs from 'fs';
import https from 'https';
import path from 'path';

const fonts = [
  {
    url: 'https://www.waleed-mohsen.com/static/media/Amin-Font-Bold.abffa5d24ba5690d788a.otf',
    dest: 'study-buddy-sim/public/fonts/Amin-Font-Bold.otf'
  },
  {
    url: 'https://www.waleed-mohsen.com/static/media/Amin-Font-Medium_0.c7523110f62aead99f01.otf',
    dest: 'study-buddy-sim/public/fonts/Amin-Font-Medium.otf'
  },
  {
    url: 'https://www.waleed-mohsen.com/static/media/VIPHALA.2c9fe0fb114294e25646.otf',
    dest: 'study-buddy-sim/public/fonts/VIPHALA.otf'
  },
  {
    url: 'https://www.waleed-mohsen.com/static/media/ArbFONTS-Somar-Bold.0dbc68e097a11558a290.otf',
    dest: 'study-buddy-sim/public/fonts/Somar-Bold.otf'
  },
  {
    url: 'https://www.waleed-mohsen.com/static/media/fs-albert-700.448aac52cdcfee46b941.ttf',
    dest: 'study-buddy-sim/public/fonts/FS-Albert-Bold.ttf'
  }
];

if (!fs.existsSync('study-buddy-sim/public/fonts')) {
  fs.mkdirSync('study-buddy-sim/public/fonts', { recursive: true });
}

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
      console.error(`Error:`, err.message);
      reject(err);
    });
  });
}

async function run() {
  for (const f of fonts) {
    try {
      await download(f.url, f.dest);
    } catch (e) {}
  }
}

run();

