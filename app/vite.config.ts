import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { htmlPartials } from './vite-plugin-html-partials.ts';
import { svgText } from './vite-plugin-svg-text.ts';

export default defineConfig({
  root: 'docs',
  plugins: [svgText(), htmlPartials()],
  resolve: {
    alias: {
      'timepicker-ui': fileURLToPath(new URL('./src/index.ts', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 8010,
    open: true,
  },
  build: {
    outDir: fileURLToPath(new URL('./dist', import.meta.url)),
    emptyOutDir: true,
  },
});
