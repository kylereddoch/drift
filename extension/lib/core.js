export const DEFAULT_SETTINGS = Object.freeze({ servers: [], defaultServer: '', cleanLinks: true, includeTitle: true });
const TRACKING_KEYS = new Set(['fbclid', 'gclid', 'dclid', 'msclkid', 'mc_cid', 'mc_eid', 'igshid', 'igsh', 'srsltid', 'vero_id', '_hsenc', '_hsmi']);

export function normalizeServer(value) {
  const input = String(value ?? '').trim();
  if (!input || input.startsWith('/') || /[\s\\]/u.test(input)) throw new Error('Enter your Mastodon server, such as mastodon.social.');
  let server;
  try { server = new URL(input.includes('://') ? input : `https://${input}`); }
  catch { throw new Error('That server address does not look right. Try mastodon.social.'); }
  if (server.protocol !== 'https:' || server.username || server.password || server.search || server.hash || server.pathname !== '/') {
    throw new Error('Use your server’s HTTPS address only, without a username, profile path, or query.');
  }
  if (!server.hostname.includes('.') && server.hostname !== 'localhost' && !server.hostname.startsWith('[')) {
    throw new Error('Use the full server address, such as mastodon.social.');
  }
  return server.origin;
}

export function pageURL(value) {
  let url;
  try { url = new URL(value); } catch { throw new Error('Open a web page to share it with Drift.'); }
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) {
    throw new Error('Drift shares ordinary web pages. Browser settings, local files, and sign-in URLs with credentials cannot be shared.');
  }
  return url.href;
}

export function cleanURL(value) {
  const original = pageURL(value);
  const url = new URL(original);
  // Keep retained query bytes unchanged: URLSearchParams serialization can break signed links.
  const parts = url.search.slice(1).split('&');
  const kept = parts.filter(part => {
    let key;
    try { key = decodeURIComponent(part.split('=')[0].replace(/\+/g, ' ')).toLowerCase(); }
    catch { return true; }
    return !key.startsWith('utm_') && !TRACKING_KEYS.has(key);
  });
  if (kept.length === parts.length) return original;
  url.search = kept.filter(Boolean).length ? `?${kept.join('&')}` : '';
  return url.href;
}

export function normalizeSettings(value = {}) {
  if (!value || typeof value !== 'object') value = {};
  const servers = [];
  for (const item of Array.isArray(value.servers) ? value.servers : []) {
    try { const server = normalizeServer(item); if (!servers.includes(server)) servers.push(server); } catch { /* Ignore invalid older settings. */ }
  }
  return {
    servers: servers.slice(0, 12),
    defaultServer: servers.includes(value.defaultServer) ? value.defaultServer : (servers[0] ?? ''),
    cleanLinks: typeof value.cleanLinks === 'boolean' ? value.cleanLinks : true,
    includeTitle: typeof value.includeTitle === 'boolean' ? value.includeTitle : true,
  };
}

export function composeText(source, settings = DEFAULT_SETTINGS) {
  const url = settings.cleanLinks ? cleanURL(source.url) : pageURL(source.url);
  const title = settings.includeTitle ? String(source.title ?? '').trim() : '';
  const quote = String(source.selection ?? '').trim();
  return [title, quote ? `“${quote}”` : '', url].filter(Boolean).join('\n\n');
}

export function shareURL(server, text) {
  if (typeof text !== 'string' || !text.trim()) throw new Error('Add something to your post first.');
  const url = new URL('/share', normalizeServer(server));
  url.searchParams.set('text', text);
  // GET-based sharing has practical browser/server URL limits. Never silently truncate a quote.
  if (url.href.length > 16000) throw new Error('This draft is too long to send as a share link. Shorten it, or copy it into Mastodon.');
  return url.href;
}

export function sameSource(a, b) {
  return Boolean(a && b && a.url === b.url && a.title === b.title && a.selection === b.selection);
}

export function characterCount(text) {
  return [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text)].length;
}
