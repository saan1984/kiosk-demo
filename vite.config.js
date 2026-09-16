import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  // Relative rather than '/repo-name/', so this builds correctly on GitHub
  // Pages whatever the repository ends up being called. Kiosk is a single page
  // with no client-side routing, so relative asset paths resolve fine.
  base: './',
  server: { port: 5173 }
});
