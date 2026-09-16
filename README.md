# Kiosk — the demo app from *WebMCP in Practice*

Kiosk is a small outdoor gear shop: a product list, a search form, and a cart.
It is the app built across *WebMCP in Practice* by Sandeep Kumar Patel, one
capability per chapter, and every code listing in that book was extracted from
this source and checked against it.

## Running it locally

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # the book's Chapter 8 suite (Vitest + jsdom)
```

## What works on the deployed demo

Everything a shopper can do works with no agent and no WebMCP support at all:
search the catalog, add to the cart, remove, check out. That is deliberate.
Every tool in the book is a second way to reach something that already works,
never the only way.

The "Tools available to an agent right now" panel is real. It lists whatever
`document.modelContext.getTools()` currently returns and redraws itself on the
`toolchange` event, so the cart tools appearing and disappearing with the
cart's contents is something you can watch rather than take on faith.

## What to expect from the deployed demo

The deployed page runs the **polyfill**, not native WebMCP. Chrome's origin
trial needs a token tied to its own origin, and the local testing flag only
affects the browser you turn it on in. So:

- `document.modelContext.getTools()` works in the console.
- The on-page tool panel works.
- DevTools' **WebMCP panel stays empty**. That is expected on a polyfilled
  page rather than a bug, and the book explains why in §2.3.

To see the tools through native WebMCP instead, run this locally in Chrome
149–156 with "WebMCP for testing" enabled in `chrome://flags`.

## The book

*WebMCP in Practice* — a short guide to building websites AI agents can use.
Written by [Sandeep Kumar Patel](https://tutorialsavvy.com).

## License

MIT, see [LICENSE](LICENSE). Use it, change it, ship it in your own project.
The book's own text and figures are separate and remain all rights reserved.
