export interface BundleFile {
  name: string;
  displayName?: string;
  raw: number;
  gzip: number;
  brotli: number;
}

export interface BundleResult {
  label: string;
  files: BundleFile[];
  total: { raw: number; gzip: number; brotli: number };
}

export interface BundleData {
  timestamp: string;
  results: {
    rollup: {
      core: BundleResult;
      full: BundleResult;
      lazy: BundleResult;
    };
    vite: {
      core: BundleResult;
      full: BundleResult;
      lazy: BundleResult;
    };
    webpack: {
      core: BundleResult;
      full: BundleResult;
      lazy: BundleResult;
    };
    esbuild: {
      core: BundleResult;
      full: BundleResult;
      lazy: BundleResult;
    };
  };
  treeshaking: {
    coreSize: number;
    fullSize: number;
    pluginOverhead: number;
    pluginOverheadPercent: string;
  };
}

export function formatBytes(bytes: number): string {
  return (bytes / 1024).toFixed(2) + " KB";
}
