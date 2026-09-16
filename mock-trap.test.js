// Not part of Kiosk's real suite — this file exists to demonstrate §8.1's
// warning with a real, reproducible bug, not a hypothetical one. Both tests
// below "register" two tools that collide on name, a realistic copy-paste
// mistake. Only one of them tells you anything went wrong.
import { describe, it, expect, vi } from 'vitest';
import { initializeWebMCPPolyfill } from '@mcp-b/webmcp-polyfill';

describe('a mocked registerTool lies about this bug', () => {
  it('passes even though the real platform would reject the second call', () => {
    const mockContext = { registerTool: vi.fn() };

    mockContext.registerTool({ name: 'list-products', description: 'List products.' });
    // Copy-paste mistake: this was meant to be a different tool.
    mockContext.registerTool({ name: 'list-products', description: 'Search products.' });

    expect(mockContext.registerTool).toHaveBeenCalledTimes(2);
  });
});

describe('the real registerTool does not', () => {
  it('rejects the second registration outright', async () => {
    initializeWebMCPPolyfill();

    await document.modelContext.registerTool({
      name: 'list-products',
      description: 'List products.',
      async execute() { return { content: [{ type: 'text', text: 'listing' }] }; },
    });

    // The same copy-paste mistake, against the real platform this time.
    await expect(
      document.modelContext.registerTool({
        name: 'list-products',
        description: 'Search products.',
        async execute() { return { content: [{ type: 'text', text: 'searching' }] }; },
      }),
    ).rejects.toThrow('Tool already registered: list-products');
  });
});
