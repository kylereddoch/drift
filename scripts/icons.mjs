import { chromium } from '@playwright/test';
import { readFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
const svg = await readFile('extension/icons/drift.svg', 'utf8');
const browser = await chromium.launch({ channel: 'chromium', headless: true });
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  await mkdir('extension/icons', { recursive: true });
  for (const size of [16, 32, 48, 128]) {
    await page.setViewportSize({ width: size, height: size });
    // The store's square-icon guidance calls for 96px artwork plus 16px padding.
    const artworkSize = size === 128 ? 96 : size;
    const padding = size === 128 ? 16 : 0;
    await page.setContent(`<html><body style="margin:0;padding:${padding}px">${svg.replace('width="128" height="128"', `width="${artworkSize}" height="${artworkSize}"`)}</body></html>`);
    await page.screenshot({ path: resolve(`extension/icons/${size}.png`), omitBackground: true });
  }
} finally { await browser.close(); }
console.log('Generated 16, 32, 48, and 128px icons from the original SVG.');
