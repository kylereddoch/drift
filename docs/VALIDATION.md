# Validation

## 1.0.1 — website link update

Validated October 2, 2026. `npm run verify` and `npm run store` passed with 10 logic tests and 7 browser tests. The browser checks cover the manifest homepage, actual clicks from the welcome page and popup to the new Drift website, the separate author link, and the website privacy link. Navigation was intercepted locally; requests carried only fixed referral tags, no draft content or referrer, and no website requests occurred before a click.

The accessibility checks and toolbar-popup size checks passed. Updated welcome-page and real toolbar-popup screenshots were visually inspected. Public and packaged website-attribution disclosures match.

The upload ZIP is `dist/chrome-web-store-1.0.1/drift-1.0.1.zip`: 19 files, 26,289 bytes, SHA-256 `fd51e59110c6a5a05e2064ad537b5b5086e1c5eb4cbd6701970020a1669927d1`. Every archived file matches its source; the manifest is at the ZIP root. Permissions match the preceding version. This verifies the package, not Chrome Web Store submission or approval. Public HTTPS must be working before submission.

## 1.0.0 — Chrome Web Store submission build

Validated September 29, 2026 on Windows using the existing Node.js 24 / Playwright 1.63.0 toolchain.

- `npm run verify` passed: manifest/permission/resource/syntax checks, 10 logic tests, 7 browser tests, accessibility checks, and ZIP validation.
- No sharing logic or permissions changed from the tested 0.1.2 preview. The build changes version/preview wording, adds the public homepage, and pads the 128px store icon according to Google's guidance.
- `npm run store` loaded the actual packaged ZIP in an isolated browser and captured five 1280×800 screenshots. It also rendered 440×280 and 1400×560 promotional artwork. Dimensions and opaque RGB PNG formats were checked. The 128px icon retains transparent padding.
- Store screenshots use original sample text and example URLs; network requests were blocked while capturing them. No personal browser profile or real Mastodon account was used.
- Extension ZIP: 19 files, 26,213 bytes. SHA-256: `4862b16359a361d0c928a431cfbc62de9a6055e85facb84089bd6483a204018c`.
- Official store preparation, images, privacy, listing, and submission documentation was checked. Listing copy explicitly discloses chosen-page URLs/titles, website content, local drafts, and user-initiated server handoff.
- Browser control of the open developer dashboard returned "The extensions gallery cannot be scripted." Upload, submission, and approval are not confirmed.

The existing test boundary remains: automated Mastodon handoffs use intercepted destinations. Tests do not sign in to or publish from a real account.

## 0.1.2 — previous developer preview

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
