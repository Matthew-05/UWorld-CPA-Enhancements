// Restores browser features UWorld suppresses: native find (Ctrl/Cmd+F, F3,
// Ctrl+G), text selection, copy and the context menu.
//
// Runs at document_start and listens on `window` in the capture phase, so it
// sees each event before any page handler and can stop the page from calling
// preventDefault() on it. It never calls preventDefault() itself, which leaves
// the browser's own default behaviour (opening the find bar) intact.
(() => {
  'use strict';

  const KEY_EVENTS = ['keydown', 'keypress', 'keyup'];
  const PASSTHROUGH_EVENTS = [
    'selectstart',
    'select',
    'contextmenu',
    'copy',
    'cut',
    'dragstart'
  ];

  const isFindShortcut = (event) => {
    if (!event) return false;

    const key = String(event.key || '').toLowerCase();
    const code = event.keyCode || event.which || 0;
    const accel = event.ctrlKey || event.metaKey;

    // F3 / Shift+F3 — find next / previous.
    if (key === 'f3' || code === 114) return true;

    // Ctrl/Cmd+F — open find. Ctrl/Cmd+G — find next.
    if (accel && !event.altKey && (key === 'f' || key === 'g' || code === 70 || code === 71)) {
      return true;
    }

    return false;
  };

  const releaseEvent = (event) => {
    // Some pages stash a reference and call preventDefault() asynchronously.
    try {
      Object.defineProperty(event, 'preventDefault', {
        configurable: true,
        value: () => {}
      });
    } catch (error) {
      /* Non-configurable in some engines; stopping propagation still applies. */
    }
    event.stopImmediatePropagation();
  };

  const guardKeys = (event) => {
    if (isFindShortcut(event)) releaseEvent(event);
  };

  if (typeof module === 'object' && module.exports) {
    module.exports = { isFindShortcut };
  }

  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  for (const type of KEY_EVENTS) {
    window.addEventListener(type, guardKeys, true);
  }

  for (const type of PASSTHROUGH_EVENTS) {
    window.addEventListener(type, releaseEvent, true);
  }

  // Undo `user-select: none` and similar CSS-level blocks. Injected as its own
  // stylesheet at document_start so it applies before first paint.
  const applySelectionStyles = () => {
    if (document.getElementById('uworld-find-unblock-style')) return;

    const style = document.createElement('style');
    style.id = 'uworld-find-unblock-style';
    style.textContent = `
      *, *::before, *::after {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
        -webkit-touch-callout: default !important;
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  };

  applySelectionStyles();
  if (!document.head) {
    document.addEventListener('DOMContentLoaded', applySelectionStyles, { once: true });
  }
})();
