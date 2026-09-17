// Demo-only, not part of Kiosk as the book builds it. Tells the visitor which
// WebMCP their browser is actually running, because the answer differs by
// visitor: native when chrome://flags "WebMCP for testing" is enabled, the
// polyfill otherwise.
//
// Deferred to DOMContentLoaded because the check is only meaningful after
// tools.js has run initializeWebMCPPolyfill(). Module scripts all execute
// before that event fires, whatever order a bundler puts them in.

const FLAGS = `Chrome 149–156 with two <code>chrome://flags</code> entries enabled:
  "WebMCP for testing" for the API and "WebMCP support in DevTools" for the
  panel`;

const MODES = {
  native: `<strong>Your browser is running native WebMCP here.</strong> These
    tools are registered with Chrome's own implementation. If you've also enabled
    "WebMCP support in DevTools" in <code>chrome://flags</code>, DevTools →
    Application → WebMCP lists them.`,
  polyfill: `<strong>Your browser is running the polyfill here, not native
    WebMCP.</strong> <code>document.modelContext.getTools()</code> works in the
    console, but DevTools' WebMCP panel stays empty, because the panel only sees
    Chrome's own implementation. That's expected rather than a bug; §2.3 explains
    it. To see native tools, use ${FLAGS}.`,
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
