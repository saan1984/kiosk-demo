// Kiosk's real test suite. Every assertion here runs against the actual
// document.modelContext the polyfill installs — not a stand-in for it. See
// Chapter 8 for what that buys over mocking registerTool.
import { describe, it, expect } from 'vitest';
import './tools.js';

async function call(name, args) {
  const tools = await document.modelContext.getTools();
  const tool = tools.find((t) => t.name === name);
  const raw = await document.modelContext.executeTool(tool, JSON.stringify(args));
  return JSON.parse(raw);
}

describe('Kiosk tools', () => {
  it('registers the base tools on load', async () => {
    const tools = await document.modelContext.getTools();
    const names = tools.map((t) => t.name).sort();
    expect(names).toEqual(['add-to-cart', 'list-products', 'read-reviews', 'set-shipping-address']);
  });

  it('list-products lists the catalog', async () => {
    const result = await call('list-products', {});
    expect(result.content[0].text).toContain('Trail Runner 2');
  });

  it('read-reviews returns an actionable error for an unknown id', async () => {
    const result = await call('read-reviews', { productId: 'nope' });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('list-products');
  });

  it('add-to-cart makes remove-from-cart and checkout appear', async () => {
    await call('add-to-cart', { productId: 'p1', quantity: 1 });
    // registerCartTools() runs on a deferred tick (§5.2) — give it one.
    await new Promise((resolve) => setTimeout(resolve, 0));

    const tools = await document.modelContext.getTools();
    const names = tools.map((t) => t.name);
    expect(names).toContain('checkout');
    expect(names).toContain('remove-from-cart');
  });

  it('checkout empties the cart and checkout disappears again', async () => {
    const result = await call('checkout', {});
    expect(result.content[0].text).toContain('Order placed');
    await new Promise((resolve) => setTimeout(resolve, 0));

    const tools = await document.modelContext.getTools();
    const names = tools.map((t) => t.name);
    expect(names).not.toContain('checkout');
    expect(names).not.toContain('remove-from-cart');
  });

  it('a second checkout call before the deferred unregister errors instead of double-charging', async () => {
    await call('add-to-cart', { productId: 'p1', quantity: 1 });
    await new Promise((resolve) => setTimeout(resolve, 0));

    const tools = await document.modelContext.getTools();
    const checkout = tools.find((t) => t.name === 'checkout');
    const [first, second] = await Promise.all([
      document.modelContext.executeTool(checkout, JSON.stringify({})),
      document.modelContext.executeTool(checkout, JSON.stringify({})),
    ]).then((results) => results.map((r) => JSON.parse(r)));

    expect(first.content[0].text).toContain('Order placed for 1 item');
    expect(second.isError).toBe(true);
    expect(second.content[0].text).toContain('already empty');
  });
});
