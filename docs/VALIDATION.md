# Local validation — 0.1.2

Validated September 29, 2026, on Windows with Node.js 24.18.0, Playwright 1.63.0, and its Chromium 153.0.8010.12 build.

`npm run verify` completed successfully:

- Manifest, permission scope, packaged resources, icon dimensions, and JavaScript syntax checks passed.
- All 10 logic tests passed.
- All 7 browser tests passed, including the real extension toolbar action after selecting article text, passage-first ordering in toolbar and context drafts, draft reset, edited-draft recovery after reopening, server management, context-draft opening/cleanup, encoded handoff, support navigation, website referral links, unsupported/expired drafts, and data reset.
- axe accessibility checks passed for the welcome page in light/dark mode, the composer, and the privacy page. The narrow welcome layout had no horizontal overflow. The full toolbar popup, including its footer, fit within Chrome’s 600px popup height on the configured test screen.
- The selected Rising quotes SVG was applied and the 16, 32, 48, and 128px PNGs were regenerated. Updated welcome and actual toolbar-popup screenshots were visually inspected.
- Release ZIP generation and archive-content verification passed: 19 files, 26,288 bytes, including the license. The public v0.1.2 asset matches the local archive SHA-256: `e1a67c94597456247d6ecfbf5eac6b71de6b1b8dc0a4e45836742393d35b8802`.
- Dependencies are unchanged from 0.1.0; their installation reported no known npm audit vulnerabilities earlier on the same day.

Website links from both the welcome screen and composer opened the exact fixed `https://kylereddoch.me/?utm_source=drift&utm_medium=extension` destination. The browser test intercepted those navigations locally: no live analytics hit was generated, no article or draft information appeared in the destination, and no referrer header was sent. No website or Tinylytics request was observed before clicking. The live website was separately checked with an HTTP read: its redirect preserves the referral tags and its HTML already includes Tinylytics. A Tinylytics dashboard entry has not been verified.

The browser tests use synthetic article text and reserved `.example` destinations. No real Mastodon account was signed in or posted to. Current Mastodon web-composer behavior was checked against its official source; a logged-in test on the intended server remains a pre-release check. Chrome Web Store publication is pending.

GitHub publication was verified September 29, 2026. [Hosted Linux verification](https://github.com/kylereddoch/drift/actions/runs/36603828920) passed for `6545bf335093281a0ee350f17093e1bd1ed5a4ad`, the source tagged for v0.1.2. GitHub reports sponsorships enabled with all three configured funding links and private vulnerability reporting enabled.
