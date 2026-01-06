import { createStitches } from "@stitches/react";
import { createStoop } from "stoop";

import { sharedTheme } from "../shared-theme";
import { measureTime, type BenchmarkResult } from "../utils";

export function benchmarkInitialInjection(): { stoop: BenchmarkResult; stitches: BenchmarkResult } {
  const stoop = createStoop({ theme: sharedTheme });

  const stitches = createStitches({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  });

  return { stitches: stitchesResult, stoop: stoopResult };
}
