import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotDir = path.join(__dirname, 'temporary screenshots');
if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });
const label = process.argv[3] || 'mobile';
let n = 1;
while (fs.existsSync(path.join(screenshotDir, `screenshot-${n}-${label}.png`))) n++;
const outputPath = path.join(screenshotDir, `screenshot-${n}-${label}.png`);
const browser = await puppeteer.launch({
  executablePath: 'C:/Users/Windows 10/.cache/puppeteer/chrome/win64-146.0.7680.66/chrome-win64/chrome.exe',
  userDataDir: path.join(os.tmpdir(), 'puppeteer_mobile_' + Date.now()),
  args: ['--no-sandbox','--disable-setuid-sandbox','--no-proxy-server','--disable-dev-shm-usage','--disable-extensions'],
});
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const url = process.argv[2] || 'http://127.0.0.1:3000/';
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
await new Promise(r => setTimeout(r, 1200));
await page.screenshot({ path: outputPath, fullPage: true });
await browser.close();
console.log('Saved: ' + outputPath);
