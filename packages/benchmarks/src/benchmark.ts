#!/usr/bin/env bun
/* eslint-disable no-console */
import type { BenchmarkResult } from "./utils";

import { benchmarkCssProp } from "./benchmarks/css-prop";
import { benchmarkDeepTree } from "./benchmarks/deep-tree";
import { benchmarkInitialInjection } from "./benchmarks/initial-injection";
import { benchmarkReactRendering } from "./benchmarks/react-rendering";
import { benchmarkVariantUpdates } from "./benchmarks/variant-updates";
import { benchmarkWideTree } from "./benchmarks/wide-tree";
import { analyzeBundles, formatBundleComparison, cleanup } from "./bundle-analyzer";

function formatComparison(stoop: BenchmarkResult, stitches: BenchmarkResult): string {
  const speedup = stitches.averageTime / stoop.averageTime;
  const faster = speedup > 1 ? "Stoop" : "Stitches";
  const factor = speedup > 1 ? speedup.toFixed(2) : (1 / speedup).toFixed(2);

  return `  ${faster} is ${factor}x faster`;
}

console.log("🚀 Running Stoop vs Stitches Benchmarks\n");

// Bundle Size Analysis
try {
  const bundleComparison = await analyzeBundles();

  console.log(formatBundleComparison(bundleComparison));
} catch (error) {
  console.warn("⚠️  Bundle analysis failed, skipping:", error);
}

// Run CSS generation benchmarks
const benchmarks = [
  { fn: benchmarkInitialInjection, name: "Initial Injection" },
  { fn: benchmarkVariantUpdates, name: "Variant Updates" },
  { fn: benchmarkCssProp, name: "CSS Prop Updates" },
  { fn: benchmarkDeepTree, name: "Deep Tree" },
  { fn: benchmarkWideTree, name: "Wide Tree" },
];

console.log("📊 CSS Generation Benchmarks");
console.log("=".repeat(50));

for (const { fn, name } of benchmarks) {
  console.log(`\n${name}`);
  console.log("─".repeat(50));
  try {
    const { stitches, stoop } = fn();

    console.log(`  Stoop: ${stoop.averageTime.toFixed(4)}ms (avg)`);
    console.log(`  Stitches: ${stitches.averageTime.toFixed(4)}ms (avg)`);
    console.log(formatComparison(stoop, stitches));
  } catch (error) {
    console.error(`  Error: ${error}`);
  }
}

// Run React rendering benchmarks
console.log("\n\n⚛️  React Rendering Benchmarks");
console.log("=".repeat(50));

try {
  const renderingResults = benchmarkReactRendering();

  for (const [testName, results] of Object.entries(renderingResults)) {
    console.log(`\n${testName}`);
    console.log("─".repeat(50));
    console.log(`  Stoop: ${results.stoop.averageTime.toFixed(4)}ms (avg)`);
    console.log(`  Stitches: ${results.stitches.averageTime.toFixed(4)}ms (avg)`);
    console.log(formatComparison(results.stoop, results.stitches));
  }
} catch (error) {
  console.error(`  Error running React rendering benchmarks: ${error}`);
}

console.log("\n✅ Benchmarks complete!");
cleanup();
