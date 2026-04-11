import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotDir = path.join(__dirname, 'temporary screenshots');

if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';

// Find next available screenshot number
let n = 1;
while (fs.existsSync(path.join(screenshotDir, label ? `screenshot-${n}-${label}.png` : `screenshot-${n}.png`))) {
  n++;
}
const filename = label ? `screenshot-${n}-${label}.png` : `screenshot-${n}.png`;
const outputPath = path.join(screenshotDir, filename);

const browser = await puppeteer.launch({
  executablePath: 'C:/Users/Windows 10/.cache/puppeteer/chrome/win64-146.0.7680.66/chrome-win64/chrome.exe',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url.replace('localhost', '127.0.0.1'), { waitUntil: 'domcontentloaded', timeout: 30000 });
await new Promise(r => setTimeout(r, 1000));
// Scroll through to trigger IntersectionObserver animations
await page.evaluate(async () => {
  const totalHeight = document.body.scrollHeight;
  for (let y = 0; y < totalHeight; y += 300) {
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 120));
  }
  // Force all fade-up elements visible
  document.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible'));
  window.scrollTo(0, 0);
  await new Promise(r => setTimeout(r, 800));
});
await page.screenshot({ path: outputPath, fullPage: true });
await browser.close();

console.log(`Screenshot saved: ${outputPath}`);
