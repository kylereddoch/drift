# Getting help with Drift

Open **Settings & help** in the popup to revisit the welcome page and common answers.

Once the repository is published, use [GitHub issues](https://github.com/kylereddoch/drift/issues/new/choose) for bugs, questions, and feature ideas. Include Drift’s version, Chrome’s version, the steps you tried, what happened, and what you expected. Use a public sample article when possible. Do not include private URLs, highlighted confidential text, passwords, or tokens.

## Common problems

- **No selected text:** highlight a passage directly in the article and then click Drift. Some embedded frames, PDFs, browser pages, and the Chrome Web Store prevent selection capture. Try the right-click selection action or paste the text yourself.
- **Only a page title and URL:** either there was no selection when Drift opened, or the page prevented access. Protected-page failures are explained in the popup.
- **Wrong account:** Drift uses your browser’s current Mastodon login for the selected server. Switch accounts on that server before publishing. A saved server is not a stored account login.
- **Invalid server:** use an HTTPS origin such as `https://mastodon.social`, without an `@username`, profile path, query string, or share path.
- **A cleaned link stops working:** turn off cleanup in the draft to restore the original URL. Cleanup removes only a small known list, but some sites use unusual signed or functional tracking parameters.
- **Long post:** your server validates the final post limit. Drift does not assume every instance uses 500 characters. Very large drafts cannot fit in a share URL; copy them instead.
- **Shortcut unavailable:** open `chrome://extensions/shortcuts` and assign Drift a free shortcut.
- **Draft disappeared after restarting:** draft recovery is temporary. Closing its source tab, restarting Chrome, or reloading/updating/disabling the extension clears its session data.

There is no automated error reporting. You decide what information to include in an issue.
