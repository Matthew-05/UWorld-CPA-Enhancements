# UWorld Score vs Average

A small Manifest V3 Chrome extension for UWorld that:

- adds a peer-average marker directly to the **Points Scored** bar, comparing the displayed score with the mean of the **% CORRECT OTHERS** column;
- restores the browser features UWorld suppresses — native find (**Ctrl/Cmd+F**, **F3**, **Ctrl/Cmd+G**), text selection, copy and the right-click menu.

## Install

1. Open `chrome://extensions` in Chrome.
2. Turn on **Developer mode**.
3. Click **Load unpacked**.
4. Select this `src` folder.
5. Open or refresh your UWorld results/review page.

The extension only reads text already rendered in the current UWorld tab. It does not send data anywhere.

## Notes

`find-unblock.js` runs at `document_start` and listens on `window` in the capture phase, so it sees keyboard and selection events before UWorld's own handlers and stops them from cancelling those events. It never calls `preventDefault()` itself, so Chrome's find bar opens normally. It also injects a `user-select: text` stylesheet to undo the CSS-level selection block.

The inline comparison only appears on `/performance/test/results/` pages after both the score summary and question table have loaded. It reads rendered page data locally and sends nothing elsewhere.
