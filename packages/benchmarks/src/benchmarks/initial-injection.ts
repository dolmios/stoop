import { createStitches } from "@stitches/react";
import { createStoop } from "stoop";

import type { BenchmarkResult } from "../utils";

import { sharedTheme } from "../shared-theme";
import { measureTime } from "../utils";

export function benchmarkInitialInjection(): { stoop: BenchmarkResult; stitches: BenchmarkResult } {
  const stoop = createStoop({ theme: sharedTheme });

  const stitches = createStitches({
    theme: sharedTheme as any,
  });

  const stoopResult = measureTime("Initial Injection", "stoop", () => {
    stoop.css({
      backgroundColor: "$colors.background",
      color: "$colors.primary",
      padding: "$space.medium",
    });
  });

  const stitchesResult = measureTime("Initial Injection", "stitches", () => {
    stitches.css({
      backgroundColor: "$background",
      color: "$primary",
      padding: "$medium",
    } as any);
  });

  return { stitches: stitchesResult, stoop: stoopResult };
}
