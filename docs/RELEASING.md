# Releasing Drift

## Local readiness

- Run `npm ci`, install Playwright Chromium, and run `npm run verify`.
- Keep manifest, package version, and changelog consistent. Update the privacy policy if data handling changes.
- Inspect the toolbar popup, welcome page, keyboard navigation, and both themes.
- Test a highlighted article in current retail Chrome, a logged-out Mastodon handoff, and the logged-in composer. Confirm the account, text, title, URL, audience, and posting limit. Publishing a real test post is optional and requires the account owner’s approval.
- Confirm `dist/drift-VERSION.zip` contains a root manifest, packaged assets, and license; no node_modules, test artifacts, secrets, or developer profile.

## GitHub publication

Published September 29, 2026: [kylereddoch/drift](https://github.com/kylereddoch/drift), local extension directory `D:\Github Repos\drift`.

- `main` contains the extension, tests, issue forms, changelog, and MIT license.
- [v0.1.2](https://github.com/kylereddoch/drift/releases/tag/v0.1.2) is a GitHub prerelease with the verified extension ZIP. It is not a Chrome Web Store release.
- Sponsorships are enabled with Kyle’s GitHub Sponsors, Ko-fi, and Buy Me a Coffee destinations, matching existing projects. GitHub confirmed the account already has a Sponsors listing.
- GitHub Issues and private vulnerability reporting are enabled.
- The first hosted Linux verification run passed: [Verify Drift](https://github.com/kylereddoch/drift/actions/runs/36603828920).
- The website uses `gh-pages`, checked out separately at `D:\Github Repos\drift-website`, and GitHub Pages at `https://kylereddoch.github.io/drift/`. No custom domain is configured.

For subsequent previews, run the checks, push the reviewed commit, confirm its hosted verification run, and attach the generated ZIP to a matching prerelease tag. The development scripts do not push or publish automatically.

See [GitHub’s sponsor-button guide](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/displaying-a-sponsor-button-in-your-repository).

## Chrome Web Store submission (1.0.0 prepared)

The owner requested store submission on September 29, 2026. The upload bundle is in `dist/chrome-web-store-1.0.0/`; regenerate it with `npm run store` after `npm run verify`. Use [STORE-LISTING.md](STORE-LISTING.md) for the listing, privacy declarations, permission explanations, artwork mapping, and reviewer instructions.

The browser-control tool refused access to the developer dashboard with "The extensions gallery cannot be scripted." The upload and submission therefore require manual dashboard interaction. No store item ID, review submission, or approval has been confirmed. This is a tool limitation, not a missing authorization from the owner.

Review the current [publish guide](https://developer.chrome.com/docs/webstore/publish) and [program policies](https://developer.chrome.com/docs/webstore/program-policies/) at submission time.

- Use a registered Chrome Web Store developer account. Enter account-specific verification and legal declarations using the owner's actual details.
- Upload the verified ZIP and prepare accurate screenshots, the required store artwork, category, language, and support URL. The public privacy policy is `https://kylereddoch.github.io/drift/privacy.html`; keep it synchronized with the packaged policy.
- Complete the Privacy practices fields truthfully: Drift handles website content, URLs, selected text, and user-edited drafts locally and transmits a draft to the chosen Mastodon server on command. Author-website links also carry static Drift source tags for the website’s Tinylytics analytics after a click. “No extension usage analytics” does not mean “no data handling.”
- Explain each permission using README’s table. Single purpose: prepare and hand off a user-selected page or passage to Mastodon.
- Confirm no remotely hosted code, hidden features, or broader website access has been added.
- Verify current store requirements and name/branding availability before submission. An abstract working name does not establish exclusive rights.
- Submit for review when authorized by the owner (authorized for this first submission). A packaged ZIP is not Chrome Web Store approval or publication.

## Store listing draft

**Name:** Drift — Share to Mastodon

**Short description:** Share a page or highlighted passage to Mastodon, with its title and link. Edit your draft and choose your server before sharing.

**Overview:** Highlight a passage in an article and click Drift. Your selected text, page title, and URL appear in an editable draft. Add your own thoughts, choose your Mastodon server, and continue to its composer to review and publish. Drift also supports page and link sharing, saved servers, optional tracking cleanup, temporary draft recovery, copying, and a customizable keyboard shortcut. It has no usage analytics inside the extension, advertising, or account API access. Settings stay in your browser. Drafts are sent to your chosen server when you open its composer. Links to the maintainer’s website include a static Drift referral tag. Independent project; not affiliated with Mastodon.
