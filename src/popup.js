(() => {
  'use strict';

  const FEATURES = ['featureScoreMarker', 'featureReviewNav', 'featureUnblock'];
  const DEFAULTS = {
    featureScoreMarker: true,
    featureReviewNav: true,
    featureUnblock: true
  };

  const inputs = {};

  const load = () => {
    chrome.storage.sync.get(DEFAULTS, (data) => {
      for (const key of FEATURES) {
        if (inputs[key]) inputs[key].checked = !data || data[key] !== false;
      }
    });
  };

  const save = (key, enabled) => {
    chrome.storage.sync.set({ [key]: enabled });
  };

  document.addEventListener('DOMContentLoaded', () => {
    for (const key of FEATURES) {
      const input = document.getElementById(key);
      if (!input) continue;
      inputs[key] = input;
      input.addEventListener('change', () => save(key, input.checked));
    }
    load();

    const refresh = document.getElementById('refresh');
    refresh?.addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs && tabs[0];
        if (tab && tab.id != null) chrome.tabs.reload(tab.id);
        window.close();
      });
    });
  });
})();
