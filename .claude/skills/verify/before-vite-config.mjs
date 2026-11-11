import fs from 'node:fs';
import path from 'node:path';

const dir = path.resolve(process.argv[2] ?? '.verify/work/before/app').replaceAll('\\', '/');
const stub = !fs.existsSync(path.join(dir, 'node_modules', 'shiki'));

if (stub) {
  fs.writeFileSync(path.join(dir, 'shiki-stub.js'), "export const codeToHtml = async () => '<pre></pre>';\n");
}

const alias = stub
  ? `, resolve: { ...base.resolve, alias: { ...base.resolve?.alias, shiki: '${dir}/shiki-stub.js' } }`
  : '';

fs.writeFileSync(
  path.join(dir, 'vite.verify.config.ts'),
  `import base from './vite.config.ts';\nexport default { ...base, cacheDir: '${dir}/.vite-cache'${alias} };\n`,
);

console.log(stub ? 'before config: written, shiki stubbed' : 'before config: written');
