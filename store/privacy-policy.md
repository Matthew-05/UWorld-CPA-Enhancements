# Privacy Policy — UWorld CPA Enhancements (Unofficial)

_Last updated: 2026-09-23_

UWorld CPA Enhancements ("the extension") is an unofficial browser extension that
adds optional quality-of-life improvements to the UWorld CPA web app. This policy
explains what the extension does and does not do with your information.

## Summary

The extension does not collect, store, transmit, sell, or share any personal data.
It has no analytics, no tracking, no accounts, and no servers. Everything runs
locally in your browser.

## Information the extension handles

- **Settings.** The only information the extension saves is the state of its three
  feature toggles (on/off). These are stored using Chrome's
  `chrome.storage.sync` API under your own browser profile. If you have Chrome
  sync enabled, Google may sync these values across your devices under your
  Google account, governed by Google's own privacy policy. No other data is
  written to storage.
- **Page content.** To provide its features, the extension's content scripts read
  content that UWorld has already rendered in your browser (for example, question
  results and navigator labels) and annotate it on screen. This content is
  processed only in memory, on your device, and is never transmitted anywhere.
- **Session data.** The review-navigation feature keeps a short-lived cache of
  per-question results in your browser's `sessionStorage` so the coloring
  survives navigation within a test. It is cleared when the tab/session ends.

## Information the extension does NOT collect

- No personal information (name, email, address, etc.).
- No health, financial, or authentication information.
- No UWorld credentials, exam content, or question text is transmitted anywhere.
- No browsing history.
- No usage statistics or telemetry.

## Network activity

The extension makes no network requests of its own. It does not communicate with
the developer or any third party.

## Permissions

- **`storage`** — persists the feature toggles described above.
- **Host access to `*.uworld.com`** — required so the content scripts can run only
  on UWorld pages and modify the UI there. No other sites are accessed.

## Third parties

The extension does not share data with third parties because it does not collect
or transmit data at all.

## Children's privacy

The extension is not directed at children and collects no data from anyone.

## Changes to this policy

If this policy changes, the updated version will be published at this URL with a
new "last updated" date.

## Contact

Questions about this policy can be raised as an issue in the project repository.

## Disclaimer

UWorld CPA Enhancements is an independent, unofficial project. It is not
affiliated with, endorsed by, or sponsored by UWorld, LLC. "UWorld" is a trademark
of UWorld, LLC.
