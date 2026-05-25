import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotDir = path.join(__dirname, 'temporary screenshots');

if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

const pages = [
  ['http://127.0.0.1:3000/', 'mob-home'],
  ['http://127.0.0.1:3000/services.html', 'mob-services'],
  ['http://127.0.0.1:3000/about.html', 'mob-about'],
  ['http://127.0.0.1:3000/locations.html', 'mob-locations'],
  ['http://127.0.0.1:3000/faqs.html', 'mob-faqs'],
  ['http://127.0.0.1:3000/contact.html', 'mob-contact'],
  ['http://127.0.0.1:3000/helpful-reads/5-levels-of-hoarding-disorder-explained.html', 'mob-article'],
  ['http://127.0.0.1:3000/bellville.html', 'mob-suburb'],
];

let n = 1;
while (fs.existsSync(path.join(screenshotDir, `screenshot-${n}-mob-home.png`))) n++;

const browser = await puppeteer.launch({
  executablePath: 'C:/Users/Windows 10/.cache/puppeteer/chrome/win64-146.0.7680.66/chrome-win64/chrome.exe',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

for (const [url, label] of pages) {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1200));
  await page.evaluate(async () => {
    const totalHeight = document.body.scrollHeight;
    for (let y = 0; y < totalHeight; y += 300) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 80));
    }
    document.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible'));
    window.scrollTo(0, 0);
    await new Promise(r => setTimeout(r, 500));
  });
  const outputPath = path.join(screenshotDir, `screenshot-${n}-${label}.png`);
  await page.screenshot({ path: outputPath, fullPage: true });
  await page.close();
  console.log(`Saved: screenshot-${n}-${label}.png`);
}

await browser.close();
console.log('All done');
