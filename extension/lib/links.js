// This is the planned repository address; publish it before distributing a release.
export const PROJECT = 'https://github.com/kylereddoch/drift';
export const LINKS = Object.freeze({
  github: PROJECT,
  changelog: `${PROJECT}/blob/main/CHANGELOG.md`,
  help: `${PROJECT}/issues/new/choose`,
  sponsor: 'https://github.com/sponsors/kylereddoch',
  kofi: 'https://ko-fi.com/kylereddoch',
  coffee: 'https://www.buymeacoffee.com/kylereddoch',
});

export function bindLinks() {
  for (const anchor of document.querySelectorAll('[data-link]')) {
    const href = LINKS[anchor.dataset.link];
    if (href) { anchor.href = href; anchor.target = '_blank'; anchor.rel = 'noopener noreferrer'; }
  }
  for (const el of document.querySelectorAll('[data-version]')) el.textContent = `v${chrome.runtime.getManifest().version}`;
}
