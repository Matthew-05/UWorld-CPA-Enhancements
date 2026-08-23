(() => {
  const PANEL_ID = 'uworld-score-compare-panel';
  let lastResult = '';

  const normalize = (value) => value.replace(/\s+/g, ' ').trim();

  const parsePercentNearLabel = (text, labels) => {
    for (const label of labels) {
      const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const patterns = [
        new RegExp(`${escaped}[^%0-9]{0,40}(\\d{1,3}(?:\\.\\d+)?)\\s*%`, 'i'),
        new RegExp(`(\\d{1,3}(?:\\.\\d+)?)\\s*%[^a-z0-9]{0,20}${escaped}`, 'i')
      ];

      for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
          const value = Number(match[1]);
          if (Number.isFinite(value) && value >= 0 && value <= 100) return value;
        }
      }
    }
    return null;
  };

  const findPercentFromElements = (labels) => {
    const elements = [...document.querySelectorAll('body *')]
      .filter((el) => el.children.length === 0)
      .slice(0, 12000);

    for (const el of elements) {
      const text = normalize(el.textContent || '');
      if (!text || text.length > 160) continue;
      if (!labels.some((label) => text.toLowerCase().includes(label.toLowerCase()))) continue;

      const localText = normalize([
        el.previousElementSibling?.textContent || '',
        el.textContent || '',
        el.nextElementSibling?.textContent || '',
        el.parentElement?.textContent || ''
      ].join(' '));

      const value = parsePercentNearLabel(localText, labels);
      if (value !== null) return value;
    }
    return null;
  };

  const readScores = () => {
    const bodyText = normalize(document.body?.innerText || '');

    const yourLabels = [
      'your score', 'your percent correct', 'your % correct',
      'percent correct', '% correct', 'correct'
    ];

    const avgLabels = [
      'average', 'avg', 'average score', 'average % correct',
      'average percent correct', 'others', 'users correct',
      'answered correctly', 'peers'
    ];

    let average = parsePercentNearLabel(bodyText, avgLabels);
    let yours = parsePercentNearLabel(bodyText, ['your score', 'your percent correct', 'your % correct']);

    if (average === null) average = findPercentFromElements(avgLabels);
    if (yours === null) yours = findPercentFromElements(['your score', 'your percent correct', 'your % correct']);

    // Fallback for UWorld result/stat pages where "Percent Correct" is the user's score.
    if (yours === null) {
      yours = parsePercentNearLabel(bodyText, ['percent correct', '% correct']);
    }

    return { yours, average };
  };

  const ensurePanel = () => {
    let panel = document.getElementById(PANEL_ID);
    if (panel) return panel;

    panel = document.createElement('aside');
    panel.id = PANEL_ID;
    panel.setAttribute('aria-live', 'polite');
    panel.innerHTML = `
      <button class="uwsc-close" type="button" aria-label="Hide score comparison">×</button>
      <div class="uwsc-title">Score vs UWorld average</div>
      <div class="uwsc-values"></div>
      <div class="uwsc-diff"></div>
    `;

    panel.querySelector('.uwsc-close').addEventListener('click', () => {
      panel.remove();
    });

    document.body.appendChild(panel);
    return panel;
  };

  const render = () => {
    const { yours, average } = readScores();
    if (yours === null || average === null) return;

    const signature = `${yours}|${average}`;
    if (signature === lastResult && document.getElementById(PANEL_ID)) return;
    lastResult = signature;

    const panel = ensurePanel();
    const difference = Math.round((yours - average) * 10) / 10;
    const direction = difference > 0 ? 'above' : difference < 0 ? 'below' : 'equal to';
    const magnitude = Math.abs(difference);

    panel.classList.toggle('uwsc-above', difference > 0);
    panel.classList.toggle('uwsc-below', difference < 0);

    panel.querySelector('.uwsc-values').textContent = `You: ${yours}% · Average: ${average}%`;
    panel.querySelector('.uwsc-diff').textContent = difference === 0
      ? 'Exactly at the average'
      : `${magnitude} percentage point${magnitude === 1 ? '' : 's'} ${direction} average`;
  };

  let timer = null;
  const scheduleRender = () => {
    clearTimeout(timer);
    timer = setTimeout(render, 250);
  };

  render();

  const observer = new MutationObserver(scheduleRender);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });

  window.addEventListener('hashchange', scheduleRender);
  window.addEventListener('popstate', scheduleRender);
})();
