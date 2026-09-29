import { contextSource } from './capture.js';

export async function openContextDraft(info, tab) {
  const id = crypto.randomUUID();
  const key = `draft:context:${id}`;
  let payload;
  try { payload = { source: contextSource(info, tab) }; }
  catch (error) { payload = { error: error.message }; }
  await chrome.storage.session.set({ [key]: payload });
  try {
    const draftTab = await chrome.tabs.create({ url: chrome.runtime.getURL(`popup.html?draft=${id}`) });
    await chrome.storage.session.set({ [`context-tab:${draftTab.id}`]: key });
  } catch (error) {
    await chrome.storage.session.remove(key);
    throw error;
  }
}
