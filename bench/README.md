# Bundle Benchmark

Bundle size analysis for timepicker-ui across 4 bundlers (Rollup, Vite, Webpack, esbuild).

## Purpose

- Verify tree-shaking works correctly
- Measure real-world bundle sizes
- Compare bundler outputs
- Test lazy loading and code splitting

## Test Scenarios

**Core Only** - Base library without plugins  
**Full Static** - All plugins bundled statically  
**Lazy Load** - Plugins loaded dynamically (code splitting)  
**Tree Shake** - Unused imports eliminated

## Commands

```bash
npm run analyze:all        # Build all bundles
npm run compare            # Generate comparison report
npm run update-docs        # Update docs-app with results
```

## Output

- `dist/rollup/` - Rollup builds
- `dist/vite/` - Vite builds
- `dist/webpack/` - Webpack builds
- `dist/esbuild/` - esbuild builds
- `dist/reports/` - JSON + HTML reports

## Config Structure

```
config/
  rollup/    - Rollup configs (core, full, lazy)
  vite/      - Vite configs (core, full, lazy, unminified)
  webpack/   - Webpack configs (core, full, lazy)
  esbuild/   - esbuild configs (core, full, lazy)
```

All bundlers configured with:

- Tree-shaking enabled
- Minified + unminified outputs
- Source maps
- Gzip/Brotli compression analysis
