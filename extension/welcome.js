import { normalizeServer } from './lib/core.js';
import { getSettings, saveSettings } from './lib/storage.js';
import { bindLinks } from './lib/links.js';
const $ = id => document.getElementById(id);
let settings;
let queue = Promise.resolve();
bindLinks();

function announce(message, error = false) {
  $('settings-status').hidden = !message;
  $('settings-status').textContent = message;
  $('settings-status').classList.toggle('error', error);
}

function render() {
  const focused = $('servers').contains(document.activeElement) ? document.activeElement : null;
  const focusedServer = focused?.value;
  $('servers').replaceChildren();
  if (!settings.servers.length) {
    const p = document.createElement('p'); p.className = 'empty-state'; p.textContent = 'Your first server belongs here.'; $('servers').append(p);
  }
  for (const server of settings.servers) {
    const row = document.createElement('div'); row.className = 'saved-server';
    const label = document.createElement('label'); label.className = 'check';
    const radio = document.createElement('input'); radio.type = 'radio'; radio.name = 'default-server'; radio.value = server; radio.checked = settings.defaultServer === server;
    radio.addEventListener('change', () => mutate(value => ({ ...value, defaultServer: server }), 'Default server saved.'));
    label.append(radio, document.createTextNode(new URL(server).host));
    const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'link-button remove-server'; remove.textContent = 'Remove'; remove.setAttribute('aria-label', `Remove ${new URL(server).host}`);
    remove.addEventListener('click', () => mutate(value => ({ ...value, servers: value.servers.filter(item => item !== server) }), 'Server removed.'));
    row.append(label, remove); $('servers').append(row);
  }
  $('include-title').checked = settings.includeTitle;
  $('clean-links').checked = settings.cleanLinks;
  if (focusedServer) {
    const replacement = [...$('servers').querySelectorAll('input')].find(input => input.value === focusedServer);
    replacement?.focus();
  } else if (focused) $('server-address').focus();
}

function mutate(transform, message) {
  queue = queue.catch(() => {}).then(async () => {
    settings = await saveSettings(transform(await getSettings()));
    render(); announce(message);
  }).catch(error => announce(error.message || 'Could not save settings. Try again.', true));
  return queue;
}

$('server-form').addEventListener('submit', async event => {
  event.preventDefault();
  try {
    const server = normalizeServer($('server-address').value);
    await mutate(value => {
      if (value.servers.includes(server)) throw new Error('That server is already saved.');
      if (value.servers.length >= 12) throw new Error('You can save up to 12 servers. Remove one before adding another.');
      return { ...value, servers: [...value.servers, server] };
    }, 'Server saved. Open an article and click Drift to try it.');
    if (settings?.servers.includes(server)) $('server-address').value = '';
  } catch (error) { announce(error.message, true); }
});
for (const [id, key] of [['include-title', 'includeTitle'], ['clean-links', 'cleanLinks']]) {
  $(id).addEventListener('change', event => {
    const checked = event.target.checked;
    void mutate(value => ({ ...value, [key]: checked }), 'Preference saved for new drafts.');
  });
}
$('shortcuts').addEventListener('click', () => void chrome.tabs.create({ url: 'chrome://extensions/shortcuts' }).catch(() => announce('Open chrome://extensions/shortcuts to change the shortcut.', true)));
$('clear-drafts').addEventListener('click', async () => {
  if (!window.confirm('Clear all temporary drafts saved by Drift? Text already open in an editor stays visible until it is closed.')) return;
  try { await chrome.storage.session.clear(); $('data-status').textContent = 'Temporary drafts cleared.'; }
  catch { $('data-status').textContent = 'Drafts could not be cleared. Try again.'; }
});
$('reset-settings').addEventListener('click', async () => {
  if (!window.confirm('Remove Drift’s saved servers, preferences, and temporary drafts?')) return;
  try {
    await queue;
    await chrome.storage.local.clear(); await chrome.storage.session.clear();
    settings = await getSettings(); render(); announce('Drift has been reset.'); $('data-status').textContent = 'Saved data removed.';
  } catch { $('data-status').textContent = 'Reset did not finish. Try again.'; }
});
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.settings) void getSettings().then(value => { settings = value; render(); }).catch(() => announce('Could not refresh settings.', true));
});
void getSettings().then(value => { settings = value; render(); }).catch(() => announce('Could not read settings. Reload this page to try again.', true));
