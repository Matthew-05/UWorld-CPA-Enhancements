# Chrome Web Store listing

Copy-paste fields for the [Chrome Web Store developer dashboard](https://chrome.google.com/webstore/devconsole).
Upload package: `dist/uworld-cpa-enhancements-<version>.zip`.

## Store listing tab

**Extension name**
```
UWorld CPA Enhancements (Unofficial)
```

**Short description** (<= 132 chars)
```
Peer-average score marker, color-coded review navigation, and restored find/copy for the UWorld CPA web app.
```

**Category:** Productivity
**Language:** English

**Detailed description**
```
UWorld CPA Enhancements is an unofficial, open-source extension that adds a few quality-of-life improvements to the UWorld CPA question bank. It is not affiliated with, endorsed by, or sponsored by UWorld.

FEATURES

* Peer-average score marker
  Adds a marker to the "Points Scored" bar on test-results pages showing the average of the "% CORRECT OTHERS" column, plus a caption telling you how many points above or below the peer average you scored. Colors follow your light/dark theme.

* Color-coded review navigation
  In Tutor mode, the question navigator numbers are colored green (correct), orange (incorrect), or gray (unanswered) while you review, so you can jump straight to the questions you missed. In timed/exam mode the result is withheld by UWorld until submission, so nothing is colored.

* Find, selection and copy restored
  Restores the browser's own find bar (Ctrl/Cmd+F, F3, Ctrl/Cmd+G), text selection, copy and the right-click menu on pages where the site suppresses them.

Every feature has its own toggle in the popup and can be turned off individually. Changes apply live, no reload needed.

PRIVACY

Everything runs locally in your browser. The extension reads content already rendered on UWorld pages and makes no network requests. It does not collect, store, or transmit any personal data. The only thing saved is your three on/off toggles, synced through your own Chrome profile via chrome.storage.sync.

UWorld is a trademark of UWorld, LLC. This extension is an independent project and is not affiliated with UWorld.
```

**Screenshots:** upload `store/screenshots/score-vs-peers-1280x800.png` and
`store/screenshots/review-nav-1280x800.png`.

**Store icon:** `src/icons/icon128.png`.

## Privacy practices tab

**Single purpose**
```
UWorld CPA Enhancements adds three optional quality-of-life improvements to the UWorld CPA question-bank web app: a peer-average marker on the test-results Points Scored bar, color-coding of the Tutor-mode question review navigator by correct/incorrect/unanswered, and restoration of the browser's native find, text selection, copy and context menu where the site suppresses them. All processing happens locally in the browser.
```

**Permission justification: storage**
```
Saves the three on/off feature toggles selected in the extension popup via chrome.storage.sync, so the settings persist and follow the user's Chrome profile. No other data is stored.
```

**Host permission justification (content scripts on https://apps.uworld.com/* and https://*.uworld.com/*)**
```
All three features operate on content rendered by the UWorld web app (the test-results bar, the question navigator, and page-level find/selection/copy handlers). The content scripts must run on UWorld pages to read that rendered content, annotate it, and add the keyboard/selection listeners. Access is limited to UWorld domains; the extension requests no other hosts.
```

**Are you using remote code?**
```
No. All JavaScript, CSS and HTML are bundled in the package. The extension does not load, eval, or execute any remote code.
```

**Data usage**
```
The extension collects and transmits no user data. It does not use analytics, does not track users, and sends nothing off the device. Only the three local feature toggles are stored (chrome.storage.sync).
```

- Leave every data-collection checkbox unchecked (the extension collects no data).
- Certify that the extension complies with the Developer Program Policies.

## Notes before submitting

- The name keeps the "UWorld" mark but is explicitly "(Unofficial)"; if review staff
  object, change the name in `src/manifest.json` and re-submit.
- The detailed description and privacy policy both state the project is independent.
- Publish the privacy policy at a public URL (e.g. a GitHub Pages page or the
  repo's file view) and paste that URL into the privacy policy field.
