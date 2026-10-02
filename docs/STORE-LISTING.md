# Drift 1.0.0 — Chrome Web Store upload guide

Prepared September 29, 2026. This is an upload kit, not confirmation of submission or approval.

## Upload the extension

In the developer dashboard, choose **Add new item** and upload **drift-1.0.0.zip** from this folder. The ZIP contains only the extension and its license. Keep the artwork and this guide outside the uploaded extension ZIP.

## Store listing

**Name (from the manifest):** Drift — Share to Mastodon

**Short description (from the manifest):** Share a page or highlighted passage to Mastodon, with its title and link. Edit your draft and choose your server before sharing.

**Category:** Social Media & Networking

**Language:** English

**Homepage URL:** https://drift.kylereddoch.me/

**Support URL:** https://github.com/kylereddoch/drift/issues

**Privacy policy URL:** https://drift.kylereddoch.me/privacy.html

**Mature content:** No. Drift supplies no mature content; users choose what to share.

### Detailed description — paste the text below

Share a page, a passage, a good find.

Highlight text in an article and click the Drift icon. Your selected passage appears first in an editable draft, followed by the page title and link. Add your thoughts, choose your Mastodon server, and continue to its composer to review and publish.

Your server. Your words. Your final say.

• Share highlighted text, a whole page, or a link from the right-click menu.
• Edit the draft before opening Mastodon, or copy it to use elsewhere.
• Save multiple servers and choose a default.
• Remove known tracking tags from links, with an option to restore the original URL.
• Recover your toolbar draft when you reopen Drift on the same page with the same selection during the browser session.
• Open Drift with Alt+Shift+M, or set your own shortcut in Chrome.
• Follow your system's light or dark appearance.
• Find setup instructions, help, release notes, and optional support links on the welcome page.

Drift uses the account already signed in on your chosen Mastodon server. No password, API token, or account connection is needed in the extension. Nothing is published automatically: you review and post from Mastodon itself.

Privacy and permissions

Drift reads the page title, URL, and selected text only when you invoke it. Server preferences stay in local extension storage. Drafts use temporary session storage and are cleared when their source tab closes, Chrome restarts, or the extension reloads. Opening your server's composer sends the draft to that server in an HTTPS URL before publication; it can appear in browser history and server logs.

There is no advertising, background browsing collection, or usage analytics inside the extension. Links to the maintainer's website carry fixed Drift referral tags after a click, without including the article URL or draft.

Permissions are limited to temporary access to the selected tab, reading highlighted text, saving preferences and drafts, and adding right-click actions. All extension code is bundled locally.

Some protected pages, PDF viewers, and embedded frames block selected-text access. You can paste a passage into the draft instead. Drift targets Mastodon's /share composer; other Fediverse software and alternative clients may not support it. Very long drafts may need to be shortened or copied.

Free and open source. Built and maintained by Kyle Reddoch. Independent project; not affiliated with Mastodon. Donations are optional and do not unlock features.

## Images

Upload these PNGs from the same folder:

| Dashboard field | File | Size |
| --- | --- | --- |
| Store icon | icon-128.png | 128 × 128, transparent padding |
| Screenshot 1 | screenshot-01-draft-light.png | 1280 × 800 |
| Screenshot 2 | screenshot-02-draft-dark.png | 1280 × 800 |
| Screenshot 3 | screenshot-03-welcome.png | 1280 × 800 |
| Screenshot 4 | screenshot-04-servers-and-guide.png | 1280 × 800 |
| Screenshot 5 | screenshot-05-help-and-support.png | 1280 × 800 |
| Small promo tile | promo-small-440x280.png | 440 × 280 |
| Marquee promo tile (optional) | promo-marquee-1400x560.png | 1400 × 560 |

Screenshots show actual packaged extension pages in an isolated browser, using sample article text and server settings. The editor screenshots show the separate-tab composer used by right-click sharing. No real accounts, article content, or personal browser tabs were captured. The promotional images are original brand artwork, not screenshots. A promotional video is optional and has not been supplied.

## Privacy practices

### Single purpose — paste

Drift prepares an editable Mastodon post from a page or passage the user explicitly chooses to share, then opens the user's selected Mastodon server to review and publish it. Saved servers, temporary drafts, link cleanup, copying, and right-click actions support this sharing flow.

### activeTab justification — paste

Temporary access to the active tab is required after the user clicks Drift or invokes its shortcut to obtain the page title and URL and read selected text for the sharing draft. Drift does not request persistent host access or monitor browsing in the background.

### scripting justification — paste

After the user invokes Drift, a bundled function reads window.getSelection().toString() in the active page's main frame. This supplies the highlighted passage for the editable draft. It does not modify the page or run remotely hosted code.

### storage justification — paste

chrome.storage.local stores the user's saved Mastodon server addresses, default server, and sharing preferences. chrome.storage.session holds temporary draft text and source information so edits survive closing and reopening the toolbar popup. Drafts clear on browser restart, extension reload, or closing their associated tab; users can also clear drafts and reset preferences in Drift.

### contextMenus justification — paste

Drift adds right-click actions to share a page, a link, or selected text. Each action prepares an editable draft in an extension tab and waits for the user to choose whether to continue to Mastodon.

### Remote code

Select **No, I am not using remote code**.

If an explanation field is shown: All JavaScript and styles are included in the extension package. Drift does not fetch or execute remote code, use eval, or load remote frames. Its content security policy blocks network connections from extension pages. User-initiated links open ordinary browser tabs; they do not load code into the extension.

### Data usage

Declare **Web history** and **Website content**. Here, Web history covers the URL and associated title of the specific page the user chooses to share; Drift has no browsing-history permission or background history collection. Website content covers the selected passage and editable post draft. Google's User Data FAQ requires disclosure even for local processing and storage.

No separate collection of personally identifiable information, health data, financial/payment data, authentication data, personal communications, location, or behavioral activity analytics is implemented. The sharing tool can process text a user deliberately supplies; it does not extract those categories independently or scan private messages/forms.

The implementation supports the three Limited Use certifications: it does not sell or transfer user data outside approved uses, use or transfer data for purposes unrelated to its single purpose, or use it for creditworthiness or lending. Review and check the dashboard's exact declarations as the publisher. The draft is transferred only to the Mastodon server chosen by the user when Continue to Mastodon is clicked.

## Test instructions — paste

Drift itself does not require an account, paid subscription, or credentials. No reviewer credentials are needed to test its setup, selection capture, editing, copying, preferences, or draft recovery.

1. Install Drift. Its welcome page opens. Add mastodon.social (or a Mastodon server you use) and pin the extension.
2. Open an ordinary HTTPS article with selectable text. Highlight a sentence and click Drift's toolbar icon.
3. Confirm the editable draft contains the quoted selection first, then the page title, then the URL. With no selection, it contains the title and URL.
4. Edit the draft, close the popup, and reopen it on the same page without changing the selection. Confirm the edit remains. Reset draft restores the generated text.
5. On a URL containing a utm_source parameter, toggle Remove known tracking tags. Confirm the tracking parameter is removed/restored without changing your prose.
6. Add a second server in Settings & help. Confirm both can be selected in the composer. Copy should copy the full draft (or select it for manual copying if clipboard access is unavailable).
7. Choose Continue to Mastodon. A new tab opens at the chosen HTTPS server's /share?text=... URL. A server account may be required to see its final composer; use your own review account. Drift reads no account credentials and never posts automatically. Publishing a test post is unnecessary.
8. Right-click a selected passage, page, or link and choose the matching Drift action. A draft opens in an extension tab. Link sharing includes the target URL without borrowing the original page title.
9. Welcome contains help, release notes, optional donations, privacy information, Clear temporary drafts, and Reset Drift. Light/dark appearance follows the browser/system preference.

Chrome settings pages and the Chrome Web Store block injection; use an ordinary web article for the highlight test. Some PDFs and embedded frames also block access. Drift falls back to title/link where possible. The draft counter does not claim to be the server's exact remaining character limit. Very long share URLs are rejected with a copy/shorten suggestion instead of truncating the draft.

## Distribution and submission

Use free pricing, public visibility, and all supported regions for the general release. There are no paid or donation-only features. Complete any account verification or trader-status fields with your own account/business information.

Save the listing, privacy, distribution, and test-instructions sections. Resolve any dashboard validation messages, then select **Submit for review**. To go live after approval, keep **Publish automatically after it has passed review** selected. Google approval is a separate step; uploading the ZIP alone does not submit or publish it.

After submission, record the item ID, listing URL, submitted version, and dashboard status. Update the project website's store button only when the public listing actually works.

## Sources checked September 29, 2026

- https://developer.chrome.com/docs/webstore/prepare
- https://developer.chrome.com/docs/webstore/publish
- https://developer.chrome.com/docs/webstore/images
- https://developer.chrome.com/docs/webstore/cws-dashboard-listing
- https://developer.chrome.com/docs/webstore/cws-dashboard-privacy
- https://developer.chrome.com/docs/webstore/program-policies/user-data-faq
- https://developer.chrome.com/docs/webstore/program-policies/listing-requirements
- https://developer.chrome.com/docs/webstore/best-practices
