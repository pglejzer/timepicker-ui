import { readFileSync } from 'node:fs';
import type { Plugin } from 'vite';

export function svgText(): Plugin {
  return {
    name: 'svg-text',
    enforce: 'pre',
    load(id) {
      const queryStart = id.indexOf('?');
      const file = queryStart === -1 ? id : id.slice(0, queryStart);
      if (!file.endsWith('.svg')) {
        return null;
      }
      const content = readFileSync(file, 'utf8');
      return `export default ${JSON.stringify(content)};`;
    },
  };
}
