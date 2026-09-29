# Drift — Share to Mastodon

Share a page, a passage, a good find.

**Highlight text in an article, click the Drift toolbar icon, and an editable draft opens with your selected passage first, followed by the page title and URL.** Choose a saved Mastodon server, add your thoughts, and continue to that server’s composer to review and publish.

Drift is an independent Chrome extension by [Kyle Reddoch](https://kylereddoch.me/). It is not affiliated with Mastodon. Version 1.0.0 is prepared for Chrome Web Store submission; submission and approval have not yet been confirmed.

[Website](https://kylereddoch.github.io/drift/) · [Download the developer preview](https://github.com/kylereddoch/drift/releases/tag/v0.1.2) · [Privacy policy](https://kylereddoch.github.io/drift/privacy.html)

## Try the developer preview

1. Open `chrome://extensions` in Chrome and turn on **Developer mode**.
2. Download and extract the [preview ZIP](https://github.com/kylereddoch/drift/releases/download/v0.1.2/drift-0.1.2.zip). Click **Load unpacked**, then select the extracted folder containing `manifest.json`. If you cloned the source repository instead, select its `extension` folder.
3. The welcome page opens. Add the HTTPS server address you use to sign in to Mastodon, such as `mastodon.social`.
4. Pin Drift using Chrome’s puzzle-piece Extensions menu.
5. Open an article, highlight a passage, and click Drift. Review the draft and select **Continue to Mastodon**.

You publish from Mastodon itself. Drift does not need your password, an API token, or permission to post to your account. The server must support Mastodon’s `/share?text=...` composer. Alternative Fediverse software and clients are not yet tested.

## Features

- **Highlight → icon → draft.** Includes the selected passage, title, and URL, with editable text before handoff.
- **Share without a highlight.** Just the page title and link, with optional title inclusion.
- **Multiple servers.** Save up to 12 and pick a default. Drift uses whichever account is currently signed in on the chosen server.
- **Optional tracking cleanup.** Removes common `utm_*`, click identifiers, and newsletter tags; keeps other query parameters and fragments. Restore the original link for a draft with one toggle.
- **Draft recovery.** Closing the toolbar popup does not immediately lose your edits. Reopen it on the same page with the same selection during the browser session. Closing the source tab, restarting Chrome, or reloading the extension clears the saved draft.
- **Right-click actions.** Share pages, link targets, and selected text. Context-menu drafts open in a separate extension tab.
- **Keyboard shortcut.** `Alt+Shift+M` opens Drift; customize it at `chrome://extensions/shortcuts`. Chrome may leave it unassigned if another extension already uses it.
- **Copy a draft.** Take your text elsewhere, including drafts too long for a share URL.
- **Welcome and help.** Setup, instructions, release notes, GitHub changelog, help, and optional donation links in one place.
- **Light and dark themes.** Follows the system/browser preference; keyboard navigation and reduced-motion support.

## Privacy and permissions

Drift has no runtime dependencies, extension usage analytics, remotely hosted scripts, backend, persistent website permissions, or browsing-history permission. All executable code ships in the extension.

| Permission | Why it is needed |
| --- | --- |
| `activeTab` | Temporarily access the tab you explicitly choose to share. |
| `scripting` | Read highlighted text when you invoke Drift. |
| `storage` | Save local preferences and temporary drafts. |
| `contextMenus` | Offer right-click sharing. |

Settings use `chrome.storage.local`; drafts use `chrome.storage.session`. Drift does not sync either. When you continue to Mastodon, the draft is sent to your server as part of an HTTPS URL, which can appear in browser history and server logs before you publish. Copy uses the system clipboard. See [the full privacy policy](extension/privacy.html).

Author-website links in the extension use `https://kylereddoch.me/?utm_source=drift&utm_medium=extension`. The website’s existing Tinylytics installation can attribute those visits to Drift after someone clicks. The tags are the same for everyone and contain no article URL, selected text, draft contents, server, or user ID. No analytics script or pixel runs inside Drift. This measures website visits from extension links, not extension installs, popup views, shares, donations, or active users.

## Development

Requires Node.js 24 or later. Chrome 120 is the declared API baseline; use a currently supported Chrome release. The bundled test browser is pinned by Playwright.

```sh
npm ci
npx playwright install chromium
npm run verify
```

On Linux CI, use `npx playwright install --with-deps chromium`. There is no build step for the extension: load `extension/` directly. After editing source, reload Drift at `chrome://extensions` and refresh/reopen its pages.

- `npm run check` checks the manifest, permissions, syntax, resources, and PNG dimensions.
- `npm test` checks URL safety, quote composition, cleanup, validation, settings, and capture behavior.
- `npm run test:browser` runs the installed extension in isolated Chromium, including the real toolbar action, storage, server selection, composer handoff, themes, and accessibility.
- `npm run icons` regenerates the committed PNGs from the original vector mark.
- `npm run package` creates `dist/drift-1.0.0.zip` with the manifest at the ZIP root. No development files or dependencies are included.
- `npm run store` packages the extension and creates `dist/chrome-web-store-1.0.0/` with the ZIP, store icon, five screenshots, promotional images, checksums, and ready-to-paste submission text. Screenshots come from the actual ZIP in an isolated browser. See the [store upload guide](docs/STORE-LISTING.md).

If using a custom browser download directory, set `PLAYWRIGHT_BROWSERS_PATH` to the same path for installation and tests. This local checkout uses `.cache/browsers` (ignored by Git).

The public website is maintained separately on the [`gh-pages` branch](https://github.com/kylereddoch/drift/tree/gh-pages), in its own local checkout. The extension lives on `main`.

## Project structure

```text
extension/          Loadable, self-contained Manifest V3 extension
  lib/              URL, settings, selection, and draft helpers
  icons/            Original SVG and browser-sized PNGs
tests/              Logic and real-browser tests
scripts/            Validation, icon generation, ZIP and store-kit packaging
store/              Original promotional artwork source
docs/               Architecture, source references, release preparation
.github/            CI, dependency updates, funding, and issue forms
```

## Limits and support

Chrome settings pages, local files, and URLs with embedded credentials are not shareable. Some PDF viewers, the Web Store, and embedded frames block selection capture; Drift explains the fallback. Article text in a top-level web document is the supported highlight flow. Right-clicking a link shares its URL without pretending the current page’s title belongs to the destination.

Drift’s character count describes the draft, not your instance’s exact remaining allowance. Mastodon applies its own character, URL, audience, and content-warning rules. Share links have practical length limits; unusually long drafts must be shortened or copied. Drift never silently truncates highlighted text.

See [SUPPORT.md](SUPPORT.md), [CHANGELOG.md](CHANGELOG.md), [developer references](docs/DEVELOPMENT.md), and the [release checklist](docs/RELEASING.md).

## Support development

[Ko-fi](https://ko-fi.com/kylereddoch) · [Buy Me a Coffee](https://www.buymeacoffee.com/kylereddoch) · [GitHub Sponsors](https://github.com/sponsors/kylereddoch)

The repository’s Sponsor button uses these same funding destinations. Donations are optional; all extension features are available without payment.

## License

[MIT](LICENSE), copyright © 2026 Kyle Reddoch. Drift’s implementation and artwork are original. The feature inspiration was [Share to Mastodon](https://chromewebstore.google.com/detail/bibnjflclpdmbbcncejifemmbggkcjde); its code and assets were not copied.
