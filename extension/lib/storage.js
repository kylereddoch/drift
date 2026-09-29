import { normalizeSettings } from './core.js';

export async function getSettings() {
  const { settings } = await chrome.storage.local.get('settings');
  return normalizeSettings(settings);
}

export async function saveSettings(value) {
  const settings = normalizeSettings(value);
  await chrome.storage.local.set({ settings });
  return settings;
}

export async function getDraft(key) {
  const data = await chrome.storage.session.get(key);
  return data[key];
}

export async function saveDraft(key, draft) {
  await chrome.storage.session.set({ [key]: draft });
}
