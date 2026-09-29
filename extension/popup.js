import { cleanURL, composeText, pageURL, shareURL, sameSource, characterCount } from './lib/core.js';
import { getSettings, getDraft, saveDraft } from './lib/storage.js';
import { captureTab } from './lib/capture.js';

const $ = id => document.getElementById(id);
let settings;
let source;
let draftKey;
let saving = Promise.resolve();
let busy = false;

function notice(message, error = false) {
  $('status').hidden = !message;
  $('status').textContent = message;
  $('status').classList.toggle('error', error);
}

function updateControls() {
  $('count').textContent = `${characterCount($('post').value)} characters`;
  $('share').disabled = busy || !source || !$('post').value.trim() || !$('server').value;
  $('copy').disabled = busy || !source || !$('post').value.trim();
}

function renderServers() {
  const previous = $('server').value;
  $('server').replaceChildren();
  if (!settings.servers.length) $('server').add(new Option('Add your Mastodon server', ''));
  for (const server of settings.servers) $('server').add(new Option(new URL(server).host, server));
  $('server').value = settings.servers.includes(previous) ? previous : settings.defaultServer;
  $('server').disabled = !settings.servers.length;
  updateControls();
}

function persist() {
  if (!source || !draftKey) return;
  const draft = { source, text: $('post').value, clean: $('clean-link').checked, server: $('server').value };
  // Serialize writes without a debounce timer that would be lost when a popup closes.
  saving = saving.catch(() => {}).then(() => saveDraft(draftKey, draft));
  void saving.catch(() => notice('Your draft could not be saved for reopening. You can still copy it or continue to Mastodon.', true));
}

async function init() {
  const id = new URLSearchParams(location.search).get('draft');
  if (id) { document.body.classList.add('tab-composer'); document.documentElement.classList.remove('popup-root'); }
  settings = await getSettings();
  let saved;
  if (id) {
    if (!/^[a-f0-9-]{36}$/i.test(id)) throw new Error('This draft link is invalid. Share the page again.');
    draftKey = `draft:context:${id}`;
    saved = await getDraft(draftKey);
    if (saved?.error) throw new Error(saved.error);
    if (!saved?.source) throw new Error('This temporary draft has expired. Share the page again.');
    source = saved.source;
    pageURL(source.url);
  } else {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    source = await captureTab(tab);
    draftKey = `draft:tab:${tab.id}`;
    saved = await getDraft(draftKey);
    if (!sameSource(source, saved?.source)) saved = undefined;
  }
  const clean = typeof saved?.clean === 'boolean' ? saved.clean : settings.cleanLinks;
  $('clean-link').checked = clean;
  $('post').value = typeof saved?.text === 'string' ? saved.text : composeText(source, { ...settings, cleanLinks: clean });
  $('post').disabled = false;
  $('reset-draft').disabled = false;
  $('source-host').textContent = new URL(source.url).host;
  $('quote-badge').hidden = !source.selection?.trim();
  renderServers();
  if (settings.servers.includes(saved?.server)) $('server').value = saved.server;
  if (source.selectionUnavailable) notice('Chrome blocked access to selected text here. The title and link are ready to share.');
  else if (!settings.servers.length) notice('Add your Mastodon server in Settings to continue. Your draft stays here.');
  updateControls();
  persist();
}

$('post').addEventListener('input', () => { updateControls(); persist(); });
$('server').addEventListener('change', () => { updateControls(); persist(); });
$('clean-link').addEventListener('change', () => {
  if (!source) return;
  const original = pageURL(source.url);
  const cleaned = cleanURL(original);
  const from = $('clean-link').checked ? original : cleaned;
  const to = $('clean-link').checked ? cleaned : original;
  // Only replace a whole URL line so toggling never rewrites the user's prose or quote.
  let replaced = false;
  $('post').value = $('post').value.split('\n').map(line => {
    if (line === from) { replaced = true; return to; }
    return line;
  }).join('\n');
  if (!replaced && from !== to) notice('The link was edited or removed, so Drift kept your text unchanged.');
  updateControls(); persist();
});
$('reset-draft').addEventListener('click', () => {
  if (!source || !window.confirm('Replace your edits with the original title, selected passage, and link?')) return;
  $('post').value = composeText(source, { ...settings, cleanLinks: $('clean-link').checked });
  notice('Draft reset.'); updateControls(); persist();
});
$('copy').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText($('post').value); notice('Copied. Paste your draft wherever you like.'); }
  catch { $('post').focus(); $('post').select(); notice('Copy was blocked. The draft is selected—press Ctrl+C (Command+C on Mac).', true); }
});
$('share-form').addEventListener('submit', async event => {
  event.preventDefault();
  if (busy || !source) return;
  busy = true; updateControls();
  try {
    const url = shareURL($('server').value, $('post').value);
    await chrome.tabs.create({ url });
    notice('Mastodon’s composer is open. Review your account, audience, and post there.');
  } catch (error) { notice(error.message, true); }
  finally { busy = false; updateControls(); }
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.settings) {
    void getSettings().then(value => { settings = value; renderServers(); notice(settings.servers.length ? 'Server settings updated.' : 'Add a server in Settings to continue.'); }).catch(() => notice('Could not refresh server settings.', true));
  }
});

void init().catch(error => { notice(error.message, true); $('clean-link').disabled = true; });
