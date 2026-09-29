import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeServer, normalizeSettings, pageURL, cleanURL, composeText, shareURL, characterCount, sameSource } from '../extension/lib/core.js';
import { captureTab, contextSource } from '../extension/lib/capture.js';

test('server validation accepts HTTPS origins and IDNs without accepting credential or URL tricks', () => {
  assert.equal(normalizeServer(' Mastodon.Social '), 'https://mastodon.social');
  assert.equal(normalizeServer('https://social.example:8443/'), 'https://social.example:8443');
  assert.equal(normalizeServer('https://münchen.social'), 'https://xn--mnchen-3ya.social');
  for (const input of ['', 'http://example.com', 'javascript:alert(1)', 'https://a@evil.example', '@me@mastodon.social', 'https://mastodon.social/@user', 'https://mastodon.social?x=1', 'https://mastodon.social/#a', '//evil.example', 'example.com\\@evil.test', 'not a server']) {
    assert.throws(() => normalizeServer(input), undefined, input);
  }
});

test('only ordinary web pages are shareable; embedded credentials never leave the browser', () => {
  assert.equal(pageURL('https://example.com/story#section'), 'https://example.com/story#section');
  for (const url of ['chrome://settings', 'file:///secret.txt', 'data:text/plain,secret', 'javascript:alert(1)', 'https://name:secret@example.com', undefined]) assert.throws(() => pageURL(url));
});

test('link cleanup removes known tags, preserving functional parameters, fragments, and encoded bytes', () => {
  const url = 'https://example.com/story?q=hello%20there&UTM_source=news&sig=A%2fb%2Bc&fbclid=x&ref=keep#part';
  assert.equal(cleanURL(url), 'https://example.com/story?q=hello%20there&sig=A%2fb%2Bc&ref=keep#part');
  assert.equal(cleanURL('https://example.com/?utm_source=one&utm_source=two#part'), 'https://example.com/#part');
  assert.equal(cleanURL('https://example.com/?q=hi%20there&x=%ZZ'), 'https://example.com/?q=hi%20there&x=%ZZ');
});

test('highlighted text comes before the title and URL without truncation or escaping loss', () => {
  const source = { title: 'A story & a thought', selection: 'Line one.\nLine two: “yes” & #hello 🐘', url: 'https://example.com/story?utm_source=email&story=42' };
  const text = composeText(source, { includeTitle: true, cleanLinks: true });
  assert.equal(text, '“Line one.\nLine two: “yes” & #hello 🐘”\n\nA story & a thought\n\nhttps://example.com/story?story=42');
  const url = new URL(shareURL('mastodon.social', text));
  assert.equal(url.origin, 'https://mastodon.social');
  assert.equal(url.pathname, '/share');
  assert.equal(url.searchParams.get('text'), text);
  assert.equal([...url.searchParams].length, 1);
});

test('title and cleanup settings are respected; link sharing does not invent a title', () => {
  const source = { title: 'Title', url: 'https://example.com/?utm_medium=link', selection: '' };
  assert.equal(composeText(source, { includeTitle: false, cleanLinks: false }), source.url);
  assert.equal(composeText(source), 'Title\n\nhttps://example.com/');
  assert.equal(composeText({ ...source, selection: '  Selected passage.  ' }, { includeTitle: false, cleanLinks: true }), '“Selected passage.”\n\nhttps://example.com/');
  assert.equal(composeText({ url: source.url }), 'https://example.com/');
});

test('corrupt settings recover safely, deduplicate, and choose a valid default', () => {
  assert.deepEqual(normalizeSettings({ servers: ['https://one.social', 'one.social', 'javascript:evil', 'two.social'], defaultServer: 'https://evil.example' }).servers, ['https://one.social', 'https://two.social']);
  assert.equal(normalizeSettings({ servers: ['one.social'], defaultServer: 'unknown' }).defaultServer, 'https://one.social');
  assert.equal(normalizeSettings({ cleanLinks: 'false' }).cleanLinks, true);
});

test('long handoffs fail explicitly rather than losing part of a quote', () => {
  assert.throws(() => shareURL('mastodon.social', ''), /Add something/);
  assert.throws(() => shareURL('mastodon.social', '🐘'.repeat(2000)), /too long/);
});

test('counts user-perceived emoji characters and isolates changed source selections', () => {
  assert.equal(characterCount('A👨‍👩‍👧‍👦é'), 3);
  const a = { title: 'Title', url: 'https://example.com', selection: 'Quote' };
  assert.equal(sameSource(a, { ...a }), true);
  assert.equal(sameSource(a, { ...a, selection: 'New quote' }), false);
});

test('toolbar capture injects only into the invoked tab and gracefully handles protected pages', async () => {
  const tab = { id: 10, url: 'https://example.com', title: 'Article' };
  globalThis.chrome = { scripting: { executeScript: async options => {
    assert.deepEqual(options.target, { tabId: 10 });
    assert.equal(options.func.name, 'readSelection');
    return [{ result: 'Highlighted words' }];
  } } };
  const source = await captureTab(tab);
  assert.equal(source.selection, 'Highlighted words');
  chrome.scripting.executeScript = async () => { throw new Error('Cannot access protected page'); };
  assert.equal((await captureTab(tab)).selectionUnavailable, true);
  delete globalThis.chrome;
});

test('context menu selections retain article title and URL; link menu shares the target link', () => {
  const tab = { title: 'Article title', url: 'https://example.com/article' };
  assert.deepEqual(contextSource({ menuItemId: 'drift-selection', pageUrl: tab.url, selectionText: 'Passage' }, tab), { title: tab.title, url: tab.url, selection: 'Passage' });
  assert.deepEqual(contextSource({ menuItemId: 'drift-link', linkUrl: 'https://linked.example/path' }, tab), { title: '', url: 'https://linked.example/path', selection: '' });
});
