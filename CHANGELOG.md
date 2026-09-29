# Changelog

## 0.1.2 — 2026-09-29 (developer preview)

### Changed

- Put the highlighted passage before the article title and URL in new and reset drafts, including toolbar and right-click sharing.
- Updated the welcome-page example to match the new order. Sharing without a selection still starts with the title, and recovered edits keep their existing text.

## 0.1.1 — 2026-09-29 (local preview)

### Changed

- Adopted the Rising quotes logo across the toolbar icons, welcome page, composer, and privacy page.
- Added a prominent Support Drift navigation button, an emphasized donation card, and a compact support link in the sharing popup.
- Styled all donation options as buttons in Ko-fi, Buy Me a Coffee, then GitHub order. Moved the maintainer credit into the footer.
- Corrected the author’s website to `https://kylereddoch.me/` in the footer and popup.
- Added fixed `utm_source=drift` and `utm_medium=extension` tags to author-website links so the site’s existing Tinylytics installation can attribute visits from Drift.
- Updated privacy disclosures to explain click-through attribution. No background analytics, tracking pixel, remote code, or additional permission was added to the extension.

## 0.1.0 — 2026-09-29 (local preview)

### Added

- Toolbar popup with an editable draft containing the current page title, highlighted passage, and URL.
- Mastodon server selection, multiple saved servers, and a default server.
- Optional removal of known tracking parameters, with restoration of the original link.
- Temporary draft recovery within the browser session and explicit data-clearing controls.
- Right-click sharing for pages, links, and selected text.
- A customizable keyboard shortcut and draft copying.
- Welcome page with setup, instructions, help, release notes, changelog links, and donation options.
- Light/dark styling, keyboard support, and accessibility checks.
- Manifest V3 service worker, minimum necessary permissions, and no runtime dependencies or telemetry.
- Privacy policy, test suite, pinned CI tools, dependency updates, and release ZIP packaging.

These entries describe the initial preview implementation. The source and v0.1.2 developer preview are published on GitHub. Chrome Web Store submission is pending.
