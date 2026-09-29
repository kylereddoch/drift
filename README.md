# Drift website

The public website for [Drift — Share to Mastodon](https://github.com/kylereddoch/drift), using the approved extension design and Rising quotes logo.

**Website:** https://kylereddoch.github.io/drift/

This checkout is separate from the extension on disk. Both belong to the `kylereddoch/drift` GitHub project:

- `main`: extension source, tests, and releases, locally in `D:\Github Repos\drift`.
- `gh-pages`: this static website, locally in `D:\Github Repos\drift-website`.

The site uses GitHub’s domain, with no custom domain or DNS changes. It does not use the `drift.github.io` hostname, which belongs to the GitHub account named `drift`.

## Work on the site

There are no runtime dependencies or build step. Edit `index.html`, `privacy.html`, and `assets/styles.css`. All links and branding are packaged locally; there is no browser extension API code in the website.

For a local preview with Node.js 24 or later:

```sh
node scripts/preview.mjs
```

Open `http://127.0.0.1:4174/drift/`. The preview uses the same `/drift/` base path as GitHub Pages.

## Publish changes

Commit reviewed website changes on `gh-pages` and push that branch. GitHub Pages deploys the branch root. `.nojekyll` keeps this a plain static site.

When updating Drift, refresh the preview version, ZIP URL, release link, and changelog summary in `index.html`. When a Chrome Web Store listing is actually available, replace the preview-only call to action with its verified URL. Keep the public extension privacy text in `privacy.html` synchronized with the extension’s policy; preserve the additional section explaining this website’s hosting and referral links.

Funding links are Ko-fi, Buy Me a Coffee, then GitHub Sponsors. The GitHub Sponsor button is configured on the repository’s default branch.

## Privacy

The site has no analytics script, cookies of its own, or storage. GitHub Pages records visitor IP addresses for security. Author-website links have static `utm_source=drift&utm_medium=website` tags, which distinguish them from links clicked inside the extension. See `privacy.html` for the complete disclosure.

## License

MIT, copyright 2026 Kyle Reddoch. See `LICENSE`.
