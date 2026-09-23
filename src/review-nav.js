// Color-codes UWorld's question review navigation by result.
//
// UWorld's nav only exposes "default" (unanswered), "dirty" (answered) and
// "current" during a test. In Tutor mode the result for the question being
// viewed is rendered in the feedback banner (.correct-answer / .incorrect-answer
// with text). We read that banner for the current question, remember the result
// per question number, and add a class to each nav item.
(() => {
  'use strict';

  const NAV_ROOT = '.question-review-nav';
  const ITEM = '.question-sequence';
  const CURRENT = '.question-sequence-current';
  const STORAGE_KEY = 'uworld-review-nav-results';
  const STATE_CLASSES = ['uwrn-correct', 'uwrn-incorrect', 'uwrn-unanswered'];

  const text = (element) => String(element?.textContent || '')
    .replace(/\s+/g, ' ')
    .trim();

  const computeKey = () => {
    const testMatch = /launchtest\/(\d+)/i.exec(window.location.pathname);
    const testId = testMatch ? testMatch[1] : window.location.pathname;
    const header = document.querySelector('cpa-header .header-nav') || document.querySelector('cpa-header');
    const testletMatch = /testlet\s*[-\u2013]?\s*(\d+)/i.exec(text(header));
    return `${testId}:${testletMatch ? testletMatch[1] : '0'}`;
  };

  const load = (key) => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      const saved = JSON.parse(raw);
      return saved && saved.key === key ? (saved.results || {}) : {};
    } catch (error) {
      return {};
    }
  };

  const save = (key) => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ key, results }));
    } catch (error) {
      /* sessionStorage unavailable; keep results in memory only */
    }
  };

  const findBanner = () => {
    for (const element of document.querySelectorAll('[class*="correct-answer"],[class*="incorrect-answer"]')) {
      const tag = element.tagName;
      if (tag === 'I' || tag === 'SVG' || tag === 'PATH') continue;
      const className = element.getAttribute('class') || '';
      if (!/(^|\s)(correct|incorrect)-answer(\s|$)/.test(className)) continue;
      if (text(element)) return element;
    }
    return null;
  };

  const readResult = () => {
    const banner = findBanner();
    if (!banner) return null;

    const className = banner.getAttribute('class') || '';
    if (/(^|\s)incorrect-answer(\s|$)/.test(className)) return 'incorrect';
    if (/(^|\s)correct-answer(\s|$)/.test(className)) return 'correct';
    return /incorrect/i.test(text(banner)) ? 'incorrect' : 'correct';
  };

  let key = computeKey();
  let results = load(key);

  const render = () => {
    const root = document.querySelector(NAV_ROOT);
    if (!root) return;

    const nextKey = computeKey();
    if (nextKey !== key) {
      key = nextKey;
      results = load(key);
    }

    const current = root.querySelector(CURRENT);
    const currentNumber = Number.parseInt(text(current), 10);
    const result = readResult();
    if (result && Number.isInteger(currentNumber) && results[currentNumber] !== result) {
      results[currentNumber] = result;
      save(key);
    }

    for (const item of root.querySelectorAll(ITEM)) {
      const number = Number.parseInt(text(item.querySelector('span') || item), 10);
      item.classList.remove(...STATE_CLASSES);
      if (!Number.isInteger(number)) continue;

      const value = results[number];
      item.classList.add(
        value === 'correct' ? 'uwrn-correct'
          : value === 'incorrect' ? 'uwrn-incorrect'
            : 'uwrn-unanswered'
      );
    }
  };

  if (typeof document === 'undefined') return;

  let timer = null;
  const schedule = () => {
    clearTimeout(timer);
    timer = setTimeout(render, 150);
  };

  render();

  new MutationObserver(schedule).observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });

  window.addEventListener('hashchange', schedule);
  window.addEventListener('popstate', schedule);
})();
