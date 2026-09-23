# UWorld Enhancements

A small Manifest V3 Chrome extension that improves the UWorld web app:

1. [Peer-average score marker](#1-peer-average-score-marker)
2. [Question review navigation color coding](#2-question-review-navigation-color-coding)
3. [Find, selection and copy unblock](#3-find-selection-and-copy-unblock)

## Install

1. Open `chrome://extensions` in Chrome.
2. Turn on **Developer mode**.
3. Click **Load unpacked**.
4. Select this `src` folder.
5. Open or refresh your UWorld results/review page.

The extension only reads text already rendered in the current UWorld tab. It does not send data anywhere.

## 1. Peer-average score marker

On `/performance/test/results/` pages, `content.js` adds a marker directly to the **Points Scored** bar so your displayed score can be compared with the mean of the **% CORRECT OTHERS** column from the question table.

- The marker is positioned at the peers' average percentage.
- An inline caption below the score bar shows the average and how many points above/below it you are.
- Your score is read from the summary (`Points Scored`) with a fallback to the `Total Correct` / `Total Incorrect` / `Total Omitted` stats.

It only appears once both the score summary and the question table have loaded, and it re-renders as the page changes.

## 2. Question review navigation color coding

In Tutor mode, UWorld's question navigator (`.question-review-nav`) only distinguishes answered (`question-sequence-dirty`) from unanswered (`question-sequence-default`) — it never shows whether you got a question right or wrong. `review-nav.js` adds that.

- For the question currently being viewed, it reads the result from the feedback banner (`div.correct-answer.content` vs `div.incorrect-answer.content`).
- The result is remembered per question number, so the nav fills in as you move through the test.
- Each `.question-sequence` item is tagged:
  - **green** (`uwrn-correct`) — answered correctly
  - **orange** (`uwrn-incorrect`) — answered incorrectly
  - **gray** (`uwrn-unanswered`) — unanswered or result not yet known

Results are cached in `sessionStorage`, keyed by test id plus testlet number, so switching testlets resets the colors. Because Angular re-renders the nav, a `MutationObserver` re-applies the classes.

> Note: correctness is only available in Tutor mode. In a timed/exam test the feedback is withheld until submission, so nothing is colored.

## 3. Find, selection and copy unblock

`find-unblock.js` restores browser features UWorld suppresses: native find (**Ctrl/Cmd+F**, **F3**, **Ctrl/Cmd+G**), text selection, copy and the right-click menu.

It runs at `document_start` and listens on `window` in the capture phase, so it sees keyboard and selection events before UWorld's own handlers and stops them from cancelling those events. It never calls `preventDefault()` itself, so Chrome's find bar opens normally. It also injects a `user-select: text` stylesheet to undo the CSS-level selection block.
