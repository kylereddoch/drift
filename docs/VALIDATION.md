# Website validation

Validated September 29, 2026 using Node.js 24.18.0 and Chromium supplied by Playwright 1.63.0.

- The homepage, privacy page, stylesheet, SVG/PNG icons, robots file, and sitemap returned HTTP 200 under the `/drift/` project path.
- Download and support navigation reached the correct sections. Every in-page anchor resolved to an existing target.
- The download link targets the published `v0.1.2` ZIP, and the donation options appear in Ko-fi, Buy Me a Coffee, GitHub order.
- axe WCAG A/AA checks found no violations on the homepage in light and dark mode or on the privacy page.
- The 390px mobile layout had no horizontal overflow. Desktop and mobile screenshots were visually inspected.
- The browser reported no page errors. The site contains no scripts or Chrome extension API dependencies.

These automated checks are not a claim of complete accessibility conformance. Chrome Web Store publication is still pending.
