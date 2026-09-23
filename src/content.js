(() => {
  'use strict';

  const MARKER_ID = 'uworld-average-score-marker';
  const COMPARISON_ID = 'uworld-inline-score-comparison';
  const RESULTS_PATH = /\/performance\/test\/results\//i;
  const RESULTS_ROOT = '.test-results';
  const SUMMARY_ROOT = '.summary-stats';
  const OTHERS_COLUMN = '.mat-column-correct-percent';

  const normalize = (value) => String(value || '')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const validPercent = (value) => {
    const number = Number(value);
    return Number.isFinite(number) && number >= 0 && number <= 100
      ? number
      : null;
  };

  const parseStandalonePercent = (value) => {
    const match = /^\s*(\d{1,3}(?:\.\d+)?)\s*%\s*$/.exec(value || '');
    return match ? validPercent(match[1]) : null;
  };

  const parsePointsScored = (value) => {
    const match = /\bPoints Scored\b[^0-9%]{0,24}(\d{1,3}(?:\.\d+)?)\s*%/i.exec(
      normalize(value)
    );
    return match ? validPercent(match[1]) : null;
  };

  const averagePercentages = (values) => {
    const percentages = values
      .map(parseStandalonePercent)
      .filter((value) => value !== null);

    if (!percentages.length) return null;
    const mean = percentages.reduce((sum, value) => sum + value, 0) / percentages.length;
    return Math.round(mean * 10) / 10;
  };

  const elementText = (element) => element?.innerText || element?.textContent || '';

  const readStat = (root, label) => {
    for (const row of root.querySelectorAll('.score-stats .stats-row')) {
      const rowLabel = row.querySelector('.stats-label');
      if (normalize(elementText(rowLabel)).toLowerCase() !== label.toLowerCase()) continue;

      const valueElement = row.lastElementChild;
      const value = Number.parseFloat(normalize(elementText(valueElement)));
      return Number.isFinite(value) && value >= 0 ? value : null;
    }
    return null;
  };

  const readYourPercent = (root) => {
    const summary = root.querySelector(SUMMARY_ROOT);
    const displayedScore = parsePointsScored(elementText(summary));
    if (displayedScore !== null) return displayedScore;

    // Exact fallback for the captured Question Performance stats block.
    const correct = readStat(root, 'Total Correct');
    const incorrect = readStat(root, 'Total Incorrect');
    const omitted = readStat(root, 'Total Omitted') ?? 0;
    if (correct === null || incorrect === null) return null;

    const total = correct + incorrect + omitted;
    return total > 0 ? Math.round((correct / total) * 1000) / 10 : null;
  };

  const findOthersHeader = (table) => [...table.querySelectorAll('th')]
    .find((cell) => normalize(elementText(cell)).toUpperCase() === '% CORRECT OTHERS');

  const readOthersAverage = (root) => {
    const table = root.querySelector('.questions-info-table-div table.mat-table');
    if (!table) return null;

    const header = findOthersHeader(table);
    if (!header) return null;

    let cells = [...table.querySelectorAll(`tbody td${OTHERS_COLUMN}`)];

    // The captured Angular Material table names the entire column. Keeping the
    // header-index fallback makes the selector resilient if generated classes change.
    if (!cells.length) {
      const columnIndex = header.cellIndex;
      cells = [...table.querySelectorAll('tbody tr')]
        .map((row) => row.cells[columnIndex])
        .filter(Boolean);
    }

    const values = cells.map((cell) => normalize(elementText(cell)));
    const validValues = values.filter((value) => parseStandalonePercent(value) !== null);
    const average = averagePercentages(validValues);
    return average === null ? null : { average, questionCount: validValues.length };
  };

  const readResults = () => {
    if (!RESULTS_PATH.test(window.location.pathname)) return null;

    const root = document.querySelector(RESULTS_ROOT);
    if (!root) return null;

    const yours = readYourPercent(root);
    const others = readOthersAverage(root);
    if (yours === null || !others) return null;

    return { yours, ...others };
  };

  const formatPercent = (value) => Number.isInteger(value)
    ? String(value)
    : value.toFixed(1);

  const removeInjectedContent = () => {
    document.getElementById(MARKER_ID)?.remove();
    document.getElementById(COMPARISON_ID)?.remove();
  };

  const ensureInlineElements = (root) => {
    const scoreWidget = root.querySelector('.score-stats:not(.question-performance)');
    const statsArea = scoreWidget?.querySelector('.stats-area');
    const scoreBar = statsArea?.querySelector('.score-bar');
    if (!scoreWidget || !statsArea || !scoreBar) return null;

    let marker = document.getElementById(MARKER_ID);
    if (!marker) {
      marker = document.createElement('span');
      marker.id = MARKER_ID;
      marker.setAttribute('role', 'img');
      scoreBar.appendChild(marker);
    }

    let comparison = document.getElementById(COMPARISON_ID);
    if (!comparison) {
      comparison = document.createElement('div');
      comparison.id = COMPARISON_ID;
      comparison.setAttribute('aria-live', 'polite');
      comparison.innerHTML = `
        <span class="uwsc-average-value"><i aria-hidden="true"></i>Others' average <strong></strong></span>
        <span class="uwsc-difference"></span>
      `;
      statsArea.insertAdjacentElement('afterend', comparison);
    }

    return { marker, comparison };
  };

  let lastSignature = '';

  const render = () => {
    const results = readResults();
    if (!results) {
      removeInjectedContent();
      lastSignature = '';
      return;
    }

    const { yours, average, questionCount } = results;
    const signature = `${window.location.pathname}|${yours}|${average}|${questionCount}`;
    if (
      signature === lastSignature
      && document.getElementById(MARKER_ID)
      && document.getElementById(COMPARISON_ID)
    ) return;
    lastSignature = signature;

    const root = document.querySelector(RESULTS_ROOT);
    const inline = ensureInlineElements(root);
    if (!inline) return;

    const { marker, comparison } = inline;
    const difference = Math.round((yours - average) * 10) / 10;
    const magnitude = Math.abs(difference);

    marker.style.left = `${average}%`;
    marker.setAttribute(
      'aria-label',
      `Others' average is ${formatPercent(average)} percent across ${questionCount} questions`
    );

    comparison.classList.toggle('uwsc-above', difference > 0);
    comparison.classList.toggle('uwsc-below', difference < 0);
    comparison.querySelector('.uwsc-average-value strong').textContent = `${formatPercent(average)}%`;
    comparison.querySelector('.uwsc-difference').textContent = difference === 0
      ? 'You are at the average'
      : `${formatPercent(magnitude)} pts ${difference > 0 ? 'above' : 'below'}`;
    comparison.title = `Others' average across ${questionCount} question${questionCount === 1 ? '' : 's'}`;
  };

  if (typeof module === 'object' && module.exports) {
    module.exports = { parsePointsScored, parseStandalonePercent, averagePercentages };
  }

  if (typeof document === 'undefined') return;

  const FEATURE = 'featureScoreMarker';
  let timer = null;
  let observer = null;
  let running = false;

  const scheduleRender = () => {
    clearTimeout(timer);
    timer = setTimeout(render, 200);
  };

  const onNavigate = () => scheduleRender();

  const start = () => {
    if (running) return;
    running = true;
    render();
    observer = new MutationObserver(scheduleRender);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true
    });
    window.addEventListener('hashchange', onNavigate);
    window.addEventListener('popstate', onNavigate);
  };

  const stop = () => {
    if (!running) return;
    running = false;
    clearTimeout(timer);
    observer?.disconnect();
    observer = null;
    window.removeEventListener('hashchange', onNavigate);
    window.removeEventListener('popstate', onNavigate);
    removeInjectedContent();
    lastSignature = '';
  };

  const features = window.UWFeatures;
  if (features && typeof features.watch === 'function') {
    features.watch(FEATURE, (enabled) => (enabled ? start() : stop()));
  } else {
    start();
  }
})();
