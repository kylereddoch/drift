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

Hover DNS subsequently resolved with `CNAME`, hostname `drift`, target `kylereddoch.github.io`. GitHub approved the certificate and HTTPS enforcement was enabled. The public homepage and updated privacy page returned HTTP 200 with normal certificate validation; HTTP redirects to HTTPS.

## Search and social metadata — October 2, 2026

Both pages now include page-specific titles/descriptions, canonical URLs, robots directives, complete Open Graph image metadata, large-image Twitter/X cards, and JSON-LD. The homepage identifies the published 1.0.0 extension and its free price; no ratings or reviews were invented. Google software-app rich-result eligibility is not asserted.

- Parsed metadata checks found one canonical and one value per metadata key, with consistent page titles, descriptions, HTTPS URLs, image references, and JSON-LD identifiers.
- The 84,858-byte social PNG is 1200 × 630, served as `image/png`. Its editable artwork is marked `noindex`.
- Local page, asset, and navigation requests succeeded. Sitemap entries and robots references match the custom domain. A nested missing URL returned HTTP 404 with the custom error page and `noindex`.
- Browser checks found no page errors. Homepage accessibility checks passed 21 rules in each theme; privacy checks passed 12 rules in each theme, with no WCAG A/AA violations. Both pages fit a 390px viewport without horizontal overflow.
- The social image and desktop page were visually inspected. External scripts were replaced with empty responses for the final automated checks, keeping those checks out of website analytics.

Search-engine crawling, indexing, rich-result display, and third-party social-preview caches are outside these local checks.
