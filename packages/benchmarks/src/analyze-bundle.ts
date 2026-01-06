#!/usr/bin/env bun
/* eslint-disable no-console */
import {
  analyzeBundles,
  formatBundleComparison,
  saveBundleComparison,
  cleanup,
} from "./bundle-analyzer";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function main() {
  try {
    const comparison = await analyzeBundles();

    console.log(formatBundleComparison(comparison));
    saveBundleComparison(comparison);
    cleanup();
  } catch (error) {
    console.error("Error analyzing bundles:", error);
    process.exit(1);
  }
}

main();
