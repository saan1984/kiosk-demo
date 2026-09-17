// Demo-only, not part of Kiosk as the book builds it. Tells the visitor which
// WebMCP their browser is actually running, because the answer differs by
// visitor: native when "WebMCP for testing" is enabled, the polyfill otherwise.
//
// Deferred to DOMContentLoaded because the check is only meaningful after
// tools.js has run initializeWebMCPPolyfill(). Module scripts all execute
// before that event fires, whatever order a bundler puts them in.

const MODES = {
  native: `<strong>Your browser is running native WebMCP here.</strong> Open
    DevTools → Application → WebMCP and you'll see these tools listed, the same
    way the book's screenshots show them.`,
  polyfill: `<strong>Your browser is running the polyfill here, not native
    WebMCP.</strong> <code>document.modelContext.getTools()</code> works in the
    console, but DevTools' WebMCP panel stays empty, because the panel only sees
    Chrome's own implementation. That's expected rather than a bug; §2.3 explains
    it. To see native tools, use Chrome 149–156 with "WebMCP for testing"
    enabled in <code>chrome://flags</code>.`,
  none: `<strong>WebMCP isn't available in this browser</strong>, so there are
    no tools to see. The shop still works normally, which is the point: every
    tool in the book is a second way in, never the only one (§9.5).`,
};

document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('demo-mode');
  if (!el) return;
  const mc = document.modelContext;
  const mode = !mc ? 'none' : mc.__isWebMCPPolyfill === true ? 'polyfill' : 'native';
  el.innerHTML = MODES[mode];
  el.dataset.mode = mode;
});
