import { createStitches } from "@stitches/react";
import { createStoop } from "stoop";

import type { BenchmarkResult } from "../utils";

import { sharedTheme } from "../shared-theme";
import { measureTime } from "../utils";

export function benchmarkInitialInjection(): { stoop: BenchmarkResult; stitches: BenchmarkResult } {
  // Create fresh instances for each run to ensure isolation
  const stoop = createStoop({ theme: sharedTheme });
  const stitches = createStitches({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    theme: sharedTheme as any,
  });

  // Test CSS generation with various token types to ensure fair comparison
  const stoopResult = measureTime(
    "Initial Injection",
    "stoop",
    () => {
      stoop.css({
        backgroundColor: "$background",
        boxShadow: "$medium",
        color: "$primary",
        margin: "$small",
        padding: "$medium",
      });
    },
    1000,
    {
      maxIterations: 5000,
      minIterations: 500,
      targetPrecision: 0.03, // 3% precision for this critical benchmark
    },
  );

  const stitchesResult = measureTime(
    "Initial Injection",
    "stitches",
    () => {
      stitches.css({
        backgroundColor: "$background",
        boxShadow: "$medium",
        color: "$primary",
        margin: "$small",
        padding: "$medium",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
    },
    1000,
    {
      maxIterations: 5000,
      minIterations: 500,
      targetPrecision: 0.03,
    },
  );

  return { stitches: stitchesResult, stoop: stoopResult };
}
