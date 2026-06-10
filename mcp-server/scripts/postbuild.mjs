import { cpSync, chmodSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

cpSync(resolve(root, 'src', 'generated'), resolve(root, 'build', 'generated'), { recursive: true });

const entry = resolve(root, 'build', 'index.js');
if (existsSync(entry)) chmodSync(entry, 0o755);

console.log('[postbuild] copied generated/ into build/ and marked entry executable');
