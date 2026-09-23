// Shared feature-flag helpers. Loaded before the other content scripts so they
// can read the toggles stored by the popup and react to changes live.
(() => {
  'use strict';

  const DEFAULTS = {
    featureScoreMarker: true,
    featureReviewNav: true,
    featureUnblock: true
  };

  const read = (key, callback) => {
    const fallback = DEFAULTS[key] !== false;
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.sync) {
      callback(fallback);
      return;
    }
    try {
      chrome.storage.sync.get({ [key]: fallback }, (data) => {
        if (chrome.runtime && chrome.runtime.lastError) {
          callback(fallback);
          return;
        }
        callback(!data || data[key] !== false);
      });
    } catch (error) {
      callback(fallback);
    }
  };

  const watch = (key, apply) => {
    read(key, apply);
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.onChanged) return;
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== 'sync' || !changes || !(key in changes)) return;
      apply(changes[key].newValue !== false);
    });
  };

  if (typeof window !== 'undefined') {
    window.UWFeatures = { DEFAULTS, read, watch };
  }
})();
