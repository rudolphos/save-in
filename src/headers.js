const Headers = {
  refererListener: (details) => {
    // TODO: option to ignore or rewrite referer, check if needed
    const existingReferer = details.requestHeaders.find(
      (h) => h.name === "Referer"
    );
    if (existingReferer) {
      return {};
    }

    if (!globalChromeState || !globalChromeState.info) {
      return {};
    }

    const { pageUrl } = globalChromeState.info;
    if (!pageUrl) {
      return {};
    }

    const referer = {
      name: "Referer",
      value: pageUrl,
    };
    details.requestHeaders.push(referer);

    return { requestHeaders: details.requestHeaders };
  },

  addRequestListener: () => {
    // In Manifest V3, dynamic header mutation via webRequest.onBeforeSendHeaders is not allowed
    // for regular extensions. Detect MV3 and disable this feature.
    try {
      const manifest = chrome.runtime.getManifest && chrome.runtime.getManifest();
      if (manifest && manifest.manifest_version === 3) {
        // MV3: skip blocking listener registration. Dynamic Referer injection is disabled.
        return;
      }
    } catch (e) {
      // If detection fails, be conservative and return (no-op).
      return;
    }

    // MV2 logic: remove any existing listener and re-add if enabled
    browser.webRequest.onBeforeSendHeaders.removeListener(
      Headers.refererListener
    );

    if (options.setRefererHeader) {
      const filterList = options.setRefererHeaderFilter || "";

      const urls = filterList.split("\n").map((s) => s.trim());

      const listenerOptions = ["blocking", "requestHeaders"];

      // Chrome needs `extraHeaders` to set Referer
      // https://developer.chrome.com/extensions/webRequest
      // Firefox doesn't permit unknown options and dies, so we need this explicit check
      if (CURRENT_BROWSER === BROWSERS.CHROME) {
        listenerOptions.push("extraHeaders");
      }

      browser.webRequest.onBeforeSendHeaders.addListener(
        Headers.refererListener,
        { urls },
        listenerOptions
      );
    }
  },
};

// Export for testing
if (typeof module !== "undefined") {
  module.exports = Headers;
}
