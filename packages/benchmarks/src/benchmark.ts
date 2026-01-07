#!/usr/bin/env bun
/* eslint-disable no-console */
import type { BenchmarkResult } from "./utils";

import { benchmarkCssProp } from "./benchmarks/css-prop";
import { benchmarkDeepTree } from "./benchmarks/deep-tree";
import { benchmarkInitialInjection } from "./benchmarks/initial-injection";
import { benchmarkReactRendering } from "./benchmarks/react-rendering";
import { benchmarkSSR } from "./benchmarks/ssr";
import { benchmarkVariantUpdates } from "./benchmarks/variant-updates";
import { benchmarkWideTree } from "./benchmarks/wide-tree";
import { analyzeBundles, formatBundleComparison, cleanup } from "./bundle-analyzer";
import {
  formatValidationResults,
  validateBenchmarkComparison,
  validateBenchmarkResult,
} from "./validation";

function formatComparison(stoop: BenchmarkResult, stitches: BenchmarkResult): string {
  const speedup = stitches.averageTime / stoop.averageTime;
  const faster = speedup > 1 ? "Stoop" : "Stitches";
  const factor = speedup > 1 ? speedup.toFixed(2) : (1 / speedup).toFixed(2);

  // Check if difference is statistically significant
  // Use confidence intervals to determine if there's a real difference
  const stoopLower = stoop.confidenceInterval.lower;
  const stoopUpper = stoop.confidenceInterval.upper;
  const stitchesLower = stitches.confidenceInterval.lower;
  const stitchesUpper = stitches.confidenceInterval.upper;

  // Check if confidence intervals overlap (not statistically significant)
  const intervalsOverlap =
    (stoopLower <= stitchesUpper && stoopUpper >= stitchesLower) ||
    (stitchesLower <= stoopUpper && stitchesUpper >= stoopLower);

  const significanceNote = intervalsOverlap
    ? " (difference may not be statistically significant)"
    : " (statistically significant)";

  // Calculate relative difference
  const relativeDiff =
    (Math.abs(stoop.averageTime - stitches.averageTime) /
      Math.max(stoop.averageTime, stitches.averageTime)) *
    100;

  // If difference is very small (< 5%), consider it negligible
  const negligibleNote = relativeDiff < 5 ? " (negligible difference)" : "";

  return `  ${faster} is ${factor}x faster${significanceNote}${negligibleNote}`;
}

function formatDetailedStats(result: BenchmarkResult): string {
  let stats =
    `    Avg: ${result.averageTime.toFixed(4)}ms | ` +
    `Median: ${result.medianTime.toFixed(4)}ms | ` +
    `StdDev: ${result.stdDev.toFixed(4)}ms | ` +
    `P95: ${result.p95.toFixed(4)}ms | ` +
    `P99: ${result.p99.toFixed(4)}ms | ` +
    `Outliers: ${result.outliers} | ` +
    `CI95%: [${result.confidenceInterval.lower.toFixed(4)}, ${result.confidenceInterval.upper.toFixed(4)}]ms`;

  if (result.memory) {
    const heapUsedMB = (result.memory.delta.heapUsed / 1024 / 1024).toFixed(2);

    stats += ` | Memory Δ: ${heapUsedMB}MB`;
  }

  return stats;
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
  console.log("─".repeat(70));
  try {
    const { stitches, stoop } = fn();

    // Validate individual results
    const stoopValidation = validateBenchmarkResult(stoop);
    const stitchesValidation = validateBenchmarkResult(stitches);

    // Validate comparison
    const comparisonValidation = validateBenchmarkComparison(stoop, stitches);

    console.log(`  Stoop:`);
    console.log(formatDetailedStats(stoop));
    if (!stoopValidation.passed || stoopValidation.warnings.length > 0) {
      console.log(formatValidationResults(stoopValidation));
    }

    console.log(`  Stitches:`);
    console.log(formatDetailedStats(stitches));
    if (!stitchesValidation.passed || stitchesValidation.warnings.length > 0) {
      console.log(formatValidationResults(stitchesValidation));
    }

    console.log(`  ${formatComparison(stoop, stitches)}`);

    if (!comparisonValidation.passed || comparisonValidation.warnings.length > 0) {
      console.log(formatValidationResults(comparisonValidation));
    }
  } catch (error) {
    console.error(`  Error: ${error}`);
    if (error instanceof Error) {
      console.error(`  Stack: ${error.stack}`);
    }
  }
}

// Run React rendering benchmarks
console.log("\n\n⚛️  React Rendering Benchmarks");
console.log("=".repeat(50));

try {
  const renderingResults = benchmarkReactRendering();

  for (const [testName, results] of Object.entries(renderingResults)) {
    console.log(`\n${testName}`);
    console.log("─".repeat(70));

    // Validate individual results
    const stoopValidation = validateBenchmarkResult(results.stoop);
    const stitchesValidation = validateBenchmarkResult(results.stitches);
    const comparisonValidation = validateBenchmarkComparison(results.stoop, results.stitches);

    console.log(`  Stoop:`);
    console.log(formatDetailedStats(results.stoop));
    if (!stoopValidation.passed || stoopValidation.warnings.length > 0) {
      console.log(formatValidationResults(stoopValidation));
    }

    console.log(`  Stitches:`);
    console.log(formatDetailedStats(results.stitches));
    if (!stitchesValidation.passed || stitchesValidation.warnings.length > 0) {
      console.log(formatValidationResults(stitchesValidation));
    }

    console.log(`  ${formatComparison(results.stoop, results.stitches)}`);

    if (!comparisonValidation.passed || comparisonValidation.warnings.length > 0) {
      console.log(formatValidationResults(comparisonValidation));
    }
  }
} catch (error) {
  console.error(`  Error running React rendering benchmarks: ${error}`);
  if (error instanceof Error) {
    console.error(`  Stack: ${error.stack}`);
  }
}

// Run SSR benchmarks
console.log("\n\n🌐 SSR Benchmarks");
console.log("=".repeat(70));

try {
  const ssrResults = benchmarkSSR();

  for (const [testName, results] of Object.entries(ssrResults)) {
    console.log(`\n${testName}`);
    console.log("─".repeat(70));

    // Validate individual results
    const stoopValidation = validateBenchmarkResult(results.stoop);
    const stitchesValidation = validateBenchmarkResult(results.stitches);
    const comparisonValidation = validateBenchmarkComparison(results.stoop, results.stitches);

    console.log(`  Stoop:`);
    console.log(formatDetailedStats(results.stoop));
    if (!stoopValidation.passed || stoopValidation.warnings.length > 0) {
      console.log(formatValidationResults(stoopValidation));
    }

    console.log(`  Stitches:`);
    console.log(formatDetailedStats(results.stitches));
    if (!stitchesValidation.passed || stitchesValidation.warnings.length > 0) {
      console.log(formatValidationResults(stitchesValidation));
    }

    console.log(`  ${formatComparison(results.stoop, results.stitches)}`);

    if (!comparisonValidation.passed || comparisonValidation.warnings.length > 0) {
      console.log(formatValidationResults(comparisonValidation));
    }
  }
} catch (error) {
  console.error(`  Error running SSR benchmarks: ${error}`);
  if (error instanceof Error) {
    console.error(`  Stack: ${error.stack}`);
  }
}

console.log("\n✅ Benchmarks complete!");
cleanup();
