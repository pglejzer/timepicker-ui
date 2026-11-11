import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';

const INCLUDE = /<%=\s*require\(\s*["']\.\/partials\/([^"']+\.html)["']\s*\)\s*%>/g;

export function htmlPartials(): Plugin {
  let root = '';
  let partialsDir = '';

  return {
    name: 'html-partials',
    configResolved(config) {
      root = config.root;
      partialsDir = path.resolve(root, 'partials');
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html.replace(INCLUDE, (_match, file: string) => {
          const fullPath = path.resolve(partialsDir, file);
          if (!existsSync(fullPath)) {
            throw new Error(`html-partials: partial not found: partials/${file}`);
          }
          return readFileSync(fullPath, 'utf8');
        });
      },
    },
    configureServer(server) {
      server.watcher.add(partialsDir);
      const reload = (changed: string) => {
        if (path.resolve(changed).startsWith(partialsDir) && changed.endsWith('.html')) {
          server.ws.send({ type: 'full-reload' });
        }
      };
      server.watcher.on('change', reload);
      server.watcher.on('add', reload);
      server.watcher.on('unlink', reload);
    },
  };
}
