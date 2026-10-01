# Drift website

The public website for [Drift — Share to Mastodon](https://github.com/kylereddoch/drift), using the approved extension design and Rising quotes logo.

**Website:** https://kylereddoch.github.io/drift/

This checkout is separate from the extension on disk. Both belong to the `kylereddoch/drift` GitHub project:

- `main`: extension source, tests, and releases, locally in `D:\Github Repos\drift`.
- `gh-pages`: this static website, locally in `D:\Github Repos\drift-website`.

The site uses GitHub’s domain, with no custom domain or DNS changes. It does not use the `drift.github.io` hostname, which belongs to the GitHub account named `drift`.

## Work on the site

No package installation or build step is needed. Edit `index.html`, `privacy.html`, and `assets/styles.css`. Branding is packaged locally; there is no browser extension API code in the website. The homepage loads Tinylytics and the MakerMap badge as externally hosted scripts; the privacy page loads only Tinylytics.

For a local preview with Node.js 24 or later:

```sh
node scripts/preview.mjs
```

Open `http://127.0.0.1:4174/drift/`. The preview uses the same `/drift/` base path as GitHub Pages.

## Publish changes

Commit reviewed website changes on `gh-pages` and push that branch. GitHub Pages deploys the branch root. `.nojekyll` keeps this a plain static site.

Drift 1.0.0 is available in the [Chrome Web Store](https://chromewebstore.google.com/detail/gfngoampnddkablfoplbllkdcfkifnij). The hero and setup badges use that listing; the v1.0.0 ZIP remains a secondary option for manual installation. The official bordered badge is saved in `assets/chrome-web-store-badge.png` from [Google's branding guidelines](https://developer.chrome.com/docs/webstore/branding) and displayed without alteration at its original aspect ratio. When updating Drift, refresh the version, ZIP URL, release link, event values, and feature summary in `index.html`. Keep the public extension privacy text in `privacy.html` synchronized with the extension’s policy; preserve the additional section explaining this website’s hosting, analytics, and referral links.

Funding links are Ko-fi, Buy Me a Coffee, then GitHub Sponsors. The GitHub Sponsor button is configured on the repository’s default branch.

## Privacy

Both public HTML pages load the deferred Tinylytics embed `https://tinylytics.app/embed/4pKqZQnKtz8i-yQCyZmX.js?events&beacon` to measure website visits, referral sources, and selected click events. The beacon option helps events survive navigation away from the page. This is separate from the extension, which contains no analytics script. Tinylytics does not use tracking cookies; its optional ignore setting can store a local preference. GitHub Pages records visitor IP addresses for security. Author-website links have static `utm_source=drift&utm_medium=website` tags, which distinguish them from links clicked inside the extension. See `privacy.html` for the complete disclosure.

## Website events

Events use Tinylytics' [documented HTML attributes](https://tinylytics.app/docs/analytics/events) and appear in the site's Events tab. Values are fixed labels, never extension content or visitor input. Each tagged control has its own ID so the collector's debounce does not group unrelated controls with the same CSS class.

| Event | Values | What it counts |
| --- | --- | --- |
| `install.open` | `hero`, `setup` | Clicks to the Chrome Web Store from each install button. |
| `file.download` | `drift-1.0.0.zip` | Clicks on the manual ZIP download. |
| `release.view` | `v1.0.0` | Clicks on release notes. |
| `release.changelog` | `homepage` | Clicks on the changelog. |
| `support.click` | `ko-fi`, `buy-me-a-coffee`, `github-sponsors` | Clicks to each support service. |
| `link.github` | `header`, `footer` | Clicks on the repository links. |
| `link.author` | `footer` | Clicks to the maintainer's website. |
| `help.open` | `homepage`, `privacy` | Clicks to GitHub issues. |
| `faq.toggle` | `selected-text`, `pin-drift`, `server-composer` | FAQ summary clicks, both opening and closing. |
| `navigation.section` | `guide`, `help`, `support` | Homepage section navigation. |
| `navigation.privacy` | `homepage` | Clicks to the privacy page. |
| `navigation.home` | `privacy-logo`, `privacy-back` | Clicks back to the homepage. |

These count clicks, not completed installations, file transfers, donations, or Mastodon posts. Collection respects Tinylytics' ignore setting; privacy tools can block requests. Verify using an intercepted collector during local testing so test clicks do not enter production analytics.

## License

MIT, copyright 2026 Kyle Reddoch. See `LICENSE`.

The Chrome Web Store badge is Google's official artwork and is used under the branding guidelines linked above.
