# Local validation — 0.1.0

Validated September 29, 2026, on Windows with Node.js 24.18.0, Playwright 1.63.0, and its Chromium 153.0.8010.12 build.

`npm run verify` completed successfully:

- Manifest, permission scope, packaged resources, icon dimensions, and JavaScript syntax checks passed.
- All 10 logic tests passed.
- All 6 browser tests passed, including the real extension toolbar action after selecting article text, popup contents, edited-draft recovery after reopening, server management, context-draft opening/cleanup, encoded handoff, unsupported/expired drafts, and data reset.
- axe accessibility checks passed for the welcome page in light/dark mode, the composer, and the privacy page. The narrow welcome layout had no horizontal overflow. The full toolbar popup, including its footer, fit within Chrome’s 600px popup height on the configured test screen.
- Welcome, composer, and actual toolbar-popup screenshots were visually inspected.
- Release ZIP generation and archive-content verification passed: 19 files, 26,021 bytes, including the license.
- Dependency installation reported no known npm audit vulnerabilities at validation time.

The browser tests use synthetic article text and reserved `.example` destinations. No real Mastodon account was signed in or posted to. Current Mastodon web-composer behavior was checked against its official source; a logged-in test on the intended server remains a pre-release check. Hosted Linux GitHub Actions, the public repository links, the live Sponsor button, and Chrome Web Store publication have not run yet.
