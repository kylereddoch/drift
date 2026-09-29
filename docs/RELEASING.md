# Releasing Drift

## Local readiness

- Run `npm ci`, install Playwright Chromium, and run `npm run verify`.
- Keep manifest, package version, and changelog consistent. Update the privacy policy if data handling changes.
- Inspect the toolbar popup, welcome page, keyboard navigation, and both themes.
- Test a highlighted article in current retail Chrome, a logged-out Mastodon handoff, and the logged-in composer. Confirm the account, text, title, URL, audience, and posting limit. Publishing a real test post is optional and requires the account owner’s approval.
- Confirm `dist/drift-VERSION.zip` contains a root manifest, packaged assets, and license; no node_modules, test artifacts, secrets, or developer profile.

## First GitHub publication (pending)

The intended repository is `kylereddoch/drift`, local directory `D:\Github Repos\drift`. No remote or push is performed by the development scripts.

1. Confirm the repository name is available under Kyle’s account and create the public repository when authorized.
2. Review and commit the source, documentation, icons, package lock, and `.github` files. Add the verified remote and push `main`.
3. Verify the help and changelog URLs in `extension/lib/links.js`, README, privacy policy, and support docs.
4. Confirm GitHub Issues, the MIT license, private vulnerability reporting, and the CI workflow are enabled. Check the first CI run on GitHub; local checks do not verify hosted Linux CI.
5. Verify **Settings → General → Features → Sponsorships**, the Sponsor button, and its GitHub Sponsors, Ko-fi, and Buy Me a Coffee destinations. `.github/FUNDING.yml` is already populated from existing projects; this does not enroll a person in GitHub Sponsors.
6. Replace the welcome page’s “Local preview” status when publishing a release, and link to the real release. The changelog remains accessible from GitHub.

See [GitHub’s sponsor-button guide](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/displaying-a-sponsor-button-in-your-repository).

## Chrome Web Store submission (pending)

Review the current [publish guide](https://developer.chrome.com/docs/webstore/publish) and [program policies](https://developer.chrome.com/docs/webstore/program-policies/) at submission time.

- Use a registered Chrome Web Store developer account. Any registration/payment, policy attestations, and submission decisions belong to the owner.
- Upload the verified ZIP and prepare accurate screenshots, the required store artwork, category, language, support URL, and a publicly hosted privacy policy URL. The packaged privacy HTML alone is not a public URL.
- Complete the Privacy practices fields truthfully: Drift handles website content, URLs, selected text, and user-edited drafts locally and transmits a draft to the chosen Mastodon server on command. Author-website links also carry static Drift source tags for the website’s Tinylytics analytics after a click. “No extension usage analytics” does not mean “no data handling.”
- Explain each permission using README’s table. Single purpose: prepare and hand off a user-selected page or passage to Mastodon.
- Confirm no remotely hosted code, hidden features, or broader website access has been added.
- Verify current store requirements and name/branding availability before submission. An abstract working name does not establish exclusive rights.
- Submit for review only after owner approval. A packaged ZIP is not Chrome Web Store approval or publication.

## Store listing draft

**Name:** Drift — Share to Mastodon

**Short description:** Share a page or highlighted passage to Mastodon, with its title and link. Edit your draft and choose your server before sharing.

**Overview:** Highlight a passage in an article and click Drift. Your selected text, page title, and URL appear in an editable draft. Add your own thoughts, choose your Mastodon server, and continue to its composer to review and publish. Drift also supports page and link sharing, saved servers, optional tracking cleanup, temporary draft recovery, copying, and a customizable keyboard shortcut. It has no usage analytics inside the extension, advertising, or account API access. Settings stay in your browser. Drafts are sent to your chosen server when you open its composer. Links to the maintainer’s website include a static Drift referral tag. Independent project; not affiliated with Mastodon.
