# UWorld Score vs Average

A small Manifest V3 Chrome extension that adds a peer-average marker directly to UWorld's **Points Scored** bar. It compares the displayed score with the mean of the **% CORRECT OTHERS** column.

## Install

1. Open `chrome://extensions` in Chrome.
2. Turn on **Developer mode**.
3. Click **Load unpacked**.
4. Select this `src` folder.
5. Open or refresh your UWorld results/review page.

The extension only reads text already rendered in the current UWorld tab. It does not send data anywhere.

## Notes

The inline comparison only appears on `/performance/test/results/` pages after both the score summary and question table have loaded. It reads rendered page data locally and sends nothing elsewhere.
