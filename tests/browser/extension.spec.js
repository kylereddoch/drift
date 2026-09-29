import { test, expect, chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { resolve } from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';

let context;
let worker;
let extensionId;
let base;

async function popupSession(cdp, targetId) {
  const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: false });
  let nextId = 0;
  return {
    async send(method, params = {}) {
      const id = ++nextId;
      return new Promise((resolveResult, reject) => {
        const cleanup = () => { clearTimeout(timer); cdp.off('Target.receivedMessageFromTarget', handler); };
        const timer = setTimeout(() => { cleanup(); reject(new Error(`Popup CDP timeout: ${method}`)); }, 5000);
        const handler = event => {
          if (event.sessionId !== sessionId) return;
          const message = JSON.parse(event.message);
          if (message.id !== id) return;
          cleanup();
          if (message.error) reject(new Error(message.error.message)); else resolveResult(message.result);
        };
        cdp.on('Target.receivedMessageFromTarget', handler);
        cdp.send('Target.sendMessageToTarget', { sessionId, message: JSON.stringify({ id, method, params }) }).catch(error => { cleanup(); reject(error); });
      });
    },
    detach: () => cdp.send('Target.detachFromTarget', { sessionId }),
  };
}

test.beforeAll(async () => {
  const extension = resolve('extension');
  context = await chromium.launchPersistentContext('', {
    channel: 'chromium', headless: true, colorScheme: 'light',
    args: [`--disable-extensions-except=${extension}`, `--load-extension=${extension}`, '--enable-unsafe-extension-debugging', '--screen-info={1600x1200}', '--window-size=1440,1100'],
  });
  worker = context.serviceWorkers()[0] ?? await context.waitForEvent('serviceworker');
  extensionId = new URL(worker.url()).host;
  base = `chrome-extension://${extensionId}`;
  // No test request reaches a Mastodon account or posts real content.
  await context.route('https://*.example/**', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Mastodon handoff test</title><h1>Test composer</h1>' }));
});
test.afterAll(async () => { await context?.close(); });
test.beforeEach(async ({}, info) => {
  await worker.evaluate(async isFirst => {
    await chrome.storage.session.clear();
    await chrome.storage.local.set({ settings: { servers: isFirst ? [] : ['https://social.example'], defaultServer: isFirst ? '' : 'https://social.example', includeTitle: true, cleanLinks: true } });
  }, info.title.startsWith('first install'));
});

test('first install opens welcome; server validation, persistence, defaults, removal, and preferences', async () => {
  await expect.poll(() => context.pages().some(page => page.url().endsWith('/welcome.html'))).toBe(true);
  const page = context.pages().find(page => page.url().endsWith('/welcome.html'));
  await expect(page.getByRole('heading', { name: 'A good find. A new conversation.' })).toBeVisible();
  await page.getByLabel('Mastodon server', { exact: true }).fill('http://unsafe.example');
  await page.getByRole('button', { name: 'Add server', exact: true }).click();
  await expect(page.getByRole('status').first()).toContainText('HTTPS');
  await page.getByLabel('Mastodon server', { exact: true }).fill('social.example');
  await page.getByRole('button', { name: 'Add server', exact: true }).click();
  await expect(page.getByRole('radio', { name: 'social.example', exact: true })).toBeChecked();
  await page.getByLabel('Mastodon server', { exact: true }).fill('second.example');
  await page.getByRole('button', { name: 'Add server', exact: true }).click();
  await page.getByRole('radio', { name: 'second.example', exact: true }).check();
  await expect(page.getByRole('status').first()).toContainText('Default server saved');
  await page.reload();
  await expect(page.getByRole('radio', { name: 'second.example', exact: true })).toBeChecked();
  await page.getByRole('button', { name: 'Remove second.example' }).click();
  await expect(page.getByRole('radio', { name: 'social.example', exact: true })).toBeChecked();
  await page.getByLabel('Include the page title').uncheck();
  await expect(page.getByRole('status').first()).toContainText('Preference saved');
  await page.reload();
  await expect(page.getByLabel('Include the page title')).not.toBeChecked();
  await page.getByLabel('Include the page title').check();
  await expect(page.getByRole('status').first()).toContainText('Preference saved');
});

test('context draft edits, cleanup reversal, recovery, copy, and encoded Mastodon handoff', async () => {
  const id = '00000000-0000-4000-8000-000000000001';
  const source = { title: 'A better kind of web', selection: 'Small communities make room for good conversations.', url: 'https://news.example/story?id=42&utm_source=email#read' };
  await worker.evaluate(async ({ id, source }) => { await chrome.storage.session.set({ [`draft:context:${id}`]: { source } }); }, { id, source });
  const page = await context.newPage();
  await page.goto(`${base}/popup.html?draft=${id}`);
  const text = page.getByRole('textbox', { name: 'Post text' });
  await expect(text).toHaveValue(`${source.title}\n\n“${source.selection}”\n\nhttps://news.example/story?id=42#read`);
  await expect(page.getByText('Passage included', { exact: true })).toBeVisible();
  await page.getByLabel('Remove known tracking tags', { exact: true }).uncheck();
  await expect(text).toHaveValue(`${source.title}\n\n“${source.selection}”\n\n${source.url}`);
  await text.fill(`${await text.inputValue()}\n\nMy own thoughts & #OpenWeb 🐘`);
  const draft = await text.inputValue();
  await expect.poll(async () => worker.evaluate(async id => (await chrome.storage.session.get(`draft:context:${id}`))[`draft:context:${id}`].text, id)).toBe(draft);
  await page.reload();
  await expect(text).toHaveValue(draft);
  const handoff = context.waitForEvent('page');
  await page.getByRole('button', { name: 'Continue to Mastodon' }).click();
  const mastodon = await handoff;
  await mastodon.waitForURL('https://social.example/share?*');
  expect(new URL(mastodon.url()).searchParams.get('text')).toBe(draft);
  await mastodon.close();
  await page.bringToFront();
  await page.getByRole('button', { name: 'Copy', exact: true }).click();
  await expect(page.getByRole('status')).toContainText(/Copied|draft is selected/);
  await page.close();
});

test('real toolbar gesture captures the highlighted passage and opens the extension popup', async () => {
  const article = await context.newPage();
  await article.route('https://article.example/**', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><html lang="en"><title>The quiet web</title><body><h1>The quiet web</h1><p id="passage">Worth reading. Worth passing along.</p><p>Leave this part out.</p></body></html>' }));
  await article.goto('https://article.example/story?utm_source=test');
  await article.evaluate(() => { const range = document.createRange(); range.selectNodeContents(document.getElementById('passage')); const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); });
  await article.bringToFront();
  const tabId = await worker.evaluate(async () => (await chrome.tabs.query({ active: true, currentWindow: true }))[0].id);
  const browserCdp = await context.browser().newBrowserCDPSession();
  const targets = await browserCdp.send('Target.getTargets', { filter: [{ type: 'tab', exclude: false }, { exclude: true }] });
  const target = targets.targetInfos.find(item => item.url === article.url());
  expect(target, JSON.stringify(targets)).toBeTruthy();
  await browserCdp.send('Extensions.triggerAction', { id: extensionId, targetId: target.targetId });
  // Chrome exposes a toolbar popup as an extension target, not a Playwright Page.
  await expect.poll(async () => worker.evaluate(() => chrome.runtime.getContexts({ contextTypes: ['POPUP'] }))).not.toEqual([]);
  await expect.poll(async () => worker.evaluate(async id => (await chrome.storage.session.get(`draft:tab:${id}`))[`draft:tab:${id}`]?.text, tabId)).toBe('The quiet web\n\n“Worth reading. Worth passing along.”\n\nhttps://article.example/story');
  const popupTargets = await browserCdp.send('Target.getTargets', { filter: [{}] });
  const popupTarget = popupTargets.targetInfos.find(item => item.url === `${base}/popup.html`);
  expect(popupTarget).toBeTruthy();
  const session = await popupSession(browserCdp, popupTarget.targetId);
  const view = await session.send('Runtime.evaluate', { expression: '({ text: document.querySelector("#post").value, height: document.body.scrollHeight, width: document.body.scrollWidth })', returnByValue: true });
  expect(view.result.value.text).toBe('The quiet web\n\n“Worth reading. Worth passing along.”\n\nhttps://article.example/story');
  expect(view.result.value.height).toBeLessThanOrEqual(600);
  expect(view.result.value.width).toBe(430);
  await expect.poll(async () => (await session.send('Runtime.evaluate', { expression: 'document.querySelector(".composer-footer").getBoundingClientRect().bottom <= innerHeight', returnByValue: true })).result.value).toBe(true);
  await mkdir('test-results/screenshots', { recursive: true });
  const shot = await session.send('Page.captureScreenshot', { captureBeyondViewport: false, clip: { x: 0, y: 0, width: 430, height: 600, scale: 1 } });
  await writeFile('test-results/screenshots/toolbar-popup.png', Buffer.from(shot.data, 'base64'));
  await session.send('Runtime.evaluate', { expression: 'document.querySelector("#post").value = "Edited toolbar draft"; document.querySelector("#post").dispatchEvent(new Event("input", {bubbles:true}));' });
  await expect.poll(async () => worker.evaluate(async id => (await chrome.storage.session.get(`draft:tab:${id}`))[`draft:tab:${id}`]?.text, tabId)).toBe('Edited toolbar draft');
  await session.detach();
  await browserCdp.send('Target.closeTarget', { targetId: popupTarget.targetId });
  await article.bringToFront();
  await browserCdp.send('Extensions.triggerAction', { id: extensionId, targetId: target.targetId });
  await expect.poll(async () => worker.evaluate(() => chrome.runtime.getContexts({ contextTypes: ['POPUP'] }))).not.toEqual([]);
  const reopenedTargets = await browserCdp.send('Target.getTargets', { filter: [{}] });
  const reopened = reopenedTargets.targetInfos.find(item => item.url === `${base}/popup.html`);
  const reopenedSession = await popupSession(browserCdp, reopened.targetId);
  await expect.poll(async () => (await reopenedSession.send('Runtime.evaluate', { expression: 'document.querySelector("#post")?.value', returnByValue: true })).result.value).toBe('Edited toolbar draft');
  await reopenedSession.detach();
  await browserCdp.send('Target.closeTarget', { targetId: reopened.targetId });
  await article.close();
  await expect.poll(async () => worker.evaluate(async id => (await chrome.storage.session.get(`draft:tab:${id}`))[`draft:tab:${id}`], tabId)).toBeUndefined();
});

test('context action opens a separate draft, supports server changes, and cleans up when closed', async () => {
  const caller = await context.newPage();
  await caller.goto(`${base}/welcome.html`);
  const opened = context.waitForEvent('page');
  await caller.evaluate(async () => {
    const { openContextDraft } = await import(chrome.runtime.getURL('lib/context.js'));
    await openContextDraft({ menuItemId: 'drift-selection', pageUrl: 'https://news.example/context', selectionText: 'A selected passage.' }, { title: 'Context article' });
  });
  const page = await opened;
  await expect(page.getByRole('textbox', { name: 'Post text' })).toHaveValue('Context article\n\n“A selected passage.”\n\nhttps://news.example/context');
  const id = new URL(page.url()).searchParams.get('draft');
  await worker.evaluate(() => chrome.storage.local.set({ settings: { servers: ['https://social.example', 'https://other.example'], defaultServer: 'https://social.example' } }));
  await page.getByLabel('Share to', { exact: true }).selectOption('https://other.example');
  const handoff = context.waitForEvent('page');
  await page.getByRole('button', { name: 'Continue to Mastodon' }).click();
  const destination = await handoff;
  await destination.waitForURL('https://other.example/share?*');
  await destination.close();
  await page.close();
  await expect.poll(async () => worker.evaluate(async id => (await chrome.storage.session.get(`draft:context:${id}`))[`draft:context:${id}`], id)).toBeUndefined();
  await caller.close();
});

test('welcome and composer are accessible in both themes and narrow layouts', async () => {
  await worker.evaluate(async () => chrome.storage.session.set({ 'draft:context:00000000-0000-4000-8000-000000000001': { source: { title: 'A better kind of web', selection: 'Small communities make room for good conversations.', url: 'https://news.example/story' } } }));
  const page = await context.newPage();
  await mkdir('test-results/screenshots', { recursive: true });
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto(`${base}/welcome.html`);
  await expect(page.getByRole('radio', { name: 'social.example', exact: true })).toBeVisible();
  await page.screenshot({ path: 'test-results/screenshots/welcome-light.png', fullPage: true });
  for (const colorScheme of ['light', 'dark']) {
    await page.emulateMedia({ colorScheme });
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(result.violations).toEqual([]);
  }
  await page.screenshot({ path: 'test-results/screenshots/welcome-dark.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  const overflow = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(el => el.getBoundingClientRect().right > innerWidth + 1).map(el => `${el.tagName}.${el.className}: ${el.getBoundingClientRect().right}`));
  expect(overflow).toEqual([]);
  await page.screenshot({ path: 'test-results/screenshots/welcome-mobile.png', fullPage: true });
  await page.emulateMedia({ colorScheme: 'light' });
  await page.setViewportSize({ width: 430, height: 760 });
  await page.goto(`${base}/popup.html?draft=00000000-0000-4000-8000-000000000001`);
  await expect(page.getByRole('textbox', { name: 'Post text' })).toBeEnabled();
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(result.violations).toEqual([]);
  await page.screenshot({ path: 'test-results/screenshots/composer.png', fullPage: true });
  await page.goto(`${base}/privacy.html`);
  const privacy = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(privacy.violations).toEqual([]);
  await page.close();
});

test('support links are discoverable and website attribution requires a click without draft data', async () => {
  const website = 'https://kylereddoch.me/?utm_source=drift&utm_medium=extension';
  const requests = [];
  const record = request => {
    if (/^https:\/\/(?:www\.)?kylereddoch\.me\//.test(request.url()) || new URL(request.url()).hostname === 'tinylytics.app') requests.push(request);
  };
  const mockWebsite = route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Website navigation test</title><h1>Local stand-in for Kyle’s website</h1>' });
  context.on('request', record);
  await context.route('https://kylereddoch.me/**', mockWebsite);
  const page = await context.newPage();
  try {
    await page.goto(`${base}/welcome.html`);
    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Support Drift' }).click();
    await expect(page).toHaveURL(`${base}/welcome.html#support`);
    const card = page.locator('#support');
    await expect(card.getByRole('heading', { name: 'Help keep Drift going.' })).toBeVisible();
    await expect(card.getByRole('link', { name: 'Sponsor on GitHub' })).toHaveAttribute('href', 'https://github.com/sponsors/kylereddoch');
    await expect(card.getByRole('link', { name: 'Leave a tip on Ko-fi' })).toHaveAttribute('href', 'https://ko-fi.com/kylereddoch');
    for (const link of await page.locator('[data-link="website"]').all()) await expect(link).toHaveAttribute('href', website);
    expect(requests).toEqual([]);
    const fromWelcome = context.waitForEvent('page');
    await page.locator('.site-footer').getByRole('link', { name: 'Kyle Reddoch' }).click();
    const visit = await fromWelcome;
    await visit.waitForURL(website);
    await visit.close();

    const id = '00000000-0000-4000-8000-000000000008';
    await worker.evaluate(async id => chrome.storage.session.set({ [`draft:context:${id}`]: { source: { title: 'Private draft title', selection: 'Do not send this to the developer', url: 'https://news.example/private?secret=123' } } }), id);
    await page.goto(`${base}/popup.html?draft=${id}`);
    await expect(page.getByRole('textbox', { name: 'Post text' })).toHaveValue(/Do not send this to the developer/);
    await expect(page.getByRole('link', { name: 'Support Drift' })).toHaveAttribute('href', 'welcome.html#support');
    await expect(page.getByRole('link', { name: 'By Kyle Reddoch' })).toHaveAttribute('href', website);
    expect(requests).toHaveLength(1);
    const fromPopup = context.waitForEvent('page');
    await page.getByRole('link', { name: 'By Kyle Reddoch' }).click();
    const popupVisit = await fromPopup;
    await popupVisit.waitForURL(website);
    await popupVisit.close();
    expect(requests.map(request => request.url())).toEqual([website, website]);
    for (const request of requests) expect(request.headers().referer).toBeUndefined();
  } finally {
    await page.close();
    context.off('request', record);
    await context.unroute('https://kylereddoch.me/**', mockWebsite);
  }
});

test('expired drafts and unsupported pages give useful messages; reset clears saved data', async () => {
  const page = await context.newPage();
  await page.goto(`${base}/popup.html?draft=00000000-0000-4000-8000-000000000099`);
  await expect(page.getByRole('status')).toContainText('expired');
  await expect(page.getByRole('button', { name: 'Continue to Mastodon' })).toBeDisabled();
  await page.goto(`${base}/popup.html`);
  await expect(page.getByRole('status')).toContainText(/web page|ordinary web pages/);
  await page.goto(`${base}/welcome.html`);
  page.on('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Reset Drift', exact: true }).click();
  await expect(page.getByText('Saved data removed.', { exact: true })).toBeVisible();
  expect(await worker.evaluate(() => chrome.storage.local.get(null))).toEqual({});
  expect(await worker.evaluate(() => chrome.storage.session.get(null))).toEqual({});
  await page.close();
});
