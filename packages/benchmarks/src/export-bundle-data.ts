#!/usr/bin/env bun
/* eslint-disable no-console */
/**
 * Exports bundle analysis data in a format suitable for website display
 * This can be imported by the website to display bundle size comparisons
 */

import { writeFileSync, join } from "fs";

import { analyzeBundles, saveBundleComparison, cleanup } from "./bundle-analyzer";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function main() {
  try {
    const comparison = await analyzeBundles();

    // Save full comparison JSON
    const outputPath = join(process.cwd(), "dist", "bundle-analysis.json");

    saveBundleComparison(comparison, outputPath);

    // Create a simplified version for website consumption
    const websiteData = {
      comparison: {
        stoopVsStitches: comparison.summary.comparison.stoopVsStitches,
        winner: comparison.summary.comparison.winner,
      },
      lastUpdated: new Date().toISOString(),
      stitches: {
        gzippedKB: comparison.summary.stitches.gzippedKB,
        minifiedKB: comparison.summary.stitches.minifiedKB,
        treeShakingEffective: comparison.summary.stitches.treeShakingEffective,
      },
      stoop: {
        gzippedKB: comparison.summary.stoop.gzippedKB,
        minifiedKB: comparison.summary.stoop.minifiedKB,
        treeShakingEffective: comparison.summary.stoop.treeShakingEffective,
      },
    };

    const websiteOutputPath = join(process.cwd(), "dist", "bundle-data.json");

    writeFileSync(websiteOutputPath, JSON.stringify(websiteData, null, 2));
    console.log(`\n💾 Website bundle data saved to: ${websiteOutputPath}`);

    // Also create a TypeScript file for type-safe imports
    const tsOutputPath = join(process.cwd(), "dist", "bundle-data.ts");
    const tsContent = `// Auto-generated bundle size data
// Last updated: ${websiteData.lastUpdated}

export const bundleData = ${JSON.stringify(websiteData, null, 2)} as const;

export type BundleData = typeof bundleData;
`;

    writeFileSync(tsOutputPath, tsContent);
    console.log(`💾 TypeScript bundle data saved to: ${tsOutputPath}`);

    cleanup();
  } catch (error) {
    console.error("Error exporting bundle data:", error);
    process.exit(1);
  }
}

main();
