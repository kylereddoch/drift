import { openContextDraft } from './lib/context.js';

async function installMenus() {
  await chrome.contextMenus.removeAll();
  const patterns = ['http://*/*', 'https://*/*'];
  chrome.contextMenus.create({ id: 'drift-page', title: 'Share page with Drift', contexts: ['page'], documentUrlPatterns: patterns });
  chrome.contextMenus.create({ id: 'drift-selection', title: 'Share selected text with Drift', contexts: ['selection'], documentUrlPatterns: patterns });
  chrome.contextMenus.create({ id: 'drift-link', title: 'Share link with Drift', contexts: ['link'], targetUrlPatterns: patterns });
}

chrome.runtime.onInstalled.addListener(details => {
  void installMenus().catch(() => console.error('Drift could not create its context menus. Reload the extension.'));
  if (details.reason === 'install') void chrome.tabs.create({ url: chrome.runtime.getURL('welcome.html') });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (['drift-page', 'drift-link', 'drift-selection'].includes(info.menuItemId)) {
    void openContextDraft(info, tab).catch(() => console.error('Drift could not open a draft. Try the toolbar button.'));
  }
});

chrome.tabs.onRemoved.addListener(tabId => {
  void (async () => {
    const mapKey = `context-tab:${tabId}`;
    const data = await chrome.storage.session.get(mapKey);
    await chrome.storage.session.remove([`draft:tab:${tabId}`, mapKey, ...(data[mapKey] ? [data[mapKey]] : [])]);
  })().catch(() => console.error('Drift could not clear a closed tab’s draft.'));
});

// Register listeners above synchronously so Chrome can wake this worker for any event.
void chrome.storage.local.setAccessLevel({ accessLevel: 'TRUSTED_CONTEXTS' });
