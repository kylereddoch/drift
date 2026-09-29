# Contributing

Start with an issue for a substantial feature, especially changes to permissions, storage, or Mastodon authentication. Keep Drift’s primary flow short: highlight text, click the toolbar icon, edit, continue to Mastodon.

Use Node.js 24+, run `npm ci`, install Playwright Chromium, then run `npm run verify`. Include meaningful regression coverage for changes to URL validation, selection capture, drafts, storage, or browser behavior. Document new permissions and data handling in both the welcome/privacy pages and README.

All extension code and assets must be packaged locally. Do not add telemetry, remote executable code, automatic posting, broad host permissions, or persistent content scripts without an explicit design discussion. Do not claim compatibility with a client or platform that has not been tested.

Keep dependencies pinned, update the lockfile, and use the changelog to describe user-visible changes. Avoid unrelated formatting changes. See [the architecture and source references](docs/DEVELOPMENT.md).
