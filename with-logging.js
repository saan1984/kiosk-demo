// A small wrapper for observing tool calls in production. There is no
// built-in event for this — see Chapter 8 §8.6 — so this wraps a tool's own
// execute function instead of the platform giving you a hook.
export function withLogging(tool) {
  return {
    ...tool,
    async execute(args, options) {
      const startedAt = performance.now();
      try {
        const result = await tool.execute(args, options);
        console.log('[tool]', tool.name, args, `${(performance.now() - startedAt).toFixed(1)}ms`, 'ok');
        return result;
      } catch (error) {
        console.log('[tool]', tool.name, args, `${(performance.now() - startedAt).toFixed(1)}ms`, 'threw:', error.message);
        throw error;
      }
    },
  };
}
