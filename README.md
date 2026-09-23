# UWorld Enhancements

A small Manifest V3 Chrome extension that adds quality-of-life improvements to the
[UWorld](https://www.uworld.com) web app. Unofficial — not affiliated with or endorsed by UWorld.

## Features

- **Peer-average score marker** — marks the average of the `% CORRECT OTHERS` column on the
  test-results *Points Scored* bar and shows how far above or below it you are.
- **Question review navigation colors** — colors the Tutor-mode question navigator green
  (correct), orange (incorrect) or gray (unanswered).
- **Find, selection and copy unblock** — restores `Ctrl/Cmd+F`, `F3`, `Ctrl/Cmd+G`, text
  selection, copy and the right-click menu.

Every feature can be toggled on or off from the extension popup.

## Install (from source)

1. Open `chrome://extensions` in Chrome.
2. Turn on **Developer mode**.
3. Click **Load unpacked**.
4. Select the `src` folder in this repository.
5. Open or refresh a UWorld page.

## Usage

Click the extension icon in the toolbar to open the popup:

- **Score vs peers marker**, **Review nav colors** and **Find, selection & copy** toggle each
  feature. Changes apply live, no reload required.
- **Refresh page** reloads the active tab.

All toggles are stored in `chrome.storage.sync` and default to on.

## How it works

### Peer-average score marker

On `/performance/test/results/` pages, `content.js` reads the mean of the `% CORRECT OTHERS`
column and injects a marker into the existing *Points Scored* bar at that position. An inline
caption below the bar shows the peer average and your difference. Your score comes from the
`Points Scored` summary, with a fallback to the `Total Correct` / `Total Incorrect` /
`Total Omitted` stats. It re-renders as the page changes.

### Question review navigation colors

UWorld's navigator only distinguishes answered from unanswered during a test. In Tutor mode,
`review-nav.js` reads the feedback banner for the question you are viewing
(`div.correct-answer.content` / `div.incorrect-answer.content`), remembers the result per
question number, and tags each `.question-sequence` item:

| Color | Class | Meaning |
| --- | --- | --- |
| Green | `uwrn-correct` | answered correctly |
| Orange | `uwrn-incorrect` | answered incorrectly |
| Gray | `uwrn-unanswered` | unanswered or not yet known |

Results are cached in `sessionStorage`, keyed by test id plus testlet number, so a new testlet
starts clean. A `MutationObserver` re-applies the classes when Angular re-renders the nav.

> Correctness is only available in **Tutor mode**. In a timed/exam test the feedback is withheld
> until submission, so nothing is colored.

### Find, selection and copy unblock

`find-unblock.js` runs at `document_start` and listens on `window` in the capture phase, so it
sees keyboard and selection events before UWorld's handlers and stops them from cancelling
those events. It never calls `preventDefault()` itself, so Chrome's own find bar still opens
normally. It also injects a `user-select: text` stylesheet to undo the CSS-level selection block.

## Permissions and privacy

- **`storage`** — saves the popup toggles in `chrome.storage.sync`.
- **Host access** — limited to `*.uworld.com`.

The extension only reads content already rendered in the page. It makes no network requests and
sends no data anywhere.

## Development

Run the unit tests for the parsing helpers:

```sh
npm test
# or
node src/content.test.cjs
```

## Project layout

```
.
├── src/                  # unpacked extension (load this folder)
│   ├── manifest.json
│   ├── features.js       # shared feature-flag helpers
│   ├── content.js        # peer-average score marker
│   ├── review-nav.js     # review navigation colors
│   ├── find-unblock.js   # find / selection / copy fixes
│   ├── styles.css        # injected styles
│   ├── popup.html/.css/.js
│   ├── icons/
│   └── content.test.cjs  # parser tests
├── CHANGELOG.md
├── LICENSE
└── README.md
```

## License

[MIT](LICENSE)

