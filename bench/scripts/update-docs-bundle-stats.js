import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const ANALYSIS_JSON_PATH = "dist/reports/analysis.json";
const DOCS_APP_PAGE_PATH = join(
  "..",
  "docs-app",
  "app",
  "bundle-stats",
  "page.tsx",
);

console.log("\n🔄 Updating bundle stats in docs-app...\n");

try {
  const analysisData = JSON.parse(readFileSync(ANALYSIS_JSON_PATH, "utf-8"));

  const pageContent = readFileSync(DOCS_APP_PAGE_PATH, "utf-8");

  const startMarker = "// AUTO-GENERATED DATA - DO NOT EDIT MANUALLY";
  const endMarker = "// END AUTO-GENERATED DATA";

  const startIndex = pageContent.indexOf(startMarker);
  const endIndex = pageContent.indexOf(endMarker);

  if (startIndex === -1 || endIndex === -1) {
    throw new Error("Could not find data markers in page.tsx");
  }

  const newDataSection = `${startMarker}

const BUNDLE_DATA: BundleData = ${JSON.stringify(analysisData, null, 2)};
${endMarker}`;

  const newPageContent =
    pageContent.substring(0, startIndex) +
    newDataSection +
    pageContent.substring(endIndex + endMarker.length);

  writeFileSync(DOCS_APP_PAGE_PATH, newPageContent, "utf-8");

  console.log(
    "✅ Bundle stats updated successfully in docs-app/app/bundle-stats/page.tsx",
  );
  console.log(`📅 Timestamp: ${analysisData.timestamp}`);
  console.log(
    `📦 Core bundle: ${(analysisData.treeshaking.coreSize / 1024).toFixed(2)} KB`,
  );
  console.log(
    `📦 Full bundle: ${(analysisData.treeshaking.fullSize / 1024).toFixed(2)} KB`,
  );
  console.log(
    `📊 Plugin overhead: ${(analysisData.treeshaking.pluginOverhead / 1024).toFixed(2)} KB`,
  );
  console.log("\n✨ Done! Now you can commit and deploy docs-app to Vercel.\n");
} catch (error) {
  console.error("❌ Error updating bundle stats:", error.message);
  process.exit(1);
}
