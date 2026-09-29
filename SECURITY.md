# Security

Only the latest Drift release is supported. The current version is an unpublished local preview.

Please do not report exploitable security issues or private browsing data in a public issue. After publication, use GitHub’s **Security → Report a vulnerability** feature when enabled. If private reporting is unavailable, open a public issue asking the maintainer for a private reporting channel without including vulnerability details or confidential data.

Describe the affected version, a minimal reproduction using non-sensitive sample data, the impact, and any proposed fix. Do not include credentials or real private article content.

Drift intentionally uses temporary `activeTab` access, packaged scripts, strict CSP, local settings, and session-only drafts. It has no backend and no Mastodon API credentials.
