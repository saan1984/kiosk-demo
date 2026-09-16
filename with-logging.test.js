import { describe, it, expect, vi } from 'vitest';
import { withLogging } from './with-logging.js';

describe('withLogging', () => {
  it('logs a successful call and still returns the real result', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const tool = {
      name: 'add-to-cart',
      async execute({ productId }) {
        return { content: [{ type: 'text', text: `added ${productId}` }] };
      },
    };

    const result = await withLogging(tool).execute({ productId: 'p1' });

    expect(result.content[0].text).toBe('added p1');
    expect(logSpy).toHaveBeenCalledWith(
      '[tool]', 'add-to-cart', { productId: 'p1' }, expect.stringMatching(/ms$/), 'ok',
    );
    logSpy.mockRestore();
  });

  it('logs a thrown error and still lets it propagate', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const tool = {
      name: 'read-reviews',
      async execute() { throw new Error('Product not found'); },
    };

    await expect(withLogging(tool).execute({ productId: 'nope' })).rejects.toThrow('Product not found');
    expect(logSpy).toHaveBeenCalledWith(
      '[tool]', 'read-reviews', { productId: 'nope' }, expect.stringMatching(/ms$/), 'threw:', 'Product not found',
    );
    logSpy.mockRestore();
  });
});
