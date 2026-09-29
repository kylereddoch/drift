import { chromium, expect } from '@playwright/test';
import { copyFile, mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { join, resolve, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { unzipSync } from 'fflate';

// Render the packaged extension in an isolated profile, never a personal browser.
const manifest = JSON.parse(await readFile('extension/manifest.json', 'utf8'));
const version = manifest.version;
const out = resolve(`dist/chrome-web-store-${version}`);
const archivePath = `dist/drift-${version}.zip`;
const archive = await readFile(archivePath);
const files = unzipSync(archive);
assert.equal(JSON.parse(new TextDecoder().decode(files['manifest.json'])).version, version);
await mkdir('.cache', { recursive: true });
const extension = await mkdtemp(resolve('.cache/store-extension-'));
for (const [name, bytes] of Object.entries(files)) {
  assert.ok(!name.includes('..') && !name.startsWith('/') && !name.includes('\\'), 'Unsafe ZIP path');
  const destination = join(extension, name);
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, bytes);
}
await mkdir(out, { recursive: true });
await copyFile(archivePath, join(out, `drift-${version}.zip`));
await copyFile(join(extension, 'icons/128.png'), join(out, 'icon-128.png'));
await copyFile('docs/STORE-LISTING.md', join(out, 'START-HERE.md'));
const context = await chromium.launchPersistentContext('', {
  channel: 'chromium', headless: true, colorScheme: 'light',
  viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1,
  args: [`--disable-extensions-except=${extension}`, `--load-extension=${extension}`],
});
const images = [];
async function screenshot(page, name, width = 1280, height = 800) {
  await page.setViewportSize({ width, height });
  await page.evaluate(() => document.fonts.ready);
  const bytes = await page.screenshot({ path: join(out, name), animations: 'disabled' });
  assert.equal(bytes.readUInt32BE(16), width);
  assert.equal(bytes.readUInt32BE(20), height);
  // Chromium's opaque PNG screenshots have no alpha channel.
  assert.equal(bytes[25], 2, `${name}: expected RGB PNG without alpha`);
  images.push({ file: name, width, height, bytes: bytes.length });
}
try {
  // No screenshot requires a network request or contact with a real server.
  await context.route(/^https?:\/\//, route => route.abort());
  const worker = context.serviceWorkers()[0] ?? await context.waitForEvent('serviceworker');
  const base = `chrome-extension://${new URL(worker.url()).host}`;
  await worker.evaluate(() => chrome.storage.local.set({ settings: {
    servers: ['https://mastodon.social', 'https://infosec.exchange'],
    defaultServer: 'https://mastodon.social', includeTitle: true, cleanLinks: true,
  } }));
  const welcome = await context.newPage();
  await welcome.goto(`${base}/welcome.html`);
  await expect(welcome.getByRole('radio', { name: 'mastodon.social', exact: true })).toBeChecked();
  const draftOpened = context.waitForEvent('page');
  await welcome.evaluate(async () => {
    const { openContextDraft } = await import(chrome.runtime.getURL('lib/context.js'));
    await openContextDraft({ menuItemId: 'drift-selection', pageUrl: 'https://news.example/a-good-find?utm_source=newsletter', selectionText: 'Sometimes the most useful thing you can do with a good idea is share it.' }, { title: 'The web is better when we pass things along.' });
  });
  const draft = await draftOpened;
  const expectedDraft = '“Sometimes the most useful thing you can do with a good idea is share it.”\n\nThe web is better when we pass things along.\n\nhttps://news.example/a-good-find';
  await expect(draft.getByRole('textbox', { name: 'Post text' })).toHaveValue(expectedDraft);
  await expect(draft.getByRole('button', { name: 'Continue to Mastodon' })).toBeEnabled();
  await draft.emulateMedia({ colorScheme: 'light' });
  await screenshot(draft, 'screenshot-01-draft-light.png');
  await draft.emulateMedia({ colorScheme: 'dark' });
  await screenshot(draft, 'screenshot-02-draft-dark.png');
  await welcome.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
  await screenshot(welcome, 'screenshot-03-welcome.png');
  await welcome.locator('#setup').evaluate(el => window.scrollTo(0, el.offsetTop - 28));
  await screenshot(welcome, 'screenshot-04-servers-and-guide.png');
  await welcome.locator('.details-grid').evaluate(el => window.scrollTo(0, el.offsetTop - 28));
  await screenshot(welcome, 'screenshot-05-help-and-support.png');
  const promo = await context.newPage();
  await promo.goto(pathToFileURL(resolve('store/promo.html')).href);
  await screenshot(promo, 'promo-small-440x280.png', 440, 280);
  await screenshot(promo, 'promo-marquee-1400x560.png', 1400, 560);
} finally {
  await context.close();
}
const sha256 = createHash('sha256').update(archive).digest('hex');
await writeFile(join(out, 'SHA256SUMS.txt'), `${sha256}  drift-${version}.zip\n`);
await writeFile(join(out, 'asset-manifest.json'), JSON.stringify({ version, extension: { file: `drift-${version}.zip`, sha256, bytes: archive.length, files: Object.keys(files).length }, images }, null, 2) + '\n');
console.log(`Store kit: ${out}\nZIP: ${archive.length} bytes, ${Object.keys(files).length} files\nSHA-256: ${sha256}\n${images.length} correctly sized RGB images plus transparent store icon.`);
