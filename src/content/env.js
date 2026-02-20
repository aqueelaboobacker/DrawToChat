// Configuration for Excalidraw asset paths
// This file must be imported FIRST in the application lifecycle before any Excalidraw components are evaluated.
window.EXCALIDRAW_ASSET_PATH = chrome.runtime.getURL(''); // Excalidraw natively appends 'excalidraw-assets/'

// Statically import the lazy-loaded vendor chunk.
// Because Content Scripts run in isolated worlds, Webpack's default JSONP chunk loader
// (which injects `<script>` tags into the host page's DOM) will trigger standard CSP violations.
// By statically importing it here, we force Vite to bundle the chunk synchronously,
// self-registering into `self.webpackChunkExcalidrawLib` and entirely bypassing the JSONP mechanism.
import "@excalidraw/excalidraw/dist/excalidraw-assets/vendor-677e88ca78c86bddf13d.js";
