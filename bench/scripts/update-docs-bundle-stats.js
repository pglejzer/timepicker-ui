import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const ANALYSIS_JSON_PATH = "dist/reports/analysis.json";
const DOCS_APP_JSON_PATH = join("..", "docs-app", "public", "bundle-data.json");

console.log("\n🔄 Updating bundle stats in docs-app...\n");

try {
  const analysisData = JSON.parse(readFileSync(ANALYSIS_JSON_PATH, "utf-8"));

  writeFileSync(
    DOCS_APP_JSON_PATH,
    JSON.stringify(analysisData, null, 2),
    "utf-8",
  );

  console.log(
    "✅ Bundle stats updated successfully in docs-app/public/bundle-data.json",
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
