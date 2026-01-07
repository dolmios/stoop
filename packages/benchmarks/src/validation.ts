/**
 * Validation utilities to ensure fair and accurate benchmarks
 */

import type { BenchmarkResult } from "./utils";

export interface ValidationResult {
  passed: boolean;
  warnings: string[];
  errors: string[];
}

/**
 * Validates that two benchmark results are comparable
 */
export function validateBenchmarkComparison(
  stoop: BenchmarkResult,
  stitches: BenchmarkResult,
): ValidationResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Check if both benchmarks ran with similar iteration counts
  const iterationDiff =
    Math.abs(stoop.iterations - stitches.iterations) /
    Math.max(stoop.iterations, stitches.iterations);

  if (iterationDiff > 0.2) {
    warnings.push(
      `Significant difference in iteration counts: Stoop (${stoop.iterations}) vs Stitches (${stitches.iterations}). Results may not be directly comparable.`,
    );
  }

  // Check if confidence intervals overlap significantly (may indicate unreliable results)
  const stoopCI = stoop.confidenceInterval;
  const stitchesCI = stitches.confidenceInterval;
  const ciOverlap =
    Math.max(stoopCI.lower, stitchesCI.lower) <= Math.min(stoopCI.upper, stitchesCI.upper);

  if (!ciOverlap) {
    // Confidence intervals don't overlap - this is good, means difference is significant
    // But check if the difference is meaningful
    const relativeDiff =
      Math.abs(stoop.averageTime - stitches.averageTime) /
      Math.max(stoop.averageTime, stitches.averageTime);

    if (relativeDiff < 0.05) {
      warnings.push(
        `Difference is statistically significant but very small (${(relativeDiff * 100).toFixed(2)}%). May not be meaningful in practice.`,
      );
    }
  } else {
    warnings.push(
      "Confidence intervals overlap significantly. The observed difference may not be statistically significant.",
    );
  }

  // Check for excessive outliers
  const stoopOutlierRatio = stoop.outliers / stoop.iterations;
  const stitchesOutlierRatio = stitches.outliers / stitches.iterations;

  if (stoopOutlierRatio > 0.05) {
    warnings.push(
      `Stoop has high outlier ratio (${(stoopOutlierRatio * 100).toFixed(2)}%). Results may be less reliable.`,
    );
  }

  if (stitchesOutlierRatio > 0.05) {
    warnings.push(
      `Stitches has high outlier ratio (${(stitchesOutlierRatio * 100).toFixed(2)}%). Results may be less reliable.`,
    );
  }

  // Check coefficient of variation (std dev / mean) - high CV indicates unstable results
  const stoopCV = stoop.stdDev / stoop.averageTime;
  const stitchesCV = stitches.stdDev / stitches.averageTime;

  if (stoopCV > 0.5) {
    warnings.push(
      `Stoop has high coefficient of variation (${(stoopCV * 100).toFixed(2)}%). Results are highly variable and may be unreliable.`,
    );
  }

  if (stitchesCV > 0.5) {
    warnings.push(
      `Stitches has high coefficient of variation (${(stitchesCV * 100).toFixed(2)}%). Results are highly variable and may be unreliable.`,
    );
  }

  // Check minimum iteration requirements
  if (stoop.iterations < 50) {
    errors.push(
      `Stoop benchmark has too few iterations (${stoop.iterations}). Minimum recommended: 50.`,
    );
  }

  if (stitches.iterations < 50) {
    errors.push(
      `Stitches benchmark has too few iterations (${stitches.iterations}). Minimum recommended: 50.`,
    );
  }

  return {
    errors,
    passed: errors.length === 0,
    warnings,
  };
}

/**
 * Validates that benchmark results are within reasonable bounds
 */
export function validateBenchmarkResult(result: BenchmarkResult): ValidationResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Check for negative or zero times
  if (result.averageTime <= 0) {
    errors.push("Average time is zero or negative. Benchmark may not be measuring correctly.");
  }

  if (result.minTime < 0) {
    errors.push("Minimum time is negative. This should not be possible.");
  }

  // Check for unrealistic values (likely measurement errors)
  if (result.maxTime > result.averageTime * 100) {
    warnings.push(
      `Maximum time (${result.maxTime.toFixed(4)}ms) is more than 100x the average (${result.averageTime.toFixed(4)}ms). This may indicate measurement errors or GC pauses.`,
    );
  }

  // Check confidence interval validity
  if (result.confidenceInterval.lower > result.confidenceInterval.upper) {
    errors.push("Confidence interval is invalid (lower > upper).");
  }

  if (result.confidenceInterval.lower < 0) {
    warnings.push(
      "Confidence interval lower bound is negative. This may indicate measurement issues.",
    );
  }

  return {
    errors,
    passed: errors.length === 0,
    warnings,
  };
}

/**
 * Formats validation results for display
 */
export function formatValidationResults(validation: ValidationResult): string {
  if (validation.passed && validation.warnings.length === 0) {
    return "  ✅ Validation passed";
  }

  let output = "";

  if (!validation.passed) {
    output += "  ❌ Validation failed:\n";
    for (const error of validation.errors) {
      output += `    - ${error}\n`;
    }
  }

  if (validation.warnings.length > 0) {
    output += "  ⚠️  Warnings:\n";
    for (const warning of validation.warnings) {
      output += `    - ${warning}\n`;
    }
  }

  return output.trim();
}
