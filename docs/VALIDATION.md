# Website validation

Validated September 29, 2026 using Node.js 24.18.0 and Chromium supplied by Playwright 1.63.0.

- The homepage, privacy page, stylesheet, SVG/PNG icons, robots file, and sitemap returned HTTP 200 under the `/drift/` project path.
- Download and support navigation reached the correct sections. Every in-page anchor resolved to an existing target.
- The download link targets the published `v0.1.2` ZIP, and the donation options appear in Ko-fi, Buy Me a Coffee, GitHub order.
- axe WCAG A/AA checks found no violations on the homepage in light and dark mode or on the privacy page.
- The 390px mobile layout had no horizontal overflow. Desktop and mobile screenshots were visually inspected.
- The browser reported no page errors. At initial publication the site contained no scripts or Chrome extension API dependencies. Tinylytics was added later on September 29; see the update below.

These automated checks are not a claim of complete accessibility conformance. Chrome Web Store publication is still pending.

## Tinylytics website update — September 29, 2026

The owner supplied the Tinylytics embed for this site. It is included once, with defer, in the homepage and public privacy page. Static checks confirmed the exact script URL and single inclusion on both pages. The embed endpoint returned HTTP 200 with a JavaScript content type. The website privacy disclosure and README explain this analytics integration. The extension source and store submission package are unchanged.

## Store listing and website events — October 1, 2026

Drift's public Chrome Web Store listing was verified as version 1.0.0, offered by Kyle Reddoch. The listing returned HTTP 200. Both install calls to action now use that listing and Google's official bordered Chrome Web Store badge. The version, release notes, ZIP download, feature summary, and setup instructions now describe 1.0.0.

- Both HTML pages include the deferred Tinylytics embed once with `?events&beacon`.
- All 22 tagged controls sent exactly one expected event with the correct fixed value and page path, using the actual Tinylytics collector script. Clicks on nested content also reached the tagged control.
- The collector was intercepted during testing, so synthetic visits and events were not submitted to production analytics. Tinylytics returns HTTP 404 for the localhost referrer; local tests used the script fetched with the public site's referrer, which returned HTTP 200.
- A rapid double-click counted once. The ignore preference suppressed both hits and events. When `sendBeacon` returned false, the script's fetch fallback sent the event.
- Section, privacy-page, and return navigation worked. All images loaded, including the local store badge; the preview server serves that asset.
- axe WCAG A/AA checks found no violations on the homepage in light and dark mode or on the privacy page. Neither page overflowed horizontally at 390px. Desktop and mobile screenshots were visually inspected.
- The browser reported no page or console errors during the collector-script checks. The privacy page and README describe website click tracking and distinguish clicks from completed installs, donations, and posts.

These checks apply to the website. No extension source, permissions, or release package changed.

## Custom domain — October 2, 2026

GitHub Pages and the repository homepage are configured for `drift.kylereddoch.me`. The website’s `CNAME`, canonical and Open Graph URLs, robots sitemap reference, and sitemap entries use the custom domain. The local preview now serves the domain root.

- Local HTTP checks returned 200 for the homepage, privacy page, all linked local assets, robots file, and sitemap. Privacy-page and return links resolve from the root.
- Both pages have the expected canonical and Open Graph URLs. Their existing Tinylytics embeds remain included once per page; synthetic checks did not execute external scripts.
- Unknown paths and non-public files return 404. `git diff --check` passed.

Hover DNS and GitHub certificate provisioning must complete before the public HTTPS URL can be verified. The Hover record is `CNAME`, hostname `drift`, target `kylereddoch.github.io`, with the default TTL.
