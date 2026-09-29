import { pageURL } from './core.js';

// Executed only after a toolbar/keyboard gesture grants activeTab. No persistent content script.
export function readSelection() {
  return window.getSelection()?.toString() ?? '';
}

export async function captureTab(tab) {
  const url = pageURL(tab?.url);
  let selection = '';
  let selectionUnavailable = false;
  try {
    const results = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: readSelection });
    selection = typeof results[0]?.result === 'string' ? results[0].result : '';
  } catch {
    // Chrome blocks injection on its store and some built-in viewers; title/link sharing still works.
    selectionUnavailable = true;
  }
  return { url, title: tab.title ?? '', selection, selectionUnavailable };
}

export function contextSource(info, tab) {
  const isLink = info.menuItemId === 'drift-link';
  return {
    url: pageURL(isLink ? info.linkUrl : (info.pageUrl ?? tab?.url)),
    title: isLink ? '' : (tab?.title ?? ''),
    selection: info.menuItemId === 'drift-selection' ? (info.selectionText ?? '') : '',
  };
}
