# Design and current developer references

Documentation and official source reviewed on September 29, 2026. These links are the maintenance baseline, not a promise of permanent compatibility.

## Architecture

The extension is plain HTML, CSS, and JavaScript modules. There is no bundler or runtime dependency. `extension/` is the exact unpacked extension; `scripts/package.mjs` packages it with the MIT license.

The toolbar action has `popup.html` as its default popup. An explicit toolbar click or `_execute_action` keyboard shortcut grants temporary `activeTab` access. The popup queries the active tab, then runs one packaged selection reader in that tab’s main frame using `chrome.scripting.executeScript`. It collects only `window.getSelection().toString()`; it does not scrape the page body. The tab API supplies title and URL.

Default composition is page title, a blank line, the quoted selection, a blank line, and the shareable URL. An empty selection is omitted. All editable text stays literal; page-derived strings are assigned via textContent, form values, or text nodes, never HTML interpolation.

The service worker registers its install, context-menu, and tab-close listeners at top level. It opens the welcome page on first install only. Context-menu inputs become session drafts keyed by random UUIDs; draft tabs receive only that opaque ID, not article text, in their extension URL. Toolbar drafts are keyed by source tab ID and reused only for the same source and selection. Closed-tab cleanup is driven by `tabs.onRemoved`. Required state resides in storage, not worker globals.

Settings are local to the browser. Drafts are session-only. Storage errors are surfaced in the UI; long share links fail with a copy alternative, without silently truncating text. Saved server addresses must be HTTPS origins without credentials, paths, queries, or fragments. Shared page URLs allow HTTP/HTTPS but reject embedded credentials and browser/file/script schemes. Tracking cleanup preserves the encoded bytes of retained query parameters.

Share uses the server’s `/share` route with one URL-encoded `text` parameter containing the complete draft. Mastodon owns authentication, audience choice, content warnings, character limits, and publication. Drift never calls the status API or claims to have posted.

## Chrome references

| Official reference | Applied in Drift |
| --- | --- |
| [Manifest V3](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3) | Service worker and packaged executable code. |
| [activeTab](https://developer.chrome.com/docs/extensions/develop/concepts/activeTab) | Temporary, user-invoked access; no permanent host permissions. |
| [Scripting API](https://developer.chrome.com/docs/extensions/reference/api/scripting) | On-demand selection capture. |
| [Action API](https://developer.chrome.com/docs/extensions/reference/api/action) | Toolbar popup and sized icons. |
| [Commands API](https://developer.chrome.com/docs/extensions/reference/api/commands) | `_execute_action` keyboard shortcut. |
| [Context menus](https://developer.chrome.com/docs/extensions/reference/api/contextMenus) | Page, link, and selection sharing. |
| [Service worker events](https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/events) | Synchronous top-level listener registration. |
| [Storage API](https://developer.chrome.com/docs/extensions/reference/api/storage) | Local settings, temporary session drafts, trusted-context storage access. |
| [Content security policy](https://developer.chrome.com/docs/extensions/reference/manifest/content-security-policy) | Packaged scripts/styles, no network fetches, no inline executable code or objects. |
| [Install unpacked](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world) | Local installation steps. |
| [User data FAQ](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq) | Explicit disclosure of page content, local processing, and share-URL transmission. |
| [Quality guidelines](https://developer.chrome.com/docs/webstore/program-policies/quality-guidelines) | One clear sharing purpose, accurate functionality, and a focused interface. |

## Mastodon source verification

Mastodon does not present the web share page as a status-posting REST endpoint. Drift follows its actual web composer behavior. Reviewed source revision: `e8170d6d92075448dd23a7096f14ae8c22357e95`.

- [Routes](https://github.com/mastodon/mastodon/blob/e8170d6d92075448dd23a7096f14ae8c22357e95/config/routes.rb): `resource :share, only: [:show]`.
- [SharesController](https://github.com/mastodon/mastodon/blob/e8170d6d92075448dd23a7096f14ae8c22357e95/app/controllers/shares_controller.rb): authenticated, modal layout.
- [Application helper](https://github.com/mastodon/mastodon/blob/e8170d6d92075448dd23a7096f14ae8c22357e95/app/helpers/application_helper.rb): initial compose text joins the optional `title`, `text`, and `url` parameters. Drift sends one fully composed `text` value to preserve the intended spacing.
- [Initial state serializer](https://github.com/mastodon/mastodon/blob/e8170d6d92075448dd23a7096f14ae8c22357e95/app/serializers/initial_state_serializer.rb): passes initial text into compose state.

## Testing and maintenance

[Playwright’s extension guide](https://playwright.dev/docs/chrome-extensions) recommends a persistent Chromium context for extension tests. Retail Chrome/Edge no longer expose the same sideload flags. Tests use Playwright’s pinned Chromium build and the official [CDP Extensions domain](https://chromedevtools.github.io/devtools-protocol/tot/Extensions/) to trigger the real toolbar action on a tab target. The resulting real POPUP context and captured draft are verified; editable composer controls are additionally tested in extension tabs.

The test browser uses an explicit [virtual screen configuration](https://developer.chrome.com/docs/automation-and-testing/headless-screen-config) so Chrome has room for its full toolbar popup. The default 800×600 headless screen otherwise clamps a popup’s visible height independently of the tested web-page viewport.

Test network routes use reserved `.example` domains. They do not publish or sign in to a real account. Automated accessibility checks use axe for WCAG A/AA rules in light/dark mode, plus viewport checks and visual inspection. Automated accessibility checks are not a claim of full accessibility conformance.

Dependencies are development-only, exactly pinned, and committed with `package-lock.json`. GitHub Actions are pinned to reviewed revisions; Dependabot checks npm and Actions weekly after publication. No automatic merging or publishing is configured.

Future features should earn any additional permission they require. Possible follow-ups: opt-in settings sync, tested alternative client support, configurable text templates, localization, and Firefox packaging. These are not shipped capabilities.
