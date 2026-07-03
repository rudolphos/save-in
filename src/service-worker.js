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

// Initialize service worker: load options from storage before anything else
// This ensures options are available when event handlers fire
(async function initServiceWorker() {
  try {
    console.log("Service worker starting up, loading options...");
    await OptionsManagement.loadOptions();
    console.log("Options loaded successfully");
  } catch (e) {
    console.warn("service-worker init: failed to load options", e);
  }
})();
