// src/service-worker.js
// MV3 service worker entry point.
// Imports existing background scripts in dependency order (constants first, init last).
// Service worker lifecycle is event-driven; state persists in chrome.storage.

importScripts(
  "src/vendor/browser-polyfill.js",
  "src/vendor/content-disposition.js",
  "src/chrome-detector.js",
  "src/constants.js",
  "src/history.js",
  "src/notification.js",
  "src/path.js",
  "src/download.js",
  "src/router.js",
  "src/shortcut.js",
  "src/variable.js",
  "src/headers.js",
  "src/menu.js",
  "src/option.js",
  "src/messaging.js",
  "src/index.js"
);

// Rehydrate persisted state on startup (optional, if needed by background scripts)
(async function initServiceWorker() {
  try {
    const stored = await browser.storage.local.get();
    if (stored.globalChromeState && typeof globalChromeState !== "undefined") {
      Object.assign(globalChromeState, stored.globalChromeState);
    }
  } catch (e) {
    console.warn("service-worker init: could not rehydrate state", e);
  }
})();
