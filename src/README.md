# UWorld Score vs Average

A small Manifest V3 Chrome extension that watches UWorld pages for your percent-correct score and the displayed UWorld/peer average, then shows the difference in a floating card.

## Install

1. Open `chrome://extensions` in Chrome.
2. Turn on **Developer mode**.
3. Click **Load unpacked**.
4. Select the `uworld-score-compare` folder.
5. Open or refresh your UWorld results/review page.

The extension only reads text already rendered in the current UWorld tab. It does not send data anywhere.

## Notes

UWorld is a single-page Angular app and its DOM can change. If your specific score page uses different labels, edit the label arrays near the top of `content.js`.
