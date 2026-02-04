import { defineConfig } from 'tsup';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'plugins/range': 'src/range.ts',
    'plugins/timezone': 'src/timezone.ts',
  },
  format: ['esm', 'cjs'],
  outDir: '../dist',
  clean: true,
  minify: !isDev,
  sourcemap: isDev,
  splitting: false,
  dts: false,
  target: 'es2022',
  tsconfig: './tsconfig.prod.json',
  treeshake: true,
  metafile: isDev,
  loader: {
    '.svg': 'text',
  },
  esbuildOptions(options) {
    options.assetNames = '[name].[ext]';
    if (isDev) {
      options.metafile = true;
      options.logLevel = 'info';
    }
  },
  esbuildPlugins: isDev
    ? [
        {
          name: 'bundle-analysis',
          setup(build) {
            build.onEnd((result) => {
              if (result.metafile) {
                console.log('\n📦 Bundle Analysis:');
                const outputs = result.metafile.outputs;
                const stats: any[] = [];

                Object.entries(outputs).forEach(([file, data]) => {
                  const sizeKB = (data.bytes / 1024).toFixed(2);
                  console.log(`  ${file}: ${sizeKB} KB`);
                  stats.push({ file, bytes: data.bytes, sizeKB });
                });

                // Generowanie HTML
                const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bundle Stats - timepicker-ui</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; padding: 2rem; background: #0d1117; color: #c9d1d9; }
    h1 { margin-bottom: 2rem; font-size: 2rem; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .card { background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 1.5rem; }
    .card h3 { font-size: 0.875rem; color: #8b949e; margin-bottom: 0.5rem; text-transform: uppercase; }
    .card .value { font-size: 2rem; font-weight: 700; color: #58a6ff; }
    .files { background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 1.5rem; }
    .file-item { display: grid; grid-template-columns: 1fr auto; gap: 1rem; padding: 0.75rem; border-bottom: 1px solid #21262d; }
    .file-item:last-child { border-bottom: none; }
    .file-name { font-family: 'Monaco', 'Consolas', monospace; font-size: 0.875rem; }
    .file-size { font-weight: 600; color: #58a6ff; }
    .bar { height: 8px; background: #21262d; border-radius: 4px; overflow: hidden; margin-top: 0.5rem; }
    .bar-fill { height: 100%; background: linear-gradient(90deg, #58a6ff, #1f6feb); transition: width 0.3s; }
  </style>
</head>
<body>
  <h1>📦 Bundle Statistics</h1>
  <div class="summary">
    <div class="card">
      <h3>Total Files</h3>
      <div class="value">${stats.length}</div>
    </div>
    <div class="card">
      <h3>Total Size</h3>
      <div class="value">${(stats.reduce((sum, s) => sum + s.bytes, 0) / 1024).toFixed(2)} KB</div>
    </div>
    <div class="card">
      <h3>Largest Bundle</h3>
      <div class="value">${Math.max(...stats.map((s) => parseFloat(s.sizeKB))).toFixed(2)} KB</div>
    </div>
  </div>
  <div class="files">
    <h2 style="margin-bottom: 1rem;">Bundle Files</h2>
    ${stats
      .map((s) => {
        const maxSize = Math.max(...stats.map((x) => x.bytes));
        const percent = ((s.bytes / maxSize) * 100).toFixed(1);
        return `
        <div class="file-item">
          <div>
            <div class="file-name">${s.file.replace('../dist/', '')}</div>
            <div class="bar"><div class="bar-fill" style="width: ${percent}%"></div></div>
          </div>
          <div class="file-size">${s.sizeKB} KB</div>
        </div>
      `;
      })
      .join('')}
  </div>
  <script>
    const data = ${JSON.stringify(stats)};
    console.log('Bundle data:', data);
  </script>
</body>
</html>`;

                const outputPath = resolve('coverage/bundle-stats.html');
                writeFileSync(outputPath, html, 'utf-8');
                console.log(`\n✅ Bundle stats saved to: coverage/bundle-stats.html`);
              }
            });
          },
        },
      ]
    : [],
  onSuccess: isDev
    ? async () => {
        console.log('✅ Build completed in DEV mode with analysis');
      }
    : undefined,
});
